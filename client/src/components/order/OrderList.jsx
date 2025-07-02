import React from "react";

const OrderList = ({ orders = [], onPedidoClick }) => {
  orders.reverse();
  const traducirEstado = (status) => {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "ontheway":
      return "En camino";
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

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-gray-500">No hay pedidos aún.</div>
      ) : (
        orders.map((order, index) => (
          <div
            key={index}
            onClick={() => onPedidoClick(order)}
            className="cursor-pointer p-4 bg-white rounded-xl flex flex-col gap-2 hover:shadow-md transition-shadow"
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
                  className={`font-medium px-2 py-1 rounded-full text-xs ${
                    order.status === "pending"
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

export default OrderList;
