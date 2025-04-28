import React, { useState } from 'react';

const LoginForm = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      setError('Por favor, ingresa tu correo/usuario y contraseña.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/users/api/login/', {
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

      if (response.ok) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        localStorage.setItem('id', data.id);

        if (data.role === "Seller") {
          window.location.href = "/dashboard-vendedor";
        } else if (data.role === "Collector") {
          window.location.href = "/dashboard-recolector";
        }
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError('Ocurrió un error al conectar con el servidor');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark:bg-gray-50 dark:text-gray-800">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-1 text-sm">
          <label htmlFor="emailOrUsername" className="block dark:text-gray-600">Correo electrónico o Usuario</label>
          <input
            type="text"
            id="emailOrUsername"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
            placeholder="Correo electrónico o Usuario"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="block dark:text-gray-600">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
            placeholder="Contraseña"
          />
        </div>

        <button type="submit" className="w-full px-8 py-3 bg-[#303030] hover:bg-[#404040] border-none text-white rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
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
