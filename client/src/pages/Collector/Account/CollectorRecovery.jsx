import { useState } from "react";
import TiltCard from "../../../components/TiltCard";
import { useAuth } from "../../../context/AuthContext";
export default function CollectorRecovery() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const { user } = useAuth();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email) {
        setMessage("Por favor, ingresa un correo válido.");
        return;
      }
      if(email!=user.profile.email){
          setMessage("Ingrese el email con el que fue autenticado.")
          return;
      }
      try {
        const response = await fetch("http://127.0.0.1:8000/users/api/auth/send-reset-email/", {
          method: "POST",
          headers: { "Content-Type": "application/json",
             'Authorization': `Bearer ${user.token}`
           },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setMessage("Se ha enviado el enlace de recuperación a tu correo.");
        } else {
          setMessage(data.error || "Ocurrió un error.");
        }
      } catch (error) {
        setMessage("Error de conexión con el servidor.");
      }
    };
  
    return (
      <div className="px-5 flex flex-col justify-between gap-3">
         <p className="text-2xl text-black py-2">Recuperar Contraseña</p>
      <hr className="w-full text-gray-300 py-2 mt-3" />
      <br />
        <div className="px-3 rounded-xl w-full h-auto text-center text-[#202020] font-light text-xl">
          ¿Has olvidado tu contraseña?
        </div>
        <div className="px-3 rounded-xl w-full h-auto text-black text-md font-light text-center">
          ¡No te preocupes, solo restáurala mediante el uso de tu correo electrónico registrado!
        </div>
  
        <div className="w-full h-120 text-center text-[#202020] font-light text-xl flex flex-row justify-between gap-3">
          <div className="m-3 rounded-xl bg-[#f8f8f8] w-1/2 h-auto text-black text-md font-light text-center shadow-xl px-10">
            <p className="py-5">Restaura tu contraseña</p>
            <hr className="text-black/40 pb-20 " />
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-between gap-4 px-4 pb-6">
              <label className="text-sm w-full text-left">Ingresa tu correo asociado a tu cuenta</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-3/4 px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-primary mb-10"
                required
              />
              <br />
              <button
                type="submit"
                className="bg-[#404040] text-white py-2 px-6 rounded-xl hover:bg-[#202020]/90 transition "
              >
                Enviar correo
              </button>
              {message && <p className="text-sm text-center text-gray-600 pt-2">{message}</p>}
            </form> 
          </div>
  
          <div className="m-3 rounded-xl w-1/2 h-auto text-black text-md font-light text-center flex items-center">
            <TiltCard>
              <img
                className="w-full h-full object-cover rounded-xl self-center"
                src="/resetpassword.png"
                alt="img"
              />
            </TiltCard>
          </div>
        </div>
      </div>
      )
};