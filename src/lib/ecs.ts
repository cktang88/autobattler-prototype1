import { World } from 'miniplex'
import type { Entity } from '../features/game/components'

export const world = new World<Entity>()

export const entities = {
  all: world,
  units: world.with('position', 'health', 'combat', 'team', 'unitType'),
  bullets: world.with('bullet', 'sprite'),
  alive: world.with('health').without('dead'),
  dead: world.with('dead'),
  withTarget: world.with('target'),
  moving: world.with('movement', 'position'),
}
