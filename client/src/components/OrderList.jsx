import React from "react";

const OrderList = ({ pedidos }) => {
  return (
    <div className="space-y-4 ">
      

      {pedidos.length === 0 ? (
        <div className="text-gray-500">No hay pedidos aún.</div>
      ) : (
        pedidos.map((pedido, index) => (
          <div
            key={index}
           className="mx-0 p-4 bg-white rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-lg font-semibold">{pedido.material}</p>
              <p className="text-sm text-gray-600">
                Dirección: {pedido.direccion}
              </p>
              <p className="text-sm text-gray-600">
                Fecha: {new Date(pedido.fecha).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  pedido.estado === "pendiente"
                    ? "bg-yellow-100 text-yellow-800"
                    : pedido.estado === "aceptado"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {pedido.estado.toUpperCase()}
              </span>
            </div>
              
              </div>
              
        ))
      )}
     
    </div>
  );
};

export default OrderList;
