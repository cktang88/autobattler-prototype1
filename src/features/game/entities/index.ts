import { world } from '../../../lib/ecs'
import { getKaplay } from '../../../lib/kaplay'
import { UNIT_TYPES, UNIT_SIZE, BULLET_SIZE } from '../config/unitTypes'
import type { Entity } from '../components'

let nextEntityId = 1

export function createUnit(
  unitType: string,
  x: number,
  y: number,
  team: 'player' | 'enemy'
): Entity {
  const config = UNIT_TYPES[unitType]
  if (!config) throw new Error(`Unknown unit type: ${unitType}`)

  const k = getKaplay()
  const teamColor = team === 'player' ? k.rgb(100, 150, 255) : k.rgb(255, 100, 100)

  console.log(`Creating unit: ${unitType} at (${x}, ${y}) for team ${team}`)

  // Create main unit body - using KaplayJS components properly
  const gameObj = k.add([
    k.rect(UNIT_SIZE, UNIT_SIZE),
    k.pos(x, y),
    k.color(k.Color.fromHex(config.color)),
    k.area(),
    k.anchor('center'),
    k.outline(3, teamColor),
    k.z(0),
    `unit`,
    `team-${team}`,
    `unit-${nextEntityId}`,
  ])

  // Add health bar background
  const healthBarBg = gameObj.add([
    k.rect(UNIT_SIZE + 4, 4),
    k.pos(0, -UNIT_SIZE/2 - 8),
    k.color(k.rgb(50, 50, 50)),
    k.anchor('center'),
    'healthBarBg',
  ])

  // Add health bar foreground
  const healthBar = gameObj.add([
    k.rect(UNIT_SIZE + 4, 4),
    k.pos(0, -UNIT_SIZE/2 - 8),
    k.color(k.rgb(0, 255, 0)),
    k.anchor('center'),
    'healthBar',
  ])

  // Add unit type letter
  let letter = ''
  switch (unitType) {
    case 'assault': letter = 'A'; break
    case 'sniper': letter = 'S'; break
    case 'tank': letter = 'T'; break
    case 'scout': letter = 'R'; break
  }

  gameObj.add([
    k.text(letter, { size: 16 }),
    k.pos(0, 0),
    k.color(k.rgb(255, 255, 255)),
    k.anchor('center'),
    k.z(1),
    'unitSymbol',
  ])

  const entity = world.add({
    id: nextEntityId++,
    position: { x, y },
    velocity: { vx: 0, vy: 0 },
    health: { current: config.health, max: config.health },
    combat: {
      damage: config.damage,
      range: config.range,
      reloadTime: config.reloadTime,
      accuracy: config.accuracy,
      lastShotTime: 0,
    },
    target: { entityId: null },
    unitType: {
      type: config.type,
      targetPriority: config.targetPriority,
    },
    team: { id: team },
    sprite: { gameObj },
    movement: {
      speed: config.moveSpeed,
      targetX: null,
      targetY: null,
      engagementRange: config.range * 0.9,
    },
    initialState: {
      x,
      y,
      health: config.health,
    },
  })

  console.log(`Unit created successfully: Entity #${entity.id}, GameObj:`, gameObj, 'Pos:', gameObj.pos)

  return entity
}

export function createBullet(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  damage: number,
  ownerId: number,
  speed: number
): Entity {
  const k = getKaplay()

  // Calculate direction vector using KaplayJS
  const direction = k.vec2(toX - fromX, toY - fromY).unit()

  // Make bullets more visible with larger size and glow effect
  const gameObj = k.add([
    k.circle(BULLET_SIZE * 2),
    k.pos(fromX, fromY),
    k.color(k.rgb(255, 220, 50)),
    k.area(),
    k.anchor('center'),
    k.opacity(0.9),
    k.z(1),
    'bullet',
    `bullet-${nextEntityId}`,
  ])

  // Add inner bright core
  gameObj.add([
    k.circle(BULLET_SIZE),
    k.pos(0, 0),
    k.color(k.rgb(255, 255, 200)),
    k.anchor('center'),
  ])

  // Store movement direction on the gameObj itself
  gameObj.direction = direction
  gameObj.speed = speed

  const entity = world.add({
    id: nextEntityId++,
    bullet: { ownerId, damage, speed },
    sprite: { gameObj },
  })

  // Use KaplayJS collision detection
  gameObj.onCollide('unit', (unit: any) => {
    // Check if it's an enemy unit (different team than owner)
    const ownerEntity = Array.from(entities.units.entities).find(e => e.id === ownerId)
    if (!ownerEntity) return

    const hitEntityId = parseInt(unit.tags.find((t: string) => t.startsWith('unit-'))?.split('-')[1] || '0')
    const hitEntity = Array.from(entities.units.entities).find(e => e.id === hitEntityId)

    if (hitEntity && hitEntity.team && ownerEntity.team && hitEntity.team.id !== ownerEntity.team.id) {
      // Hit an enemy!
      if (hitEntity.health) {
        hitEntity.health.current -= damage
        if (hitEntity.health.current <= 0) {
          hitEntity.health.current = 0
          hitEntity.dead = { markedForDeath: true }
        }
      }
      // Remove bullet
      removeEntity(entity)
    }
  })

  return entity
}

export function removeEntity(entity: Entity): void {
  if (entity.sprite?.gameObj) {
    entity.sprite.gameObj.destroy()
  }
  world.remove(entity)
}
