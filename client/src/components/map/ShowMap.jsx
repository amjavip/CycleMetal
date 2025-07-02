import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Mapa({lat, lon, className}) {
  const latt = lat
  const lonn = lon
  return (
    <>
      <MapContainer center={[latt,lonn]} zoom={13} scrollWheelZoom={true} className={className}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <Marker position={[latt, lonn]}>
          <Popup>
            Aquí estás tú.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}
