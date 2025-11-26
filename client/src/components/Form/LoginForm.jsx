import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Importamos el contexto
const API_URL = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Desestructuramos login del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      setError('Todos los datos son obligatorios.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: emailOrUsername,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Respuesta login:", data);

      if (response.ok) {
        // Guardamos los tokens y rol
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('role', data.role);

        // Construimos el perfil de usuario
        const userProfile = {
          username: data.username,
          email: data.email,
          phone: data.phone,
          id: data.id,
        };

        localStorage.setItem('profile', JSON.stringify(userProfile));

        // Guardamos el vehículo si existe (solo collectors)
        if (data.vehicle) {
          localStorage.setItem('vehicle', JSON.stringify(data.vehicle));
        } else {
          localStorage.removeItem('vehicle');
        }

        // Actualizamos el contexto con todos los datos
        login(data.access, data.role, userProfile, data.refresh, data.vehicle || null, data.has_active_route);

        // Redirigimos según rol
        navigate(`/${data.role.toLowerCase()}-home`);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError('Ocurrió un error al conectar con el servidor');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-[#fff]/40  backdrop-blur-sm text-black ">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-1 text-sm">
          <label htmlFor="emailOrUsername" className="block dark:text-gray-600">Correo electrónico o Usuario</label>
          <input
            type="text"
            name="emailOrUsername"
            id="emailOrUsername"
            placeholder="Correo electrónico o Usuario"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-md dark:border-gray-300  bg-gray-50/30"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="block dark:text-gray-600">Contraseña</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3  bg-gray-50/30"
          />
          <div className="flex justify-end text-xs dark:text-gray-600">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
        </div>

        <button type="submit" className="w-full px-8 py-3 btn btn-primary bg-primary/80 hover:bg-primary/100 border-none text-white px-6 py-3 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
          Iniciar sesión
        </button>
      </form>

      <p className="text-xs text-center sm:px-6 dark:text-gray-600">
        ¿No tienes una cuenta? <a href="#" className="underline dark:text-gray-800">Regístrate</a>
      </p>
    </div>
  );
};

export default LoginForm;
