import { useAuth } from "../../../context/AuthContext"
export default function SellerDetails() {
    const { user } = useAuth();
    return(
        <div>
<p className="text-xl font-semibold text-black">Detalles del perfil</p>
        <div className="w-full mt-10 border-t border-gray-300 pt-6">
  
  <div className="text-[#202020] space-y-4 text-lg font-light ">
    <div className="flex justify-between w-full">
      <span className="font-medium">Nombre de usuario:</span>
      <span>{user.profile.username}</span>
    </div>
    <div className="flex justify-between w-full">
      <span className="font-medium">Correo electrónico:</span>
      <span>{user.profile.email}</span>
      

    </div>
    <div className="flex justify-between w-full">
      <span className="font-medium">Teléfono:</span>
      <span>{user.profile.phone}</span>
    </div>
    <div className="flex justify-between w-full">
      <span className="font-medium">Rol:</span>
      <span>{user.role}</span>
    </div>
    <div className="flex justify-between w-full">
      <span className="font-medium">ID de usuario:</span>
      <span>{user.profile.id}</span>
    </div>
    <div className="w-1/2  focus:">
    
    <details class="rounded-none transition-all duration-300 ease-in-out hover:border-l-1 collapse hover:px-1 bg-white ">
  <summary class="collapse-title font-semibold">¿por que no se muestra mi contraseña?</summary>
  <div class="collapse-content text-sm ">
   No mostramos contraseñas por cuestion de seguridad de tus datos, si gustas cambiar tu contraseña dirigete a ....
  </div>
 
</details>
</div>
</div>
   
  </div>
  </div>
    )
};