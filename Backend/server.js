require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const { createWorker } = require("tesseract.js");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/billScanner", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema + Model
const billItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  billDate: { type: Date },
  rawText: { type: String },
});

const BillItem = mongoose.model("BillItem", billItemSchema);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// OCR Processor
const Tesseract = require("tesseract.js");

async function processImageWithOCR(imagePath) {
  try {
    console.log("🧠 Processing image with Tesseract:", imagePath);

    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log(m), // Optional progress logs
    });

    console.log("📄 OCR Text Output:\n", text);
    return text;
  } catch (error) {
    console.error("❌ OCR Error:", error);
    return null;
  }
}
function extractDateFromText(text) {
  const datePatterns = [
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/, // e.g. 12/03/2023 or 12-03-2023
    /\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/, // e.g. 2023-03-12
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const rawDate = match[1];
      const parsed = new Date(rawDate);
      if (!isNaN(parsed)) return parsed;
    }
  }

  return null;
}

// Bill text parser
function parseBillText(text) {
  const lines = text.split("\n");
  const items = [];

  const pattern = /^(.+?)\s*[-:]?\s*(\d+(?:\.\d{1,2})?)$/;

  const billDate = extractDateFromText(text); // NEW

  lines.forEach((line) => {
    line = line.trim();
    if (!line || line.toLowerCase().includes("total")) return;

    const match = line.match(pattern);
    if (match) {
      const name = match[1].trim();
      const price = parseFloat(match[2]);
      if (name && !isNaN(price)) {
        items.push({ name, price, rawText: line, billDate }); // Attach date here
      }
    }
  });

  console.log("📆 Extracted Bill Date: ", billDate);
  console.log("🛒 Final parsed items: ", items);

  return items;
}

// Upload and Process Route
app.post("/api/process-bill", upload.single("billImage"), async (req, res) => {
  try {
    console.log("📤 API called: /api/process-bill");

    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const imagePath = path.join(uploadDir, req.file.filename);

    const ocrText = await processImageWithOCR(imagePath);

    // Delete uploaded file after processing
    fs.unlinkSync(imagePath);

    if (!ocrText) {
      return res
        .status(500)
        .json({ error: "Failed to extract text from image" });
    }

    const parsedItems = parseBillText(ocrText);

    if (!parsedItems.length) {
      return res
        .status(400)
        .json({ error: "No valid items found in the bill" });
    }

    const cleanedItems = parsedItems.slice(1); // remove last item
    const savedItems = await BillItem.insertMany(cleanedItems);

    res.json({
      message: "✅ Bill processed successfully",
      items: savedItems,
      billDate: parsedItems[0]?.billDate || null,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Error processing bill" });
  }
});

// Get All Items
app.get("/api/items", async (req, res) => {
  try {
    const items = await BillItem.find().sort({ date: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

// Start server
app.listen(PORT, () =>
  console.log("🚀 Server running on http://localhost:${PORT}")
);
