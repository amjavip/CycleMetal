// NavbarSelector.jsx
import React from 'react';
import DefaultNavbar from './DefaultNavbar';
import SellerNavbar from './Seller/SellerNavbar';
import { useAuth } from '../context/AuthContext';
import LoadingAlert from './Alert/LoadingAlert';
import CollectorNavbar from './Collector/CollectorNavbar';

const NavbarSelector = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <LoadingAlert></LoadingAlert> 
  }
  if (!user) {
    return <DefaultNavbar />;
  }

  if (user.role === 'seller') {
    return <SellerNavbar />;
  }

  if (user.role === 'collector') {
    return <CollectorNavbar />;
  }

  return <DefaultNavbar />; 
};

export default NavbarSelector;
