import { useState, useCallback, useEffect, useRef } from 'react'
import { GameCanvas } from './features/game/GameCanvas'
import { UnitMenu } from './features/ui/components/UnitMenu'
import { DebugInspector } from './features/ui/components/DebugInspector'
import { GameControls } from './features/ui/components/GameControls'
import { createUnit, removeEntity } from './features/game/entities'
import { entities } from './lib/ecs'
import { resetUnitsToInitialState, clearAllUnits } from './features/game/systems/ResetSystem'
import type { GameResult } from './features/game/systems/DeathSystem'
import type { GamePhase } from './features/game/state/GamePhaseState'

function App() {
  const [gameResult, setGameResult] = useState<GameResult>('ongoing')
  const [selectedUnitType, setSelectedUnitType] = useState<string | null>(null)
  const [gamePhase, setGamePhase] = useState<GamePhase>('placement')
  const selectedUnitTypeRef = useRef<string | null>(null)
  const gamePhaseRef = useRef<GamePhase>('placement')

  // Keep refs updated
  useEffect(() => {
    selectedUnitTypeRef.current = selectedUnitType
  }, [selectedUnitType])

  useEffect(() => {
    gamePhaseRef.current = gamePhase
  }, [gamePhase])

  const handleUnitSelect = useCallback((unitType: string) => {
    setSelectedUnitType(unitType)
    console.log('Unit selected:', unitType)
  }, [])

  const handleCanvasClick = useCallback((x: number, y: number, isShiftKey: boolean) => {
    console.log('Canvas clicked!', {
      gamePhase: gamePhaseRef.current,
      selectedUnitType: selectedUnitTypeRef.current,
      x,
      y
    })

    // Only allow placing units during placement phase
    if (gamePhaseRef.current !== 'placement') {
      console.warn('Not in placement phase, cannot place units')
      return
    }
    if (!selectedUnitTypeRef.current) {
      console.warn('No unit type selected')
      return
    }

    console.log(`Placing ${selectedUnitTypeRef.current} at (${x}, ${y})`)

    const team = isShiftKey ? 'enemy' : 'player'
    createUnit(selectedUnitTypeRef.current, x, y, team)
  }, [])

  const handleStartBattle = useCallback(() => {
    setGamePhase('battle')
    setGameResult('ongoing')
  }, [])

  const handleResetRound = useCallback(() => {
    resetUnitsToInitialState()
    setGamePhase('placement')
    setGameResult('ongoing')
  }, [])

  const handleClearUnits = useCallback(() => {
    clearAllUnits()
    setGamePhase('placement')
    setGameResult('ongoing')
  }, [])

  const handleGameResult = useCallback((result: GameResult) => {
    setGameResult(result)
    setGamePhase('result')
  }, [])


  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
        }}
      >
        <GameCanvas
          onGameResult={handleGameResult}
          gamePhase={gamePhase}
          onCanvasClick={handleCanvasClick}
        />
      </div>

      <GameControls
        onStartBattle={handleStartBattle}
        onResetRound={handleResetRound}
        onClearUnits={handleClearUnits}
        gameResult={gameResult}
        gamePhase={gamePhase}
      />

      <UnitMenu onUnitSelect={handleUnitSelect} />

      <DebugInspector />

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          background: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #444',
          borderRadius: 8,
          padding: 12,
          fontSize: 12,
          color: '#aaa',
          maxWidth: 250,
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: 6, color: '#fff' }}>How to Play:</div>
        <div style={{ lineHeight: 1.5 }}>
          1. Place units (Click=Player, Shift+Click=Enemy)
          <br />
          2. Press "Start Battle" to begin
          <br />
          3. Watch the battle unfold!
          <br />
          4. Reset to place units again
          <br />
          <br />
          Phase: <span style={{ color: '#4ecdc4' }}>{gamePhase.toUpperCase()}</span>
          <br />
          Selected: <span style={{ color: '#f9ca24' }}>{selectedUnitType || 'None'}</span>
        </div>
      </div>
    </div>
  )
}

export default App
