// context/OrderContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orderData, setOrderData] = useState(() => {
    const saved = localStorage.getItem("orderData");
    return saved
      ? JSON.parse(saved)
      : {
          sellerId: null,
          location: null,
          items: [],
          total: 0,
          paymentMethod: null,
          notes: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }, [orderData]);

  const updateOrder = (key, value) => {
    setOrderData((prev) => {
      const updated = { ...prev, [key]: value };

      // Recalcula el total si se actualizan los items
      if (key === "items") {
        updated.total = value.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
      }

      return updated;
    });
  };

  const resetOrder = () => {
    setOrderData({
      sellerId: null,
      location: null,
      items: [],
      total: 0,
      paymentMethod: null,
      notes: "",
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
