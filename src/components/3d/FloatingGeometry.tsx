import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingGeometryProps {
  geometry: 'box' | 'sphere' | 'torus' | 'octahedron';
  position: [number, number, number];
  scale?: number;
  speed?: number;
}

export const FloatingGeometry = ({
  geometry,
  position,
  scale = 1,
  speed = 1,
}: FloatingGeometryProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.007 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  const renderGeometry = () => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 32]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.6]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {renderGeometry()}
      <meshStandardMaterial
        color="#808080"
        wireframe
        transparent
        opacity={0.3}
        emissive="#404040"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};
