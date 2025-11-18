import { entities } from '../../../lib/ecs'
import { removeEntity } from '../entities'

export type GameResult = 'ongoing' | 'player-win' | 'enemy-win' | 'draw'

export function updateDeath(): GameResult {
  // Find dead units by checking health directly, not relying on the dead query
  // (miniplex queries may not auto-update when components are added dynamically)
  const deadUnits = Array.from(entities.units.entities).filter(
    (u) => u.dead || (u.health && u.health.current <= 0)
  )

  for (const unit of deadUnits) {
    removeEntity(unit)
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
