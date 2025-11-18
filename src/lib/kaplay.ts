import kaplay, { KAPLAYCtx } from 'kaplay'

let k: KAPLAYCtx | null = null

export function initKaplay(container: HTMLElement): KAPLAYCtx {
  // Always reinitialize if k exists
  if (k) {
    try {
      k.quit()
    } catch (e) {
      console.warn('Error quitting previous Kaplay instance:', e)
    }
    k = null
  }

  // Clear the container
  container.innerHTML = ''

  // Let kaplay create its own canvas completely fresh
  k = kaplay({
    width: 1200,
    height: 800,
    background: [20, 20, 30],
    debug: true,
    global: false,
  })

  // Move the canvas into our container
  const canvas = k.canvas
  if (canvas && canvas.parentElement) {
    canvas.parentElement.removeChild(canvas)
  }
  if (canvas) {
    container.appendChild(canvas)
  }

  console.log('Kaplay initialized successfully', {
    width: k.width(),
    height: k.height(),
    canvas: canvas,
  })

  return k
}

export function getKaplay(): KAPLAYCtx {
  if (!k) throw new Error('Kaplay not initialized')
  return k
}

export function quitKaplay(): void {
  if (k) {
    try {
      k.quit()
    } catch (e) {
      console.warn('Error quitting Kaplay:', e)
    }
    k = null
  }
}
