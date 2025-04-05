import React from "react";
import "./styles/SpendingHistory.css";
import "./styles/global.css";
const SpendingHistory = ({ history }) => {
  if (!history.length) return null;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📜 Spending History</h3>
      {history.map((bill, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div>
            <strong>Shop:</strong> {bill.shop}
          </div>
          <div>
            <strong>Date:</strong> {bill.date}
          </div>
          <div>
            <strong>Items:</strong>
            <ul>
              {bill.items.map((item, i) => (
                <li key={i}>
                  {item.name} - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Date:</strong>{" "}
            {bill.date || bill.items[0]?.billDate?.slice(0, 10)}
          </div>

          <div>
            <strong>Total:</strong> $
            {bill.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpendingHistory;
