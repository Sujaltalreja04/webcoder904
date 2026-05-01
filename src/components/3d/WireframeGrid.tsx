import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const WireframeGrid = () => {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 10 - 5;
    }
  });

  return (
    <group ref={gridRef} position={[0, -5, -10]}>
      <gridHelper args={[50, 50, 0x404040, 0x2a2a2a]} rotation={[0, 0, 0]} />
      <gridHelper
        args={[50, 50, 0x404040, 0x2a2a2a]}
        rotation={[0, 0, 0]}
        position={[0, 0, -10]}
      />
      <gridHelper
        args={[50, 50, 0x404040, 0x2a2a2a]}
        rotation={[0, 0, 0]}
        position={[0, 0, -20]}
      />
    </group>
  );
};
