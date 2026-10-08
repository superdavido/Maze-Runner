import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

import { useGame } from '@/lib/GameContext';
import { INITIAL_GEMS, ENEMY_PATHS } from '@/lib/constants';
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
  const lastShownSecond = useRef(-1);
  const activeGemsRef = useRef(activeGems);
  activeGemsRef.current = activeGems;

  useFrame((sceneState) => {
    if (state.status !== 'playing') return;

    const time = sceneState.clock.elapsedTime;
    const elapsedSecond = Math.floor(time);
    if (elapsedSecond !== lastShownSecond.current) {
      lastShownSecond.current = elapsedSecond;
      updateTime(elapsedSecond);
    }

    const playerPos = sceneState.camera.position;

    for (const gem of activeGemsRef.current) {
      const gPos = new THREE.Vector3(gem.pos[0], 1, gem.pos[2]);
      if (playerPos.distanceTo(gPos) < 1.5) {
        const remaining = activeGemsRef.current.filter(g => g.id !== gem.id);
        setActiveGems(remaining);
        activeGemsRef.current = remaining;
        collectGem();

        if (remaining.length === 0) {
          endGame(true, Math.floor(time));
          document.exitPointerLock();
        }
        break;
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#090d18']} />
      <hemisphereLight args={['#c9dcff', '#252b40', 0.85]} />
      <ambientLight intensity={0.5} color="#aab9df" />
      <directionalLight position={[10, 20, 10]} intensity={0.75} color="#ffeebb" />

      <Maze />
      <Player />

      {activeGems.map(gem => (
        <Gem key={gem.id} position={gem.pos as [number, number, number]} />
      ))}

      {ENEMY_PATHS.map((path, i) => (
        <Enemy
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

export function GameScreen() {
  const { state } = useGame();
  const [isLocked, setIsLocked] = useState(false);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onLockChange = () => setIsLocked(!!document.pointerLockElement);
    document.addEventListener('pointerlockchange', onLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', onLockChange);
    };
  }, []);

  const handleCanvasClick = () => {
    const canvas = canvasWrapperRef.current?.querySelector('canvas');
    if (canvas && !document.pointerLockElement && canvas.requestPointerLock) {
      try {
        const lockRequest = canvas.requestPointerLock();
        if (lockRequest instanceof Promise) {
          void lockRequest.catch(() => setIsLocked(false));
        }
      } catch {
        setIsLocked(false);
      }
    }
  };

  return (
      <div
      ref={canvasWrapperRef}
        className="relative w-full h-screen bg-[#090d18] overflow-hidden"
      id="game-container"
      onClick={handleCanvasClick}
    >
      {state.status === 'playing' && <HUD />}

      <KeyboardControls map={KEY_BINDINGS}>
        <Canvas camera={{ fov: 75, near: 0.1, far: 100 }} dpr={[1, 1.5]}>
          <GameLogic />
        </Canvas>
      </KeyboardControls>

      {/* Crosshair — always visible during play */}
      {state.status === 'playing' && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative w-5 h-5">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/70 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-white/70 -translate-x-1/2" />
          </div>
        </div>
      )}

      {/* Click-to-lock hint — only shown when pointer is not locked */}
      {state.status === 'playing' && !isLocked && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center pb-8">
          <div className="bg-black/60 border border-white/20 text-white/80 text-sm font-mono px-4 py-2 rounded-lg">
            Click or drag to look around
          </div>
        </div>
      )}
    </div>
  );
}
