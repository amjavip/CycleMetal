// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home';  // Página de inicio
import RegisterPage from './pages/RegisterPage';  // Página de registro
import Navbar from './components/NavBar'
import Login from './pages/LoginPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  // Función para manejar el logout
  const handleLogout = () => {
    setIsAuthenticated(false); // Cambia el estado a false cuando el usuario cierra sesión
  };

  return (
    
    <BrowserRouter>
    <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} /> {/* Ruta para el registro */}
        <Route path="/Login" element={<Login />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;





