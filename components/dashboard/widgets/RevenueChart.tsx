"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { mes: "Jan", receita: 120, despesa: 80 },
  { mes: "Fev", receita: 150, despesa: 95 },
  { mes: "Mar", receita: 180, despesa: 110 },
  { mes: "Abr", receita: 220, despesa: 130 },
  { mes: "Mai", receita: 260, despesa: 150 },
  { mes: "Jun", receita: 310, despesa: 175 },
];

export default function RevenueChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="mes" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="receita"
            stroke="#2563eb"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="despesa"
            stroke="#ef4444"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}