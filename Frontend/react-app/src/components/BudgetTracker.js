// export default BudgetTracker;
import React, { useState } from "react";
import "./styles/BudgetTracker.css";
import "./styles/global.css";
const BudgetTracker = ({ budget, setBudget, totalSpent }) => {
  const [tempBudget, setTempBudget] = useState(budget);

  const updateBudget = () => {
    setBudget(tempBudget);
  };

  const remaining = (budget.amount - totalSpent).toFixed(2);

  return (
    <div
      style={{
        margin: "20px 0",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <h3>💰 Budget Tracker</h3>
      <div>
        <label>Target Amount: $</label>
        <input
          type="number"
          value={tempBudget.amount}
          onChange={(e) =>
            setTempBudget({ ...tempBudget, amount: parseFloat(e.target.value) })
          }
        />
        <label> From: </label>
        <input
          type="date"
          value={tempBudget.from}
          onChange={(e) =>
            setTempBudget({ ...tempBudget, from: e.target.value })
          }
        />
        <label> To: </label>
        <input
          type="date"
          value={tempBudget.to}
          onChange={(e) => setTempBudget({ ...tempBudget, to: e.target.value })}
        />
        <button onClick={updateBudget}>Set Budget</button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <strong>Total Spent:</strong> ${totalSpent.toFixed(2)}
        <br />
        <strong>Remaining:</strong> ${remaining}
      </div>
    </div>
  );
};

export default BudgetTracker;
