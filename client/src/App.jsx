// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';  // Página de inicio
import RegisterPage from './pages/RegisterPage';  // Página de registro


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} /> {/* Ruta para el registro */}
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;





