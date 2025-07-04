import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { div } from "three/tsl";

export default function CollectorOrder() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/orders/api/nearby/",
        {
          params: {
            lat: latitude,
            lon: longitude,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(res.data);
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error al obtener pedidos cercanos:", err);
    } finally {
      setLoading(false);
    }
  });
}, []);

  return (
    <div className="bg-base-100 rounded-box shadow p-6 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-lg font-semibold">Pedidos cercanos (en un radio de 1 km)</h2>

      {loading ? (
        <div className="text-center">Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="text-center opacity-60">No hay pedidos cercanos.</div>
      ) : (
        <>
        <div className="min-h-screen text-primary">
        <ul className="flex flex-col gap-4">
          {orders.map(({ order, distance_km }) => (
            <li
              key={order.id}
              className="p-4 bg-base-200 rounded-box shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            >
              <div>
                <p className="font-semibold">Pedido #{order.id}</p>
                <p className="text-sm opacity-70">
                  Dirección aprox: {order.address || "No especificada"}
                </p>
                <p className="text-sm">Distancia: {distance_km} km</p>
              </div>
              <button className="btn btn-sm btn-success">Aceptar pedido</button>
            </li>
          ))}
        </ul>
        </div>
        </>
      )}
    </div>
  );


}