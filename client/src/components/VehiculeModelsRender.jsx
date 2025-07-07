import { useGLTF, Center, Bounds } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export function VehicleModel({ url }) {
  return (
    <Canvas camera={{ position: [0, 3, 0], fov: 20 }}>
      <ambientLight />
      <directionalLight position={[0, 0, 0]} intensity={0.8} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1}>
          <Center top>
            <Model url={url} />
          </Center>
        </Bounds>
      </Suspense>
    </Canvas>
  );
}

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
