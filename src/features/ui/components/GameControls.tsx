import type { GameResult } from '../../game/systems/DeathSystem'
import type { GamePhase } from '../../game/state/GamePhaseState'

interface GameControlsProps {
  onStartBattle: () => void
  onResetRound: () => void
  onClearUnits: () => void
  gameResult: GameResult
  gamePhase: GamePhase
}

export function GameControls({
  onStartBattle,
  onResetRound,
  onClearUnits,
  gameResult,
  gamePhase
}: GameControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid #444',
        borderRadius: 8,
        padding: 16,
        minWidth: 250,
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: 18, color: '#fff' }}>Game Controls</h3>

      {gameResult !== 'ongoing' && (
        <div
          style={{
            background:
              gameResult === 'player-win'
                ? 'rgba(0, 255, 0, 0.2)'
                : gameResult === 'enemy-win'
                ? 'rgba(255, 0, 0, 0.2)'
                : 'rgba(128, 128, 128, 0.2)',
            border:
              gameResult === 'player-win'
                ? '2px solid #0f0'
                : gameResult === 'enemy-win'
                ? '2px solid #f00'
                : '2px solid #888',
            borderRadius: 6,
            padding: 12,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
            {gameResult === 'player-win' && '🎉 Player Wins!'}
            {gameResult === 'enemy-win' && '💀 Enemy Wins!'}
            {gameResult === 'draw' && '🤝 Draw!'}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>Actions:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {gamePhase === 'placement' && (
            <button
              onClick={onStartBattle}
              style={{
                background: '#27ae60',
                border: 'none',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                width: '100%',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              ▶ Start Battle
            </button>
          )}

          {gamePhase === 'result' && (
            <button
              onClick={onResetRound}
              style={{
                background: '#f39c12',
                border: 'none',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                width: '100%',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              ↻ Reset Round
            </button>
          )}

          <button
            onClick={onClearUnits}
            style={{
              background: '#d63031',
              border: 'none',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 4,
              cursor: 'pointer',
              width: '100%',
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            Clear All Units
          </button>
        </div>
      </div>

      <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>
        <div>F1 - Toggle debug overlay</div>
        <div>F8 - Pause game</div>
        <div>F7 - Slow down</div>
        <div>F9 - Speed up</div>
      </div>
    </div>
  )
}
