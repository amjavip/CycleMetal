import React from 'react';
import 'leaflet/dist/leaflet.css';
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
import ConfirmNewPassword from './pages/ConfirmNewPassword';

// Seller
import SellerHome from './pages/Seller/SellerHome';
import SellerAccount from './pages/Seller/SellerAccount';
import SellerChangePassword from './pages/Seller/Account/SellerChangePassword';
import SellerRecovery from './pages/Seller/Account/SellerRecovery';
import SellerDetails from './pages/Seller/Account/SellerDetails';
import SellerProfile from './pages/Seller/Account/SellerProfile';
import SellerActivity from './pages/Seller/SellerActivity';
import SellerServices from './pages/Seller/Services/SellerServices';
import AccountLayout from './components/Seller/SellerLayout';
import SellerNewOrder from './pages/Seller/Services/SellerNewOrder';
import SellerUbication from './pages/Seller/Services/SellerUbication';
import SellerOrderPayment from './pages/Seller/Services/SellerOrderPayment';

// Collector
import CollectorHome from './pages/Collector/CollectorHome';


function App() {
  const { t_user} = useAuth();

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
         <Route
          path="/changepassword/:uid/:token"
          element={
            <ConfirmNewPassword /> 
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
      <AccountLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="profile"/>} />
  <Route path="profile" element={<SellerProfile />} />
  <Route path="changepassword" element={<SellerChangePassword />} />
  <Route path="Recovery" element={<SellerRecovery />} />
  <Route path="details" element={<SellerDetails />} />
</Route>

        <Route
  path="/seller-services"
  element={
    <ProtectedRoute role="Seller">
      <SellerServices />
    </ProtectedRoute>
  }
>
  {/* 👇 Ruta hija visible dentro de <SellerServices /> gracias a <Outlet /> */}
  <Route
   path="neworder" 
   element={
   <SellerNewOrder />

   } >
<Route path="ubication" element={<SellerUbication />} />
<Route path="payment" element={<SellerOrderPayment/>}/>
    </Route>
</Route>

        
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




