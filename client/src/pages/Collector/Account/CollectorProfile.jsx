//TODO falta la verificacion para ver si el usuario esta disponible dentro de la base de datos
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import TiltCard from "../../../components/TiltCard";
import { DataArrayTexture } from "three";
export default function CollectorProfile() {
  const { user, login } = useAuth();  // Obtiene los datos del usuario desde el contexto

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
  });

  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (user && user.profile) {
      setFormData({
        username: user.profile.username || "",
        phone: user.profile.phone || "",
        email: user.profile.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Detecta si hay cambios comparado con los datos originales
      setIsModified(
        updated.username !== user.profile.username ||
        updated.phone !== user.profile.phone ||
        updated.email !== user.profile.email
      );
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtén el ID y el role del usuario desde el contexto o localStorage
    const userId = user.profile.id;  // Asegúrate de que el ID esté en el contexto
    const role = user.role;   // Asegúrate de que el role esté en el contexto

    const updatedData = {
      ...formData,
      id: userId,  // Agregar el ID al cuerpo de la solicitud
      role: role,  // Agregar el role al cuerpo de la solicitud
    };

    // Hacer la solicitud PUT al backend
    try {
      const response = await fetch('http://localhost:8000/users/api/update/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`, // Mandar el token de autorización
        },
        body: JSON.stringify(updatedData), // Enviar los datos a actualizar
      });

      if (response.ok) {
        const data = await response.json();
        
        const newProfile = {
          username: data.username,
          email: data.email,
          phone: data.phone,
          id: data.id
        };
      
        // Guardar nueva token y perfil actualizado
        localStorage.setItem('refresh', data.refresh)
        localStorage.setItem('access', data.access);
    
        localStorage.setItem('profile', JSON.stringify(newProfile));
        
        // Actualizar AuthContext
        login(data.access, data.role, newProfile, data.refresh);
        
        setIsModified(false);        // Oculta el botón otra vez
        setFormData(updatedData); // Resetea formData
        alert("Perfil actualizado correctamente");
      } else {
        alert("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error de conexión", error);
      alert("Hubo un error al actualizar el perfil");
    }
  };

  const { username, email, phone } = user.profile;  // Datos del perfil para mostrar

  return (
    <div className="px-5">
      <p className="text-2xl text-black py-2">Perfil</p>
      <br />
      <hr className="w-full text-gray-300 py-2" />
      <br />
      <div className="w-full flex flex-row">
        <div className="w-1/2 p-5 text-black ">
       
          <TiltCard>
        
          <div className="p-5 bg-[#f8f8f8] shadow-xl p-2 w-full rounded-xl flex flex-col justify-center text-black">
            <p className="self-center pb-6">Ficha de perfil</p>
            
            <img
              src="/12694.jpg"
              alt="Foto de perfil"
              className="w-85 h-85 rounded-full object-cover self-center"
            />
            <br />
            <p className="text-3xl font-semibold">{username}</p>
            <p className="text-[#202020]">({email})</p>
            <br />
            <p className="border-1 border-primary text-primary rounded-lg self-center px-3">Subscripción activa</p>
          </div>
     
          </TiltCard>
          
        </div>
        <div className="w-1/2 text-xl font-semibold text-black px-5 flex flex-row">
          <div className="p-5 p-2 w-full flex flex-col text-black ">
            <p className="w-full pb-5">Datos</p>
            <form onSubmit={handleSubmit} className="flex flex-col space-between gap-10">
              <label className="outline-none focus:outline-none input input-lg bg-white w-3/4 rounded-none transition-all duration-300 ease-in-out hover:border-l-black justify-center outline-hidden">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="outline-hidden text-[#202020] text-xl font-light transition-all duration-300 ease-in-out focus:pl-2 focus:outline-hidden"
                />
              </label>
              <label className="input input-lg bg-white w-3/4 rounded-none transition-all duration-300 ease-in-out hover:border-l-black" >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-[#202020] text-xl font-light"
                />
              </label>
              <label className="input input-lg bg-white w-3/4 rounded-none transition-all duration-300 ease-in-out hover:border-l-black">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="text-[#202020] text-xl font-light"
                />
              </label>

              {isModified && (
                <button
                  type="submit"
                  className="self-center justify-center border-1 border-primary mx-auto px-3 text-primary font-light  py-2 rounded hover:bg-primary/10 transition "
                >
                  Guardar cambios
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
