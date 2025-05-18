import { useAuth } from "../../context/AuthContext"
import OrderList from "../../components/OrderList";

import { BsPlusLg } from "react-icons/bs";

export default function SellerServices(){
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
            <div className=" self-end tooltip tooltip-left tooltip-[#fff] flex-none" data-tip="Iniciar pedido">
          <BsPlusLg className="text-[#404040] h-20 w-20 btn flex-none btn bg-white border-none shadow-none"></BsPlusLg></div>
</div>
          <hr className="text-[#e4e4e4] w-full"/>
<div className="flex flex-row p-2 h-auto">

 

   <div className="relative w-4/10 mx-10 mt-5 bg-[#f8f8f8] text-black flex flex-col h-[550px] rounded-3xl">
   
  <p className="self-center text-[#303030] text-xl font-sans font-semibold py-10">
    Historial de pedidos
  </p>
  <hr className="text-[#e4e4e4] py-5 mx-10" />
   
  <div className=" mx-4 carousel carousel-vertical bg-none ">

    <OrderList pedidos={pedidosEjemplo} />
    
  </div>

  <div className="rounded-3xl  pointer-events-none absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-white to-transparent z-10" />
</div>

    <div className="w-6/10 mx-10 mt-5 bg-[#f8f8f8] text-black flex flex-col h-[550px] rounded-3xl"></div>
</div>

        </div>
    )
};
