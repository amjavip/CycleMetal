// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import './index.css'; // ✅ tus estilos deben importarse aquí

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
