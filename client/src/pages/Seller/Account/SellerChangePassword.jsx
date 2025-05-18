import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";


export default function SellerChangePassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, setTToken } = useAuth();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/users/api/verify-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: user.role,
          id: user.profile.id,
          password: password
        }),
      });

         
// ...
            if (response.ok) {
             const data = await response.json();
              console.log(data);
              const urlCambio = data.url;
             localStorage.setItem('t_token', data.token);
             localStorage.setItem('uid', data.uid)
             setTToken(data.token, data.uid); // <- esta es la función correcta del contexto
             
             navigate(urlCambio);
          } else {
           const errorData = await response.json();
            setError(errorData.error || 'Error al verificar la contraseña');
          }

    } catch (err) {
      console.log("No se enviaron datos.");
      setError('Error al conectar con el servidor');
    }
  };

return(
    <div className="px-5">
       <p className="text-2xl text-black py-2">Cambiar Contraseña</p>
  <br />
      <hr className="w-full text-gray-300 py-2" />
      <br />
      <div className="px-3 flex flex-col flex justify-center">
        <p className="font-light text-black py-2 self-center">Para continuar con la creacion de su nueva contraseña de debe de verificar su identidad.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className=" text-center text-red-500 text-sm">{error}</p>}

        <div className="space-y-1 text-sm w-full flex flex-col">
          <label htmlFor="password" className="block text-black text-center">Contraseña actual</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black self-center text-black"
            required
          />
        <br />
        <button
          type="submit"
          className=" w-1/4 bg-[#303030] self-center hover:bg-[#404040] text-white py-3 rounded-md transition-all duration-300 hover:scale-105 shadow-md"
        >
          Verificar y continuar
        </button>
        </div>
      </form>
            </div>
        
    </div>
)
}
