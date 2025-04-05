// components/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import BudgetTracker from "./BudgetTracker";

const Dashboard = ({ user, budget, setBudget, totalSpent, remaining }) => {
  return (
    <>
      <h2 style={{ textAlign: "center" }}>👤 Welcome, {user.name}</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          margin: "20px 0",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>👤 Profile</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> demo@example.com
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#f1faff",
          }}
        >
          <h2>💸 Budget Overview</h2>
          {budget.amount > 0 ? (
            <>
              <p>
                <strong>Target:</strong> ${budget.amount}
              </p>
              <p>
                <strong>Remaining:</strong> ${remaining}
              </p>
            </>
          ) : (
            <p>No target set yet. Create one below 👇</p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Link to="/upload">
          <button style={buttonStyle}>📤 Upload Bill</button>
        </Link>
        <Link to="/bills">
          <button style={buttonStyle}>📜 View My Bills</button>
        </Link>
      </div>

      <BudgetTracker
        budget={budget}
        setBudget={setBudget}
        totalSpent={totalSpent}
      />
    </>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "8px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

export default Dashboard;
