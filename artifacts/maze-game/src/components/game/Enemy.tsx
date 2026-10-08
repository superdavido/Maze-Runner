import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnemyProps {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
  onHit?: () => void;
}

export function Enemy({ start, end, speed = 2, onHit }: EnemyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const direction = useRef(1);

  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);
  const distance = startVec.distanceTo(endVec);

  useFrame((state, delta) => {
    if (meshRef.current) {
      let p = progress.current + (speed * delta * direction.current) / distance;
      if (p > 1) {
        p = 1;
        direction.current = -1;
      } else if (p < 0) {
        p = 0;
        direction.current = 1;
      }
      progress.current = p;

      const currentPos = new THREE.Vector3().lerpVectors(startVec, endVec, p);
      meshRef.current.position.copy(currentPos);
      meshRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      
      meshRef.current.rotation.y += delta * 2;

      if (onHit) {
        const playerPos = state.camera.position;
        const dist = Math.hypot(playerPos.x - currentPos.x, playerPos.z - currentPos.z);
        if (dist < 1.2) {
          onHit();
        }
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={start as any}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
        <pointLight color="#ff0000" intensity={0.5} distance={4} />
      </mesh>
    </group>
  );
}
