# Autobattler Prototype

A 2D top-down autobattler game prototype built with TypeScript, React, KaplayJS, and Miniplex ECS.

## Features

- **ECS Architecture**: Clean separation of data (components) and logic (systems) using Miniplex
- **Multiple Unit Types**: Assault, Sniper, Tank, and Scout with different stats and behaviors
- **Combat System**: Units auto-target enemies, move to engagement range, and shoot with accuracy/reload mechanics
- **Bullet Physics**: Bullets have travel time and collision detection
- **Debug Tools**: Built-in inspector to view entity data in real-time
- **Hot Reload**: Instant updates via Vite

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## How to Play

1. **Select a unit** from the Unit Menu (right side)
2. **Click on canvas** to spawn a player unit
3. **Hold SHIFT + Click** to spawn an enemy unit
4. **Watch the battle!** Units auto-target and engage enemies

## Controls

- **F1**: Toggle KaplayJS debug overlay
- **F8**: Pause/Resume game
- **F7**: Slow down game speed
- **F9**: Speed up game speed
- **Clear All Units**: Remove all units and reset battle

## Project Structure

```
/src
  /features
    /game
      /components     # ECS components (Position, Health, Combat, etc.)
      /systems        # ECS systems (Targeting, Movement, Combat, etc.)
      /entities       # Entity factories (createUnit, createBullet)
      /config         # Unit type definitions and constants
      GameCanvas.tsx  # Main game loop and KaplayJS integration
    /ui
      /components     # React UI components
  /lib
    /ecs.ts          # Miniplex world setup
    /kaplay.ts       # KaplayJS initialization
```

## Unit Types

### Assault
- **Health**: 100
- **Damage**: 15
- **Range**: 150
- **Reload**: 0.8s
- **Accuracy**: 85%
- **Speed**: 100
- **Priority**: Closest enemy

### Sniper
- **Health**: 60
- **Damage**: 40
- **Range**: 350
- **Reload**: 2.0s
- **Accuracy**: 95%
- **Speed**: 60
- **Priority**: Lowest health

### Tank
- **Health**: 200
- **Damage**: 10
- **Range**: 100
- **Reload**: 1.2s
- **Accuracy**: 75%
- **Speed**: 50
- **Priority**: Highest threat

### Scout
- **Health**: 50
- **Damage**: 8
- **Range**: 180
- **Reload**: 0.5s
- **Accuracy**: 80%
- **Speed**: 150
- **Priority**: Closest enemy

## Systems

### TargetingSystem
Finds targets based on unit priority (closest, lowest-health, highest-threat)

### MovementSystem
Moves units to engagement range (90% of attack range) and stops

### CombatSystem
Handles shooting with reload timer and accuracy checks

### BulletSystem
Updates bullet positions and handles collision with units

### DeathSystem
Removes dead units and checks win conditions (last team standing)

## Tweaking & Debugging

- **Modify unit stats**: Edit `src/features/game/config/unitTypes.ts`
- **Inspect entities**: Use the Debug Inspector panel (bottom-left)
- **Pause and step through**: Press F8 to pause, observe state
- **View collision boxes**: Press F1 for debug overlay

## Tech Stack

- **Vite**: Build tool with hot reload
- **React**: UI layer
- **TypeScript**: Type safety
- **KaplayJS**: Game engine (rendering, collision, input)
- **Miniplex**: ECS library
- **Robot3**: State machines (not yet fully integrated)

## Future Enhancements

- Unit placement grid
- Drag-and-drop from menu
- More unit types and abilities
- Team compositions and synergies
- Wave-based progression
- Animations and effects
- Pathfinding for obstacle avoidance
- Better targeting visualization
