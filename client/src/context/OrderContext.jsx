// context/OrderContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orderData, setOrderData] = useState(() => {
    const saved = localStorage.getItem("orderData");
    return saved
      ? JSON.parse(saved)
      : {
          id: null,
          sellerId: null,
          items: [],
          tip: 0,
          comision: 0,
          total: 0,
          subtotal: 0,
          token: null,
          paymentMethod: null,
          date: null,
          step: 0,
          rutas: [],
          instrucciones: {},
          activeOrderId: null,
        };
  });

  useEffect(() => {
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }, [orderData]);

  const updateOrder = (key, value) => {
    setOrderData((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === "items") {
        updated.subtotal = value.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0
        );
      }

      return updated;
    });
  };

  const resetOrder = () => {
    setOrderData({
      id: null,
      sellerId: null,
      items: [],
      tip: 0,
      comision: 0,
      total: 0,
      subtotal: 0,
      token: null,
      paymentMethod: null,
      date: null,
      step: 0,
      rutas: [],
      instrucciones: {},
      activeOrderId: null,
    });
    localStorage.removeItem("orderData");
  };

  return (
    <OrderContext.Provider value={{ orderData, updateOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);
