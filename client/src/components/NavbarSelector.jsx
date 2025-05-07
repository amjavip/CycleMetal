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
    console.log("Esta utilizando el def");
    return <DefaultNavbar />;
  }

  if (user.role === 'Seller') {
    console.log("Esta utilizando el sell");
    return <SellerNavbar />;
  }

  if (user.role === 'Collector') {
    console.log("Esta utilizando el coll");
    return <CollectorNavbar />;
  }

  return <DefaultNavbar />; 
};

export default NavbarSelector;
