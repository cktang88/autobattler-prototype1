import { UNIT_TYPES } from '../../game/config/unitTypes'
import type { UnitTypeConfig } from '../../game/config/unitTypes'

interface UnitMenuProps {
  onUnitSelect: (unitType: string) => void
}

export function UnitMenu({ onUnitSelect }: UnitMenuProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid #444',
        borderRadius: 8,
        padding: 16,
        minWidth: 250,
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: 18, color: '#fff' }}>Unit Menu</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.values(UNIT_TYPES).map((unit) => (
          <UnitCard key={unit.type} unit={unit} onSelect={() => onUnitSelect(unit.type)} />
        ))}
      </div>
    </div>
  )
}

interface UnitCardProps {
  unit: UnitTypeConfig
  onSelect: () => void
}

function UnitCard({ unit, onSelect }: UnitCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: 'rgba(40, 40, 50, 0.9)',
        border: `2px solid ${unit.color}`,
        borderRadius: 6,
        padding: 12,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.background = 'rgba(50, 50, 60, 0.9)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.background = 'rgba(40, 40, 50, 0.9)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 20,
            height: 20,
            background: unit.color,
            border: '2px solid #fff',
            borderRadius: 2,
          }}
        />
        <div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{unit.name}</div>
          <div style={{ fontSize: 12, color: '#aaa' }}>Cost: {unit.cost}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#ccc', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <div>HP: {unit.health}</div>
        <div>DMG: {unit.damage}</div>
        <div>Range: {unit.range}</div>
        <div>Reload: {unit.reloadTime}s</div>
        <div>Accuracy: {(unit.accuracy * 100).toFixed(0)}%</div>
        <div>Speed: {unit.moveSpeed}</div>
      </div>
    </div>
  )
}
