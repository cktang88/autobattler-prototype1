import { entities } from '../../../lib/ecs'
import { removeEntity } from '../entities'

export type GameResult = 'ongoing' | 'player-win' | 'enemy-win' | 'draw'

export function updateDeath(): GameResult {
  // Find newly dead units and hide them (don't remove - we need them for reset)
  const deadUnits = Array.from(entities.units.entities).filter(
    (u) => (u.dead || (u.health && u.health.current <= 0)) && u.sprite?.gameObj?.hidden !== true
  )

  for (const unit of deadUnits) {
    // Mark as dead and hide instead of removing
    if (!unit.dead) {
      unit.dead = { markedForDeath: true }
    }
    if (unit.sprite?.gameObj) {
      unit.sprite.gameObj.hidden = true
    }
  }

  const playerUnits = Array.from(entities.units.entities).filter(
    (u) => u.team?.id === 'player' && !u.dead
  )
  const enemyUnits = Array.from(entities.units.entities).filter(
    (u) => u.team?.id === 'enemy' && !u.dead
  )

  if (playerUnits.length === 0 && enemyUnits.length === 0) {
    return 'draw'
  }

  if (playerUnits.length === 0) {
    return 'enemy-win'
  }

  if (enemyUnits.length === 0) {
    return 'player-win'
  }

  return 'ongoing'
}
