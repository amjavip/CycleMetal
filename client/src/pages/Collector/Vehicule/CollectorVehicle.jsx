import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Center, Bounds, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

export default function CollectorVehicule() {
  const { user, login } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/orders/api/order/Vehicle/", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setVehiculos(res.data))
      .catch((err) => console.error("Error al cargar vehículos", err));
  }, []);

  const handleSeleccionar = (vehiculo) => {
    setSeleccionado((prev) => (prev?.id === vehiculo.id ? null : vehiculo));
  };

  const guardarVehiculo = async () => {
    if (!seleccionado) return;
    setGuardando(true);
    try {
     await axios.patch(
  "http://127.0.0.1:8000/orders/api/update-vehicle/",
  { id: seleccionado.id },
  {
    headers: { Authorization: `Bearer ${user.token}` },
  }
).then((res) => {
  const vehiculoActualizado = res.data.vehicle;
  // 👇 Aquí actualizas el user.vehicle en el AuthContext si tienes una función para eso
  
        login(vehiculoActualizado);
  alert("Vehículo asignado correctamente.");
});

  
      alert("Vehículo asignado correctamente.");
    } catch (err) {
      console.error("Error al guardar", err);
    } finally {
      setGuardando(false);
    }
  };

  // 📊 Diccionario de descripciones
  const descripciones = {
    caminar: {
      uso: "Ideal para zonas muy estrechas y sin acceso vehicular.",
      desventajas: "Velocidad baja y poca capacidad de carga.",
      calificacion: 30,
    },
    pickup: {
      uso: "Excelente para rutas medianas con carga moderada.",
      desventajas: "Consumo alto y espacio limitado en cabina.",
      calificacion: 75,
    },
    auto: {
      uso: "Rápido y versátil para zonas urbanas.",
      desventajas: "Capacidad limitada de carga.",
      calificacion: 60,
    },
    camion: {
      uso: "Óptimo para grandes cantidades y recorridos largos.",
      desventajas: "Difícil de maniobrar en calles angostas.",
      calificacion: 85,
    },
    carreta: {
      uso: "Alternativa económica sin gasolina.",
      desventajas: "Lenta y depende de tracción física o animal.",
      calificacion: 40,
    },
  };

  return (
    <div className="min-h-screen flex p-5 gap-5 bg-base-200">
      {/* 🎥 Modelo + selección */}
      <div className="w-3/4 flex flex-col gap-4">
        <div className="h-[calc(100vh-38vh)] flex justify-center items-center bg-base-100 rounded-lg bg-base-200">
          {seleccionado ? (
            <Canvas camera={{ position: [10, 10, 0], fov: 20 }}>
              <ambientLight />
              <directionalLight position={[0, 3, 3]} intensity={6} />
              <Suspense fallback={null}>
                <Bounds fit clip observe margin={0.6}>
                  <Center>
                    <Model url={seleccionado.modelo_3d} />
                  </Center>
                </Bounds>
              </Suspense>
              <OrbitControls enablePan enableZoom enableRotate />
            </Canvas>
          ) : (
            <p className="text-center text-xl text-gray-400">Selecciona un vehículo</p>
          )}
        </div>

        {/* 🚗 Lista horizontal */}
        <div className="p-2 flex flex-row justify-between gap-3 h-[calc(100vh-82.5vh)] text-black">
          {vehiculos
            .filter((v) => v.tipo !== user.vehicle?.tipo)
            .map((vehiculo) => {
              const activo = seleccionado?.id === vehiculo.id;
              return (
                <div
                  key={vehiculo.id}
                  onClick={() => handleSeleccionar(vehiculo)}
                  className={`w-1/5 card text-black cursor-pointer flex flex-col justify-center items-center rounded-lg transition-all border shadow-sm p-2 ${
                    activo
                      ? "bg-primary border-primary"
                      : "bg-base-300 hover:bg-base-100 border-transparent"
                  }`}
                >
                  <h3 className="font-bold text-md text-center mb-1">
                    {vehiculo.tipo.charAt(0).toUpperCase() + vehiculo.tipo.slice(1).toLowerCase()}
                  </h3>
                </div>
              );
            })}
        </div>
      </div>

      {/* 📋 Panel derecho con estadísticas */}
      <div className="w-1/4 flex flex-col gap-4">
        <div className="bg-base-100 rounded-lg shadow p-4 h-[calc(100%-80px)] flex flex-col justify-between text-black">
          {seleccionado ? (
            <>
              <div>
                <h2 className="text-xl font-bold mb-3">{seleccionado.nombre}</h2>

                <p className="text-sm mb-1">Capacidad (kg): {seleccionado.capacidad}</p>
                <progress className="progress progress-info w-full" value={seleccionado.capacidad} max="5000" />

                <p className="text-sm mt-2 mb-1">Consumo (L/km): {seleccionado.consumo}</p>
                <progress className="progress progress-error w-full" value={seleccionado.consumo ?? 0} max="50" />

                <p className="text-sm mt-2 mb-1">Velocidad (km/h): {seleccionado.velocidad}</p>
                <progress className="progress progress-success w-full" value={seleccionado.velocidad} max="60" />

                <p className="text-sm mt-4 font-semibold">Uso recomendado:</p>
                <p className="text-sm">
                  {descripciones[seleccionado.tipo]?.uso || "Vehículo de uso general."}
                </p>

                <p className="text-sm mt-2 font-semibold">Desventajas:</p>
                <p className="text-sm">
                  {descripciones[seleccionado.tipo]?.desventajas || "Ninguna especificada."}
                </p>

                <p className="text-sm mt-2 font-semibold">Calificación final:</p>
                <progress
                  className="progress progress-warning w-full"
                  value={descripciones[seleccionado.tipo]?.calificacion || 50}
                  max="100"
                />
              </div>

              <button
                className={`btn btn-primary w-full mt-4 ${guardando ? "loading" : ""}`}
                onClick={guardarVehiculo}
                disabled={guardando}
              >
                Guardar vehículo
              </button>
            </>
          ) : (
            <p className="text-center text-sm text-gray-500">
              Selecciona un vehículo para ver más detalles
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 🧠 Modelo 3D individual
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={[0, 0, 0]} />;
}
