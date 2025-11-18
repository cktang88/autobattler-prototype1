import { entities } from '../../../lib/ecs'
import { createBullet } from '../entities'
import { BULLET_SPEED } from '../config/unitTypes'

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

export function updateCombat(time: number): void {
  for (const unit of entities.units.entities) {
    if (!unit.sprite?.gameObj || !unit.combat || !unit.target || unit.dead) continue

    const gameObj = unit.sprite.gameObj
    const targetId = unit.target.entityId
    if (!targetId) continue

    const targetEntity = Array.from(entities.units.entities).find((e) => e.id === targetId)
    if (!targetEntity || !targetEntity.sprite?.gameObj || !targetEntity.health || targetEntity.dead) {
      continue
    }

    const targetPos = targetEntity.sprite.gameObj.pos
    const dist = gameObj.pos.dist(targetPos)

    if (dist > unit.combat.range) continue

    const timeSinceLastShot = time - unit.combat.lastShotTime
    if (timeSinceLastShot < unit.combat.reloadTime) continue

    const hitRoll = Math.random()
    if (hitRoll > unit.combat.accuracy) {
      unit.combat.lastShotTime = time
      continue
    }

    createBullet(
      gameObj.pos.x,
      gameObj.pos.y,
      targetPos.x,
      targetPos.y,
      unit.combat.damage,
      unit.id,
      BULLET_SPEED
    )

    unit.combat.lastShotTime = time
  }
}
