import { useOrder } from "../../../context/OrderContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { damp } from "three/src/math/MathUtils.js";
export default function SummaryPage() {
  const { orderData } = useOrder();
  const {updateOrder} = useOrder();
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState([]);
  const [propina, setPropina] = useState(0);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/orders/api/catalog/")
      .then(res => res.json())
      .then(data => setCatalog(data));
  }, []);

  const calcularSubtotal = () => {
    return orderData.items.reduce((sum, item) => {
      
      return sum + (item.precio || 0) * item.cantidad;
    }, 0);
  };

  const subtotal = calcularSubtotal();
  const comision = subtotal * 0.10;
  const total = subtotal + parseFloat(propina || 0) + comision;
console.log("ey",total);
  const handleNext = () => {
    updateOrder("total", total)
    navigate("/seller-services/neworder/payment");
  };

  return (
    <div className="min-h-screen bg-white px-5 py-8 text-black flex flex-row">
        <div className="pt-5 px-5 w-1/3 shadow-md max-h-full">
      <h1 className="text-2xl font-bold mb-4">Resumen de pedido</h1>

      <ul className="mb-4 w-full carousel carousel-vertical max-h-[180px]">
        {orderData.items.map(item => {
      
          return (
            <li key={item.item} className="mb-2 border-b pb-2">
              <p className="font-semibold">{item.nombre}</p>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio: ${item.precio} MXN</p>
            </li>
          );
        })}
      </ul>

      <div className="border-t pt-4 mt-4">
        <p>Subtotal: ${subtotal.toFixed(2)} MXN</p>
        <p>Comisión empresa (10%): ${comision.toFixed(2)} MXN</p>
        <div className="mt-2">
          <label className="block mb-1">Propina (opcional):</label>
          <input
            type="number"
            className="border p-2 rounded w-32"
            value={propina}
            onChange={(e) => setPropina(e.target.value)}
            placeholder="0"
          />
        </div>
        <p className="mt-4 font-bold text-xl">
          Total a pagar: ${(total).toFixed(2)} MXN
        </p>
      </div>

      <button
        onClick={handleNext}
        className="mt-6 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
      >
        Confirmar pedido
      </button>
      </div>
         <div className="w-2/3 h-[500px] rounded-xl m-5">
                          <MapContainer center={orderData.location} zoom={15} className="rounded-xl" style={{ height: '100%', width: '100%' }}>
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                             <Marker position={orderData.location} />
                          </MapContainer>
                      </div>
    </div>
  );
}
