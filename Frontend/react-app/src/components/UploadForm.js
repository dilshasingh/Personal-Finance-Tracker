import React, { useState } from "react";
import axios from "axios";
import "./styles/UploadForm.css";
import "./styles/global.css";
const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [shop, setShop] = useState("");

  const handleUpload = async () => {
    if (!file || !shop)
      return alert("Please provide a shop name and upload an image!");

    const formData = new FormData();
    formData.append("billImage", file);
    formData.append("shop", shop);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/process-bill",
        formData
      );

      console.log("Bill response:", res.data);

      // 👇 Filter out invalid items like dates that got OCR'ed
      const validItems = res.data.items.filter((item) => {
        return (
          item.name && item.price > 0 && isNaN(Date.parse(item.name)) // remove if name is just a date
        );
      });

      const newBill = {
        shop,
        date: res.data.billDate.split("T")[0],
        items: validItems,
      };

      onUploadSuccess(newBill);
      setFile(null);
      setShop("");
    } catch (error) {
      alert("Error processing bill");
    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <input
        type="text"
        placeholder="Shop Name"
        value={shop}
        onChange={(e) => setShop(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadForm;
