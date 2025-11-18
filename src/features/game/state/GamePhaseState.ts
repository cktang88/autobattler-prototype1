import { createMachine, interpret } from 'robot3'

export type GamePhase = 'placement' | 'battle' | 'result'

export const gamePhaseStateMachine = createMachine({
  placement: {
    startBattle: 'battle',
  },
  battle: {
    endBattle: 'result',
  },
  result: {
    reset: 'placement',
  },
})

export const gamePhaseService = interpret(gamePhaseStateMachine)

export function getCurrentPhase(): GamePhase {
  return gamePhaseService.machine.current as GamePhase
}

export function startBattle(): void {
  gamePhaseService.send('startBattle')
}

export function endBattle(): void {
  gamePhaseService.send('endBattle')
}

export function resetToPlacement(): void {
  gamePhaseService.send('reset')
}
