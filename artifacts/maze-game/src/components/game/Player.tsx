import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { MAZE_GRID, CELL_SIZE, INITIAL_PLAYER_POS } from '@/lib/constants';

const SPEED = 4;
const PLAYER_RADIUS = 0.4;

export function Player() {
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();
  const torchLight = useRef<THREE.PointLight>(null);

  useEffect(() => {
    camera.position.set(INITIAL_PLAYER_POS[0], 1, INITIAL_PLAYER_POS[2]);
    // Face +Z direction (down the open corridor away from the starting wall)
    camera.rotation.order = 'YXZ';
    camera.rotation.y = Math.PI;
    camera.rotation.x = 0;
  }, [camera]);

  const checkCollision = (newPos: THREE.Vector3) => {
    const pMinX = newPos.x - PLAYER_RADIUS;
    const pMaxX = newPos.x + PLAYER_RADIUS;
    const pMinZ = newPos.z - PLAYER_RADIUS;
    const pMaxZ = newPos.z + PLAYER_RADIUS;

    const col = Math.floor(newPos.x / CELL_SIZE);
    const row = Math.floor(newPos.z / CELL_SIZE);

    for (let r = Math.max(0, row - 1); r <= Math.min(MAZE_GRID.length - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(MAZE_GRID[0].length - 1, col + 1); c++) {
        if (MAZE_GRID[r][c] === 1) {
          const wMinX = c * CELL_SIZE - CELL_SIZE / 2;
          const wMaxX = c * CELL_SIZE + CELL_SIZE / 2;
          const wMinZ = r * CELL_SIZE - CELL_SIZE / 2;
          const wMaxZ = r * CELL_SIZE + CELL_SIZE / 2;

          if (pMinX < wMaxX && pMaxX > wMinX && pMinZ < wMaxZ && pMaxZ > wMinZ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  useFrame((state, delta) => {
    const keys = getKeys();
    const moveZ = Number(keys.forward) - Number(keys.back);
    const moveX = Number(keys.right) - Number(keys.left);

    if (moveX !== 0 || moveZ !== 0) {
      const direction = new THREE.Vector3(moveX, 0, -moveZ).normalize();
      direction.applyQuaternion(camera.quaternion);
      direction.y = 0;
      direction.normalize();

      const newPos = camera.position.clone().add(direction.multiplyScalar(SPEED * delta));

      const nextX = camera.position.clone();
      nextX.x = newPos.x;
      const nextZ = camera.position.clone();
      nextZ.z = newPos.z;

      if (!checkCollision(nextX)) {
        camera.position.x = nextX.x;
      }
      if (!checkCollision(nextZ)) {
        camera.position.z = nextZ.z;
      }
    }

    if (torchLight.current) {
      torchLight.current.position.copy(camera.position);
      torchLight.current.position.y -= 0.2;
    }
  });

  return (
    <>
      <PointerLockControls />
      <pointLight ref={torchLight} color="#ffaa00" intensity={0.8} distance={6} />
    </>
  );
}
