import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

// Componente para actualizar la cámara
const CameraUpdater = ({ cameraPosition }) => {
  const { camera } = useThree(); // Accede a la cámara

  useEffect(() => {
    // Actualiza la posición de la cámara
    camera.position.set(...cameraPosition);
    camera.updateProjectionMatrix(); // Asegúrate de que la cámara se actualice
  }, [cameraPosition, camera]);

  return null; // No renderiza nada
};

const ThreeDScene = () => {
  const { scene } = useGLTF("/public/modelos/truck.glb"); // Ruta del modelo GLB

  // Estados internos para la cámara y el modelo
  const [cameraPosition, setCameraPosition] = useState([7, 5, 7]);
  const [modelPosition, setModelPosition] = useState([0, -3, -5]);

  // Manejo del scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollMax > 0 ? scrollPosition / scrollMax : 0;
      

      // Mantener una distancia adecuada entre la cámara y el modelo
      const newCameraPosition = [
        7 - (7  * scrollPercentage), 
        5 + (15 * scrollPercentage), 
        7 + (7 * scrollPercentage) ,
      ];

      const newModelPosition = [
        0 + (0 * scrollPercentage), 
        -3 - (5 * scrollPercentage), 
        -5 + (6 * scrollPercentage)
      ];

      setCameraPosition(newCameraPosition);
      setModelPosition(newModelPosition);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Canvas
      camera={{
        position: cameraPosition, // Posición inicial de la cámara
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 0]} castShadow intensity={6} />

      {/* Modelo 3D con posición dinámica */}
      <primitive object={scene} scale={3} position={modelPosition} castShadow />

      {/* Actualizador de la cámara */}
      <CameraUpdater cameraPosition={cameraPosition} />

      {/* OrbitControls deshabilitado */}
      <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
    </Canvas>
  );
};

export default ThreeDScene;