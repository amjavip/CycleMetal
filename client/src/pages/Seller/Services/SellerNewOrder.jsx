import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
export default function SellerNewOrder() {
    const { user } = useAuth();
    const [catalog, setCatalog] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/orders/api/catalog/")
            .then((res) => setCatalog(res.data))
            .catch((err) => console.error("Error al cargar el catálogo", err));
    }, []);

    const handleSelect = (item) => {
        const exists = selectedItems.find(i => i.item === item.id);
        if (exists) {
            // Aumentar cantidad
            setSelectedItems(selectedItems.map(i =>
                i.item === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ));
        } else {
            setSelectedItems([...selectedItems, { item: item.id, cantidad: 1 }]);
        }
    };

    const handleQuantityChange = (itemId, value) => {
        setSelectedItems(selectedItems.map(i =>
            i.item === itemId ? { ...i, cantidad: value } : i
        ));
    };

    const handleSubmit = () => {
        axios.post("/api/orders/create/", {
            id_seller: 1,  // ← CAMBIA esto si el ID se debe tomar dinámicamente
            items: selectedItems
        }).then(res => {
            alert("Orden creada con éxito: " + res.data.id_order);
            setSelectedItems([]);
        }).catch(err => {
            console.error(err);
            alert("Error al crear la orden");
        });
    };

    return (
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

        <div className="min-h-screen p-6 bg-white text-black">
            <h1 className="text-2xl font-bold mb-4">Crear nuevo pedido</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {catalog.map(item => (
                    <div key={item.id} className="border rounded-xl p-3 shadow hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect(item)}>
                        <h2 className="font-semibold">{item.nombre}</h2>
                        <p className="text-sm text-gray-600">{item.descripcion}</p>
                        <p className="text-green-600 font-bold">${item.precio} MXN</p>
                    </div>
                ))}
            </div>
</div>

            <h2 className="text-xl font-semibold mb-2">Resumen del pedido</h2>
            <ul className="mb-4">
                {selectedItems.map(sel => {
                    const item = catalog.find(i => i.id === sel.item);
                    return (
                        <li key={sel.item} className="flex items-center justify-between mb-2">
                            <span>{item?.nombre}</span>
                            <input
                                type="number"
                                className="w-16 border p-1"
                                value={sel.cantidad}
                                min={1}
                                onChange={e => handleQuantityChange(sel.item, parseInt(e.target.value))}
                            />
                        </li>
                    );
                })}
            </ul>

            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Enviar Pedido
            </button>
        </div>
        </div>
    );
}
