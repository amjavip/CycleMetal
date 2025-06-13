import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdOutlineRecycling } from "react-icons/md";

export default function SellerOrderSummary() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tempOrder = JSON.parse(localStorage.getItem("tempOrder"));
    if (tempOrder) {
      setOrder(tempOrder);
    } else {
      navigate("/seller-services/neworder");
    }
  }, []);

  const handleContinue = () => {
    navigate("/payment");
  };

  if (!order) return <p className="text-center mt-10">Cargando resumen...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-16 lg:px-32">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Resumen de tu Orden
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-semibold">Ubicación:</span>
          <span className="text-gray-800 text-right max-w-[60%] truncate">
            {order.location}
          </span>
        </div>

        <hr />

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-semibold">Método de pago:</span>
          <span className="text-gray-800 flex items-center gap-2">
            {order.paymentMethod === "cash" ? (
              <>
                <FaMoneyBillWave className="text-green-500" />
                Efectivo al recolector
              </>
            ) : (
              <>
                <FaMoneyBillWave className="text-blue-500" />
                Tarjeta
              </>
            )}
          </span>
        </div>

        <hr />

        <div>
          <span className="text-gray-600 font-semibold">Materiales a recolectar:</span>
          <ul className="mt-2 space-y-1 text-gray-800 list-disc list-inside">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.quantity} x {item.name}
              </li>
            ))}
          </ul>
        </div>

        <hr />

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-semibold">Comisión estimada:</span>
          <span className="text-green-600 font-bold text-lg">
            ${order.commission} MXN
          </span>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleContinue}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Continuar al pago
          </button>
        </div>
      </div>

      <div className="text-xs text-center text-gray-400 mt-8">
        <p className="flex items-center justify-center gap-1">
          <MdOutlineRecycling className="text-green-500" />
          Gracias por reciclar responsablemente
        </p>
      </div>
    </div>
  );
}
