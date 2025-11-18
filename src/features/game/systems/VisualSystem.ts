import { entities } from '../../../lib/ecs'
import { getKaplay } from '../../../lib/kaplay'
import type { Entity } from '../components'

let hoveredEntity: Entity | null = null
let rangeCircle: any = null

export function updateVisuals(): void {
  const k = getKaplay()

  // Update health bars
  for (const unit of entities.units.entities) {
    if (!unit.health || !unit.sprite?.gameObj) continue

    const healthBar = unit.sprite.gameObj.get('healthBar')[0]
    if (healthBar) {
      const healthPercent = unit.health.current / unit.health.max
      healthBar.width = (healthPercent * (20 + 4))

      // Color health bar based on health
      if (healthPercent > 0.6) {
        healthBar.color = k.rgb(0, 255, 0)
      } else if (healthPercent > 0.3) {
        healthBar.color = k.rgb(255, 200, 0)
      } else {
        healthBar.color = k.rgb(255, 0, 0)
      }
    }
  }

  // Handle hover detection
  const mousePos = k.mousePos()
  let foundHover = false

  for (const unit of entities.units.entities) {
    if (!unit.position || !unit.combat || unit.dead) continue

    const dist = Math.sqrt(
      (mousePos.x - unit.position.x) ** 2 + (mousePos.y - unit.position.y) ** 2
    )

    if (dist < 15) {
      if (hoveredEntity?.id !== unit.id) {
        hoveredEntity = unit

        // Remove old range circle
        if (rangeCircle) {
          rangeCircle.destroy()
        }

        // Create new range circle
        rangeCircle = k.add([
          k.circle(unit.combat.range),
          k.pos(unit.position.x, unit.position.y),
          k.color(k.rgb(100, 200, 255)),
          k.opacity(0.2),
          k.outline(2, k.rgb(100, 200, 255)),
          k.anchor('center'),
          k.z(-1),
          'rangeCircle',
        ])
      }
      foundHover = true
      break
    }
  }

  if (!foundHover && hoveredEntity) {
    hoveredEntity = null
    if (rangeCircle) {
      rangeCircle.destroy()
      rangeCircle = null
    }
  }

  // Update range circle position if unit moved
  if (hoveredEntity && rangeCircle && hoveredEntity.position) {
    rangeCircle.pos.x = hoveredEntity.position.x
    rangeCircle.pos.y = hoveredEntity.position.y
  }
}
