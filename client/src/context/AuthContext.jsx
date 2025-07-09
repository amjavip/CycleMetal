import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { setUpdateTokenCallback } from './tokenService';

// Creamos el contexto de autenticación
export const AuthContext = createContext();


// Custom hook para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para el usuario
  const [t_user, setT_user] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  
  useEffect(() => {
    const token = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    const role = localStorage.getItem('role');
    const has_active_route = localStorage.getItem('has_active_route'||true);

    const profileString = localStorage.getItem('profile');
    const vehicleString = localStorage.getItem('vehicle');

    const profile = profileString ? JSON.parse(profileString) : null;
    let vehicle = null;
try {
  const vehicleString = localStorage.getItem('vehicle');
  if (vehicleString && vehicleString !== "undefined") {
    vehicle = JSON.parse(vehicleString);
  }
} catch (err) {
  console.warn("Error al parsear vehicle:", err);
  vehicle = null;
}


    const t_token = localStorage.getItem('t_token');
    const uid = localStorage.getItem('uid');

    if (token && role && profile) {
      setUser({ token, role, profile, refresh, vehicle, has_active_route });
      if (t_token) {
        setT_user({ t_token, uid });
      }
    }
    setLoading(false); // Terminamos de cargar después de revisar localStorage
  }, []);

  const updateAccessToken = (newToken) => {
    localStorage.setItem("access", newToken);
    setUser((prev) => (prev ? { ...prev, token: newToken } : null));
  };

  useEffect(() => {
    setUpdateTokenCallback(updateAccessToken);
  }, []);

  const login = (token, role, profile, refresh, vehicle, has_active_route ) => {
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('vehicle', JSON.stringify(vehicle));
    localStorage.setItem('access', token);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('role', role);
    localStorage.setItem('has_active_route', has_active_route);
    setUser({ token, role, profile, refresh, vehicle, has_active_route });
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('role');
    localStorage.removeItem('profile');
    localStorage.removeItem('t_token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('vehicle');
    localStorage.removeItem('has_active_route')
    setUser(null);
    setT_user(null);
  };

  const setTToken = (token, uid) => {
    localStorage.setItem('t_token', token);
    localStorage.setItem('uid', uid);
    setT_user({ t_token: token, uid });
  };
console.log(user);
  return (
    <AuthContext.Provider
  value={{ user, login, logout, loading, t_user, setTToken, updateAccessToken, setUser }}
>

      {children}
    </AuthContext.Provider>
  );
};
