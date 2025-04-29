// src/components/ActividadSemanal.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Lun", kg: 12 },
  { name: "Mar", kg: 8 },
  { name: "Mié", kg: 15 },
  { name: "Jue", kg: 10 },
  { name: "Vie", kg: 20 },
  { name: "Sáb", kg: 5 },
  { name: "Dom", kg: 0 },
];

export default function ActividadSemanal() {
  return (
    <div className="bg-white p-6 rounded-xl col-span-1 row-span-2 self-center">
     
      <ResponsiveContainer width="100%" height={110}>
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Kg ', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="kg" fill="#303030" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
