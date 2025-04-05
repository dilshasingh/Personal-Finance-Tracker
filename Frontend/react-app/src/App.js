// src/App.js
import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import BillItems from "./components/BillItems";
import BudgetTracker from "./components/BudgetTracker";
import SpendingHistory from "./components/SpendingHistory";
import BillsTable from "./components/BillsTable";
import WelcomePage from "./components/WelcomePage";
import SpendingChart from "./components/SpendingChart";

console.log("Imported SpendingChart:", SpendingChart);

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [budget, setBudget] = useState(null);
  const [mode, setMode] = useState(null);
  const [error, setError] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Fetch history from backend on first load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");
        const data = await response.json();

        const grouped = data.reduce((acc, item) => {
          const date = new Date(item.billDate).toISOString().split("T")[0];
          const existing = acc.find((b) => b.billDate === date);

          const newItem = {
            name: item.name,
            price: item.price,
            rawText: item.rawText,
            date: item.date,
          };

          if (existing) {
            existing.items.push(newItem);
          } else {
            acc.push({
              billDate: date,
              items: [newItem],
            });
          }

          return acc;
        }, []);

        setHistory(grouped);
        setBudget(JSON.parse(localStorage.getItem("budget")) || null);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setHistory(JSON.parse(localStorage.getItem("spendingHistory")) || []);
        setBudget(JSON.parse(localStorage.getItem("budget")) || null);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    localStorage.setItem("spendingHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("budget", JSON.stringify(budget));
  }, [budget]);

  const addToHistory = (newBill) => {
    setHistory((prev) => [...prev, newBill]);
    setItems(newBill.items);
  };

  const totalSpent = history.reduce(
    (sum, bill) => sum + bill.items.reduce((s, i) => s + i.price, 0),
    0
  );

  const remaining = budget ? (budget.amount - totalSpent).toFixed(2) : 0;

  useEffect(() => {
    if (budget && budget.amount > 0) {
      const remainingAmount = budget.amount - totalSpent;

      if (remainingAmount < 0) {
        setShowAlert("exceeded");
      } else if (remainingAmount === 0) {
        setShowAlert("reached");
      } else if (remainingAmount <= 0.25 * budget.amount) {
        setShowAlert("low");
      } else {
        setShowAlert(false);
      }
    }
  }, [budget, totalSpent]);

  const handleUseExisting = () => {
    if (budget && budget.amount > 0) {
      setMode("use");
      setError("");
    } else {
      setError("No existing target. Please create a new one.");
      setMode(null);
    }
  };

  const handleCreateNew = () => {
    setMode("create");
    setError("");
    setHistory([]);
    localStorage.removeItem("spendingHistory");
  };

  return (
    <Router>
      <div
        className={`app-container dashboard ${mode ? "actions-visible" : ""}`}
      >
        <Routes>
          <Route path="/" element={<WelcomePage />} />

          <Route
            path="/dashboard"
            element={
              <div className="dashboard">
                {showAlert === "low" && (
                  <div className="alert-box warning">
                    ⚠️ <strong>Warning:</strong> Your remaining budget is below
                    25%!
                  </div>
                )}
                {showAlert === "reached" && (
                  <div className="alert-box info">
                    🎯 <strong>NOTE!!</strong> You've exactly reached your
                    target.
                  </div>
                )}
                {showAlert === "exceeded" && (
                  <div className="alert-box danger">
                    ❌ <strong>Alert:</strong> You've exceeded your budget
                    target!
                  </div>
                )}

                <h1 className="center-title">👤 My Finance Dashboard</h1>

                <div className="button-group">
                  <div className="profile-section">
                    <h2>👤 Profile</h2>
                    <p>
                      <strong>Name:</strong> {user?.name || "Guest"}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email || "N/A"}
                    </p>
                  </div>
                  <div className="target-buttons">
                    <button className="primary-btn" onClick={handleUseExisting}>
                      ✅ Use Existing Target
                    </button>
                    <button className="success-btn" onClick={handleCreateNew}>
                      ➕ Create New Target
                    </button>
                  </div>
                </div>

                {error && <p className="error-text">{error}</p>}

                {mode === "use" && budget && (
                  <div className="target-box">
                    <h3>💸 Existing Target</h3>
                    <p>
                      <strong>Target:</strong> ₹{budget.amount}
                    </p>
                    <p>
                      <strong>Remaining:</strong> ₹{remaining}
                    </p>
                  </div>
                )}

                {mode === "create" && (
                  <div className="create-box">
                    <h3>🎯 Create New Target</h3>
                    <BudgetTracker
                      budget={budget || { amount: 0, from: "", to: "" }}
                      setBudget={setBudget}
                      totalSpent={totalSpent}
                    />
                  </div>
                )}

                {mode && (
                  <div className="button-group">
                    <Link to="/upload">
                      <button className="primary-btn bottom">
                        📤 Upload Bill
                      </button>
                    </Link>
                    <Link to="/bills">
                      <button className="primary-btn bottom">
                        📜 View My Bills
                      </button>
                    </Link>
                    <button
                      className="primary-btn bottom"
                      onClick={() => setShowChart(!showChart)}
                    >
                      {showChart
                        ? "📉 Hide Spending Graph"
                        : "📊 View Spending Graph"}
                    </button>
                  </div>
                )}

                {showChart && history.length > 0 && (
                  <div className="chart-wrapper">
                    <SpendingChart history={history} />
                  </div>
                )}
              </div>
            }
          />

          <Route
            path="/upload"
            element={
              <div className="upload-page">
                <Link to="/dashboard">
                  <button className="back-btn">⬅ Back</button>
                </Link>
                <h2>📤 Upload New Bill</h2>
                <UploadForm onUploadSuccess={addToHistory} />
                <BillItems items={items} />
              </div>
            }
          />

          <Route
            path="/bills"
            element={
              <div className="bills-page">
                <Link to="/dashboard">
                  <button className="back-btn">⬅ Back</button>
                </Link>
                <BillsTable />
              </div>
            }
          />

          <Route
            path="/spending-history"
            element={
              <div className="history-page">
                <Link to="/dashboard">
                  <button className="back-btn">⬅ Back</button>
                </Link>
                <SpendingHistory history={history} />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
