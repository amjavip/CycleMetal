import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import truckModel from '../assets/Truck.glb'; // ← IMPORTANTE

const CameraUpdater = ({ cameraPosition }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...cameraPosition);
    camera.updateProjectionMatrix();
  }, [cameraPosition, camera]);

  return null;
};

const ThreeDScene = () => {

  const { scene } = useGLTF(truckModel); // ← usar import

  const [cameraPosition, setCameraPosition] = useState([7, 5, 7]);
  const [modelPosition, setModelPosition] = useState([0, -3, -5]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollMax > 0 ? scrollPosition / scrollMax : 0;

      setCameraPosition([
        7 - (7 * scrollPercentage),
        5 + (15 * scrollPercentage),
        7 + (7 * scrollPercentage),
      ]);

      setModelPosition([
        0,
        -3 - (5 * scrollPercentage),
        -5 + (6 * scrollPercentage)
      ]);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Canvas camera={{ position: cameraPosition, fov: 50, near: 0.1, far: 1000 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 0]} intensity={6} />

      <primitive object={scene} scale={3} position={modelPosition} />

      <CameraUpdater cameraPosition={cameraPosition} />

      <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
    </Canvas>
  );
};

export default ThreeDScene;