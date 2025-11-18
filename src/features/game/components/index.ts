import type { GameObj } from 'kaplay'

export interface Position {
  x: number
  y: number
}

export interface Velocity {
  vx: number
  vy: number
}

export interface Health {
  current: number
  max: number
}

export interface Combat {
  damage: number
  range: number
  reloadTime: number
  accuracy: number
  lastShotTime: number
}

export interface Target {
  entityId: number | null
}

export interface UnitType {
  type: string
  targetPriority: 'closest' | 'lowest-health' | 'highest-threat'
}

export interface Team {
  id: 'player' | 'enemy'
}

export interface Sprite {
  gameObj: GameObj | null
}

export interface Bullet {
  ownerId: number
  damage: number
  speed: number
}

export interface Dead {
  markedForDeath: boolean
}

export interface Movement {
  speed: number
  targetX: number | null
  targetY: number | null
  engagementRange: number
}

export interface InitialState {
  x: number
  y: number
  health: number
}

export type Entity = {
  id: number
  position?: Position
  velocity?: Velocity
  health?: Health
  combat?: Combat
  target?: Target
  unitType?: UnitType
  team?: Team
  sprite?: Sprite
  bullet?: Bullet
  dead?: Dead
  movement?: Movement
  initialState?: InitialState
}
