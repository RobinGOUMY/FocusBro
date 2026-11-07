import { actionModes, advanceActionRound, setupActionRound, sliceFruit, turnSnake } from './arcade-action-games.js'
import { paintActionStage } from './arcade-action-view.js'
import { advanceFlight, beginFlight, flipMemory, markAnswer, saveArcadeResult, startArcade } from './arcade.js'
import { arcadeView } from './arcade-view.js'

export function createArcade({ app, getState, render, commit, createId }) {
  const settings = { subject: '', scope: 'worked', assisted: false }
  let run
  let frame
  let lastFrame
  let live
  let gesture

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
      : sprinting ? { clock: app.querySelector('[data-game-clock]'), bar: app.querySelector('.game-countdown') }
        : playing && actionModes.includes(run.mode) ? { stage: app.querySelector('[data-motion]') } : null
    if (!live?.field && !live?.clock && !live?.stage) stopClock()
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
    } else if (live.stage) {
      const choice = advanceActionRound(run, elapsed)
      if (choice !== null) markAnswer(run, choice)
      if (run.phase === 'feedback') {
        render({ focus: '#game-feedback' })
        return
      }
      paintActionStage(run, live.stage)
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
    if (!live || run?.phase !== 'playing' || run.mode === 'sling') return
    run.phase = 'paused'
    render({ focus: '#game-primary' })
  }

  function leave() {
    stopClock()
    run = null
    live = null
    gesture = null
  }

  function launch() {
    if (run?.phase !== 'ready') return
    if (run.mode === 'flight') beginFlight(run)
    else run.phase = 'playing'
    const selector = run.mode === 'flight' ? '#game-primary' : '[data-motion]'
    render({ focus: selector })
    app.querySelector(selector)?.scrollIntoView({ block: 'nearest' })
  }

  function slice(index) {
    if (!sliceFruit(run, index)) return
    if (run.phase === 'feedback') render({ focus: '#game-feedback' })
    else if (live?.stage) paintActionStage(run, live.stage)
  }

  function chooseLane(lane, focus = false) {
    if (!['sling', 'runner'].includes(run?.mode) || ![0, 1, 2].includes(lane)) return
    if (run.phase !== 'ready' && !(run.mode === 'runner' && run.phase === 'playing')) return
    run.motion.lane = lane
    if (run.phase === 'ready') render({ focus: focus ? `[data-action="arcade-lane"][data-value="${lane}"]` : '[data-motion]' })
    else {
      for (const control of app.querySelectorAll('[data-action="arcade-lane"]')) {
        control.setAttribute('aria-pressed', String(Number(control.dataset.value) === lane))
      }
    }
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
    'arcade-launch': launch,
    'arcade-jump': jump,
    'arcade-pause': pause,
    'arcade-resume': () => {
      if (run?.phase !== 'paused') return
      run.phase = 'playing'
      render({ focus: run.mode === 'flight' ? '#game-primary' : actionModes.includes(run.mode) ? '[data-motion]' : '#game-question' })
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
    'arcade-slice': ({ value }) => slice(Number(value)),
    'arcade-turn': ({ value }) => turnSnake(run, value),
    'arcade-lane': ({ value }) => chooseLane(Number(value), true),
    'arcade-next': () => {
      if (run?.phase !== 'feedback') return
      if (run.mode === 'memory') {
        if (run.matched.length === run.board.length) return finish()
        run.open = []
        run.phase = 'playing'
      } else {
        run.index += 1
        if (run.index === run.questions.length || run.lives === 0) return finish()
        run.phase = run.mode === 'sprint' ? 'playing' : 'ready'
        setupActionRound(run)
      }
      run.outcome = null
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
    const direction = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left' }[event.key]
    if (direction && !event.altKey && !event.ctrlKey && !event.metaKey && !event.target.closest('select, input, textarea')) {
      if (run?.mode === 'snake' && run.phase === 'playing') {
        event.preventDefault()
        turnSnake(run, direction)
      } else if (['sling', 'runner'].includes(run?.mode) && (direction === 'right' || direction === 'left') &&
        (run.phase === 'ready' || (run.mode === 'runner' && run.phase === 'playing'))) {
        event.preventDefault()
        chooseLane(Math.max(0, Math.min(2, run.motion.lane + (direction === 'right' ? 1 : -1))))
      }
    }
    if (!live?.field || event.code !== 'Space' || event.target.closest('a, input, select, textarea, button:not(.flight-field)')) return
    event.preventDefault()
    if (!event.repeat) jump()
  })

  app.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return
    const field = event.target.closest('[data-motion]')
    if (!field || !((run?.mode === 'slice' && run.phase === 'playing') || (run?.mode === 'sling' && run.phase === 'ready'))) return
    gesture = { id: event.pointerId, mode: run.mode, run, x: event.clientX, y: event.clientY }
    const target = event.target.closest('[data-action="arcade-slice"]')
    if (target) slice(Number(target.dataset.value))
  })
  document.addEventListener('pointermove', event => {
    if (gesture?.id !== event.pointerId || gesture.mode !== 'slice' || gesture.run !== run || run.phase !== 'playing') return
    const dx = event.clientX - gesture.x
    const dy = event.clientY - gesture.y
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 18))
    for (let index = 1; index <= steps && run.phase === 'playing'; index += 1) {
      const target = document.elementFromPoint(gesture.x + dx * index / steps, gesture.y + dy * index / steps)?.closest('[data-action="arcade-slice"]')
      if (target) slice(Number(target.dataset.value))
    }
    Object.assign(gesture, { x: event.clientX, y: event.clientY })
  })
  document.addEventListener('pointerup', event => {
    if (gesture?.id !== event.pointerId) return
    const pull = gesture
    gesture = null
    if (pull.mode !== 'sling' || pull.run !== run || run.phase !== 'ready') return
    const dx = event.clientX - pull.x
    if (Math.hypot(dx, event.clientY - pull.y) < 18) return
    chooseLane(dx > 15 ? 0 : dx < -15 ? 2 : 1)
    launch()
  })
  document.addEventListener('pointercancel', event => {
    if (gesture?.id === event.pointerId) gesture = null
  })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause()
  })

  return { actions, change, leave, sync, view: state => arcadeView(state, settings, run) }
}
