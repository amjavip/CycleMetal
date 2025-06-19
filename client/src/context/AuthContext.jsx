import React, { createContext, useState, useEffect, useContext } from 'react';

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
    const role = localStorage.getItem('role');
    const profileString = localStorage.getItem('profile');
    const profile = profileString ? JSON.parse(profileString) : null;
    const t_token = localStorage.getItem('t_token');
    const uid = localStorage.getItem('uid')
    if (token && role && profile) {
      setUser({ token, role, profile});
    if (t_token) {
      setT_user({t_token, uid});
    }
    }
    
    setLoading(false); // Terminamos de cargar después de revisar localStorage
  }, []);

  const login = (token, role, profile) => {
    localStorage.setItem('profile', JSON.stringify(profile)); // <- importante
    localStorage.setItem('access', token);
    localStorage.setItem('role', role);
    setUser({ token, role, profile });
    console.log(token, role, profile,  " . from AuthContext");
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('role');
    localStorage.removeItem('profile');
    localStorage.removeItem('t_token');
    setUser(null);
    setT_user(null);
  };
   const setTToken = (token, uid) => {
    localStorage.setItem('t_token', token);
   localStorage.setItem('uid', uid);
    setT_user({ t_token: token, uid });
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading, t_user, setTToken }}>
      {children}
    </AuthContext.Provider>
  );
};
