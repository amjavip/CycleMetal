import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TiLocationOutline } from "react-icons/ti";

export default function SellerUbication() {
    const [latlon, setLatlon] = useState(null); // CDMX por defecto
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    // Obtener búsquedas recientes desde localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('recentUbicationSearches')) || [];
        setRecentSearches(saved);
    }, []);

    const saveRecentSearch = (term) => {
        const updated = [term, ...recentSearches.filter(item => item !== term)].slice(0, 6);
        setRecentSearches(updated);
        localStorage.setItem('recentUbicationSearches', JSON.stringify(updated));
    };

    const handleSearch = (searchTerm) => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}&accept-language=es`)
            .then(res => res.json())
            .then(data => {
                setSuggestions(data);
                saveRecentSearch(searchTerm);
            });
    };
    const reverseGeocode = async (lat, lon) => {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=es`);
        const data = await res.json();
        return data.display_name;
    };

    // Obtener ubicación actual
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLatlon([pos.coords.latitude, pos.coords.longitude]);
            },
            (err) => {
                console.warn("No se pudo obtener la ubicación:", err.message);
            }
        );
    }, []);
    const handleCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                setLatlon([lat, lon]);

                try {
                    const locationName = await reverseGeocode(lat, lon);
                    setSearch(locationName); // Esto llena el input automáticamente
                } catch (err) {
                    console.error("No se pudo traducir la ubicación", err);
                }
            },
            (err) => {
                console.warn("No se pudo obtener la ubicación:", err.message);
            }
        );
    };



    // Buscar sugerencias al escribir
    useEffect(() => {
        const delay = setTimeout(() => {
            if (search.length > 2) {
                handleSearch(search);
            }
        }, 500);
        return () => clearTimeout(delay);
    }, [search]);

    const handleSelectSuggestion = (place) => {
        setLatlon([parseFloat(place.lat), parseFloat(place.lon)]);
        setSearch(place.display_name);
        setSuggestions([]);
        saveRecentSearch(place.display_name);
    };

    const handleRecentClick = (term) => {
        setSearch(term);
        handleSearch(term);
    };

    return (
        <div className="min-h-screen bg-white flex gap-10">
            <div className="w-1/3 p-5 flex flex-col items-center">
                <p className="text-black text-xl font-semilight text-center pt-10">
                    Ingresa tu ubicación actual o seleccionada en el mapa
                </p>
                <div className='flex flex-row justify-center mt-2'>
                <label className="input bg-[#f8f8f8] self-center border flex items-center">
                    <div className="tooltip tooltip-right" data-tip="selecciona tu ubicacion actual">

                        <TiLocationOutline className="text-black mr-2 cursor-pointer" onClick={handleCurrentPosition} />

                    </div>
                    <input
                        type="text"
                        placeholder="Buscar ubicación..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent text-black focus:outline-none w-full self-center"
                    />
                </label>
              {latlon && latlon.length === 2 && (
  <button className='btn btn-primary self-center text-[12px] p-3 m-3'>Usar esta ubicación</button>
)}

                </div> 
                {/* Sugerencias */}
                <div className='carousel carousel-vertical max-h-[300px]'>
                    <ul className="mt-2 w-full">
                        {suggestions.map((place, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectSuggestion(place)}
                                className="cursor-pointer hover:bg-gray-100 p-2 text-sm text-black"
                            >
                                {place.display_name}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Búsquedas recientes */}
              
                    {recentSearches.length > 0 && (
                        <div className="mt-4 w-full">
                            <h3 className="text-md font-semibold text-black mb-1">Búsquedas recientes</h3>
                              <div className='carousel carousel-vertical max-h-[100px]'>
                            <ul className="space-y-1">
                                {recentSearches.map((term, index) => (
                                    <li
                                        key={index}
                                        className="cursor-pointer rounded-md list-row text-primary hover:bg-[#f8f8f8] text-sm p-2 "
                                        onClick={() => handleRecentClick(term)}
                                    >
                                        {term}
                                    </li>
                                ))}
                            </ul>
                                </div>
                        </div>

                    )}
                </div>
            

                <div className="w-2/3 h-[550px] rounded-xl m-5">
                    <MapContainer center={!latlon ? [19.4326, -99.1332] : latlon} zoom={15} className="rounded-xl" style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                       {latlon && <Marker position={latlon} />}
                    </MapContainer>
                </div>
            </div>
            );
}
