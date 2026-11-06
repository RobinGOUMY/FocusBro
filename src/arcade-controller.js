import { advanceFlight, beginFlight, flipMemory, markAnswer, prepareBoard, saveArcadeResult, startArcade } from './arcade.js'
import { arcadeView } from './arcade-view.js'

export function createArcade({ app, getState, render, commit, createId }) {
  const settings = { subject: '', scope: 'all', assisted: false }
  let run
  let frame
  let lastFrame
  let live

  function stopClock() {
    cancelAnimationFrame(frame)
    frame = null
    lastFrame = null
  }

  function sync() {
    const playing = run?.phase === 'playing'
    const flying = playing && run.mode === 'flight' && !run.assisted
    const sprinting = playing && run.mode === 'sprint'
    live = flying ? { field: app.querySelector('.flight-field.live') }
      : sprinting ? { clock: app.querySelector('[data-game-clock]'), bar: app.querySelector('.game-countdown') } : null
    if (!live?.field && !live?.clock) stopClock()
    else if (frame == null) {
      lastFrame = performance.now()
      frame = requestAnimationFrame(tick)
    }
  }

  function tick(now) {
    frame = null
    const elapsed = Math.max(0, now - lastFrame)
    lastFrame = now
    if (live.field) {
      advanceFlight(run, elapsed)
      const { y, gate } = run.flight
      live.field.style.setProperty('--pilot-y', `${y * 100}%`)
      live.field.style.setProperty('--gate-x', `${gate * 100}%`)
      if (run.phase === 'feedback') {
        render({ focus: '#game-feedback' })
        return
      }
    } else {
      run.remaining = Math.max(0, run.remaining - elapsed)
      const time = `${Math.ceil(run.remaining / 1000)} s`
      if (live.clock.textContent !== time) live.clock.textContent = time
      live.bar.value = run.remaining
      if (run.remaining === 0) {
        void finish()
        return
      }
    }
    frame = requestAnimationFrame(tick)
  }

  async function finish() {
    const finished = run
    finished.phase = 'done'
    render()
    const result = await commit(state => saveArcadeResult(state, finished))
    if (run !== finished) return
    run.result = result
    render({ focus: '#game-question' })
  }

  function jump() {
    if (run?.mode === 'flight' && run.phase === 'playing' && !run.assisted) run.flight.speed = -0.5
  }

  function pause() {
    if (!live || run?.phase !== 'playing') return
    run.phase = 'paused'
    render({ focus: '#game-primary' })
  }

  function leave() {
    stopClock()
    run = null
    live = null
  }

  const actions = {
    'arcade-start': ({ value }) => {
      const next = startArcade(getState(), value, settings, createId())
      if (!next) return
      stopClock()
      run = next
      render({ focus: '#game-question' })
      app.querySelector('.arcade-session')?.scrollIntoView({ block: 'start' })
    },
    'arcade-exit': () => {
      leave()
      render({ focus: '#main-content' })
      window.scrollTo(0, 0)
    },
    'arcade-launch': () => {
      if (run?.phase !== 'ready') return
      beginFlight(run)
      render({ focus: '#game-primary' })
      app.querySelector('#game-primary')?.scrollIntoView({ block: 'nearest' })
    },
    'arcade-jump': jump,
    'arcade-pause': pause,
    'arcade-resume': () => {
      if (run?.phase !== 'paused') return
      run.phase = 'playing'
      render({ focus: run.mode === 'flight' ? '#game-primary' : '#game-question' })
    },
    'arcade-assist-run': () => {
      if (run?.mode !== 'flight' || run.phase !== 'ready') return
      run.assisted = true
      render({ focus: '#game-question' })
    },
    'arcade-answer': ({ value }) => {
      const interactive = run?.mode === 'sprint' && run.phase === 'playing'
        || run?.mode === 'flight' && run.assisted && run.phase === 'ready'
      if (!interactive || ![0, 1, 2].includes(Number(value))) return
      markAnswer(run, Number(value))
      render({ focus: '#game-feedback' })
    },
    'arcade-flip': ({ value }) => {
      if (run?.mode !== 'memory' || !flipMemory(run, Number(value))) return
      render({ focus: run.outcome ? '#game-feedback' : '.memory-card:not(:disabled)' })
    },
    'arcade-next': () => {
      if (run?.phase !== 'feedback') return
      if (run.mode === 'memory') {
        if (run.matched.length === run.board.length) {
          run.index += run.board.length / 2
          if (run.index === run.questions.length) return finish()
          prepareBoard(run)
        } else {
          run.open = []
          run.outcome = null
          run.phase = 'playing'
        }
      } else {
        run.index += 1
        if (run.index === run.questions.length) return finish()
        run.outcome = null
        run.phase = run.mode === 'flight' ? 'ready' : 'playing'
      }
      render({ focus: '#game-question' })
    },
  }

  function change({ id, value, checked }) {
    if (id === 'arcade-subject') settings.subject = value
    else if (id === 'arcade-scope') settings.scope = value
    else if (id === 'arcade-assist') settings.assisted = checked
    else return false
    render({ focus: `#${id}` })
    return true
  }

  document.addEventListener('keydown', event => {
    if (!live?.field || event.code !== 'Space' || event.target.closest('a, input, select, textarea, button:not(.flight-field)')) return
    event.preventDefault()
    if (!event.repeat) jump()
  })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause()
  })

  return { actions, change, leave, sync, view: state => arcadeView(state, settings, run) }
}
