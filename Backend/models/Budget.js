const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    remaining: {
      type: Number,
      required: true,
    },
    from: {
      type: String,
      required: false,
    },
    to: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
