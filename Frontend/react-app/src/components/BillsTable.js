import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/BillsTable.css";
import "./styles/global.css";
const BillsTable = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    // Fetch bills data from the backend API
    axios
      .get("http://localhost:5000/api/items")
      .then((response) => {
        // Assuming response.data is an array of bill items
        setBills(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bills:", error);
      });
  }, []);

  return (
    <div style={{ margin: "20px 0" }}>
      <h2>My Bills</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Item</th>
            <th style={tableHeaderStyle}>Price</th>
            <th style={tableHeaderStyle}>Date of Purchase</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{bill.name}</td>
              <td style={tableCellStyle}>${bill.price.toFixed(2)}</td>
              <td style={tableCellStyle}>
                {bill.billDate
                  ? new Date(bill.billDate).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

export default BillsTable;
