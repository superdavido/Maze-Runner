import React, { useMemo } from 'react';
import * as THREE from 'three';
import { MAZE_GRID, CELL_SIZE, WALL_HEIGHT } from '@/lib/constants';

export function Maze() {
  const wallGeometries = useMemo(() => {
    const geometries: THREE.BoxGeometry[] = [];
    const material = new THREE.MeshStandardMaterial({
      color: '#596781',
      emissive: '#19233a',
      emissiveIntensity: 0.45,
      roughness: 0.85,
      metalness: 0.05,
    });

    for (let row = 0; row < MAZE_GRID.length; row++) {
      for (let col = 0; col < MAZE_GRID[row].length; col++) {
        if (MAZE_GRID[row][col] === 1) {
          const x = col * CELL_SIZE;
          const z = row * CELL_SIZE;
          const y = WALL_HEIGHT / 2;
          const geom = new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT, CELL_SIZE);
          geom.translate(x, y, z);
          geometries.push(geom);
        }
      }
    }
    return { geometries, material };
  }, []);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[MAZE_GRID[0].length * CELL_SIZE / 2 - CELL_SIZE/2, 0, MAZE_GRID.length * CELL_SIZE / 2 - CELL_SIZE/2]}>
        <planeGeometry args={[MAZE_GRID[0].length * CELL_SIZE, MAZE_GRID.length * CELL_SIZE]} />
        <meshStandardMaterial
          color="#2a3449"
          emissive="#11192b"
          emissiveIntensity={0.55}
          roughness={0.9}
        />
      </mesh>

      {/* Walls */}
      {wallGeometries.geometries.map((geom, i) => (
        <mesh key={i} geometry={geom} material={wallGeometries.material} />
      ))}
    </group>
  );
}
