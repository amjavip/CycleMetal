import { NavLink, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import BotonAnimado from "../../../components/Button/neworderbutton";
import { useOrder } from "../../../context/OrderContext";
import Mapa from "../../../components/map/ShowMap";
export default function SellerServices() {
  const { resetOrder, orderData } = useOrder();
  const traducirEstado = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "ontheway":
        return "Esperando a ser aceptado";
      case "rejected":
        return "Rechazado";
      case "cancelled":
        return "Cancelado";
      case "completed":
        return "Completado";
      default:
        return status;
    }
  };

  const traducirMetodoPago = (metodo) => {
    switch (metodo) {
      case "cash":
        return "Efectivo";
      case "card":
        return "Tarjeta";
      default:
        return "No especificado";
    }
  };

  const OrderList = ({ orders = [], onPedidoClick }) => {
    orders.reverse();

    return (
      <div className="space-y-4 ">
        {orders.length === 0 ? (
          <div className="text-gray-500">No hay pedidos aún.</div>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              onClick={() => onPedidoClick(order)}
              className="cursor-pointer p-4 bg-white rounded-xl flex flex-col gap-2 hover:shadow-md transition duration-300 focus:bg-[#e4e4e4]"
            >
              <div>
                <p className="text-md font-semibold text-gray-800">
                  Pedido: {order.id_order}
                </p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(order.orderCreationDay).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Método de pago: {traducirMetodoPago(order.metodo_pago)}
                </p>
                <p className="text-sm text-gray-600">
                  Estado:{" "}
                  <span
                    className={`font-medium px-2 py-1 rounded-full text-xs ${order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "ontheway"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {traducirEstado(order.status)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Total: ${parseFloat(order.total).toFixed(2)}
                </p>
              </div>

              <div className="mt-1">
                <p className="text-sm font-semibold text-gray-700">Artículos:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      ID item: {item.item} - Cantidad: {item.cantidad} - $
                      {parseFloat(item.total).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const { user } = useAuth();

  const location = useLocation();
  const id = user.profile.id
  console.log(id);
  const isNewOrderRoute = location.pathname === "/seller-services";

  const [pedidoActual, setPedidoActual] = useState(null);
  const [previousOrder, setPreviousOrder] = useState([]);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/orders/api/showPrev/${user.profile.id}/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const reversed = res.data.reverse();
        setPreviousOrder(reversed);
        setPedidoActual(reversed[0]);
      })
      .catch((err) => console.error("Error al cargar pedidos", err));
  }, []);


  const steps = [
    '/neworder',
    '/neworder/ubication',
    '/neworder/summary',
    '/neworder/payment'
  ];

  const path = location.pathname.replace('/seller-services', '');
  const currentIndex = steps.findIndex(step => step === path);


  return (
    <div className="min-h-screen bg-white flex flex-col px-5">
      <div className="flex">
        <div className="flex-1 self-center pl-5 pr-3">
          <p className="text-black font-md text-xl">{user.profile.username}</p>
        </div>

        {isNewOrderRoute ? (
          <div className="flex flex-2">
            <ul className="menu bg-[#f8f8f8] lg:menu-horizontal rounded-box self-center text-black">
              <li className="rounded-md hover:bg-[#e9e9e9] transition transition-300">
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="accent"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Inbox
                  <span className="badge badge-xs">99+</span>
                </a>
              </li>
              <li className="rounded-md hover:bg-[#e9e9e9] transition transition-300">
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Updates
                  <span className="badge badge-xs badge-warning">NEW</span>
                </a>
              </li>
              <li className="rounded-md hover:bg-[#e9e9e9] transition transition-300">
                <a>
                  Stats
                  <span className="badge badge-xs badge-info"></span>
                </a>
              </li>
            </ul>
          </div>
        ) : <div className="flex w-full self-center justify-center scale-90 text-black"><ul className="steps">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`step ${index <= currentIndex ? 'step-primary text-primary' : ''}`}
            >
              {step === '/neworder' && 'Artículos'}
              {step === '/neworder/ubication' && 'Ubicación de recolección'}
              {step === '/neworder/summary' && 'Info. del pedido'}
              {step === '/neworder/payment' && 'Método de pago'}

            </li>
          ))}
        </ul>
        </div>}

        <div
          className="self-end tooltip tooltip-left tooltip-[#fff] flex-none"
          data-tip={isNewOrderRoute ? "Iniciar pedido" : "Cancelar ruta"}
        >
          <div className="flex justify-center items-center h-full w-full">
            <BotonAnimado />
          </div>
        </div>
      </div>

      <hr className="text-[#e4e4e4] w-full" />

      <>
        <Outlet />

        <div className="flex flex-row p-2 h-auto">
          {isNewOrderRoute && (
            <>

              <div className="relative w-4/10 mx-10 mt-5 bg-[#f8f8f8] text-black flex flex-col h-[550px] rounded-3xl">
                <p className="self-center text-[#303030] text-xl font-sans font-semibold py-10">
                  Historial de pedidos
                </p>
                <hr className="text-[#e4e4e4] py-5 mx-10" />
                <div className="mx-4 carousel carousel-vertical bg-none ">
                  <OrderList orders={previousOrder} onPedidoClick={setPedidoActual} />
                </div>
                <div className="rounded-3xl pointer-events-none absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-white to-transparent z-10" />
              </div>

              <div className="w-6/10 mr-10 p-5 my-5 bg-[#f8f8f8] text-black flex flex-col h-[550px] rounded-3xl ">
                {pedidoActual ? (
                  <>
                    <div className="flex flex-row justify-between">
                      <div>
                        <p className="font-semibold text-xl">Pedido - {pedidoActual.id_order
                        }</p>
                      </div>
                      <div>
                        <p>
                          <span className="font-semibold">Fecha:</span>{" "}
                          {new Date(pedidoActual.orderCreationDay).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <hr className="text-[#a3a3a3]/70 w-full my-2" />

                    <div className="flex flex-row justify-between
                ">
                      <div className="h-[100px] carousel carousel-vertical w-2/3">
                        <p className="font-semibold ">Materiales:</p>
                        <ul className="list-disc list-inside text-sm">
                          {pedidoActual.items.map((item, index) => (
                            <li className="list" key={index}>
                              ID {item.item} - {item.cantidad} piezas (${item.total})
                            </li>
                          ))}
                        </ul>
                      </div> <div className="h-[100px] carousel carousel-vertical w-1/3">
                        <p className="font-semibold self-center">Total: ${pedidoActual.total}MXN</p>
                        <br />
                        <p className="font-semibold text-[#006400]/90 justify-end self-center ">{traducirMetodoPago(pedidoActual.metodo_pago)}</p>
                        
                      </div> 



                    </div>

                    <div className="p-2 m-0">
                      <div className="p-0 m-0 h-[300px] overflow-hidden rounded-4xl">
                        <Mapa className="h-full w-full p-0 rounded-3xl" lat={pedidoActual.lat} lon={pedidoActual.lon} />
                      </div>
                    </div>
                    <div className="w-full flex flex-row">


                      <div
                        className={`px-2 py-1 rounded-full text-sm self-center flex-1 m-2 font-medium h-[30px] ${pedidoActual.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : pedidoActual.status === "ontheway"
                            ? "bg-blue-100 text-blue-800"
                            : pedidoActual.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : pedidoActual.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-200 text-gray-800"
                          }`}
                      >
                        <p className="w-full text-center">{traducirEstado(pedidoActual.status)}</p>
                      </div>
                    </div>

                  </>
                ) : (
                  <p className="text-gray-500">Selecciona un pedido para ver los detalles.</p>
                )}

              </div>
            </>
          )}
        </div>
      </>
    </div>
  );
}
