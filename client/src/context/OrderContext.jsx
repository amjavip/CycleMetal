import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orderData, setOrderData] = useState({
    location: null,
    items: [],
    paymentMethod: null,
    notes: "",
  });

  const updateOrder = (key, value) => {
    setOrderData(prev => ({ ...prev, [key]: value }));
  };

  const resetOrder = () => {
    setOrderData({
      location: null,
      items: [],
      paymentMethod: null,
      notes: "",
    });
  };

  return (
    <OrderContext.Provider value={{ orderData, updateOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);
