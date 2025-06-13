import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ setMessage }) => {  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",  // Asegurar que confirmPassword esté en el estado
    phone: "",
    role: "seller"
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Verificar si el nombre de usuario ya está en uso
  const checkUsername = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/api/check-username/",
        { username: formData.username, email: formData.email }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el nombre de usuario", error);
      return false;
    }
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    const usernameExists = await checkUsername();
    if (usernameExists) {
      setMessage("El nombre de usuario ya está en uso. Por favor, elige otro.");
      return;
    }

    // Crear un nuevo objeto sin confirmPassword
    const dataToSend = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role
    };

    try {
      await axios.post("http://127.0.0.1:8000/users/api/register/", dataToSend);
      setMessage("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } catch (error) {
      setMessage("Error al registrar usuario.");
      console.error("Error:", error.response?.data);
    }
  };

  return (
    <div className="flex flex-col max-w-md py-8 rounded-3xl sm:p-10 bg-[#fff]/40  backdrop-blur-sm  text-gray-800">
      <div className="mb-8 text-center ">
        <h1 className="my-3 text-4xl font-bold">Registro de Usuario</h1>
        <p className="text-sm text-gray-600">Crea una cuenta para continuar</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div>
          <label className="block mb-2 text-sm">Username</label>
          <input type="text" placeholder="Usuario" name="username" onChange={handleChange} required className="w-full px-3 py-2  rounded-md bg-gray-50/30 text-gray-800" />
        </div>
        <div>
          <label className="block mb-2 text-sm">Email</label>
          <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required className="w-full px-3 py-2 rounded-md bg-gray-50/30 text-gray-800" />
        </div>
        <div>
          <label className="block mb-2 text-sm">Password</label>
          <input type="password" placeholder="Contraseña" name="password" onChange={handleChange} required className="w-full px-3 py-2  rounded-md bg-gray-50/30 text-gray-800" />
        </div>
        <div>
          <label className="block mb-2 text-sm">Confirmar contraseña</label>
          <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" onChange={handleChange} required className="w-full px-3 py-2  rounded-md bg-gray-50/30 text-gray-800" />
        </div>
        <div>
          <label className="block mb-2 text-sm">Telefono</label>
          <input type="text" name="phone" placeholder="Telefono" onChange={handleChange} required className="w-full px-3 py-2  rounded-md bg-gray-50/30 text-gray-800" />
        </div>
        <div>
          <label className="block mb-2 text-sm">Role</label>
          <select name="role" onChange={handleChange} className="w-full px-3 py-2  rounded-md bg-gray-50/30 text-gray-800">
            <option value="seller">Seller</option>
            <option value="collector">Collector</option>
          </select>
        </div>
        <div>
          <button type="submit" className="w-full px-8 py-3 font-semibold rounded-2xl bg-violet-600 text-white hover:bg-violet-700">Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
