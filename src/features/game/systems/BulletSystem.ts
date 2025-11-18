import { entities } from '../../../lib/ecs'
import { removeEntity } from '../entities'
import { getKaplay } from '../../../lib/kaplay'

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

export function updateBullets(dt: number): void {
  const k = getKaplay()
  const bulletsToRemove: typeof entities.bullets.entities = new Set()

  for (const bullet of entities.bullets.entities) {
    if (!bullet.sprite?.gameObj) continue

    const gameObj = bullet.sprite.gameObj

    // Use KaplayJS's move method with stored direction
    if (gameObj.direction && gameObj.speed) {
      gameObj.move(gameObj.direction.scale(gameObj.speed))
    }

    // Check if bullet is out of bounds
    if (
      gameObj.pos.x < 0 ||
      gameObj.pos.x > k.width() ||
      gameObj.pos.y < 0 ||
      gameObj.pos.y > k.height()
    ) {
      bulletsToRemove.add(bullet)
    }
  }

  // Remove out-of-bounds bullets
  for (const bullet of bulletsToRemove) {
    removeEntity(bullet)
  }
}
