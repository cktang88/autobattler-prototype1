import { entities } from '../../../lib/ecs'

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

export function updateMovement(dt: number): void {
  for (const unit of entities.units.entities) {
    if (!unit.movement || !unit.target || !unit.sprite?.gameObj || unit.dead) continue

    const gameObj = unit.sprite.gameObj
    const targetId = unit.target.entityId

    if (!targetId) {
      // No target, don't move
      continue
    }

    const targetEntity = Array.from(entities.units.entities).find((e) => e.id === targetId)
    if (!targetEntity || !targetEntity.sprite?.gameObj) {
      continue
    }

    const targetPos = targetEntity.sprite.gameObj.pos
    const dist = gameObj.pos.dist(targetPos)

    if (dist <= unit.movement.engagementRange) {
      // In range, stop moving
      continue
    }

    // Use KaplayJS's built-in movement - move toward target
    const direction = targetPos.sub(gameObj.pos).unit()
    const moveSpeed = unit.movement.speed

    // Move using KaplayJS move method
    gameObj.move(direction.scale(moveSpeed))
  }
}
