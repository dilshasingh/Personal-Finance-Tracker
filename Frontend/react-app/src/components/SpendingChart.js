// src/components/SpendingChart.js
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA66CC",
  "#FF6666",
];

const SpendingChart = ({ history }) => {
  // Aggregate spending by item name
  const spendingData = {};

  history.forEach((bill) => {
    bill.items.forEach((item) => {
      const name = item.name;
      spendingData[name] = (spendingData[name] || 0) + item.price;
    });
  });

  const chartData = Object.entries(spendingData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  return (
    <div className="chart-container">
      <h3>📊 Spending Breakdown</h3>
      <PieChart width={400} height={300}>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default SpendingChart;
