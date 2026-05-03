import React from 'react';
import { useGame } from '@/lib/GameContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';

export function GameOverScreen() {
  const { state, resetGame } = useGame();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-destructive/20 backdrop-blur-sm"
    >
      <div className="text-center max-w-md p-8 rounded-xl border border-destructive/50 bg-background shadow-2xl">
        <h1 className="text-5xl font-mono font-bold text-destructive mb-2 uppercase tracking-widest">You Died</h1>
        <p className="text-muted-foreground mb-8">The guardians caught you.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8 text-left">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground uppercase">Score</div>
            <div className="text-2xl font-bold text-primary font-mono">{state.score}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground uppercase">Time</div>
            <div className="text-2xl font-bold text-primary font-mono">{formatTime(state.timeSurvived)}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border col-span-2">
            <div className="text-xs text-muted-foreground uppercase">Gems Collected</div>
            <div className="text-2xl font-bold text-accent font-mono">{state.gemsCollected} / 12</div>
          </div>
        </div>

        <Button 
          onClick={resetGame}
          variant="destructive"
          size="lg"
          className="w-full text-xl font-bold uppercase tracking-wider py-8 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all"
        >
          Try Again
        </Button>
      </div>
    </motion.div>
  );
}
