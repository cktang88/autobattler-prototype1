import { useEffect, useRef, useState } from 'react'
import { initKaplay, quitKaplay } from '../../lib/kaplay'
import { updateTargeting } from './systems/TargetingSystem'
import { updateMovement } from './systems/MovementSystem'
import { updateCombat } from './systems/CombatSystem'
import { updateBullets } from './systems/BulletSystem'
import { updateDeath, type GameResult } from './systems/DeathSystem'
import { updateVisuals } from './systems/VisualSystem'
import type { GamePhase } from './state/GamePhaseState'

interface GameCanvasProps {
  onGameResult: (result: GameResult) => void
  gamePhase: GamePhase
  onCanvasClick: (x: number, y: number, isShiftKey: boolean) => void
}

export function GameCanvas({ onGameResult, gamePhase, onCanvasClick }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameResultRef = useRef<GameResult>('ongoing')
  const gamePhaseRef = useRef<GamePhase>(gamePhase)
  const shiftKeyRef = useRef<boolean>(false)

  // Keep phase ref updated
  useEffect(() => {
    gamePhaseRef.current = gamePhase
  }, [gamePhase])

  // Track shift key state with native browser events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        shiftKeyRef.current = true
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        shiftKeyRef.current = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    console.log('Initializing GameCanvas...')
    const k = initKaplay(containerRef.current)

    // Handle mouse clicks - use native shift key tracking
    k.onMousePress(() => {
      const mousePos = k.mousePos()
      const isShift = shiftKeyRef.current
      console.log('Mouse pressed at', mousePos, 'shift:', isShift)
      onCanvasClick(mousePos.x, mousePos.y, isShift)
    })

    k.onUpdate(() => {
      const dt = k.dt()
      const time = k.time()

      updateVisuals()

      // Only run battle systems during battle phase
      if (gamePhaseRef.current !== 'battle') return
      if (gameResultRef.current !== 'ongoing') return

      updateTargeting()
      updateMovement(dt)
      updateCombat(time)
      updateBullets(dt)

      const result = updateDeath()
      if (result !== 'ongoing') {
        gameResultRef.current = result
        onGameResult(result)
      }
    })

    k.onDraw(() => {
      let phaseText = ''
      const currentPhase = gamePhaseRef.current
      switch (currentPhase) {
        case 'placement':
          phaseText = 'PLACEMENT PHASE - Place your units'
          break
        case 'battle':
          phaseText = 'BATTLE PHASE'
          break
        case 'result':
          phaseText = 'ROUND OVER'
          break
      }

      k.drawText({
        text: phaseText,
        pos: k.vec2(k.width() / 2, 30),
        size: 24,
        color: currentPhase === 'battle' ? k.rgb(255, 100, 100) : k.rgb(100, 200, 255),
        anchor: 'center',
      })

      k.drawText({
        text: 'Press F1 for debug info',
        pos: k.vec2(10, 10),
        size: 16,
        color: k.rgb(200, 200, 200),
      })
    })

    return () => {
      console.log('Cleaning up GameCanvas...')
      quitKaplay()
    }
  }, [onGameResult])

  // Reset game result when phase changes to placement
  useEffect(() => {
    if (gamePhase === 'placement') {
      gameResultRef.current = 'ongoing'
    }
  }, [gamePhase])

  return (
    <div
      ref={containerRef}
      style={{
        width: 1200,
        height: 800,
        border: '2px solid #333',
        position: 'relative',
      }}
    />
  )
}
