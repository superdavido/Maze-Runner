import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { KeyboardControls, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

import { useGame } from '@/lib/GameContext';
import { INITIAL_GEMS, ENEMY_PATHS, CELL_SIZE } from '@/lib/constants';
import { Maze } from '@/components/game/Maze';
import { Player } from '@/components/game/Player';
import { Gem } from '@/components/game/Gem';
import { Enemy } from '@/components/game/Enemy';
import { HUD } from '@/components/game/HUD';

const KEY_BINDINGS = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'back', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
];

function GameLogic() {
  const { state, collectGem, loseLife, updateTime, endGame } = useGame();
  const [activeGems, setActiveGems] = useState(INITIAL_GEMS.map((pos, i) => ({ id: i, pos })));
  
  const lastHitTime = useRef(0);

  useFrame((sceneState) => {
    if (state.status !== 'playing') return;

    const time = sceneState.clock.elapsedTime;
    updateTime(Math.floor(time));

    const playerPos = sceneState.camera.position;

    // Check Gem Collisions
    for (const gem of activeGems) {
      const gPos = new THREE.Vector3(...gem.pos);
      gPos.y = 1; 
      
      if (playerPos.distanceTo(gPos) < 1.5) {
        collectGem();
        setActiveGems(prev => prev.filter(g => g.id !== gem.id));
        
        if (activeGems.length - 1 === 0) {
          endGame(true, Math.floor(time));
          document.exitPointerLock();
        }
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#4a4a6a" />
      <directionalLight position={[10, 20, 10]} intensity={0.3} color="#ffeebb" />
      
      <Maze />
      <Player />
      
      {activeGems.map(gem => (
        <Gem key={gem.id} position={gem.pos as [number, number, number]} />
      ))}

      {ENEMY_PATHS.map((path, i) => (
        <EnemyWithCollision 
          key={i} 
          start={path.start as [number, number, number]} 
          end={path.end as [number, number, number]} 
          onHit={() => {
            const now = Date.now();
            if (now - lastHitTime.current > 2000) {
              lastHitTime.current = now;
              loseLife();
              if (state.lives <= 1) {
                endGame(false, state.timeSurvived);
                document.exitPointerLock();
              }
            }
          }}
        />
      ))}
    </>
  );
}

function EnemyWithCollision({ start, end, onHit }: { start: [number, number, number], end: [number, number, number], onHit: () => void }) {
  return (
    <Enemy start={start} end={end} onHit={onHit} />
  );
}

export function GameScreen() {
  const { state } = useGame();

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden" id="game-container">
      {state.status === 'playing' && <HUD />}
      
      <KeyboardControls map={KEY_BINDINGS}>
        <Canvas shadows>
          <GameLogic />
        </Canvas>
      </KeyboardControls>

      {state.status === 'playing' && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="bg-background/80 px-4 py-2 rounded pointer-events-auto cursor-pointer" onClick={() => {
            document.body.requestPointerLock();
          }}>
            Click to resume
          </div>
        </div>
      )}
    </div>
  );
}
