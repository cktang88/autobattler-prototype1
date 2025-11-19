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
    reloadTime: 0.4,
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
    health: 250,
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
  melee: {
    type: 'melee',
    name: 'Melee',
    color: '#e056fd',
    health: 30,
    damage: 35,
    range: 30,
    reloadTime: 0.6,
    accuracy: 0.95,
    moveSpeed: 120,
    targetPriority: 'closest',
    cost: 110,
  },
  heavyTank: {
    type: 'heavyTank',
    name: 'Heavy Tank',
    color: '#686de0',
    health: 400,
    damage: 15,
    range: 120,
    reloadTime: 1.5,
    accuracy: 0.70,
    moveSpeed: 35,
    targetPriority: 'highest-threat',
    cost: 200,
  },
}

export const UNIT_SIZE = 20
export const BULLET_SIZE = 4
export const BULLET_SPEED = 300
