import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerDeleteAccount() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false); 
  const [loading, setLoading] = useState(false);

  // 1. Verificar identidad (POST)
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/api/verify-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          role: user.role,
          id: user.profile.id, // ID del perfil del contexto
          password: password
        }),
      });

      if (response.ok) {
        setIsVerified(true); 
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // 2. Eliminar cuenta (DELETE) usando el ID dinámico
 const handleDeleteAccount = async () => {
    if (!window.confirm("¿Estás absolutamente seguro?")) return;

    try {
      // Ajustamos la URL para que siga el patrón que sí funciona (/users/api/...)
      // Y usamos .replace para evitar la doble diagonal accidental
      const base = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      
      const response = await fetch(`${API_URL}/users/api/users/users/${user.profile.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 204 || response.ok) {
        alert("Cuenta eliminada exitosamente.");
        logout();
        navigate('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(`Error ${response.status}: No se encontró el recurso o no tienes permiso.`);
      }
    } catch (err) {
      setError("Error de red al intentar conectar con el servidor.");
    }
  };
  return (
    <div className="px-5">
      <p className="text-2xl text-black py-2 font-semibold">Configuración de Cuenta</p>
      <hr className="w-full text-gray-300 py-2" />
      
      <div className="px-3 flex flex-col justify-center mt-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {!isVerified ? (
          <div className="animate-fade-in">
            <p className="font-light text-black py-2 self-center text-center mb-4">
              Para desbloquear la opción de eliminación, ingresa tu contraseña.
            </p>
            <form onSubmit={handleVerify} className="space-y-6 flex flex-col items-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escribe tu contraseña"
                className="px-4 py-3 w-full max-w-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-xs bg-black hover:bg-gray-800 text-white py-3 rounded-md transition-all shadow-lg"
              >
                {loading ? 'Validando...' : 'Desbloquear Acción'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-red-50 border-2 border-red-200 p-8 rounded-xl flex flex-col items-center shadow-inner animate-pulse-subtle">
            
            <p className="text-red-600 text-center mb-8 leading-relaxed">
              Has verificado tu identidad. Ahora puedes proceder a eliminar tu perfil de 
              <strong> {user.role}</strong>. Recuerda que perderás tu historial de ventas.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setIsVerified(false)}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Regresar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-xl font-bold uppercase tracking-wider"
              >
                Eliminar Ahora
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}