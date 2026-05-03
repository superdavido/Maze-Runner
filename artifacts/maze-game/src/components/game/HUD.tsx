import React from 'react';
import { useGame } from '@/lib/GameContext';
import { Heart } from 'lucide-react';
import { formatTime } from '@/lib/utils';

export function HUD() {
  const { state } = useGame();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
      <div className="flex justify-between font-mono text-xl text-primary font-bold">
        <div className="bg-background/80 px-4 py-2 rounded-md border border-primary/30 backdrop-blur">
          SCORE: {state.score.toString().padStart(6, '0')}
        </div>
        
        <div className="bg-background/80 px-4 py-2 rounded-md border border-primary/30 backdrop-blur text-center text-2xl font-bold">
          {formatTime(state.timeSurvived)}
        </div>

        <div className="bg-background/80 px-4 py-2 rounded-md border border-primary/30 backdrop-blur text-accent">
          GEMS: {state.gemsCollected}/12
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-primary/80 rounded-full" />
        <div className="absolute w-6 h-0.5 bg-primary/30 rounded-full" />
        <div className="absolute w-0.5 h-6 bg-primary/30 rounded-full" />
      </div>

      <div className="flex justify-center">
        <div className="flex gap-2 bg-background/80 px-6 py-3 rounded-full border border-destructive/30 backdrop-blur">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              className={`w-8 h-8 ${i < state.lives ? 'fill-destructive text-destructive' : 'text-muted-foreground/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
