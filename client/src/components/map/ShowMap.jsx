import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Mapa() {
  return (
    <div className="h-screen w-full overflow-hidden p-10">
      <MapContainer center={[19.4326, -99.1332]} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <Marker position={[19.4326, -99.1332]}>
          <Popup>
            Aquí estás tú.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
