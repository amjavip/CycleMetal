import React, { createContext, useState, useEffect, useContext } from 'react';

// Creamos el contexto de autenticación
export const AuthContext = createContext();

// Custom hook para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para el usuario
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  useEffect(() => {
    const token = localStorage.getItem('access');
    const role = localStorage.getItem('role');

    if (token && role) {
      setUser({ token, role });
    }
    
    setLoading(false); // Terminamos de cargar después de revisar localStorage
  }, []);

  const login = (token, role) => {
    localStorage.setItem('access', token);
    localStorage.setItem('role', role);
    setUser({ token, role });
    console.log(token, role, " . from AuthContext");
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
