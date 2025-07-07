// src/components/ActividadSemanal.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function ActividadSemanal() {
  const { user } = useAuth();
  const [data, setData] = useState([
    { name: "Lun", kg: 0 },
    { name: "Mar", kg: 0 },
    { name: "Mié", kg: 0 },
    { name: "Jue", kg: 0 },
    { name: "Vie", kg: 0 },
    { name: "Sáb", kg: 0 },
    { name: "Dom", kg: 0 },
  ]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/users/api/seller/weekly-activity/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar actividad semanal", err);
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl col-span-1 row-span-2 self-center">
      <ResponsiveContainer width="100%" height={110}>
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: "orders", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="kg" fill="#303030" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
