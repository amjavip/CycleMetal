import { useState } from "react";
import RegisterForm from "../components/Form/RegisterForm";
import Alert from "../components/Alert/SuccesAlert";
export default function RegisterPage() {
  const [message, setMessage] = useState(null); // Estado para la alerta

  return (
    <div className="flex items-center justify-center min-h-screen bg-opacity-60 bg-gradient-to-t from-[#909090] to-[#f1f1f1]  p-9">  
      
      <div className="w-full max-w-md">
        {/* Alerta arriba del formulario */}
        {message && <Alert message={message} onClose={() => setMessage(null)} />}

        <RegisterForm setMessage={setMessage} />  {/* Pasamos setMessage al formulario */}
      </div>

    </div>
  );
}
