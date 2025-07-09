import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function useNearbyOrders() {
  const { user } = useAuth();
  const [nearby, setNearby] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await axios.get("http://127.0.0.1:8000/orders/api/nearby/", {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { lat: latitude, lon: longitude },
        });

        setNearby(res.data.orders.length);
      } catch (err) {
        console.error("Error obteniendo pedidos cercanos:", err);
      }
    });
  }, [user]);

  return nearby;
}
