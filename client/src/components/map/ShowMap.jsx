import { MapContainer, TileLayer, Marker, Popup, useMapEvent, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from "react";
import polyline from '@mapbox/polyline'; // 👉 Importa para decodificar
import L from 'leaflet';


// Componente radar que se ubica en la posición geográfica
function RadarOverlay({ lat, lon }) {
  const map = useMapEvent('move', updatePosition);
  const overlayRef = useRef();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function updatePosition() {
    if (!map) return;
    const point = map.latLngToContainerPoint([lat, lon]);
    setPosition({ x: point.x, y: point.y });
  }

  useEffect(() => {
    updatePosition();
  }, [map, lat, lon]);

  return (
    <div
      ref={overlayRef}
      className="radar-overlay"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    />
  );
}

export default function Mapa({ lat, lon, className = "", orders = [], rutas = [] }) {
  if (!lat || !lon) return <p>Esperando ubicación...</p>;

  const center = [lat, lon];
  const radius = 1000;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapContainer center={center} zoom={16} scrollWheelZoom={true} className="w-full h-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Tu ubicación */}
        <Marker position={center}>
          <Popup>Aquí estás tú.</Popup>
        </Marker>

        {/* Pedidos */}
        {orders.map(({ order }, idx) => {
          const { lat: orderLat, lon: orderLon, id } = order || {};
          if (!orderLat || !orderLon) return null;

          return (
            <Marker key={id || idx} position={[parseFloat(orderLat), parseFloat(orderLon)]}>
              <Popup>Pedido: {id}</Popup>
            </Marker>
          );
        })}

        {/* Radar como capa extra */}
        {orders && (
          <>
            <RadarOverlay lat={lat} lon={lon} />
            <Circle
              center={center}
              radius={radius}
              pathOptions={{
                color: "#007bff",
                dashArray: "5, 5",
                fillOpacity: 0.0,
                weight: 2,
              }}
            />
          </>
        )}

        {/* 👇 Mostrar rutas geométricas */}
        {rutas.map((ruta, idx) => {
          let decodedCoords = [];
          try {
            decodedCoords = polyline.decode(ruta.geometry);
          } catch (err) {
            console.error("Error al decodificar la ruta:", ruta.id, err);
          }

          return (
            <Polyline
              key={ruta.id || idx}
              positions={decodedCoords}
              pathOptions={{
                color: ruta.color || "blue",
                weight: 5,
                opacity: 0.7,
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
