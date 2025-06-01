import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";

export default function ConfirmNewPassword() {
  const { uid, token } = useParams(); // captura uid y token de la URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
   // <- los datos que vienen en la URL
  const { t_user, setTToken, user, logout } = useAuth();



  useEffect(() => {
    // Si no están en contexto, los guardamos
    if (!t_user?.t_token && token && uid) {
      setTToken(token, uid);
      localStorage.setItem('t_token', token);
      localStorage.setItem('uid', uid);
    }
  }, [token, uid, t_user, setTToken]);

  // ...


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/users/api/auth/set-new-password/', {
        new_password: newPassword,
        id: user.profile.id,
        uid: t_user.uid,
        role: user.role,
        t_token: t_user.t_token,
      });

      alert("Contraseña actualizada con éxito");
      logout();
      navigate('/login'); // redirigir al login para que inicie sesión con la nueva contraseña
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Hubo un error al cambiar la contraseña");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#fff] text-black">
      <h2 className="text-2xl font-bold">Establecer nueva contraseña</h2>
      <p className="font-light text-md mb-4">Cuando se cambie la contraseña se le pedirá que vuelva a iniciar sesión.</p>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Cambiar contraseña
        </button>
      </form>
    </div>
  );
}
