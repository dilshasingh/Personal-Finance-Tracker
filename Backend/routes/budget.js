const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");

// ✅ Fetch latest budget
router.get("/latest", async (req, res) => {
  try {
    const latestBudget = await Budget.findOne().sort({ createdAt: -1 });

    if (!latestBudget) {
      return res.status(404).json({ message: "No budget found." });
    }

    res.status(200).json(latestBudget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create new or fetch latest budget
router.post("/", async (req, res) => {
  const { amount, from, to, isNewTarget } = req.body;

  try {
    if (isNewTarget) {
      const newBudget = new Budget({
        amount,
        remaining: amount,
        from,
        to,
      });
      await newBudget.save();
      return res.status(201).json(newBudget);
    } else {
      const latestBudget = await Budget.findOne().sort({ createdAt: -1 });

      if (!latestBudget)
        return res.status(404).json({ message: "No budget found." });

      return res.status(200).json(latestBudget);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update remaining after bill is uploaded
router.put("/update", async (req, res) => {
  const { amount } = req.body;

  try {
    const budget = await Budget.findOne().sort({ createdAt: -1 });
    if (!budget) return res.status(404).json({ message: "No budget found." });

    budget.remaining -= amount;
    await budget.save();

    res.status(200).json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update remaining amount" });
  }
});

module.exports = router;
