import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError('Por favor, ingresa tu correo/usuario y contraseña.');
      return;
    }

    // Aquí iría la lógica para autenticar al usuario
    // Puede ser una llamada a tu backend o API para verificar las credenciales
    onLogin(emailOrUsername, password);
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
            name="emailOrUsername"
            id="emailOrUsername"
            placeholder="Correo electrónico o Usuario"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
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
            className="w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600"
          />
          <div className="flex justify-end text-xs dark:text-gray-600">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
        </div>

        <button type="submit" className="block w-full p-3 text-center rounded-sm dark:text-gray-50 dark:bg-violet-600">
          Iniciar sesión
        </button>
      </form>

      <div className="flex items-center pt-4 space-x-1">
        <div className="flex-1 h-px sm:w-16 dark:bg-gray-300"></div>
        <p className="px-3 text-sm dark:text-gray-600">Iniciar sesión con cuentas sociales</p>
        <div className="flex-1 h-px sm:w-16 dark:bg-gray-300"></div>
      </div>

      <div className="flex justify-center space-x-4">
        <button aria-label="Iniciar sesión con Google" className="p-3 rounded-sm">
          {/* Aquí puedes poner el icono de Google */}
        </button>
        <button aria-label="Iniciar sesión con Twitter" className="p-3 rounded-sm">
          {/* Aquí puedes poner el icono de Twitter */}
        </button>
        <button aria-label="Iniciar sesión con GitHub" className="p-3 rounded-sm">
          {/* Aquí puedes poner el icono de GitHub */}
        </button>
      </div>

      <p className="text-xs text-center sm:px-6 dark:text-gray-600">
        ¿No tienes una cuenta? <a href="#" className="underline dark:text-gray-800">Regístrate</a>
      </p>
    </div>
  );
};

export default LoginForm;
