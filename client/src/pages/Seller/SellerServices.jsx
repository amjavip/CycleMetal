import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import { useState } from "react";
import OrderList from "../../components/order/OrderList";
import Mapa from "../../components/map/ShowMap";
import { BsPlusLg } from "react-icons/bs";

export default function SellerServices(){
    const [pedidoActual, setPedidoActual] = useState(null);
    const pedidosEjemplo = [
  {
    material: "Refrigerador viejo",
    direccion: "Calle Falsa 123",
    fecha: "2025-05-15",
    estado: "pendiente",
  },
  {
    material: "Colchón",
    direccion: "Av. Reforma 456",
    fecha: "2025-05-16",
    estado: "aceptado",
  },
  {
    material: "TV rota",
    direccion: "Insurgentes Sur 789",
    fecha: "2025-05-14",
    estado: "recolectado",
  },
  {
    material: "TV rota",
    direccion: "Insurgentes Sur 789",
    fecha: "2025-05-14",
    estado: "recolectado",
  },
  {
    material: "TV rota",
    direccion: "Insurgentes Sur 789",
    fecha: "2025-05-14",
    estado: "recolectado",
  },
  {
    material: "TV rota",
    direccion: "Insurgentes Sur 789",
    fecha: "2025-05-14",
    estado: "recolectado",
  },
  {
    material: "TV rota",
    direccion: "Insurgentes Sur 789",
    fecha: "2025-05-14",
    estado: "recolectado",
  },
  {
    material: "TV rota",
    direccion: "Insurgentes Sur 789",
    fecha: "2025-05-14",
    estado: "recolectado",
  },
  {
    material: "TV rota",
    direccion: "Insurgentes Sur 789",
    fecha: "2025-05-14",
    estado: "recolectado",
  },
];
    const { user } = useAuth();
    
    return(
        <div className=" min-h-screen bg-white flex flex-col px-5">
            <div className="flex">
          <div className="flex-1 self-center px-10"> <p className="text-black font-md text-xl"> {user.profile.username}  </p></div>
          <div className="flex flex-2"><ul className="menu bg-base-100 lg:menu-horizontal rounded-box self-center">
  <li>
    <a>
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="accent">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      Inbox
      <span className="badge badge-xs">99+</span>
    </a>
  </li>
  <li>
    <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Updates
      <span className="badge badge-xs badge-warning">NEW</span>
    </a>
  </li>
  <li>
    <a>
      Stats
      <span className="badge badge-xs badge-info"></span>
    </a>
  </li>
</ul></div>
            <div className=" self-end tooltip tooltip-left tooltip-[#fff] flex-none" data-tip="Iniciar pedido">
          <NavLink  to="/seller-neworder"><BsPlusLg className="text-[#404040] h-20 w-20 btn flex-none btn bg-transparent transition duration-300 border-none shadow-none hover:scale-105"></BsPlusLg></NavLink></div>
</div>
          <hr className="text-[#e4e4e4] w-full"/>
          
<div className="flex flex-row p-2 h-auto">

 

   <div className="relative w-4/10 mx-10 mt-5 bg-[#f8f8f8] text-black flex flex-col h-[550px] rounded-3xl">
   
  <p className="self-center text-[#303030] text-xl font-sans font-semibold py-10">
    Historial de pedidos
    
  </p>
  
  <hr className="text-[#e4e4e4] py-5 mx-10" />
   
  <div className=" mx-4 carousel carousel-vertical bg-none ">

    <OrderList pedidos={pedidosEjemplo} onPedidoClick={setPedidoActual} />
    
  </div>

  <div className="rounded-3xl  pointer-events-none absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-white to-transparent z-10" />
</div>

    <div className="w-6/10 mr-10 p-5 my-5 bg-[#f8f8f8] text-black flex flex-col h-[550px] rounded-3xl ">
  <p className="text-lg font-bold mb-2">Pedido seleccionado</p>

  {pedidoActual ? (
    <>
      <p><span className="font-semibold">Material:</span> {pedidoActual.material}</p>
      <p><span className="font-semibold">Dirección:</span> {pedidoActual.direccion}</p>
      <p><span className="font-semibold">Fecha:</span> {new Date(pedidoActual.fecha).toLocaleDateString()}</p>
      <p>
        <span className="font-semibold">Estado:</span>{" "}
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            pedidoActual.estado === "pendiente"
              ? "bg-yellow-100 text-yellow-800"
              : pedidoActual.estado === "aceptado"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {pedidoActual.estado.toUpperCase()}
        </span>
      </p>
    </>
  ) : (
    <p className="text-gray-500">Selecciona un pedido para ver los detalles.</p>
  )}
</div>

</div>

        </div>
    )
};
