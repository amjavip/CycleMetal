import { useEffect, useState } from "react";
import { useOrder } from "../../../context/OrderContext";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import BotonAnimado from "../../../components/Button/neworderbutton";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { div, userData } from "three/tsl";

export default function SellerNewOrder() {
    const isNewOrderRoute = location.pathname === "/seller-services/neworder";
    const navigate = useNavigate();
    const { user } = useAuth();
    const [catalog, setCatalog] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCatalog = catalog.filter(item =>
        item.nombre.toLowerCase().startsWith(searchTerm.toLowerCase())
    );


    useEffect(() => {
        axios.get("http://127.0.0.1:8000/orders/api/catalog/")
            .then((res) => setCatalog(res.data))
            .catch((err) => console.error("Error al cargar el catálogo", err));
    }, []);
    const handleDeleteAll = () => {
        setSelectedItems([]);

    }
    const handleDeleteItem = (itemD) => {
        setSelectedItems(sel =>
            sel.filter(sel => sel.item !== itemD)
        );

    };

  const total = selectedItems.reduce((sum, sel) => {
  const item = catalog.find(i => i.id === sel.item);
  const precio = Number(item?.precio) || 0;
  const cantidad = Number(sel.cantidad) || 0;
  return sum + precio * cantidad;
}, 0);
console.log(total);
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
const { updateOrder } = useOrder();
// Agrega esto justo antes de handleSubmit
const orderItems = selectedItems.map(sel => {
  const item = catalog.find(i => i.id === sel.item);
  return {
    id: sel.item,
    cantidad: sel.cantidad,
    nombre: item?.nombre || "",
    precio: item?.precio || 0
  };
});

const handleSubmit = () => {
 
  updateOrder("sellerId", user?.profile?.id);
  updateOrder("items", orderItems);
  updateOrder("subtotal", total);
  navigate("/seller-services/neworder/ubication");
};


    return (
        <div className=" min-h-screen bg-white flex flex-col px-5">
               {(isNewOrderRoute) ? (
                <div>
                    <hr className="text-[#e4e4e4] w-full" />

                    <div className="flex flex-row p-2 h-auto">

                        <div className="relative w-1/2 mt-2 bg-[#f8f8f8] text-black flex flex-col h-[550px] rounded-3xl ">
                            <h1 className="flex text-2xl font-semibold justify-center self-center w-full  m-3">Articulos</h1>
                            <input
                                type="text"
                                placeholder="Buscar artículo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mx-4 mb-2 p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <div className=" mx-4 carousel carousel-vertical bg-none list">
                                {filteredCatalog.length > 0 ? (
                                    filteredCatalog.map(item => (

                                        <div key={item.id} className="rounded-xl py-5 hover:bg-gray-100 cursor-pointer list-row " onClick={() => handleSelect(item)}>
                                            <h2 className="font-semibold">{item.nombre}</h2>
                                            <p className="text-sm text-gray-600">{item.descripcion}</p>
                                            <p className="text-green-600 font-bold">${item.precio} MXN</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 mt-5">No se encontró ningún artículo</p>
                                )}

                            </div>
                        </div>
                        <div className="w-4/10 mt-2 ml-20 bg-[#f8f8f8] text-black flex flex-col h-1/2 max-h-[550px] rounded-3xl p-5">
                            <h2 className="text-xl text-black font-semibold mb-2 flex justify-center">Resumen del pedido</h2>
                            <div className="w-full carousel carousel-vertical   ">
                                <ul className="mb-4 text-black mx-3  w-full">
                                    {selectedItems.map(sel => {
                                        const item = catalog.find(i => i.id === sel.item);
                                        return (
                                            <li key={sel.item} className="flex items-center justify-between mb-2 list-row">
                                                <span>{item?.nombre}</span>
                                                <div className="flex flex-row">
                                                    <input
                                                        type="number"
                                                        className="w-20 border  border-none p-4 focus: border-none outline-none py-4 flex justify-start"
                                                        value={sel.cantidad}
                                                        min={1}
                                                        onChange={e => handleQuantityChange(sel.item, parseInt(e.target.value))}
                                                    />
                                                    <button onClick={() => handleDeleteItem(sel.item)} className="btn bg-transparent border-none shadow-none self-center"><RxCross2 className="text-[#dc5550] w-full h-full p-2" />
                                                    </button></div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            {(selectedItems.length > 0) ? (
                                 <div>
                                  <p className="self-center text-center px-4 py-1  font-light ">  Total del pedido:         ${total} MXN</p>
                                <div className="w-full flex flex-row">
                                    
                                    <button onClick={handleSubmit} className="bg-[#303030] text-white px-4 py-2 rounded-xl hover:bg-[#202020] transition  w-3/4 max-h-[40px] self-center">
                                        Enviar Pedido
                                    </button>
                                    <button onClick={handleDeleteAll} className="bg-transparent text-white pl-4  rounded-xl  w-1/4 flex justify-center"><RxCross2 className="text-black w-15 h-15 p-2 hover:text-[#dc5550] transition transition-300" /></button>
                                </div>
                                </div>
                            )
                                : (
                                    <p>Seleccion al menos un prodcuto para continuar</p>
                                )}
                        </div>
                    </div>
                    </div>
         
                 ) : (
      <Outlet />
    )}
  </div>
  );
};