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
    const vehicle = localStorage.getItem('vehicle')
    const profileString = localStorage.getItem('profile');
    const profile = profileString ? JSON.parse(profileString) : null;
    const t_token = localStorage.getItem('t_token');
    const uid = localStorage.getItem('uid')
    if (token && role && profile) {
      setUser({ token, role, profile, refresh, vehicle });
      if (t_token) {
        setT_user({ t_token, uid });
      }
    }
    setLoading(false); // Terminamos de cargar después de revisar localStorage
  }, []);


 const updateAccessToken = (newToken) => {
    console.log("gg");
    localStorage.setItem("access", newToken);
    setUser((prev) => (prev ? { ...prev, token: newToken } : null));
  };
  useEffect(() => {
  setUpdateTokenCallback(updateAccessToken);
}, []);

  const login = (token, role, profile, refresh, vehicle) => {
    localStorage.setItem('profile', JSON.stringify(profile)); // <- importante
    localStorage.setItem('access', token);
    localStorage.setItem('refresh', refresh)
    localStorage.setItem('vehicle', vehicle)
    localStorage.setItem('role', role);
    setUser({ token, role, profile, refresh, vehicle});
    console.log(token, role, profile, refresh, " . from AuthContext");

  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('role');
    localStorage.removeItem('profile');
    localStorage.removeItem('t_token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('vehicle')
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
    <AuthContext.Provider value={{ user, login, logout, loading, t_user, setTToken, updateAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
