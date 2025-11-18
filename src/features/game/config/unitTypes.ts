export interface UnitTypeConfig {
  type: string
  name: string
  color: string
  health: number
  damage: number
  range: number
  reloadTime: number
  accuracy: number
  moveSpeed: number
  targetPriority: 'closest' | 'lowest-health' | 'highest-threat'
  cost: number
}

export const UNIT_TYPES: Record<string, UnitTypeConfig> = {
  assault: {
    type: 'assault',
    name: 'Assault',
    color: '#ff6b6b',
    health: 100,
    damage: 15,
    range: 150,
    reloadTime: 0.8,
    accuracy: 0.85,
    moveSpeed: 100,
    targetPriority: 'closest',
    cost: 100,
  },
  sniper: {
    type: 'sniper',
    name: 'Sniper',
    color: '#4ecdc4',
    health: 60,
    damage: 40,
    range: 350,
    reloadTime: 2.0,
    accuracy: 0.95,
    moveSpeed: 60,
    targetPriority: 'lowest-health',
    cost: 150,
  },
  tank: {
    type: 'tank',
    name: 'Tank',
    color: '#45b7d1',
    health: 200,
    damage: 10,
    range: 100,
    reloadTime: 1.2,
    accuracy: 0.75,
    moveSpeed: 50,
    targetPriority: 'highest-threat',
    cost: 120,
  },
  scout: {
    type: 'scout',
    name: 'Scout',
    color: '#f9ca24',
    health: 50,
    damage: 8,
    range: 180,
    reloadTime: 0.5,
    accuracy: 0.80,
    moveSpeed: 150,
    targetPriority: 'closest',
    cost: 80,
  },
}

export const UNIT_SIZE = 20
export const BULLET_SIZE = 4
export const BULLET_SPEED = 300
