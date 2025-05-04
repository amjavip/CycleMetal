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
    const profileString = localStorage.getItem('profile');
    const profile = profileString ? JSON.parse(profileString) : null;
    if (token && role && profile) {
      setUser({ token, role, profile});
      console.log(profile, "ahora estos son los datos");
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
    localStorage.removeItem('profile')
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
