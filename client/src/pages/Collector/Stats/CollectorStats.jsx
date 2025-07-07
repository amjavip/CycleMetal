import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

export default function CollectorStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/users/api/stats/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error al cargar estadísticas", err));
  }, []);

  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <p className="text-gray-500">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-[#303030]">{stats.completados}</p>
        <p className="text-sm text-gray-500">Pedidos completados</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-[#303030]">{stats.aceptados}</p>
        <p className="text-sm text-gray-500">Pedidos aceptados</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-[#303030]">${stats.propinas}</p>
        <p className="text-sm text-gray-500">Propinas esta semana</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-[#303030]">{stats.dia_mas_activo}</p>
        <p className="text-sm text-gray-500">Día más activo</p>
      </div>
    </div>
  );
}
