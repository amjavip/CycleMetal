import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context
import { useAuth } from './context/AuthContext';

// Componentes
import NavbarSelector from './components/NavbarSelector';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuth from './components/RedirectIfAuth'


// Páginas generales
import Home from './pages/home';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

// Seller
import SellerHome from './pages/Seller/SellerHome';
import SellerAccount from './pages/Seller/SellerAccount';
import SellerActivity from './pages/Seller/SellerActivity';
import SellerServices from './pages/Seller/SellerServices';

// Collector
import CollectorHome from './pages/Collector/CollectorHome';

function App() {
  const { user } = useAuth(); // Aquí ya tienes acceso a user.role y user.isAuthenticated

  return (
    <>
      <NavbarSelector />
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/register" element={
          <RedirectIfAuth>
          <RegisterPage />
          </RedirectIfAuth>
         } 
        />
        <Route path="/login" element={ 
          <RedirectIfAuth> 
          <LoginPage /> 
          </RedirectIfAuth>
         } 
        />

        {/* Seller */}
        <Route
          path="/seller-home"
          element={
            <ProtectedRoute role="Seller">
              <SellerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-activity"
          element={
            <ProtectedRoute role="Seller">
              <SellerActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-account"
          element={
            <ProtectedRoute role="Seller">
              <SellerAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-services"
          element={
            <ProtectedRoute role="Seller">
              <SellerServices />
            </ProtectedRoute>
          }
        />

        {/* Collector */}
        <Route
          path="/collector-home"
          element={
            <ProtectedRoute role="Collector">
              <CollectorHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;




