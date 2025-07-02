// main.jsx
import "./context/axiosInstance"; // 👈 esto activa el interceptor

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrderProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </OrderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
