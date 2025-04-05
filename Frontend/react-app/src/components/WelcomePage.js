// components/WelcomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (!name || !email) {
      alert("Please enter name and email.");
      return;
    }

    const user = { name, email };
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10%" }}>
      <h1>🌱 Welcome to EcoFinance Tracker</h1>
      <p>Please login to continue</p>

      <div style={{ marginTop: "2rem" }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <br />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <br />
        <button style={buttonStyle} onClick={handleLogin}>
          🔐 Login / Register
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  margin: "10px",
  padding: "10px",
  fontSize: "16px",
  width: "250px",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "8px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

export default WelcomePage;
