# Autobattler Prototype - Technical Specification

## Overview

This is a 2D autobattler game built with:
- **KAPLAY.js** - Game engine for rendering, collision detection, and input handling
- **Miniplex** - Entity Component System (ECS) for game state management
- **React** - UI layer and game canvas container

Units automatically fight each other during battle phase. Players place units during placement phase, then watch them battle autonomously.

## Architecture

### Hybrid ECS + Game Object Pattern

The game uses a hybrid approach:

1. **Miniplex ECS** (`src/lib/ecs.ts`) - Stores entity data and enables querying
2. **KAPLAY Game Objects** - Handle rendering, collision, and visual representation

Each entity has a `sprite.gameObj` reference linking the ECS entity to its KAPLAY visual representation.

```
┌─────────────────┐     ┌──────────────────┐
│  Miniplex ECS   │────▶│  KAPLAY GameObj  │
│  (Data/Logic)   │     │  (Rendering)     │
└─────────────────┘     └──────────────────┘
```

### Core Files

```
src/
├── lib/
│   ├── ecs.ts              # ECS world and entity queries
│   └── kaplay.ts           # KAPLAY initialization
├── features/game/
│   ├── GameCanvas.tsx      # Main game loop and KAPLAY setup
│   ├── components/
│   │   └── index.ts        # Entity component type definitions
│   ├── entities/
│   │   └── index.ts        # Entity creation (units, bullets)
│   ├── systems/
│   │   ├── TargetingSystem.ts
│   │   ├── MovementSystem.ts
│   │   ├── CombatSystem.ts
│   │   ├── BulletSystem.ts
│   │   ├── DeathSystem.ts
│   │   ├── VisualSystem.ts
│   │   └── ResetSystem.ts
│   ├── config/
│   │   └── unitTypes.ts    # Unit stats and constants
│   └── state/
│       └── GamePhaseState.ts
```

## Game Phases

The game operates in three phases:

1. **Placement** - Player places units on the battlefield
2. **Battle** - Units automatically fight (all systems active)
3. **Result** - Battle ended, showing outcome

Phase transitions are managed by React state and passed to `GameCanvas`.

## ECS Queries

Defined in `src/lib/ecs.ts`:

```typescript
entities = {
  all: world,
  units: world.with('position', 'health', 'combat', 'team', 'unitType'),
  bullets: world.with('bullet', 'sprite'),
  alive: world.with('health').without('dead'),
  dead: world.with('dead'),
  withTarget: world.with('target'),
  moving: world.with('movement', 'position'),
}
```

**Important**: Entity queries only match entities with ALL specified components. This is why bullets must have `bullet` and `sprite` components.

## Components

All components defined in `src/features/game/components/index.ts`:

| Component | Purpose |
|-----------|---------|
| `position` | X/Y coordinates (ECS-side, synced with gameObj) |
| `velocity` | Movement vector |
| `health` | Current/max HP |
| `combat` | Damage, range, reload time, accuracy |
| `target` | Currently targeted entity ID |
| `unitType` | Unit class and targeting priority |
| `team` | 'player' or 'enemy' |
| `sprite` | Reference to KAPLAY game object |
| `bullet` | Bullet owner, damage, speed |
| `dead` | Marks entity for death processing |
| `movement` | Speed, engagement range |
| `initialState` | Starting position/health for round reset |

## Systems

Systems run every frame during battle phase in this order:

### 1. TargetingSystem
- Finds valid enemy targets for each unit
- Respects `targetPriority`: closest, lowest-health, highest-threat
- Skips dead units (`unit.dead` check)

### 2. MovementSystem
- Moves units toward their targets
- Stops when within `engagementRange`
- Uses KAPLAY's `gameObj.move()` method
- Skips dead units

### 3. CombatSystem
- Checks if target is in range
- Respects reload time between shots
- Applies accuracy roll (random hit chance)
- Creates bullet on successful shot
- Skips dead units

### 4. BulletSystem
- Moves bullets using stored direction and speed
- Removes bullets that go out of bounds
- Collision damage handled by KAPLAY's `onCollide()`

### 5. DeathSystem
- Finds units with `health.current <= 0` or `dead` component
- Hides dead units (doesn't remove - needed for round reset)
- Returns game result: 'ongoing', 'player-win', 'enemy-win', 'draw'

### 6. VisualSystem
- Updates health bar widths based on current health
- Runs every frame (not just battle phase)

### 7. ResetSystem
- Called between rounds
- Restores all units to initial position/health
- Unhides dead units
- Clears bullets

## Entity Creation

### Units (`createUnit`)

Created with full component set:
- Position, velocity, health, combat, target
- unitType, team, sprite, movement, initialState

Visual elements (KAPLAY):
- Rectangle body with team-colored outline
- Health bar (background + foreground)
- Unit type letter indicator

### Bullets (`createBullet`)

Created with minimal components:
- `bullet` (owner, damage, speed)
- `sprite` (gameObj reference)

Movement data stored on gameObj:
- `gameObj.direction` - Unit vector toward target
- `gameObj.speed` - Pixels per second

Collision handler attached via `gameObj.onCollide('unit', ...)`:
- Verifies target is enemy team
- Applies damage
- Marks target as dead if HP <= 0
- Removes bullet

## Unit Types

Defined in `src/features/game/config/unitTypes.ts`:

| Type | Letter | Health | Damage | Range | Reload | Accuracy | Speed | Priority | Cost |
|------|--------|--------|--------|-------|--------|----------|-------|----------|------|
| Assault | A | 100 | 15 | 150 | 0.4s | 85% | 100 | closest | 100 |
| Sniper | S | 60 | 40 | 350 | 2.0s | 95% | 60 | lowest-health | 150 |
| Tank | T | 250 | 10 | 100 | 1.2s | 75% | 50 | highest-threat | 120 |
| Scout | R | 50 | 8 | 180 | 0.5s | 80% | 150 | closest | 80 |
| Melee | M | 30 | 35 | 30 | 0.6s | 95% | 120 | closest | 110 |
| Heavy Tank | H | 400 | 15 | 120 | 1.5s | 70% | 35 | highest-threat | 200 |

### Unit Roles

- **Assault** - Balanced all-rounder, fast reload
- **Sniper** - Long range, high damage, slow but deadly
- **Tank** - High HP frontline, draws fire
- **Scout** - Fast and cheap, good for harassment
- **Melee** - Must get close, but devastating damage when in range
- **Heavy Tank** - Extreme durability, slowest unit, expensive

Constants:
- `UNIT_SIZE = 20` (pixels)
- `BULLET_SIZE = 4` (radius)
- `BULLET_SPEED = 300` (pixels/second)

## Important Patterns & Gotchas

### 1. ECS Query Matching

Miniplex queries require ALL specified components. If you create an entity missing a component, it won't appear in the query.

**Example**: Bullets query is `world.with('bullet', 'sprite')`. If you create a bullet without `sprite`, it won't be found.

### 2. Dynamic Component Addition

Don't rely on miniplex queries to auto-update when adding components dynamically. Instead, check properties directly:

```typescript
// BAD - query may not update
const dead = entities.dead.entities

// GOOD - direct property check
const dead = entities.units.entities.filter(u => u.dead || u.health.current <= 0)
```

### 3. Dead Unit Handling

Dead units are HIDDEN, not removed. This preserves them for round reset.

```typescript
// DeathSystem hides
gameObj.hidden = true

// ResetSystem shows
gameObj.hidden = false
```

### 4. Skip Dead Units in Systems

All systems must check `unit.dead` before processing:

```typescript
if (!unit.sprite?.gameObj || unit.dead) continue
```

### 5. KAPLAY GameObj Movement

Movement uses KAPLAY's built-in method with direction vectors:

```typescript
const direction = targetPos.sub(gameObj.pos).unit()
gameObj.move(direction.scale(speed))
```

### 6. Bullet Collision via KAPLAY

Bullets use KAPLAY's collision system, not ECS-side detection:

```typescript
gameObj.onCollide('unit', (unit) => {
  // Handle damage
})
```

This requires bullets to have `k.area()` component.

## Game Loop

Located in `GameCanvas.tsx`:

```typescript
k.onUpdate(() => {
  updateVisuals()                    // Always run

  if (gamePhase !== 'battle') return // Skip if not battling
  if (gameResult !== 'ongoing') return

  updateTargeting()
  updateMovement(dt)
  updateCombat(time)
  updateBullets(dt)

  const result = updateDeath()
  if (result !== 'ongoing') {
    onGameResult(result)
  }
})
```

## Adding New Features

### New Unit Type

1. Add config to `UNIT_TYPES` in `unitTypes.ts`
2. Add letter mapping in `createUnit` switch statement

### New Component

1. Define interface in `components/index.ts`
2. Add to `Entity` type
3. Add query in `ecs.ts` if needed
4. Initialize in entity creation

### New System

1. Create file in `systems/`
2. Export update function
3. Add to game loop in `GameCanvas.tsx`
4. Remember to skip dead units

## Debugging

- Press F1 in-game for debug info
- Entity inspector shows all entities with components
- Console logs entity creation and positions
