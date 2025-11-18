import { entities, world } from '../../../lib/ecs'
import { removeEntity } from '../entities'

export function resetUnitsToInitialState(): void {
  // Remove all bullets
  const allBullets = Array.from(entities.bullets.entities)
  for (const bullet of allBullets) {
    removeEntity(bullet)
  }

  // Reset all units to initial state
  for (const unit of entities.units.entities) {
    if (!unit.initialState || !unit.health || !unit.sprite?.gameObj) continue

    const gameObj = unit.sprite.gameObj

    // Reset position using KaplayJS
    gameObj.pos.x = unit.initialState.x
    gameObj.pos.y = unit.initialState.y

    // Reset health
    unit.health.current = unit.initialState.health

    // Reset target
    if (unit.target) {
      unit.target.entityId = null
    }

    // Reset combat state
    if (unit.combat) {
      unit.combat.lastShotTime = 0
    }

    // Remove dead marker
    if (unit.dead) {
      delete unit.dead
    }
  }
}

export function clearAllUnits(): void {
  const allEntities = Array.from(entities.all.entities)
  for (const entity of allEntities) {
    removeEntity(entity)
  }
}
