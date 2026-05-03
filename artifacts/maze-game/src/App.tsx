import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider, useGame } from "@/lib/GameContext";
import { StartScreen } from "@/pages/StartScreen";
import { GameScreen } from "@/pages/GameScreen";
import { GameOverScreen } from "@/pages/GameOverScreen";
import { WinScreen } from "@/pages/WinScreen";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

function GameRouter() {
  const { state } = useGame();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-foreground">
      <AnimatePresence mode="wait">
        {state.status === 'start' && <StartScreen key="start" />}
        {state.status === 'game_over' && <GameOverScreen key="game_over" />}
        {state.status === 'win' && <WinScreen key="win" />}
      </AnimatePresence>
      
      {/* Keep GameScreen mounted but maybe hidden or frozen, or re-mount on play */}
      {(state.status === 'playing' || state.status === 'game_over' || state.status === 'win') && (
        <GameScreen />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <GameRouter />
        </GameProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
