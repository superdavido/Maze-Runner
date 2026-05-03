import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GemProps {
  position: [number, number, number];
}

export function Gem({ position }: GemProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.position.y = position[1] + 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position as any}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
      </mesh>
      <pointLight color="#ffaa00" intensity={0.5} distance={3} position={[0, 1, 0]} />
    </group>
  );
}
