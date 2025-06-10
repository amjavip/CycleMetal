import { TiLocationOutline } from "react-icons/ti";

export default function SellerUbication() {
    return (
        <div className="min-h-screen bg-white flex flex-row jusitfy-between gap-10">
            <div className="w-1/3 h-screen bg-transparent flex flex-col items-center">
           <p className="text-black text-xl font-semilight p-5 text-center pt-10"> Ingresa tu ubicacion actual o selecionada en el mapa</p>
            <form action="">
<label className="input bg-transparent self-center border  border-none focus:outline-none">
 <TiLocationOutline className="text-black"/>
  <input
    type="text"
    required
    placeholder="Ubicacion"
    className="bg-transparent text-black focus:outline-none"
    title="Only letters, numbers or dash"
  />
</label>

            </form>
            </div>
            <div className="w-2/3 h-screen bg-black rounded-xl">

            </div>
        </div>
    )
}