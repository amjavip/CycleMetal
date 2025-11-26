import React, { useState } from 'react';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import {
  loadStripe
} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useOrder } from '../../../context/OrderContext';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1f2937',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#9ca3af',
      },
      iconColor: '#3b82f6',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

function CheckoutForm() {
 
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { orderData, updateOrder, resetOrder } = useOrder();
   const { user }= useAuth();

  const [paymentMethod, setPaymentMethod] = useState('card' || 'cash');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setErrorMessage(null);
    setPaymentSuccess(false);
  };
  useEffect(() => {
  if (!orderData.step || orderData.step < 2) {
    navigate("/seller-services/neworder/summary");
  }
if (!orderData.token){
  navigate("/seller-services/neworder/summary");
}
console.log(orderData.token);
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage(null);
  setIsProcessing(true);

  if (paymentMethod === 'cash') {
    try {
      const response = await axios.post(`${API_URL}/orders/api/checkout/`, {
        ...orderData,
        paymentMethod: "cash",
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      navigate("/seller-services")
      resetOrder();
      console.log("Respuesta CASH:", response.data);
      updateOrder("paymentMethod", response.data.paymentMethod)
      setPaymentSuccess(true);
      
    } catch (error) {
      setErrorMessage("Error al procesar el pago en efectivo");
    } finally {
      setIsProcessing(false);
    }
    return;
  }

  // Si es pago con tarjeta
  if (!stripe || !elements) {
    setErrorMessage("Stripe no está disponible");
    setIsProcessing(false);
    return;
  }

 // PASO 1: Crear el PaymentMethod
const cardElement = elements.getElement(CardElement);
const { error: pmError, paymentMethod: pm } = await stripe.createPaymentMethod({
  type: 'card',
  card: cardElement,
});

if (pmError) {
  setErrorMessage(pmError.message);
  setIsProcessing(false);
  return;
}

// PASO 2: Pedir al backend que cree el PaymentIntent con capture_method="manual"
const backendRes = await axios.post(`${API_URL}/orders/api/checkout/`, {
  id: orderData.id,
  token: orderData.token,
  paymentMethod: "card",
}, {
  headers: {
    Authorization: `Bearer ${user.token}`,
  },
});

const clientSecret = backendRes.data.clientSecret;

// PASO 3: Confirmar el PaymentIntent (autorizar, sin cobrar)
const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: pm.id,
});

if (confirmError) {
  setErrorMessage(confirmError.message);
  setIsProcessing(false);
  return;
}

console.log("✅ Autorizado con éxito (no capturado aún):", paymentIntent.id);
setPaymentSuccess(true);
updateOrder("paymentMethod", "card");
setIsProcessing(false);
};


  return (
    <div className="min-h-screen mx-auto bg-white w-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Finaliza tu pedido</h2>

        {/* Resumen pedido */}
        <section className="mb-8 text-black">
          <h3 className="text-xl font-semibold mb-3">Resumen del pedido</h3>
          <ul className="mb-2">
            {orderData.items.map((item, i) => (
              <li key={i} className="flex justify-between border-b py-2">
                <span>{item.nombre} x {item.cantidad}</span>
                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
            
              </li>
            ))}
          
             <li className="flex justify-between border-b py-2">
              <span>Comision</span>
              <span>${orderData.comision.toFixed(3)}</span>
            </li>
             <li className="flex justify-between border-b py-2">
              <span>Propina</span>
              <span>${orderData.tip}</span>
            </li>
            
          </ul>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${orderData.total.toFixed(2)}</span>
          </div>
        </section>

        {/* Método de pago */}
        <section className="mb-8 text-black">
          <h3 className="text-xl font-semibold mb-3">Método de pago</h3>

          <div className="flex items-center mb-4">
            <input
              id="pay-card"
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={handlePaymentMethodChange}
              className="mr-2 cursor-pointer"
            />
            <label htmlFor="pay-card" className="cursor-pointer select-none">
              Tarjeta de crédito/débito
            </label>
          </div>

          <div className="flex items-center mb-4">
            <input
              id="pay-cash"
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={handlePaymentMethodChange}
              className="mr-2 cursor-pointer"
            />
            <label htmlFor="pay-cash" className="cursor-pointer select-none">
              Pago al recolector (en efectivo)
            </label>
          </div>

          {paymentMethod === 'card' && (
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">
                Información de la tarjeta
              </label>
              <div className="border rounded-md p-3 bg-gray-50">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>
          )}
        </section>

        {/* Error */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMessage}</div>
        )}

        {/* Botón de pagar */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || (!stripe && paymentMethod === 'card')}
          className={`w-full py-3 rounded-md text-white font-semibold transition
            ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isProcessing ? 'Procesando...' : 'Pagar ahora'}
        </button>

        {/* Mensaje éxito */}
        {paymentSuccess && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded text-center font-semibold">
            ¡Pago realizado con éxito! Gracias por tu pedido.
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <CheckoutForm />
      </div>
    </Elements>
  );
}
