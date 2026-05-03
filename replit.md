# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### 3D Maze Game (`artifacts/maze-game`) — preview path: `/`
First-person 3D maze game built with React Three Fiber and @react-three/drei.
- **Stack**: React + Vite + Three.js + @react-three/fiber + @react-three/drei + framer-motion
- **Features**: First-person camera (PointerLockControls), WASD movement, AABB wall collision, 12 collectible gems, 3 patrolling enemy orbs, 3 lives, score system with time bonus, win/lose screens
- **Screens**: StartScreen, GameScreen (with HUD), GameOverScreen, WinScreen
- **Game state**: All local via GameContext (no backend)
- **Key files**:
  - `src/App.tsx` — root with GameContext provider and screen routing
  - `src/pages/GameScreen.tsx` — 3D Canvas + HUD overlay
  - `src/components/game/Player.tsx` — first-person controller
  - `src/components/game/Maze.tsx` — wall/floor rendering from 15x15 grid
  - `src/components/game/Gem.tsx` — collectible gem with point light
  - `src/components/game/Enemy.tsx` — patrolling enemy orb

### API Server (`artifacts/api-server`) — preview path: `/api`
Express 5 backend server (currently only health check endpoint).

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
