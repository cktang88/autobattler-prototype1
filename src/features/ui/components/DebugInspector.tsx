import { useState, useEffect } from 'react'
import { entities } from '../../../lib/ecs'
import type { Entity } from '../../game/components'

export function DebugInspector() {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [entityList, setEntityList] = useState<Entity[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setEntityList(Array.from(entities.all.entities))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid #444',
        borderRadius: 8,
        padding: 16,
        maxWidth: 400,
        maxHeight: 400,
        overflow: 'auto',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: 18, color: '#fff' }}>
        Debug Inspector ({entityList.length} entities)
      </h3>

      {selectedEntity ? (
        <div>
          <button
            onClick={() => setSelectedEntity(null)}
            style={{
              background: '#444',
              border: 'none',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              marginBottom: 12,
            }}
          >
            ← Back
          </button>
          <EntityDetails entity={selectedEntity} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {entityList.map((entity) => (
            <button
              key={entity.id}
              onClick={() => setSelectedEntity(entity)}
              style={{
                background: 'rgba(40, 40, 50, 0.9)',
                border: '1px solid #555',
                borderRadius: 4,
                padding: 8,
                cursor: 'pointer',
                color: '#fff',
                textAlign: 'left',
                fontSize: 12,
              }}
            >
              Entity #{entity.id} - {entity.unitType?.type || 'bullet'}
              {entity.team && ` (${entity.team.id})`}
              {entity.health && ` HP: ${entity.health.current.toFixed(0)}/${entity.health.max}`}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function EntityDetails({ entity }: { entity: Entity }) {
  return (
    <div style={{ fontSize: 12, color: '#ccc' }}>
      <pre
        style={{
          background: '#1a1a1a',
          padding: 12,
          borderRadius: 4,
          overflow: 'auto',
          maxHeight: 300,
        }}
      >
        {JSON.stringify(
          {
            id: entity.id,
            position: entity.position,
            velocity: entity.velocity,
            health: entity.health,
            combat: entity.combat,
            target: entity.target,
            unitType: entity.unitType,
            team: entity.team,
            movement: entity.movement,
            dead: entity.dead,
          },
          null,
          2
        )}
      </pre>
    </div>
  )
}
