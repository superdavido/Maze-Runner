import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type GameStatus = 'start' | 'playing' | 'game_over' | 'win';

export interface GameState {
  status: GameStatus;
  score: number;
  timeSurvived: number;
  gemsCollected: number;
  lives: number;
}

interface GameContextType {
  state: GameState;
  startGame: () => void;
  endGame: (win: boolean, time: number) => void;
  collectGem: () => void;
  loseLife: () => void;
  resetGame: () => void;
  updateTime: (time: number) => void;
}

const initialState: GameState = {
  status: 'start',
  score: 0,
  timeSurvived: 0,
  gemsCollected: 0,
  lives: 3,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const startGame = useCallback(() => {
    setState({ ...initialState, status: 'playing' });
  }, []);

  const endGame = useCallback((win: boolean, time: number) => {
    setState(s => {
      let finalScore = s.score;
      if (win) {
        const timeBonus = Math.max(0, 2000 - time * 10);
        finalScore += timeBonus;
      }
      return {
        ...s,
        status: win ? 'win' : 'game_over',
        timeSurvived: time,
        score: finalScore
      };
    });
  }, []);

  const collectGem = useCallback(() => {
    setState(s => ({
      ...s,
      score: s.score + 100,
      gemsCollected: s.gemsCollected + 1
    }));
  }, []);

  const loseLife = useCallback(() => {
    setState(s => ({
      ...s,
      lives: Math.max(0, s.lives - 1)
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const updateTime = useCallback((time: number) => {
    setState(s => ({ ...s, timeSurvived: time }));
  }, []);

  return (
    <GameContext.Provider value={{ state, startGame, endGame, collectGem, loseLife, resetGame, updateTime }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
