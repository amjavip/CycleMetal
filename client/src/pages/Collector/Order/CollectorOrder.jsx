import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import Mapa from "../../../components/map/ShowMap";
import { useOrder } from "../../../context/OrderContext";

export default function CollectorOrder() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateOrder, orderData } = useOrder();
  const [instrucciones, setInstrucciones] = useState({});
  const [rutas, setRutas] = useState([]); // NUEVO: para pintar rutas en el mapa

  // Obtener ubicación y pedidos cercanos
  useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    // Primero actualiza el contexto con la ubicación
    updateOrder("location", { lat: latitude, lon: longitude });

    // Espera unos 300ms antes de hacer la petición
    setTimeout(async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/orders/api/nearby/", {
          params: { lat: latitude, lon: longitude },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error al obtener pedidos cercanos:", err);
      } finally {
        setLoading(false);
      }
    }, 30); // puedes ajustar el delay si hace falta
  });
}, []);


  // Calcular ruta al hacer clic
  const calcularRuta = async (orderId) => {
    if (rutas[0]?.id && rutas[0].id !== orderId){
        console.log(rutas[0].id)
    setRutas([])
    
    };
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/orders/api/calcular-ruta-orden/",
        {
          lat: orderData.location.lat,
          lon: orderData.location.lon,
          id: orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Guardar instrucciones
      setInstrucciones((prev) => ({
        ...prev,
        [orderId]: res.data.instrucciones,
      }));

      // Guardar geometría de la ruta
      setRutas((prev) => [
        ...prev,
        {
          id: orderId,
          geometry: res.data.ruta.routes[0].geometry,
          color: "#4CAF50",
        },
      ]);
    } catch (err) {
      console.error("Error al calcular la ruta:", err);
    }
  };

  return (
    <div className="bg-base-100 shadow flex flex-col gap-4 overflow-y-auto bg-base-200">
      {loading ? (
        <div className="text-center">Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="text-center opacity-60">No hay pedidos cercanos.</div>
      ) : (
        <div className="min-h-screen text-primary flex flex-row mt-5">
          {/* Mapa */}
          <div className="m-5 rounded-box w-2/3 overflow-hidden mt-0">
            <Mapa
              lat={orderData.location.lat}
              lon={orderData.location.lon}
              className="w-full h-full z-0"
              orders={orders}
              rutas={rutas} // NUEVO: pasamos rutas al mapa
            />
          </div>

          {/* Lista de pedidos */}
          <div className="w-1/3 p-auto mx-auto flex flex-col bg-transparent">
            <div className="flex flex-row px-5 justify-between mx-3">
              <div className="rounded-box bg-base-100 px-3">
                Pedidos cercanos
              </div>
              <div className="rounded-box bg-base-100 px-2 hover:scale-105">
                {orders.length}
              </div>
            </div>

            <ul className="flex flex-col gap-4 mx-auto mt-3">
              {orders.map(({ order, distance_km }) => (
                <li
                  key={order.id}
onClick={() => calcularRuta(order.id)}
                  className="p-4 bg-base-100 mx-10 shadow rounded-box border-box flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:scale-101 transition ease-out duration-300 cursor-pointer"
                >
                  <div className="w-full max-h-screen ">
                    <p className="font-semibold">Pedido #{order.id}</p>
                    <p className="text-sm opacity-70">
                      Valor: ${order.total - order.comision}
                    </p>
                    <p className="text-sm opacity-70">Propina: ${order.tip}</p>
                    <p className="text-sm">Distancia radial: {distance_km} km</p>

                    {/* Botón para calcular ruta */}
                    

                    {/* Mostrar instrucciones */}
                   
                  </div>

                  <button
  className="btn btn-sm btn-success"
  onClick={async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/orders/api/accept-order/",
        {
          order_id: order.id,
          geometry: rutas[0]?.geometry,
          distance: rutas[0]?.distance || 0,
          start_lat: orderData.location.lat,
          start_lon: orderData.location.lon,
          end_lat: order.lat,
          end_lon: order.lon,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Pedido aceptado. Ruta activa.");
    } catch (err) {
      alert(err.response?.data?.error || "Error al aceptar pedido");
    }
  }}
>
  Aceptar pedido
</button>

                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
