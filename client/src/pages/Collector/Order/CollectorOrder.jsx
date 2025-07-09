import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import Mapa from "../../../components/map/ShowMap";
import { useOrder } from "../../../context/OrderContext";
import { or } from "three/tsl";

export default function CollectorOrder() {
    const { user, setUser } = useAuth();
    const { updateOrder, orderData, resetOrder } = useOrder();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            updateOrder("location", { lat: latitude, lon: longitude });

            // Revisar ruta activa
            try {
                const res = await axios.get("http://127.0.0.1:8000/routes/api/active-route/", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                const { routeGeometry, order_id, active_route } = res.data;

                setUser((prev) => (prev ? { ...prev, has_active_route: active_route } : prev));
                localStorage.setItem("has_active_route", active_route);

                if (routeGeometry) {
                    updateOrder("rutas", [
                        {
                            id: order_id,
                            geometry: routeGeometry,
                            color: "#FFA500",
                        },
                    ]);
                    updateOrder("activeOrderId", order_id);
                }

                if (active_route === true) {
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.log("No hay ruta activa (o error):", err);
            }

            // Pedidos cercanos
            try {
                const res = await axios.get("http://127.0.0.1:8000/orders/api/nearby/", {
                    params: { lat: latitude, lon: longitude },
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setOrders(res.data.orders);
            } catch (err) {
                console.error("Error al obtener pedidos cercanos:", err);
            } finally {
                setLoading(false);
            }
        });
    }, []);

    const calcularRuta = async (orderId) => {
        if (orderData.rutas?.[0]?.id && orderData.rutas[0].id !== orderId) {
            updateOrder("rutas", []);
        }

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/orders/api/calcular-ruta-orden/",
                {
                    lat: orderData.location.lat,
                    lon: orderData.location.lon,
                    id: orderId,
                },
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );

            updateOrder("instrucciones", {
                ...orderData.instrucciones,
                [orderId]: res.data.instrucciones,
            });

            updateOrder("rutas", [
                {
                    id: orderId,
                    geometry: res.data.ruta.routes[0].geometry,
                    color: "#4CAF50",
                    lat: res.data.lat,
                    lon: res.data.lon,
                },

            ]);
        } catch (err) {
            console.error("Error al calcular la ruta:", err);
        }
    };

    const cancelarOrden = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/orders/api/cancel-order/",
                { id: orderData.id },
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );

            updateOrder("activeOrderId", null);
            updateOrder("rutas", []);
            window.location.reload()
        } catch (err) {
            alert("Error al cancelar orden");
        }
    };

    const completarOrden = async () => {
        const lat1 = orderData.location.lat;
        const lon1 = orderData.location.lon;


       const lat2 = orderData.rutas[0]?.lat;
const lon2 = orderData.rutas[0]?.lon;

        const distancia = Math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2) * 111;
        console.log(lat2)
        if (distancia <= 0.1) {
            try {
                await axios.post(
                    "http://127.0.0.1:8000/orders/api/complete-order/",
                    { order_id: orderData.id },
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                );
                alert("Orden completada");

                updateOrder("activeOrderId", null);
                updateOrder("rutas", []);
                resetOrder();
                window.location.reload()
            } catch (err) {
                alert("Error al completar orden");
            }
        } else {
            alert("Aún estás lejos para completar esta orden");
        }
    };

    return (
        <div className="bg-base-100 shadow flex flex-col gap-4 overflow-y-auto bg-base-200">
            {loading ? (
                <div className="text-center">Cargando pedidos...</div>
            ) : (
                <div className="min-h-screen text-primary flex flex-row mt-5">
                    <div className="m-5 rounded-box w-2/3 overflow-hidden mt-0">
                        <Mapa
                            lat={orderData.location.lat}
                            lon={orderData.location.lon}
                            className="w-full h-full z-0"
                            orders={orders}
                            rutas={orderData.rutas}
                        />
                    </div>

                    <div className="w-1/3 p-auto mx-auto flex flex-col bg-transparent">
                        {!user.has_active_route && (
                            <div className="flex flex-row px-5 justify-between mx-3">
                                <div className="rounded-box bg-base-100 px-3">Pedidos cercanos</div>
                                <div className="rounded-box bg-base-100 px-2 hover:scale-105">
                                    {orders.length}
                                </div>
                            </div>
                        )}

                        <ul className="flex flex-col gap-4 mx-auto mt-3">
                            {orders.map(({ order, distance_km }) => (
                                <li
                                    key={order.id}
                                    onClick={() => calcularRuta(order.id)}
                                    className="p-4 bg-base-100 mx-10 shadow rounded-box border-box flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:scale-101 transition ease-out duration-300 cursor-pointer"
                                >
                                    <div className="w-full max-h-screen">
                                        <p className="font-semibold">Pedido #{order.id}</p>
                                        <p className="text-sm opacity-70">Valor: ${order.total - order.comision}</p>
                                        <p className="text-sm opacity-70">Propina: ${order.tip}</p>
                                        <p className="text-sm">Distancia radial: {distance_km} km</p>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={async () => {
                                            try {
                                                const res = await axios.post(
                                                    "http://127.0.0.1:8000/orders/api/accept-order/",
                                                    {
                                                        order_id: order.id,
                                                        geometry: orderData.rutas[0]?.geometry,
                                                        distance: orderData.rutas[0]?.distance,
                                                        start_lat: orderData.location.lat,
                                                        start_lon: orderData.location.lon,
                                                        end_lat: order.lat,
                                                        end_lon: order.lon,
                                                    },
                                                    {
                                                        headers: { Authorization: `Bearer ${user.token}` },
                                                    }
                                                );

                                                // Guardar datos relevantes en OrderContext
                                                updateOrder("id", order.id);
                                                updateOrder("sellerId", order.seller_id); // Asegúrate que venga en el objeto
                                                updateOrder("tip", order.tip);
                                                updateOrder("comision", order.comision);
                                                updateOrder("total", order.total);
                                                updateOrder("token", res.data?.token || null); // si lo devuelve el backend
                                                updateOrder("paymentMethod", order.metodo_pago || null);
                                                updateOrder("date", order.date || null);
                                                updateOrder("rutas", orderData.rutas); // ruta ya calculada
                                                console.log("xdddddddddddddd", orderData.rutas)

                                                try {
                                                    await calcularRuta(orderData.id); // Primero calcula
                                                    window.location.reload();         // Luego recarga
                                                } catch (error) {
                                                    alert("Error al aceptar pedido");
                                                    console.log(error);
                                                }
                                            } catch (error) {
                                                alert("Error al aceptar pedido");
                                                console.log(error)
                                            }
                                        }}
                                    >
                                        Aceptar pedido
                                    </button>

                                </li>
                            ))}
                        </ul>

                        {user.has_active_route === true && (
                            <div className="mx-5 mt-4 bg-base-100 p-6 rounded-box shadow p-5 flex flex-col gap-3 h-4/5">
                                <p className="text-xl font-bold">Orden: #{orderData.id}</p>
                                <div className="grid grid-cols-2 md:grid-cols-1 gap-3 text-sm">
                                    <div><span className="font-semibold">Total:</span> ${orderData.total}</div>
                                    <div><span className="font-semibold">Comisión:</span> ${orderData.comision}</div>
                                    <div><span className="font-semibold">Propina:</span> ${orderData.tip}</div>
                                    <div><span className="font-semibold">Método de pago:</span> {orderData.paymentMethod}</div>
                                </div>

                                <div className="mt-4 flex gap-3 flex items-end">
                                    <button className="btn btn-error hover-1" onClick={cancelarOrden}>
                                        Cancelar orden
                                    </button>
                                    <button className="btn btn-primary hover-1" onClick={completarOrden}>
                                        Completar orden
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}
