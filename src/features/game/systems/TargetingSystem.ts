import { entities } from '../../../lib/ecs'
import type { Entity } from '../components'

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

function findClosestEnemy(unit: Entity, enemies: Entity[]): Entity | null {
  if (!unit.sprite?.gameObj || !unit.combat) return null

  const gameObj = unit.sprite.gameObj
  let closest: Entity | null = null
  let closestDist = Infinity

  for (const enemy of enemies) {
    if (!enemy.sprite?.gameObj || !enemy.health) continue

    const dist = gameObj.pos.dist(enemy.sprite.gameObj.pos)

    if (dist < closestDist) {
      closestDist = dist
      closest = enemy
    }
  }

  return closest
}

function findLowestHealthEnemy(enemies: Entity[]): Entity | null {
  let lowest: Entity | null = null
  let lowestHealth = Infinity

  for (const enemy of enemies) {
    if (!enemy.health) continue

    if (enemy.health.current < lowestHealth) {
      lowestHealth = enemy.health.current
      lowest = enemy
    }
  }

  return lowest
}

function findHighestThreatEnemy(unit: Entity, enemies: Entity[]): Entity | null {
  if (!unit.sprite?.gameObj) return null

  const gameObj = unit.sprite.gameObj
  let highestThreat: Entity | null = null
  let highestThreatScore = 0

  for (const enemy of enemies) {
    if (!enemy.sprite?.gameObj || !enemy.combat || !enemy.health) continue

    const dist = gameObj.pos.dist(enemy.sprite.gameObj.pos)
    const threatScore = enemy.combat.damage / Math.max(dist, 1)

    if (threatScore > highestThreatScore) {
      highestThreatScore = threatScore
      highestThreat = enemy
    }
  }

  return highestThreat
}

export function updateTargeting(): void {
  for (const unit of entities.units.entities) {
    if (!unit.sprite?.gameObj || !unit.target || !unit.team || !unit.unitType || !unit.combat) continue

    const gameObj = unit.sprite.gameObj
    const enemies = Array.from(entities.units.entities).filter(
      (e) => e.team && e.team.id !== unit.team!.id && e.health && !e.dead && e.sprite?.gameObj
    )

    if (enemies.length === 0) {
      unit.target.entityId = null
      continue
    }

    const currentTarget = enemies.find((e) => e.id === unit.target!.entityId)

    if (currentTarget && currentTarget.sprite?.gameObj) {
      const dist = gameObj.pos.dist(currentTarget.sprite.gameObj.pos)

      if (dist <= unit.combat.range && currentTarget.health && !currentTarget.dead) {
        continue
      }
    }

    let newTarget: Entity | null = null

    switch (unit.unitType.targetPriority) {
      case 'closest':
        newTarget = findClosestEnemy(unit, enemies)
        break
      case 'lowest-health':
        newTarget = findLowestHealthEnemy(enemies)
        break
      case 'highest-threat':
        newTarget = findHighestThreatEnemy(unit, enemies)
        break
    }

    unit.target.entityId = newTarget?.id ?? null
  }
}
