import React from "react";
import "./styles/BillItems.css";
import "./styles/global.css";
const BillItems = ({ items }) => {
  if (!items.length) return null;

  return (
    <div>
      <h3>🧾 Extracted Items</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillItems;
