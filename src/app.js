import { setAmbience, setVolume, unlockAudio, chime } from './audio.js'
import { hasSubject } from './content.js'
import { courseById } from './courses.js'
import { focusActivity } from './focus-activities.js'
import { advanceMathTrack, beginMathTrack, mathContext, recordMathAttempt, skillForCard } from './math-practice.js'
import { createState, dayKey, freshTimer, gradeCard, isCourseWorked, levelInfo, mathReviewContext, remainingTime, restoreState, reviewCards, settleTimer, storageKey, studyStats } from './study.js'
import { cardForm, courseResults, customCardList, dashboard, escapeHtml, flashcardsView, focusView, formatClock, feynmanView, icon, layout, libraryView, mathView, pages, profileView, progressView, readerView, suggestedChallenge } from './views.js'

const app = document.querySelector('#app')
const dialog = document.querySelector('#dialog')
const toast = document.querySelector('#toast')
const study = { subject: '', course: '', mode: 'due', scope: 'worked', queue: [], started: false, flipped: false }
const library = { subject: '', query: '', filter: 'all' }
const pageFromUrl = () => pages.find(page => page.id === location.hash.slice(1).split('/')[0])?.id ?? 'accueil'
const routeDetail = () => location.hash.split('/')[1] ?? ''
const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
let state = createState()
let page = pageFromUrl()
let selectedNote = ''
let challengeId = ''
let currentCourse
let exerciseContext = mathReviewContext(state)
let returnToCards = ''
let sound = 'off'
let focusChoice = ''
let toastTimeout
let timerCheck = false
let persistenceFailed = false
let lastDay = dayKey()
let dialogTrigger
let confirmAction

function readState() {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? restoreState(JSON.parse(stored)) : null
  } catch {
    persistenceFailed = true
    return null
  }
}

async function commit(change) {
  const operation = () => {
    const next = (persistenceFailed ? null : readState()) ?? state
    const previousLevel = levelInfo(studyStats(next).xp).index
    const finished = settleTimer(next)
    const result = change(next)
    state = next
    if (finished && page !== 'focus' && next.timer.status === 'ready' && sound !== 'off') {
      sound = 'off'
      setAmbience(sound, next.profile.volume)
    }
    if (finished || result !== false) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state))
        persistenceFailed = false
      } catch {
        if (!persistenceFailed) notify('La sauvegarde est indisponible dans ce navigateur.')
        persistenceFailed = true
      }
    }
    const unlocked = levelInfo(studyStats(state).xp)
    if (unlocked.index > previousLevel) celebrate(`Niveau ${unlocked.current.title} débloqué !`, 'Un thème et un avatar t’attendent dans ton profil.')
    else if (finished === 'focus') celebrate('Session terminée · +50 XP', 'Tu as bien mérité cinq minutes de pause.')
    else if (finished === 'break') {
      chime(state.profile.chime, state.profile.volume)
      notify('Pause terminée. À toi de jouer !')
    }
    return result
  }
  return navigator.locks ? navigator.locks.request(storageKey, operation) : operation()
}

function snapshotForm() {
  const form = app.querySelector('#note-form, #profile-form, #math-form')
  if (!form) return null
  const active = form.contains(document.activeElement) ? document.activeElement : null
  return {
    id: form.id,
    note: form.dataset.id,
    course: form.dataset.course,
    values: Array.from(form.elements).filter(input => input.name).map(input => ({ name: input.name, value: input.value, checked: input.checked, type: input.type })),
    focus: active ? { name: active.name, value: active.value, type: active.type } : null,
    selection: active && typeof active.selectionStart === 'number' ? [active.selectionStart, active.selectionEnd] : null,
  }
}

function render({ preserveForm = false, focus } = {}) {
  const draft = preserveForm ? snapshotForm() : null
  const openDetails = preserveForm ? [...app.querySelectorAll('main details')].map(detail => detail.open) : []
  const content = {
    accueil: () => dashboard(state),
    cours: () => currentCourse ? readerView(state, currentCourse) : libraryView(state, library.subject, library.query, library.filter),
    exercices: () => mathView(state, exerciseContext, returnToCards),
    focus: () => focusView(state, sound, focusChoice),
    flashcards: () => flashcardsView(state, study),
    feynman: () => feynmanView(state, challengeId, selectedNote),
    progression: () => progressView(state),
    profil: () => profileView(state),
  }[page]()
  document.documentElement.dataset.theme = state.profile.theme
  app.innerHTML = layout(state, page, content)
  app.querySelectorAll('main details').forEach((detail, index) => {
    if (openDetails[index]) detail.open = true
  })
  if (draft) {
    const form = document.getElementById(draft.id)
    if (form && form.dataset.id === draft.note && form.dataset.course === draft.course) {
      const findField = ({ name, value, type }) => Array.from(form.elements).find(input => input.name === name && (type !== 'radio' || input.value === value))
      draft.values.forEach(item => {
        const input = findField(item)
        if (!input) return
        if (item.type === 'checkbox' || item.type === 'radio') input.checked = item.checked
        else input.value = item.value
      })
      const field = draft.focus && findField(draft.focus)
      field?.focus?.({ preventScroll: true })
      if (field && draft.selection) field.setSelectionRange(...draft.selection)
    }
  }
  if (focus) app.querySelector(focus)?.focus({ preventScroll: true })
  updateClock()
}

function updateClock() {
  const timer = state.timer
  const remaining = remainingTime(timer)
  const time = formatClock(remaining)
  app.querySelectorAll('[data-live-timer]').forEach(element => {
    if (element.textContent !== time) element.textContent = time
  })
  const title = timer.status === 'running' ? `${time} · ${timer.phase === 'focus' ? 'Focus' : 'Pause'} · FocusBro` : 'FocusBro · Ton QG de révision'
  if (document.title !== title) document.title = title
}

async function tick() {
  const today = dayKey()
  if (today !== lastDay) {
    lastDay = today
    render({ preserveForm: true })
  }
  updateClock()
  if (state.timer.status !== 'running' || remainingTime(state.timer) > 0 || timerCheck) return
  timerCheck = true
  try {
    await commit(() => false)
    render({ preserveForm: true })
  } finally {
    timerCheck = false
  }
}

function notify(message, detail = '') {
  clearTimeout(toastTimeout)
  toast.innerHTML = `${icon('spark', 20)} <span><strong>${escapeHtml(message)}</strong>${detail ? `<small>${escapeHtml(detail)}</small>` : ''}</span>`
  toast.classList.add('visible')
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 4500)
}

function celebrate(message, detail) {
  notify(message, detail)
  chime(state.profile.chime, state.profile.volume)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const confetti = document.createElement('div')
  confetti.className = 'confetti'
  confetti.setAttribute('aria-hidden', 'true')
  confetti.innerHTML = Array.from({ length: 16 }, (_, index) =>
    `<i style="--x:${(index - 8) * 19}px;--spin:${index * 61}deg;--delay:${index % 4 * 35}ms"></i>`,
  ).join('')
  document.body.append(confetti)
  setTimeout(() => confetti.remove(), 1100)
}

function showDialog(title, content) {
  if (!dialog.open) dialogTrigger = document.activeElement
  confirmAction = null
  dialog.innerHTML = `<div class="dialog-heading"><h2 id="dialog-title">${title}</h2><button type="button" class="btn secondary icon-button" data-action="close-dialog" aria-label="Fermer">${icon('close', 19)}</button></div>${content}`
  if (!dialog.open) dialog.showModal()
  const firstField = dialog.querySelector('input, textarea, select') ?? dialog.querySelector('[data-action="close-dialog"]')
  firstField?.focus()
}

function confirm(title, text, label, action) {
  showDialog(title, `<p>${text}</p><div class="toolbar-actions confirm-actions"><button type="button" class="btn secondary" data-action="close-dialog">Annuler</button><button type="button" class="btn danger-fill" data-action="confirm">${label}</button></div>`)
  confirmAction = action
  dialog.querySelector('.confirm-actions .secondary').focus()
}

dialog.addEventListener('close', () => {
  if (dialog.open) return
  confirmAction = null
  dialog.replaceChildren()
  dialogTrigger?.focus({ preventScroll: true })
  dialogTrigger = null
})

async function startTimer() {
  const { status, phase, id, subject: savedSubject } = state.timer
  if (status === 'running') return
  const opening = status === 'ready' && phase === 'focus'
  const field = app.querySelector('#timer-subject')
  const subject = opening ? field?.value : savedSubject
  if (opening && !hasSubject(subject)) {
    field?.focus()
    notify('Choisis la matière de ta session.')
    return
  }
  const choice = focusChoice
  unlockAudio()
  const started = await commit(next => {
    const current = next.timer
    if (current.status !== status || current.phase !== phase || current.id !== id) return false
    current.subject = subject
    if (opening) {
      current.activity = focusActivity(next, choice)
      if (current.activity.kind === 'exercise') {
        const context = mathReviewContext(next, current.activity.route.split('/')[1])
        const track = next.mathPractice.tracks[context.key]
        if (track?.result) advanceMathTrack(next.mathPractice, context, track.current)
      }
    }
    current.id ??= createId()
    current.endsAt = Date.now() + current.remaining
    current.status = 'running'
    return true
  })
  if (started && opening && openFocusActivity(true)) return
  render({ preserveForm: true, focus: '.focus-float [data-action="pause-timer"]' })
}

function openFocusActivity(newSession = false) {
  const activity = state.timer.phase === 'focus' && focusActivity(state, focusChoice)
  if (!activity?.route) return false
  if (newSession && activity.kind === 'cards') resetReview({ subject: '', course: '', scope: 'worked' })
  location.hash = activity.route
  return true
}

async function pauseTimer() {
  const id = state.timer.id
  await commit(next => {
    if (next.timer.id !== id || next.timer.status !== 'running') return false
    next.timer.remaining = remainingTime(next.timer)
    next.timer.endsAt = null
    next.timer.status = 'paused'
  })
  render({ preserveForm: true, focus: '.focus-float [data-action="start-timer"]' })
}

function stopTimer() {
  const { phase, id } = state.timer
  confirm('Arrêter le minuteur ?', phase === 'focus' ? 'Si tu arrêtes maintenant, cette session ne rapportera pas d’XP.' : 'Tu pourras démarrer une nouvelle session quand tu seras prêt.', 'Arrêter', async () => {
    const stopped = await commit(next => {
      if (next.timer.id !== id) return false
      next.timer = freshTimer('focus', next.timer.subject)
      return true
    })
    render({ focus: '[data-action="start-timer"]' })
    if (stopped) notify(phase === 'focus' ? 'Session arrêtée · 0 XP' : 'Pause arrêtée')
  })
}

function resetReview(selection = {}) {
  Object.assign(study, { queue: [], started: false, flipped: false }, selection)
}

function syncReviewQueue() {
  const previousCard = study.queue[0]
  const available = new Set(reviewCards(state, study).map(card => card.id))
  study.queue = study.queue.filter(id => available.has(id))
  if (study.queue[0] !== previousCard) study.flipped = false
}

function shuffle(cards) {
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    const card = cards[index]
    cards[index] = cards[target]
    cards[target] = card
  }
  return cards
}

function prepareReview() {
  const available = reviewCards(state, study)
  let cards = available
  if (study.mode === 'practice') cards = shuffle(available)
  else if (!study.subject && !study.course) {
    const scheduled = available.filter(card => state.schedule[card.id])
    const unseen = available.filter(card => !state.schedule[card.id])
    cards = [...scheduled, ...shuffle(unseen)]
  }
  resetReview({ started: true, queue: cards.slice(0, 10).map(card => card.id) })
}

function startReview() {
  prepareReview()
  render({ focus: '[data-action="flip-card"]' })
}

async function reviewCard(grade) {
  if (!study.flipped) return
  const id = study.queue[0]
  const practice = study.mode === 'practice'
  const selection = { ...study }
  study.flipped = false
  unlockAudio()
  const outcome = await commit(next => {
    const card = reviewCards(next, selection).find(item => item.id === id)
    if (!card) return false
    const mathSkill = grade === 'easy' ? null : skillForCard(card)
    if (mathSkill) {
      const context = mathContext(mathSkill.id)
      beginMathTrack(next.mathPractice, context, { source: card.question, recovery: true })
      if (!practice) next.schedule[card.id] = { adaptive: true }
      next.reviews.push({ subject: card.subject, card: card.id, grade, at: Date.now(), xp: 0, practice })
      return { mathSkill: mathSkill.id }
    }
    if (practice) {
      next.reviews.push({ subject: card.subject, card: card.id, grade, at: Date.now(), xp: 0, practice: true })
      return { xp: 0 }
    }
    return { xp: gradeCard(next, card, grade), due: next.schedule[card.id].due }
  })
  study.queue = study.queue.filter(queued => queued !== id)
  if (outcome?.mathSkill) {
    location.hash = `exercices/${outcome.mathSkill}/cartes/${selection.course || selection.subject || 'toutes'}`
    return
  }
  render({ focus: '[data-action="flip-card"], .empty-state .btn' })
  if (outcome?.xp) {
    if (!toast.textContent.includes('débloqué') || !toast.classList.contains('visible')) celebrate('Bonus mémoire · +20 XP', 'Dix cartes retrouvées de mémoire !')
  } else if (outcome?.due) {
    const date = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(`${outcome.due}T12:00:00`))
    notify(`Prochaine révision le ${date}`)
  } else if (outcome && !study.queue.length) {
    notify('Série d’entraînement terminée !')
  }
}

async function submitMath(values, formId) {
  const context = exerciseContext
  const current = state.mathPractice.tracks[context.key]?.current
  if (!current || (formId && `${current.skill}:${current.seed}` !== formId)) return
  const result = await commit(next => recordMathAttempt(next.mathPractice, context.key === 'worked' ? mathReviewContext(next) : context, current, values, dayKey()))
  if (page !== 'exercices' || exerciseContext.key !== context.key) return
  if (result === 'invalid') {
    app.querySelector('#math-input-error').hidden = false
    return
  }
  render({ focus: '#math-feedback-title' })
  app.querySelector('#math-feedback-title')?.scrollIntoView({ block: 'nearest' })
}

async function nextMath() {
  const context = exerciseContext
  const current = state.mathPractice.tracks[context.key]?.current
  if (!current) return
  await commit(next => advanceMathTrack(next.mathPractice, context.key === 'worked' ? mathReviewContext(next) : context, current))
  if (page !== 'exercices' || exerciseContext.key !== context.key) return
  render({ focus: '#math-question' })
  app.querySelector('#math-question')?.scrollIntoView({ block: 'nearest' })
}

function deleteCard(id) {
  confirm('Supprimer cette carte ?', 'Elle disparaîtra de ta collection et de tes révisions à venir.', 'Supprimer', async () => {
    await commit(next => {
      next.customCards = next.customCards.filter(card => card.id !== id)
      delete next.schedule[id]
    })
    study.queue = study.queue.filter(queued => queued !== id)
    study.flipped = false
    render()
    notify('Carte supprimée')
  })
}

function deleteNote(id) {
  confirm('Supprimer cette explication ?', 'Le texte sera retiré de ton carnet.', 'Supprimer', async () => {
    await commit(next => { next.notes = next.notes.filter(note => note.id !== id) })
    selectedNote = ''
    render()
    notify('Note supprimée')
  })
}

const actions = {
  'start-timer': startTimer,
  'pause-timer': pauseTimer,
  'stop-timer': stopTimer,
  'open-focus-activity': () => openFocusActivity(),
  'skip-break': async () => {
    await commit(next => {
      if (next.timer.phase !== 'break' || next.timer.status !== 'ready') return false
      next.timer = freshTimer('focus', next.timer.subject)
    })
    render({ focus: '[data-action="start-timer"]' })
  },
  sound: ({ value }) => {
    if (!setAmbience(value, state.profile.volume)) {
      notify('Le son est indisponible dans ce navigateur.')
      return
    }
    sound = value
    render({ focus: `[data-action="sound"][data-value="${value}"]` })
  },
  'start-review': startReview,
  'review-mode': ({ value }) => {
    resetReview({ mode: value })
    render({ focus: `[data-action="review-mode"][data-value="${value}"]` })
  },
  'mark-worked': async ({ value }) => {
    if (!courseById.has(value)) return
    const worked = await commit(next => {
      const worked = !isCourseWorked(next, value)
      next.reading[value] = { ...next.reading[value], worked }
      return worked ? 'added' : 'removed'
    })
    syncReviewQueue()
    render({ preserveForm: true })
    const toggle = app.querySelector(`[data-action="mark-worked"][data-value="${value}"]`)
    const fallback = page === 'flashcards' ? app.querySelector('[data-action="start-review"]') ?? app.querySelector('#card-scope') : app.querySelector('#course-filter')
    const control = toggle ?? fallback
    control?.focus({ preventScroll: true })
    notify(worked === 'added' ? 'Chapitre ajouté à tes révisions' : 'Chapitre marqué « Pas encore »')
  },
  'mark-course': async () => {
    if (!currentCourse) return
    const id = currentCourse.id
    const completed = !state.reading[id]?.completedAt
    await commit(next => {
      next.reading[id] = { ...next.reading[id], completedAt: completed ? Date.now() : null }
    })
    render({ focus: '[data-action="mark-course"]' })
    notify(completed ? 'Chapitre marqué comme lu' : 'Chapitre marqué à relire')
  },
  'flip-card': () => {
    study.flipped = !study.flipped
    render({ focus: '[data-action="flip-card"]' })
  },
  'grade-card': ({ value }) => reviewCard(value),
  'math-stuck': () => submitMath(null),
  'math-next': nextMath,
  'manage-cards': () => showDialog('Mes flashcards', customCardList(state)),
  'edit-card': ({ value }) => {
    const card = state.customCards.find(item => item.id === value)
    if (card) showDialog('Modifier la flashcard', cardForm(card))
  },
  'delete-card': ({ value }) => deleteCard(value),
  'open-note': ({ value }) => {
    const note = state.notes.find(item => item.id === value)
    if (!note) return
    if (note.course) {
      if (challengeId === note.course && !selectedNote) app.querySelector('[name="body"]')?.focus()
      else location.hash = `feynman/${note.course}`
      return
    }
    selectedNote = value
    render({ focus: '[name="body"]' })
  },
  'delete-note': ({ value }) => deleteNote(value),
  reward: async ({ type, value }) => {
    await commit(next => { next.profile[type] = value })
    render({ preserveForm: true, focus: `[data-type="${type}"][data-value="${value}"]` })
    notify(type === 'theme' ? 'Thème activé' : 'Avatar sélectionné')
  },
  'close-dialog': () => dialog.close(),
  confirm: async () => {
    const action = confirmAction
    dialog.close()
    await action?.()
  },
}

document.addEventListener('click', async event => {
  if (event.target.closest('.skip')) {
    event.preventDefault()
    document.querySelector('#main-content').focus()
    return
  }
  const control = event.target.closest('[data-action]')
  if (control) await actions[control.dataset.action]?.(control.dataset)
})

app.addEventListener('input', event => {
  if (event.target.id === 'course-search') {
    library.query = event.target.value
    document.querySelector('#course-results').innerHTML = courseResults(state, library.subject, library.query, library.filter)
    return
  }
  if (event.target.id !== 'volume') return
  const volume = Number(event.target.value)
  document.querySelector('#volume-value').textContent = `${volume} %`
  setVolume(volume)
})

app.addEventListener('change', async event => {
  const { id, value } = event.target
  if (id === 'timer-subject') {
    const changed = await commit(next => {
      if (next.timer.status !== 'ready' || next.timer.phase !== 'focus' || !hasSubject(value)) return false
      next.timer.subject = value
      return true
    })
    if (changed && page === 'focus') {
      focusChoice = ''
      render({ focus: '#timer-subject' })
    }
  } else if (id === 'timer-activity') {
    focusChoice = value
    render({ focus: '#timer-activity' })
  } else if (id === 'card-subject') {
    history.replaceState(null, '', value ? `#flashcards/${value}` : '#flashcards')
    resetReview({ subject: value, course: '' })
    render({ focus: '#card-subject' })
  } else if (id === 'card-scope') {
    resetReview({ scope: value })
    render({ focus: '#card-scope' })
  } else if (id === 'course-filter') {
    library.filter = value
    document.querySelector('#course-results').innerHTML = courseResults(state, library.subject, library.query, library.filter)
  } else if (id === 'challenge-course') {
    location.hash = `feynman/${value}`
  } else if (id === 'math-context') {
    location.hash = value ? `exercices/${value}` : 'exercices'
  } else if (id === 'volume') {
    await commit(next => { next.profile.volume = Number(value) })
  }
})

const forms = {
  'math-form': (form, values) => submitMath(Object.values(values), form.dataset.id),
  'note-form': async (form, values) => {
    const course = courseById.get(form.dataset.course)
    if (!values.body || (course && !values.example)) {
      notify(course ? 'Écris ton explication et ajoute un exemple.' : 'Écris ton explication.')
      return
    }
    const id = form.dataset.id || createId()
    const saved = await commit(next => {
      const previous = next.notes.find(note => course ? note.course === course.id : note.id === id)
      if (!previous && form.dataset.id) return false
      const updatedAt = Date.now()
      const identity = course ? { title: course.title, subject: course.subject, course: course.id } : { title: previous.title, subject: previous.subject }
      const note = { id: previous?.id ?? id, ...identity, ...values, updatedAt, createdAt: previous?.createdAt ?? updatedAt }
      next.notes = [...next.notes.filter(item => item.id !== note.id), note]
      return true
    })
    if (!course) selectedNote = saved ? id : ''
    render({ focus: course && saved ? '.guide-model summary' : '[name="body"]' })
    notify(saved ? 'Explication enregistrée' : 'Cette note a été supprimée dans un autre onglet.')
  },
  'card-form': async (form, values) => {
    if (!values.question || !values.answer || !hasSubject(values.subject)) {
      notify('Indique une matière, une question et sa réponse.')
      return
    }
    const id = form.dataset.id
    const saved = await commit(next => {
      if (!next.customCards.some(item => item.id === id)) return false
      next.customCards = [...next.customCards.filter(card => card.id !== id), { id, ...values }]
      return true
    })
    dialog.close()
    if (study.subject && study.subject !== values.subject) study.queue = study.queue.filter(queued => queued !== id)
    study.flipped = false
    render({ focus: '[data-action="manage-cards"]' })
    notify(saved ? 'Flashcard enregistrée' : 'Cette carte a été supprimée dans un autre onglet.')
  },
  'profile-form': async (form, values) => {
    await commit(next => Object.assign(next.profile, { name: values.name, chime: form.elements.chime.checked }))
    render({ focus: '#profile-form button' })
    notify('Préférences enregistrées')
  },
}

document.addEventListener('submit', async event => {
  const form = event.target
  if (!forms[form.id]) return
  event.preventDefault()
  const values = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]))
  const submit = form.querySelector('[type="submit"]')
  submit.disabled = true
  try {
    await forms[form.id](form, values)
  } finally {
    submit.disabled = false
  }
})

async function navigate(initial = false) {
  const previousPage = page
  page = pageFromUrl()
  const detail = routeDetail()
  currentCourse = page === 'cours' ? courseById.get(detail) : null
  if (page === 'cours' && !currentCourse && detail !== library.subject) {
    Object.assign(library, { subject: hasSubject(detail) ? detail : '', query: '', filter: 'all' })
  }
  if (page === 'flashcards') {
    const chapter = courseById.get(detail)
    const subject = chapter?.subject ?? (hasSubject(detail) ? detail : '')
    if ((chapter?.id ?? '') !== study.course || (detail && subject !== study.subject)) {
      resetReview({ course: chapter?.id ?? '', subject, mode: 'due' })
    }
    syncReviewQueue()
    const timer = state.timer
    if (timer.phase === 'focus' && timer.status !== 'ready' && timer.activity?.route === `flashcards/${detail}` && !study.started) {
      study.scope = 'worked'
      study.mode = reviewCards(state, study, 'due').length ? 'due' : 'practice'
      prepareReview()
    }
  }
  if (page === 'feynman') {
    selectedNote = ''
    challengeId = courseById.has(detail) ? detail : suggestedChallenge(state)?.id ?? ''
  }
  if (page === 'exercices') {
    const [, , origin, deck] = location.hash.split('/')
    exerciseContext = mathReviewContext(state, detail)
    returnToCards = origin === 'cartes' ? (courseById.has(deck) || hasSubject(deck) ? `flashcards/${deck}` : 'flashcards') : ''
    const restart = origin === 'variante' && Boolean(exerciseContext.skill)
    if (restart) history.replaceState(null, '', `#exercices/${detail}`)
    const context = exerciseContext
    const source = restart ? courseById.get(context.course).exercise.question : ''
    if (restart || needsMathTrack(context)) {
      await commit(next => beginMathTrack(next.mathPractice, mathReviewContext(next, detail), { source, restart }))
      if (page !== 'exercices' || exerciseContext.key !== context.key) return
      exerciseContext = mathReviewContext(state, detail)
    }
  }
  if (page !== 'focus' && state.timer.status === 'ready' && sound !== 'off') {
    sound = 'off'
    setAmbience(sound, state.profile.volume)
  }
  render(initial ? {} : { focus: '#main-content' })
  if (!initial || previousPage !== page) window.scrollTo(0, 0)
  if (currentCourse) {
    const id = currentCourse.id
    await commit(next => {
      next.reading[id] = { ...next.reading[id], openedAt: Date.now() }
    })
  }
}

window.addEventListener('hashchange', () => { void navigate() })

function needsMathTrack(context) {
  const current = state.mathPractice.tracks[context.key]?.current
  return context.options.length > 0 && !context.options.some(skill => skill.id === current?.skill)
}

window.addEventListener('storage', async event => {
  if (event.key !== storageKey) return
  const previousTimer = state.timer
  state = readState() ?? createState()
  if (previousTimer.id && previousTimer.id !== state.timer.id && page !== 'focus') {
    sound = 'off'
    setAmbience(sound, state.profile.volume)
  }
  setVolume(state.profile.volume)
  syncReviewQueue()
  if (page === 'feynman' && !selectedNote && !routeDetail() && !isCourseWorked(state, challengeId)) {
    challengeId = suggestedChallenge(state)?.id ?? ''
  }
  if (page === 'exercices' && exerciseContext.key === 'worked') {
    exerciseContext = mathReviewContext(state)
    if (needsMathTrack(exerciseContext)) {
      await commit(next => beginMathTrack(next.mathPractice, mathReviewContext(next)))
      if (page !== 'exercices' || exerciseContext.key !== 'worked') return
      exerciseContext = mathReviewContext(state)
    }
  }
  render({ preserveForm: true })
})

state = readState() ?? state
void navigate(true)
if (persistenceFailed) notify('La sauvegarde est indisponible dans ce navigateur.')
void tick()
setInterval(tick, 250)
document.addEventListener('visibilitychange', tick)
