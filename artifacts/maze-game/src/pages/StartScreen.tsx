import React from 'react';
import { useGame } from '@/lib/GameContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function StartScreen() {
  const { startGame } = useGame();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <div className="text-center max-w-md p-8 rounded-xl border border-primary/30 bg-card/80 shadow-2xl">
        <h1 className="text-5xl font-mono font-bold text-primary mb-4 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,255,204,0.5)]">Labyrinth Run</h1>
        
        <div className="space-y-4 mb-8 text-left text-muted-foreground">
          <p>You are trapped. Find the gems before the guardians find you.</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-foreground">WASD</strong> to move, <strong className="text-foreground">Mouse</strong> to look</li>
            <li>Collect all <strong className="text-accent">12 glowing gems</strong></li>
            <li>Avoid the <strong className="text-destructive">patrolling red orbs</strong></li>
          </ul>
        </div>

        <Button 
          onClick={startGame}
          size="lg"
          className="w-full text-xl font-bold uppercase tracking-wider py-8 shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:shadow-[0_0_30px_rgba(0,255,204,0.5)] transition-all"
        >
          Enter the Maze
        </Button>
      </div>
    </motion.div>
  );
}
