import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchNav() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const routesMap = {
    detalles: "details",
    "cambiar contraseña": "changepassword",
    "recuperar contraseña": "recovery",
    perfil: "profile", // puedes poner "profile" si tienes una ruta así
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const lowerQuery = query.toLowerCase();
      const matchedRoute = Object.keys(routesMap).find((key) =>
        lowerQuery.includes(key)
      );

      if (matchedRoute) {
        navigate(routesMap[matchedRoute]);
        setQuery("");
      } else {
        alert("No se encontró la opción");
      }
    }
  };

  return (
    <div>
      <label className="input bg-[#000]/2">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="black"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </g>
  </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full bg-transparent focus:outline-none text-black placeholder-gray-500"
          placeholder="Buscar sección"
        />
      </label>
    </div>
  );
}
