import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import Alert from "../components/SuccesAlert"; // Asegúrate de importar la alerta

export default function RegisterPage() {
  const [message, setMessage] = useState(null); // Estado para la alerta

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#202020] p-9">  
      
      <div className="w-full max-w-md">
        {/* Alerta arriba del formulario */}
        {message && <Alert message={message} onClose={() => setMessage(null)} />}

        <RegisterForm setMessage={setMessage} />  {/* Pasamos setMessage al formulario */}
      </div>

    </div>
  );
}
