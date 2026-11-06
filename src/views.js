import { hasSubject, subjects } from './content.js'
import { courseById, courses } from './courses.js'
import { focusActivities, focusActivity } from './focus-activities.js'
import { courseExerciseSkills, mathSkills, problemFor, skillById, skillForCard } from './math-practice.js'
import { arcadeModes } from './arcade.js'
import { cosmetics, cosmeticTypes, equippedCosmetic, levels } from './pass.js'
import { availableCustomCards, dailyGoal, dayKey, isCourseWorked, levelInfo, remainingTime, reviewCards, studyStats, weekActivity } from './study.js'

const glyphs = {
  bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M10 2h4m-2 7v4l2 2m4-9 2-2"/>',
  cards: '<rect x="7" y="3" width="14" height="16" rx="2"/><path d="M17 22H5a2 2 0 0 1-2-2V7m8 2h6m-6 4h4"/>',
  pen: '<path d="m13 6 5 5M5 20l4-.8L21 7l-4-4L5 15l-1 5h1ZM4 4h7M4 8h3"/>',
  chart: '<path d="M3 3v18h18M8 16v-4m5 4V8m5 8V5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M9.5 3h5l.6 2.6 2 .9 2.4-.8 2.5 4.2-1.9 1.8v.6l1.9 1.8-2.5 4.2-2.4-.8-2 .9-.6 2.6h-5l-.6-2.6-2-.9-2.4.8L2 14.1l1.9-1.8v-.6L2 9.9l2.5-4.2 2.4.8 2-.9.6-2.6Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  play: '<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5Z"/>',
  pause: '<path d="M9 5v14m6-14v14"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  fire: '<path d="M12 22a7 7 0 0 0 7-7c0-4-2.3-5.5-3.5-6.5.3 2-1 2.5-1.8 2.5 0-3.8-2-6.8-4.2-8-.1 3-1.5 4.8-2.7 6.3C5.8 10.6 5 12.3 5 15a7 7 0 0 0 7 7Z"/><path d="M12 22c-1.6 0-3-1.3-3-3 0-1.3.8-2.3 3-4 2.2 1.7 3 2.7 3 4 0 1.7-1.4 3-3 3Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  back: '<path d="m14 6-6 6 6 6"/>',
  spark: '<path d="M9 2c.7 4.5 2.5 6.3 7 7-4.5.7-6.3 2.5-7 7-.7-4.5-2.5-6.3-7-7 4.5-.7 6.3-2.5 7-7Zm9 11c.4 2.6 1.4 3.6 4 4-2.6.4-3.6 1.4-4 4-.4-2.6-1.4-3.6-4-4 2.6-.4 3.6-1.4 4-4Z"/>',
  headphones: '<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="12" width="4" height="7" rx="1"/><rect x="17" y="12" width="4" height="7" rx="1"/>',
  mute: '<path d="M11 5 6 9H3v6h3l5 4V5Zm5 4 5 6m0-6-5 6"/>',
  rain: '<path d="M6 15a4 4 0 0 1-.6-7.9A6 6 0 0 1 17 8a3.5 3.5 0 1 1 .5 7H16m-7 1-1 3m5-2-1 4m5-4-1 2"/>',
  music: '<path d="M9 17V6l12-3v11M9 9l12-3"/><ellipse cx="6" cy="17" rx="3" ry="2.5"/><ellipse cx="18" cy="14" rx="3" ry="2.5"/>',
  waves: '<path d="M2 12h2l2-5 4 10 4-13 4 14 2-6h2"/>',
  coffee: '<path d="M4 9h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Zm13 1h2a2 2 0 1 1 0 4h-2M3 21h17M8 3v3m5-3v3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  rotate: '<path d="M3 12a9 9 0 1 1 2.6 6.4M3 5v7h7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  minus: '<path d="M5 12h14"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/>',
  crown: '<path d="m3 6 5 4 4-6 4 6 5-4-2 13H5L3 6Zm2 10h14"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8 14-2 7 6-3 6 3-2-7"/>',
  planet: '<circle cx="12" cy="12" r="6"/><ellipse cx="12" cy="12" rx="11" ry="3" transform="rotate(-30 12 12)"/>',
  ghost: '<path d="M4 20V11a8 8 0 0 1 16 0v9l-3-2-2.5 2-2.5-2-2.5 2L7 18l-3 2Zm5-9h.01M15 11h.01"/>',
  math: '<path d="M4 7h8M8 3v8m7 5h6m-6 4h6M4 16l5 5m0-5-5 5"/>',
  book: '<path d="M12 5v16M3 4h4a5 5 0 0 1 5 2 5 5 0 0 1 5-2h4v15h-4a6 6 0 0 0-5 2 6 6 0 0 0-5-2H3V4Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><ellipse cx="12" cy="12" rx="4" ry="9"/>',
  flask: '<path d="M9 3h6m-5 0v7l-5.5 8.4A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.6L14 10V3M8 15h8"/>',
  leaf: '<path d="M4 20c2-5 6-7 10-10M5 16C2 6 13 4 21 4c0 9-3 17-13 14"/>',
  message: '<path d="M20 11a7 7 0 0 1-7 7H8l-5 3 1-5a7 7 0 0 1 5-12h4a7 7 0 0 1 7 7Z"/><path d="M8 10h8m-8 4h5"/>',
  trash: '<path d="M4 7h16m-10 0V4h4v3m4 0-1 13H7L6 7m4 4v5m4-5v5"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4 4"/>',
  arcade: '<path d="M7 7h10a4 4 0 0 1 4 3.5l1 5.5a2.5 2.5 0 0 1-4.2 2.3L15 16H9l-2.8 2.3A2.5 2.5 0 0 1 2 16l1-5.5A4 4 0 0 1 7 7Z"/><path d="M6 12h5m-2.5-2.5v5m7.5-2.5h.01m3 2h.01"/>',
  flight: '<path d="m3 12 18-8-6 17-3.5-7.5L3 12Zm8.5 1.5L21 4"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12m0-12H8.5A2.5 2.5 0 1 1 11 5.5L12 8Zm0 0h3.5A2.5 2.5 0 1 0 13 5.5L12 8Z"/>',
}

export function icon(name, size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[name]}</svg>`
}

export const pages = [
  { id: 'accueil', name: 'Tableau de bord', mobile: 'Accueil', icon: 'grid' },
  { id: 'cours', name: 'Bibliothèque de cours', mobile: 'Cours', icon: 'book' },
  { id: 'exercices', name: 'Exercices de maths', icon: 'math' },
  { id: 'focus', name: 'Session focus', mobile: 'Focus', icon: 'timer' },
  { id: 'flashcards', name: 'Flashcards', mobile: 'Cartes', icon: 'cards' },
  { id: 'feynman', name: 'Carnet Feynman', mobile: 'Carnet', icon: 'pen' },
  { id: 'arcade', name: 'Arcade', mobile: 'Arcade', icon: 'arcade' },
  { id: 'pass', name: 'Pass Focus', icon: 'gift' },
  { id: 'progression', name: 'Progression', icon: 'chart' },
  { id: 'profil', name: 'Personnalisation', icon: 'settings' },
]

const navGroups = [
  ['Espace d’étude', ['accueil', 'cours', 'focus']],
  ['Révisions', ['flashcards', 'exercices', 'feynman']],
  ['Jeu et progression', ['arcade', 'pass', 'progression']],
]

export const sounds = [
  ['off', 'Silence', 'mute'], ['rain', 'Pluie', 'rain'], ['lofi', 'Lo-fi', 'music'], ['white', 'Bruit blanc', 'waves'],
]

export function escapeHtml(value = '') {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(value).replace(/[&<>"']/g, character => entities[character])
}

const number = new Intl.NumberFormat('fr-FR')
const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
const shortDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })
const dayLabel = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' })
const subjectById = id => subjects.find(subject => subject.id === id)
const countLabel = (count, singular, plural = `${singular}s`) => `${number.format(count)} ${count === 1 ? singular : plural}`

function timeLabel(minutes) {
  const hours = Math.floor(minutes / 60)
  return hours ? `${hours} h ${String(minutes % 60).padStart(2, '0')}` : `${minutes} min`
}

export const tile = (name, color) => `<span class="icon-tile ${color}">${icon(name)}</span>`
export const button = (content, action, variant = 'primary', attributes = '') => `<button type="button" class="btn ${variant}" data-action="${action}" ${attributes}>${content}</button>`
export const link = (content, page, variant = 'primary') => `<a class="btn ${variant}" href="#${page}">${content}</a>`

function bar(progress, label) {
  return `<div class="meter" role="progressbar" aria-label="${label}" aria-valuenow="${Math.round(progress * 100)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress * 100}%"></span></div>`
}

export function heading(kicker, title, description) {
  return `<div class="page-heading"><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${description}</p></div>`
}

function navItem(page, active, mobile = false) {
  return `<a class="nav-link${page.id === active ? ' active' : ''}" href="#${page.id}" ${page.id === active ? 'aria-current="page"' : ''}><span class="nav-icon">${icon(page.icon, mobile ? 20 : 18)}</span><span>${mobile ? page.mobile : page.name}</span></a>`
}

export function layout(state, page, content) {
  const stats = studyStats(state)
  const level = levelInfo(stats.xp)
  const name = escapeHtml(state.profile.name || 'FocusBro')
  const avatar = equippedCosmetic(state.profile, 'avatar')
  const frame = equippedCosmetic(state.profile, 'frame')
  const float = floatingTimer(state.timer)
  const currentPage = pages.find(item => item.id === page)
  return `<aside class="sidebar">
    <a class="brand" href="#accueil"><img src="./assets/bolt.svg" width="38" height="38" alt=""><span>Focus<span>Bro</span><small>ESPACE DE RÉVISION</small></span></a>
    <nav class="main-nav" aria-label="Navigation principale">${navGroups.map(([title, ids]) => `<div class="nav-group"><p class="nav-caption">${title}</p>${ids.map(id => navItem(pages.find(item => item.id === id), page)).join('')}</div>`).join('')}</nav>
    <div class="sidebar-bottom">
      <a class="sidebar-level" href="#pass">
        <div class="level-heading">${tile('award', 'purple')}<div><b>${level.current.title}</b><small>Niveau ${level.current.number}</small></div>${icon('chevron', 16)}</div>
        ${bar(level.progress, 'Progression du niveau')}
        <div class="level-caption">${level.next ? `${number.format(stats.xp)} / ${level.next.xp} XP` : 'Niveau max'}<span>${Math.round(level.progress * 100)} %</span></div>
      </a>
      ${navItem(pages.at(-1), page)}
    </div>
  </aside>
  <div class="workspace${float ? ' has-focus-float' : ''}">
    <header class="topbar">
      <a class="brand mobile-brand" href="#accueil"><img src="./assets/bolt.svg" width="34" height="34" alt=""><span>Focus<span>Bro</span></span></a>
      <div class="workspace-path">${icon(currentPage.icon, 16)}<span>${currentPage.name}</span></div>
      <div class="top-actions">
        <span class="today-date">${icon('calendar', 16)} <span>${weekday.format(new Date())}</span></span>
        ${float}
        <a href="#pass" class="xp-pill" title="Voir le Pass Focus">${icon('bolt', 16)} <strong>${number.format(stats.xp)} XP</strong></a>
        <a class="avatar profile-frame" data-frame="${frame.id}" style="--frame-color:${frame.visual}" href="#profil" aria-label="Profil de ${name}" title="Profil de ${name}">${avatarArt(avatar, 19)}</a>
      </div>
    </header>
    <main id="main-content" class="main-content" tabindex="-1">${content}</main>
  </div>
  <nav class="mobile-nav" aria-label="Navigation principale">${pages.filter(item => item.mobile).map(item => navItem(item, page, true)).join('')}</nav>`
}

function statCard(symbol, color, label, value, detail) {
  return `<article class="stat-card panel">${tile(symbol, color)}<div><h2>${label}</h2><strong>${value}</strong><p>${detail}</p></div></article>`
}

function moduleCard(page, symbol, color, title, detail, status) {
  return `<a href="#${page}" class="module-card panel">${tile(symbol, color)}<span class="module-arrow">${icon('chevron', 17)}</span><h3>${title}</h3><p>${detail}</p><span class="module-status ${color}">${status}</span></a>`
}

function nextRow(route, symbol, color, title, detail) {
  return `<a class="next-row" href="#${escapeHtml(route)}">${tile(symbol, color)}<span><strong>${title}</strong><small>${detail}</small></span>${icon('chevron', 17)}</a>`
}

function dailyPanel(state, todayMinutes) {
  const goal = Math.min(1, todayMinutes / dailyGoal)
  return `<section class="quest panel" aria-labelledby="mission-title">
    <div class="quest-heading"><div><span class="section-kicker">AUJOURD’HUI</span><h2 id="mission-title">Objectif du jour</h2></div>${tile(goal === 1 ? 'check' : 'target', 'mint')}</div>
    <div class="goal-content"><div class="goal-ring" style="--goal:${goal * 100}%" role="progressbar" aria-label="Objectif du jour en minutes" aria-valuenow="${Math.min(todayMinutes, dailyGoal)}" aria-valuemin="0" aria-valuemax="${dailyGoal}"><span><strong>${todayMinutes}</strong><small>/ ${dailyGoal} min</small></span></div><div><h3>${goal === 1 ? 'Objectif atteint' : 'Une session suffit'}</h3><p>${goal === 1 ? 'Tu as pris le temps d’avancer aujourd’hui.' : 'Termine un Pomodoro pour atteindre ton objectif.'}</p></div></div>
    <ul class="goal-week" aria-label="Sessions des sept derniers jours">${weekActivity(state).map(({ date, minutes }, index) => `<li class="${index === 6 ? 'today' : ''}${minutes ? ' done' : ''}" aria-label="${weekday.format(date)} · ${timeLabel(minutes)}"><span>${dayLabel.format(date).slice(0, 1).toUpperCase()}</span><i>${minutes ? icon('check', 12) : ''}</i></li>`).join('')}</ul>
  </section>`
}

export function dashboard(state) {
  const stats = studyStats(state)
  const due = reviewCards(state, {}, 'due').length
  const worked = courses.filter(course => isCourseWorked(state, course.id)).length
  const noteCount = state.notes.filter(note => hasSubject(note.subject)).length
  const latest = latestCourse(state)
  const active = state.timer.phase === 'break' || state.timer.status !== 'ready'
  const greeting = state.profile.name ? `Salut, ${escapeHtml(state.profile.name)} !` : 'Ton espace de révision'
  const current = state.timer.phase === 'focus' && active && state.timer.activity
  const next = [
    latest && current?.route !== `cours/${latest.id}` ? nextRow(`cours/${latest.id}`, 'book', 'sky', 'Reprendre ta lecture', escapeHtml(latest.title)) : '',
    due ? nextRow('flashcards', 'cards', 'mint', 'Réviser tes flashcards', `${countLabel(due, 'carte')} à revoir`) : '',
    !worked ? nextRow('cours', 'check', 'mint', 'Indiquer les chapitres vus', 'Tes révisions suivront ton programme.') : '',
  ].filter(Boolean).slice(0, 2)
  if (!next.length) next.push(nextRow('cours', 'book', 'sky', 'Revoir tes chapitres', 'Retrouve tes cours dans la bibliothèque.'))
  return `<div class="dashboard">${heading('TON TABLEAU DE BORD', greeting, 'Retrouve tes cours et choisis ta prochaine activité.')}
    <div class="dashboard-top"><section class="hero" aria-labelledby="hero-title">
      <img class="hero-art" src="./assets/focus-illustration.webp" width="680" height="680" alt="" fetchpriority="high">
      <div class="hero-copy">
        <span class="hero-tag">${icon('timer', 15)} POMODORO · 25 MIN</span>
        <h2 id="hero-title">${active ? 'Ta session focus' : '25 minutes pour avancer'}</h2>
        <p>${current?.route ? escapeHtml(current.title) : active ? 'Retrouve les commandes de ta session.' : 'Choisis une matière, on te propose par quoi commencer.'}</p>
        ${link(`${icon('play', 17)} ${current?.route ? 'Reprendre l’activité' : active ? 'Revenir à la session' : 'Lancer une session'} ${icon('arrow', 17)}`, current?.route ?? 'focus', 'hero-button')}
      </div>
    </section>${dailyPanel(state, stats.todayMinutes)}</div>
    <section class="stats-grid" aria-label="Mes statistiques">
      ${statCard('fire', 'amber', 'Série en cours', countLabel(stats.streak, 'jour'), 'Jours de révision consécutifs')}
      ${statCard('clock', 'sky', 'Temps en focus', timeLabel(stats.minutes), 'Depuis tes débuts')}
      ${statCard('bolt', 'purple', 'Expérience', `${number.format(stats.xp)} XP`, `Niveau ${levelInfo(stats.xp).current.title}`)}
    </section>
    <div class="dashboard-bottom">
      <section aria-labelledby="modules-title">
        <div class="section-heading"><h2 id="modules-title">Tes outils de révision</h2></div>
        <div class="module-grid">
          ${moduleCard('cours', 'book', 'sky', 'Cours', 'Lis et marque les chapitres vus.', `${courses.length} chapitres`)}
          ${moduleCard('flashcards', 'cards', 'purple', 'Flashcards', 'Retrouve la réponse de mémoire.', due ? `${countLabel(due, 'carte')} à revoir` : 'Rappel actif')}
          ${moduleCard('exercices', 'math', 'amber', 'Exercices de maths', 'Entraîne-toi avec des variantes.', `${mathSkills.length} types d’exercices`)}
          ${moduleCard('feynman', 'pen', 'mint', 'Carnet Feynman', 'Explique avec tes propres mots.', noteCount ? countLabel(noteCount, 'note') : 'Défis guidés')}
          ${moduleCard('arcade', 'arcade', 'sky', 'Arcade', 'Révise en volant, en sprintant ou en jouant au memory.', '3 mini-jeux')}
          ${moduleCard('pass', 'gift', 'amber', 'Pass Focus', 'Débloque des récompenses en gagnant de l’XP.', `Niveau ${levelInfo(stats.xp).current.number} sur ${levels.length}`)}
        </div>
      </section>
      <section class="dashboard-next" aria-labelledby="next-title">
        <div class="section-heading"><h2 id="next-title">À suivre</h2></div>
        <div class="panel next-panel">${next.join('')}</div>
        <a class="progress-link" href="#progression">Voir ma progression ${icon('arrow', 16)}</a>
        <a class="progress-link account-link" href="#profil">Mon compte ${icon('arrow', 16)}</a>
      </section>
    </div></div>`
}

export function subjectOptions(selected = '', all = false, options = subjects, allLabel = 'Toutes les matières') {
  return `<option value="" ${selected ? '' : 'selected'} ${all ? '' : 'disabled'}>${all ? allLabel : 'Choisir une matière'}</option>${options.map(subject => `<option value="${subject.id}" ${selected === subject.id ? 'selected' : ''}>${subject.name}</option>`).join('')}`
}

export function latestCourse(state) {
  const recent = Object.entries(state.reading).filter(([id, progress]) => courseById.has(id) && progress.openedAt)
    .sort((first, second) => second[1].openedAt - first[1].openedAt)
  return courseById.get(recent[0]?.[0])
}

const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

function workedButton(state, course) {
  const worked = isCourseWorked(state, course.id)
  return button(`${icon(worked ? 'check' : 'plus', 16)} ${worked ? 'Travaillé' : 'Pas encore'}`, 'mark-worked', 'secondary worked-toggle', `data-value="${course.id}" aria-pressed="${worked}" aria-label="Chapitre travaillé · ${escapeHtml(course.title)}"`)
}

export function courseResults(state, subjectId, query, filter) {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean)
  const matches = courses.filter(course => {
    const done = Boolean(state.reading[course.id]?.completedAt)
    if ((subjectId && course.subject !== subjectId) || (filter === 'done' && !done)) return false
    const worked = isCourseWorked(state, course.id)
    if ((filter === 'worked' && !worked) || (filter === 'unworked' && worked)) return false
    const text = normalize([course.title, course.topic, course.intro, subjectById(course.subject).name, ...course.sections.map(section => `${section.heading} ${section.text}`)].join(' '))
    return words.every(word => text.includes(word))
  })

  if (!subjectId && !words.length && filter === 'all') {
    return `<div class="library-grid">${subjects.filter(subject => matches.some(course => course.subject === subject.id)).map(subject => {
      const chapters = matches.filter(course => course.subject === subject.id)
      const worked = chapters.filter(course => isCourseWorked(state, course.id)).length
      return `<a class="panel subject-card" href="#cours/${subject.id}">${tile(subject.icon, subject.color)}<div><h2>${subject.name}</h2><p>${worked} / ${chapters.length} travaillés</p></div>${icon('chevron', 17)}${bar(worked / chapters.length, `Chapitres travaillés en ${subject.name}`)}</a>`
    }).join('')}</div>`
  }

  return `<p class="result-count" role="status">${countLabel(matches.length, 'chapitre')}</p>${matches.length ? `<div class="chapter-list">${matches.map(course => {
    const subject = subjectById(course.subject)
    const read = Boolean(state.reading[course.id]?.completedAt)
    return `<article class="panel chapter-row"><a class="chapter-open" href="#cours/${course.id}">${tile(read ? 'check' : subject.icon, read ? 'mint' : subject.color)}<span><small>${subject.name} · ${course.topic}</small><strong>${course.title}</strong><span class="chapter-summary">${course.intro}</span></span><span class="read-state">${read ? 'Relire' : 'Lire'} ${icon('chevron', 16)}</span></a>${workedButton(state, course)}</article>`
  }).join('')}</div>` : '<div class="panel empty-state"><h2>Aucun chapitre trouvé</h2><p>Essaie un autre mot-clé ou change de filtre.</p></div>'}`
}

export function libraryView(state, subjectId, query, filter) {
  const subject = subjectById(subjectId)
  const latest = latestCourse(state)
  const chapters = subject ? courses.filter(course => course.subject === subject.id) : courses
  const worked = chapters.filter(course => isCourseWorked(state, course.id)).length
  const filters = [['all', 'Tous'], ['worked', 'Travaillés'], ['unworked', 'Pas encore travaillés'], ['done', 'Déjà lus']]
  return `${subject ? '<a class="back-link" href="#cours">' + icon('back', 17) + ' Toutes les matières</a>' : ''}
    ${heading('PROGRAMME DE SECONDE', subject ? subject.name : 'Bibliothèque de cours', subject ? 'Coche les chapitres que tu as déjà vus en classe ou travaillés chez toi.' : 'Ouvre une matière et indique les chapitres que tu as travaillés pour personnaliser tes révisions.')}
    <section class="panel library-banner"><div class="library-progress">${tile('book', 'sky')}<div><strong>${worked} / ${chapters.length} chapitres travaillés</strong><small>Tes questions de révision partent de cette sélection.</small>${bar(worked / Math.max(1, chapters.length), 'Chapitres travaillés')}</div></div><div class="toolbar-actions">${subject ? (worked ? link(`Réviser cette matière ${icon('arrow', 17)}`, `flashcards/${subject.id}`, 'primary') : '') : latest ? link(`Reprendre ma lecture ${icon('arrow', 17)}`, `cours/${latest.id}`, 'primary') : ''}${!subject || subject.id === 'maths' ? link(`${icon('math', 17)} Exercices de maths`, 'exercices', 'secondary') : ''}</div></section>
    <div class="library-tools"><label class="field"><span>Rechercher un cours</span><span class="search-input">${icon('search', 19)}<input id="course-search" type="search" value="${escapeHtml(query)}" placeholder="Ex. vecteurs, biodiversité, poésie…" autocomplete="off"></span></label><div class="course-filters" id="course-filter" role="group" aria-label="Filtrer par avancement">${filters.map(([value, label]) => button(label, 'course-filter', 'filter-chip', `data-value="${value}" aria-pressed="${filter === value}"`)).join('')}</div></div>
    <section id="course-results" aria-label="Chapitres disponibles">${courseResults(state, subjectId, query, filter)}</section>`
}

export function readerView(state, course) {
  const subject = subjectById(course.subject)
  const chapterList = courses.filter(item => item.subject === course.subject)
  const previous = chapterList[course.number - 2]
  const next = chapterList[course.number]
  const read = Boolean(state.reading[course.id]?.completedAt)
  const retrySkill = courseExerciseSkills[course.id]
  const cardCount = reviewCards(state, { course: course.id, scope: 'all' }, 'practice').length
  return `<a class="back-link" href="#cours/${subject.id}">${icon('back', 17)} ${subject.name}</a>
    ${heading(`CHAPITRE ${course.number} / ${chapterList.length} · ${course.topic.toLocaleUpperCase('fr')}`, course.title, course.intro)}
    <div class="reader-worked">${workedButton(state, course)}<span>Le statut « Travaillé » ajoute ce chapitre à tes questions.</span></div>
    <div class="reader-layout"><article class="panel reading-panel">
      ${course.sections.map((section, index) => `<section class="lesson-section"><h2><span>${index + 1}</span>${section.heading}</h2><p>${escapeHtml(section.text)}</p></section>`).join('')}
      <section class="exercise-box"><h2>${icon('target', 20)} À toi de jouer</h2><p>${escapeHtml(course.exercise.question)}</p><details><summary>Voir la correction</summary><p>${escapeHtml(course.exercise.answer)}</p></details>${retrySkill ? link(`${icon('rotate', 17)} Essayer avec d’autres valeurs`, `exercices/${retrySkill}/variante`, 'secondary exercise-variant') : ''}</section>
      <div class="reader-actions">${read ? `<span class="read-confirm">${icon('check', 18)} Chapitre lu</span>${button('Marquer à relire', 'mark-course', 'secondary')}` : button(`${icon('check', 17)} Marquer comme lu`, 'mark-course')}</div>
      <nav class="chapter-pagination" aria-label="Navigation entre chapitres"><span>${previous ? link(`${icon('back', 17)} Chapitre précédent`, `cours/${previous.id}`, 'secondary') : ''}</span><span>${next ? link(`Chapitre suivant ${icon('arrow', 17)}`, `cours/${next.id}`, 'secondary') : link('Voir les matières', 'cours', 'secondary')}</span></nav>
    </article>
    <aside class="focus-aside"><section class="panel padded"><div class="panel-title">${tile('cards', 'purple')}<div><h2>Entraîne-toi</h2><p>${countLabel(cardCount, 'carte')} sur ce chapitre</p></div></div><div class="reader-links">${retrySkill ? link(`${icon('math', 17)} Faire les exercices du chapitre`, `exercices/${course.id}`, 'primary') : ''}${link(`${icon('cards', 17)} Réviser les cartes`, `flashcards/${course.id}`, 'secondary')}${link(`${icon('pen', 17)} Relever le défi Feynman`, `feynman/${course.id}`, 'secondary')}</div></section>
      <section class="panel padded"><div class="panel-title">${tile(subject.icon, subject.color)}<div><h2>${subject.name}</h2><p>Les chapitres de la matière</p></div></div><ol class="reader-index">${chapterList.map(item => `<li><a href="#cours/${item.id}" ${item.id === course.id ? 'aria-current="page"' : ''}><span>${item.number}. ${item.title}</span>${state.reading[item.id]?.completedAt ? icon('check', 14) : ''}</a></li>`).join('')}</ol></section></aside></div>`
}

function mathAnswerForm(problem, current) {
  const inputs = problem.options
    ? `<fieldset class="math-options"><legend>Choisis une réponse</legend>${problem.options.map((option, index) => `<label class="math-option"><input type="radio" name="choice" value="${index}" required><span>${escapeHtml(option.label)}</span></label>`).join('')}</fieldset>`
    : `<div class="math-fields">${problem.fields.map((field, index) => `<label class="field"><span>${escapeHtml(field.label)}</span><input name="value-${index}" type="text" maxlength="40" autocomplete="off" spellcheck="false" required></label>`).join('')}</div><p class="math-format">Tu peux entrer un entier, un décimal avec une virgule ou une fraction comme 3/4.</p>`
  return `<form id="math-form" class="math-answer" data-id="${current.skill}:${current.seed}">${inputs}<p id="math-input-error" class="math-input-error" role="alert" hidden>Entre un nombre ou une fraction valide dans chaque champ.</p><div class="toolbar-actions"><button type="submit" class="btn primary">${icon('check', 17)} Vérifier</button>${button(`${icon('spark', 17)} Je bloque`, 'math-stuck', 'secondary')}</div></form>`
}

function mathFeedback(problem, track, context, recovery, returnTo) {
  const { result } = track
  const correct = result.kind === 'correct'
  const title = correct ? result.recovered ? 'Compétence reprise !' : 'Bonne réponse !' : result.kind === 'stuck' ? 'Voici comment t’y prendre' : 'Reprenons la méthode'
  const nextText = recovery ? 'Essayer avec d’autres valeurs' : context.skill ? 'Faire une autre variante' : 'Exercice suivant'
  const primaryExit = context.skill && !recovery && (returnTo || `exercices/${context.course}`)
  return `<section class="math-feedback ${correct ? 'is-correct' : ''}" aria-labelledby="math-feedback-title">
    <h2 id="math-feedback-title" tabindex="-1">${icon(correct ? 'check' : 'spark', 20)} ${title}</h2>
    ${!correct && result.submitted.length ? `<p class="math-submitted">Ta réponse · ${escapeHtml(result.submitted.join(' · '))}</p>` : ''}
    ${result.feedback ? `<p class="math-diagnosis">${escapeHtml(result.feedback)}</p>` : ''}
    <p>${escapeHtml(problem.solution)}</p>
    ${recovery ? `<p class="math-recovery-text">${recovery === 1 ? 'Encore une variante réussie de suite pour valider la reprise.' : 'On garde cette méthode avec d’autres valeurs. Réussis deux variantes de suite pour valider la reprise.'}</p>` : ''}
    <div class="toolbar-actions">${primaryExit ? link(`${returnTo ? 'Reprendre les flashcards' : 'Explorer les autres compétences'} ${icon('arrow', 17)}`, primaryExit) : ''}${button(`${nextText} ${icon('arrow', 17)}`, 'math-next', primaryExit ? 'secondary' : 'primary')}</div>
  </section>`
}

export function mathView(state, context, returnTo) {
  const track = state.mathPractice.tracks[context.key]
  const course = courseById.get(context.course)
  const worked = context.key === 'worked'
  const selected = context.skill?.id ?? context.course
  const lead = course ? `Travaille ${context.skill ? 'cette compétence' : 'les compétences du chapitre'} avec des valeurs qui changent à chaque essai.` : worked ? 'Entraîne-toi sur les chapitres que tu as indiqués comme travaillés.' : 'Un mélange de compétences de Seconde. Quand une réponse coince, tu retravailles tout de suite la même méthode.'
  const controls = `<div class="math-controls"><label class="field"><span id="math-context-label">Ce que tu veux travailler</span><select id="math-context" aria-labelledby="math-context-label"><option value="">Mes chapitres travaillés</option><option value="tous" ${context.key === 'mix' ? 'selected' : ''}>Tous les chapitres</option>${context.skill ? `<option value="${context.skill.id}" selected>${context.skill.name}</option>` : ''}${courses.filter(item => item.subject === 'maths').map(item => `<option value="${item.id}" ${selected === item.id ? 'selected' : ''}>${item.title}${isCourseWorked(state, item.id) ? '' : ' · à découvrir'}</option>`).join('')}</select></label>${returnTo ? link(`${icon('back', 17)} Retour aux flashcards`, returnTo, 'secondary') : ''}</div>`
  const header = `${course ? `<a class="back-link" href="#cours/${course.id}">${icon('back', 17)} Relire ${course.title}</a>` : ''}${heading('MATHS · ENTRAÎNEMENT ADAPTATIF', context.skill?.name ?? course?.title ?? 'Exercices de maths', lead)}${controls}`
  if (!context.options.length) return `${header}<section class="panel empty-state">${tile('math', 'purple')}<h2>Quels chapitres de maths as-tu travaillés ?</h2><p>Indique-les dans la bibliothèque pour recevoir des exercices sur ces notions.</p>${link('Indiquer mes chapitres', 'cours/maths')}</section>`
  if (!track || !context.options.some(skill => skill.id === track.current.skill)) return `${header}<section class="panel empty-state" role="status"><h2>Préparation de l’exercice…</h2></section>`
  const problem = problemFor(track.current)
  const skill = skillById.get(track.current.skill)
  const recovery = state.mathPractice.skills[skill.id]?.recovery ?? 0
  const pending = mathSkills.filter(item => item.id !== skill.id && state.mathPractice.skills[item.id]?.recovery && (!worked || isCourseWorked(state, item.course)))
  const [statement, code] = problem.prompt.split('\n\n')
  return `${header}<div class="focus-layout">
    <section class="panel padded math-panel" aria-label="Exercice en cours">
      <div class="math-meta"><span class="subject-tag purple">${icon('math', 16)} ${skill.name}</span>${recovery ? `<span class="subject-tag mint">${icon('rotate', 15)} Reprise · ${2 - recovery}/2</span>` : ''}</div>
      <h2 id="math-question" tabindex="-1">${escapeHtml(statement)}</h2>${code ? `<pre class="math-code"><code>${escapeHtml(code)}</code></pre>` : ''}
      ${track.result ? mathFeedback(problem, track, context, recovery, returnTo) : `<details class="math-hint"><summary>Voir un indice</summary><p>${escapeHtml(problem.hint)}</p></details>${mathAnswerForm(problem, track.current)}`}
    </section>
    <aside class="focus-aside">
      <section class="panel padded"><div class="panel-title">${tile('target', 'mint')}<div><h2>Ta session</h2><p>Les résultats de cet entraînement</p></div></div><div class="math-session"><span><strong>${track.correct}/${track.answered}</strong> bonnes réponses</span><span><strong>${track.chain}</strong> de suite</span></div></section>
      <section class="panel padded"><div class="panel-title">${tile('book', 'sky')}<div><h2>Le cours associé</h2><p>${courseById.get(skill.course).title}</p></div></div>${link(`Relire le cours ${icon('arrow', 16)}`, `cours/${skill.course}`, 'secondary')}</section>
      ${pending.length ? `<section class="panel padded"><div class="panel-title">${tile('rotate', 'mint')}<div><h2>Reprises à terminer</h2><p>${countLabel(pending.length, 'compétence')}</p></div></div><ul class="math-pending">${pending.map(item => `<li><a class="back-link" href="#exercices/${item.id}">${escapeHtml(item.name)} ${icon('chevron', 14)}</a></li>`).join('')}</ul></section>` : ''}
      <section class="panel padded"><div class="panel-title">${tile('rotate', 'purple')}<div><h2>Rejoue autant que tu veux</h2><p>${mathSkills.length} types d’exercices sur les chapitres de maths.</p></div></div><p>Une difficulté lance une reprise immédiate. Chaque nouvelle variante change les valeurs et la correction s’adapte à ta réponse.</p></section>
    </aside>
  </div>`
}

export function formatClock(ms) {
  const seconds = Math.ceil(ms / 1000)
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

function floatingTimer(timer) {
  const isBreak = timer.phase === 'break'
  if (!isBreak && timer.status === 'ready') return ''
  const running = timer.status === 'running'
  const label = timer.status === 'paused' ? 'Minuteur suspendu' : isBreak ? (running ? 'Pause' : 'Pause prête') : 'Focus en cours'
  const actionLabel = running ? 'Mettre le minuteur en pause' : timer.status === 'paused' ? 'Reprendre le minuteur' : 'Démarrer la pause'
  return `<section class="focus-float${isBreak ? ' is-break' : ''}" aria-label="Minuteur flottant">
    <a href="#focus" class="focus-float-status" title="Ouvrir la session focus">${icon(isBreak ? 'coffee' : 'timer', 19)}<span><small>${label}</small><strong role="timer" data-live-timer>${formatClock(remainingTime(timer))}</strong></span></a>
    ${button(icon(running ? 'pause' : 'play', 18), running ? 'pause-timer' : 'start-timer', 'secondary icon-button', `aria-label="${actionLabel}" title="${actionLabel}"`)}
  </section>`
}

export function focusView(state, sound, choice) {
  const timer = state.timer
  const isBreak = timer.phase === 'break'
  const active = timer.status !== 'ready'
  const options = isBreak || (active && timer.activity) ? [] : focusActivities(state)
  const activity = isBreak ? null : focusActivity(state, choice, options)
  const controls = isBreak
    ? active ? button(`${icon('stop', 18)} Arrêter la pause`, 'stop-timer', 'secondary') : `${button(`${icon('play', 18)} Démarrer la pause`, 'start-timer')}${button('Passer la pause', 'skip-break', 'secondary')}`
    : active ? `${activity?.route ? button(`Ouvrir l’activité ${icon('arrow', 18)}`, 'open-focus-activity') : ''}${button(`${icon('stop', 18)} Arrêter la session`, 'stop-timer', 'secondary')}`
      : button(`${icon('play', 18)} Démarrer le focus`, 'start-timer')
  return `${heading('POMODORO', 'Session focus', 'Choisis une matière et commence tout de suite avec une activité.')}
    <div class="focus-layout">
      <section class="focus-card panel ${isBreak ? 'break-mode' : ''}" aria-label="Préparation du Pomodoro">
        <div class="phase-label">${icon(isBreak ? 'coffee' : 'timer', 17)} ${isBreak ? 'Pause · 5 min' : 'Focus · 25 min'}</div>
        ${isBreak ? `<div class="focus-proposal">${tile('coffee', 'mint')}<div><h2>${active ? 'Prends ton temps' : 'Tu as terminé ta session !'}</h2><p>Profites-en pour te lever ou boire un verre d’eau.</p></div></div>` : `
          <div class="focus-fields"><label class="field"><span id="timer-subject-label">Matière</span><select id="timer-subject" aria-labelledby="timer-subject-label" ${active ? 'disabled' : ''}>${subjectOptions(timer.subject)}</select></label>
            ${!active && options.length > 1 ? `<label class="field"><span id="timer-activity-label">Activité</span><select id="timer-activity" aria-labelledby="timer-activity-label">${options.map((item, index) => `<option value="${item.kind}" ${item.kind === activity?.kind ? 'selected' : ''}>${item.label}${index === 0 ? ' · proposée' : ''}</option>`).join('')}</select></label>` : ''}</div>
          ${activity ? `<div class="focus-proposal">${tile(activity.icon, 'purple')}<div><small>${active ? 'ACTIVITÉ DE TA SESSION' : 'TON POINT DE DÉPART'}</small><h2>${escapeHtml(activity.title)}</h2><p>${escapeHtml(activity.detail)}</p></div></div>` : '<p class="timer-hint">Sélectionne une matière pour voir une activité proposée.</p>'}`}
        <div class="timer-controls">${controls}</div>
        ${isBreak ? '' : `<p class="timer-hint">${icon('bolt', 16)} +50 XP quand tu termines la session.</p>`}
      </section>
      <div class="focus-aside">
        <section class="panel padded"><div class="panel-title">${tile('headphones', 'purple')}<div><h2>Ambiance sonore</h2><p>Crée ta bulle.</p></div></div>
          <div class="sound-grid">${sounds.map(([id, label, symbol]) => button(`${icon(symbol, 18)} ${label}`, 'sound', `sound-button ${sound === id ? 'selected' : ''}`, `data-value="${id}" aria-pressed="${sound === id}"`)).join('')}</div>
          <label class="field range-field"><span>Volume <output id="volume-value">${state.profile.volume} %</output></span><input id="volume" type="range" min="0" max="100" value="${state.profile.volume}"></label>
        </section>
        <section class="panel padded focus-tip"><div class="panel-title">${tile('target', 'mint')}<div><h2>Un seul objectif</h2><p>Décide de ce que tu veux finir avant de démarrer.</p></div></div><p>Par exemple, faire deux exercices de maths ou revoir les points importants d’un chapitre.</p></section>
      </div>
    </div>`
}

export function flashcardsView(state, study) {
  const cards = reviewCards(state, study)
  const availableById = new Map(cards.map(card => [card.id, card]))
  const queue = study.queue.map(id => availableById.get(id)).filter(Boolean)
  const card = queue[0]
  const total = study.reviewed + queue.length
  const subject = card && subjectById(card.subject)
  const course = courseById.get(study.course)
  const practice = study.mode === 'practice'
  const worked = study.scope !== 'all'
  const deck = reviewCards(state, study, 'practice')
  const nextDue = deck
    .map(item => state.schedule[item.id]?.due)
    .filter(date => date && date > dayKey()).sort()[0]
  const nextReview = !deck.length && worked ? 'Marque les chapitres déjà vus pour recevoir les questions qui leur correspondent.' : nextDue ? `Prochaine révision espacée le ${shortDate.format(new Date(`${nextDue}T12:00:00`))}. Tu peux continuer en entraînement libre.`
    : deck.length ? 'Tes cartes sont disponibles en entraînement libre. En maths, tu peux aussi essayer de nouvelles variantes.' : 'Choisis une matière de la bibliothèque pour démarrer.'
  const reviewed = state.reviews.filter(item => dayKey(item.at) === dayKey()).length
  const mastered = state.reviews.filter(item => item.grade === 'easy' && !item.practice).length
  const title = !deck.length && worked ? 'Qu’as-tu déjà travaillé ?' : study.started ? 'Série terminée !' : practice ? 'Prêt à t’entraîner ?' : cards.length ? 'Prêt à tester ta mémoire ?' : 'Tu es à jour !'
  const courseRoute = course ? `cours/${course.id}` : study.subject && study.subject !== 'autre' ? `cours/${study.subject}` : 'cours'
  const emptyAction = !deck.length && worked
    ? course ? button(`${icon('check', 17)} Marquer le chapitre comme travaillé`, 'mark-worked', 'primary', `data-value="${course.id}"`) : link('Indiquer mes chapitres', courseRoute)
    : link('Voir les cours', courseRoute, 'secondary')
  return `${heading('RAPPEL ACTIF', 'Flashcards', 'Cherche la réponse de mémoire, puis retourne la carte pour te corriger.')}
    ${course ? `<div class="deck-filter"><strong>${course.title}</strong><a href="#flashcards">Voir tous les chapitres ${icon('close', 14)}</a></div>` : ''}
    <details class="panel review-settings" ${card ? '' : 'open'}><summary>${icon('settings', 17)} Réglages de la révision ${icon('chevron', 16)}</summary>
    <div class="study-toolbar"><div class="study-filters"><label class="field"><span id="card-subject-label">Matière</span><select id="card-subject" aria-labelledby="card-subject-label">${subjectOptions(study.subject, true)}</select></label><label class="field"><span id="card-scope-label">Chapitres à réviser</span><select id="card-scope" aria-labelledby="card-scope-label"><option value="worked">Chapitres travaillés</option><option value="all" ${worked ? '' : 'selected'}>Toute la collection</option></select></label></div><div class="toolbar-actions">${availableCustomCards(state).length ? button(`${icon('cards', 17)} Mes cartes`, 'manage-cards', 'secondary') : ''}${link(`${icon('book', 17)} ${course ? 'Relire le chapitre' : 'Parcourir les cours'}`, courseRoute, 'secondary')}${!study.subject || study.subject === 'maths' ? link(`${icon('math', 17)} Exercices de maths`, course ? `exercices/${course.id}` : 'exercices', 'secondary') : ''}</div></div>
    <div class="review-modes" aria-label="Mode de révision">${button(`${icon('calendar', 16)} À revoir`, 'review-mode', 'secondary', `data-value="due" aria-pressed="${!practice}"`)}${button(`${icon('rotate', 16)} Entraînement libre`, 'review-mode', 'secondary', `data-value="practice" aria-pressed="${practice}"`)}</div>
    </details>
    <div class="focus-layout">
      <section class="panel study-panel" aria-label="Révision des cartes">
        ${card ? `<div class="deck-header"><span class="subject-tag ${subject.color}">${icon(subject.icon, 15)} ${subject.name}</span><span>Carte ${study.reviewed + 1} sur ${total}</span></div>
        ${bar(study.reviewed / total, 'Progression de la série')}
        <button class="flashcard ${study.flipped ? 'revealed' : ''}" type="button" data-action="flip-card" aria-pressed="${study.flipped}"><span class="card-face">${study.flipped ? 'VERSO · RÉPONSE' : 'RECTO · QUESTION'}</span><span class="flashcard-text">${escapeHtml(study.flipped ? card.answer : card.question)}</span><span class="flip-hint">${icon('rotate', 16)} ${study.flipped ? 'Revoir la question' : 'Retourner la carte'}</span></button>
        ${study.flipped ? `<p class="rating-hint">Comment s’est passé le rappel ?</p><div class="ratings">${button(`${icon('close', 17)} Difficile`, 'grade-card', 'rating hard', 'data-value="hard"')}${button(`${icon('minus', 17)} Moyen`, 'grade-card', 'rating medium', 'data-value="medium"')}${button(`${icon('check', 17)} Facile`, 'grade-card', 'rating easy', 'data-value="easy"')}</div>${skillForCard(card) ? '<p class="rating-hint">« Difficile » et « Moyen » ouvrent tout de suite un exercice du même type.</p>' : ''}` : '<p class="rating-hint">Essaie de formuler la réponse avant de la lire.</p>'}`
        : `<div class="empty-state">${tile(study.started ? 'check' : 'cards', 'purple')}<h2>${title}</h2><p>${cards.length ? `${countLabel(cards.length, 'carte')} ${practice ? 'dans la collection' : 'à revoir'}. Lance une série de ${Math.min(10, cards.length)}.` : nextReview}</p>${cards.length ? button(`${icon('play', 17)} ${study.started ? 'Relancer une série' : 'Commencer la révision'}`, 'start-review') : deck.length && !practice ? button(`${icon('rotate', 17)} Continuer en entraînement libre`, 'review-mode', 'primary', 'data-value="practice"') : emptyAction}</div>`}
      </section>
      <div class="focus-aside">
        <section class="panel padded"><div class="panel-title">${tile('bolt', 'purple')}<div><h2>Bonus mémoire</h2><p>+20 XP toutes les 10 cartes faciles.</p></div></div>${bar(mastered % 10 / 10, 'Bonus mémoire')}<div class="quest-caption"><span>${mastered % 10} / 10</span><span>${countLabel(reviewed, 'carte révisée', 'cartes révisées')} aujourd’hui</span></div></section>
        <section class="panel padded"><div class="panel-title">${tile('cards', 'mint')}<div><h2>Ta collection</h2><p>${countLabel(deck.length, 'carte')} dans cette sélection</p></div></div><p>${practice ? 'Rejoue les cartes quand tu veux. Le bonus mémoire se gagne en révision espacée.' : 'Un rappel facile réussi augmente l’intervalle, jusqu’à 16 jours. En maths, une difficulté déclenche d’abord un exercice avec de nouvelles valeurs.'}</p></section>
        ${card?.course && !course ? `<section class="panel padded"><div class="panel-title">${tile('book', 'sky')}<div><h2>Le cours de cette carte</h2><p>${courseById.get(card.course).title}</p></div></div>${link(`Ouvrir le cours ${icon('arrow', 16)}`, `cours/${card.course}`, 'secondary')}</section>` : ''}
      </div>
    </div>`
}

export function suggestedChallenge(state, currentId = '') {
  const answered = new Set(state.notes.map(item => item.course))
  const latest = latestCourse(state)
  if (!currentId && latest && isCourseWorked(state, latest.id) && !answered.has(latest.id)) return latest
  const first = currentId ? courses.findIndex(course => course.id === currentId) + 1 : 0
  const ordered = [...courses.slice(first), ...courses.slice(0, first)].filter(course => course.id !== currentId && isCourseWorked(state, course.id))
  return ordered.find(course => !answered.has(course.id)) ?? ordered[0]
}

export function feynmanView(state, courseId, selectedId) {
  const notes = state.notes.filter(item => hasSubject(item.subject)).sort((first, second) => second.updatedAt - first.updatedAt)
  const legacyNote = notes.find(item => item.id === selectedId && !item.course)
  const course = legacyNote ? null : courseById.get(courseId) ?? suggestedChallenge(state)
  const note = legacyNote ?? (course && notes.find(item => item.course === course.id))
  const suggested = suggestedChallenge(state, course?.id)
  return `${heading('MÉTHODE FEYNMAN', 'Carnet Feynman', 'Relève un défi guidé et explique la notion avec des mots simples, comme à quelqu’un de 10 ans.')}
    <div class="focus-layout">
      ${course || note ? `<section class="panel padded"><div class="panel-title">${tile('pen', 'mint')}<div><h2>${escapeHtml(course?.title ?? note.title)}</h2><p>${subjectById(course?.subject ?? note.subject).name} · ${course ? 'Défi guidé' : 'Ancienne explication'}</p></div></div>
        ${course ? `<div class="guide-prompt"><strong>${escapeHtml(course.guide.prompt)}</strong><details><summary>Voir un indice</summary><p>${escapeHtml(course.guide.hint)}</p></details></div>` : ''}
        <form id="note-form" class="stack-form" data-id="${note?.id ?? ''}" data-course="${course?.id ?? ''}">
          <label class="field"><span id="note-body-label">${course ? '1. Ton explication' : 'Ton explication'}</span><textarea name="body" aria-labelledby="note-body-label" rows="5" maxlength="5000" placeholder="Explique l’idée en deux ou trois phrases avec tes mots…" required>${escapeHtml(note?.body)}</textarea></label>
          ${course ? `<label class="field"><span id="note-example-label">2. Ton exemple ou ta comparaison</span><textarea name="example" aria-labelledby="note-example-label" rows="2" maxlength="1000" placeholder="Imagine une situation ou un exemple qui rend l’idée concrète…" required>${escapeHtml(note?.example)}</textarea></label>` : ''}
          <label class="field"><span id="note-gap-label">${course ? '3. Le point à retravailler' : 'Un point à éclaircir'} <small>(facultatif)</small></span><textarea name="gap" aria-labelledby="note-gap-label" rows="2" maxlength="800" placeholder="Quelle partie reste difficile à expliquer ?">${escapeHtml(note?.gap)}</textarea></label>
          <div class="toolbar-actions"><button class="btn primary" type="submit">${icon('check', 17)} Enregistrer</button>${note ? button(icon('trash', 18), 'delete-note', 'secondary icon-button', `data-value="${note.id}" aria-label="Supprimer cette note"`) : ''}</div>
        </form>
        ${course && note ? `<details class="guide-model"><summary>Comparer avec une explication possible</summary><p>${escapeHtml(course.guide.model)}</p><p>Vérifie que ton exemple aide à comprendre, puis reprends ta réponse si nécessaire.</p></details>` : ''}
      </section>` : `<section class="panel empty-state">${tile('pen', 'mint')}<h2>Choisis les notions à réviser</h2><p>Indique les chapitres travaillés pour recevoir un défi adapté.</p>${link('Indiquer mes chapitres', 'cours')}</section>`}
      <div class="focus-aside">
        <section class="panel padded"><div class="panel-title">${tile('spark', 'mint')}<div><h2>Choisir un défi</h2><p>Une notion proposée dans chaque chapitre</p></div></div>
          <label class="field"><span id="challenge-label">Notion à expliquer</span><select id="challenge-course" aria-labelledby="challenge-label"><option value="" ${course ? '' : 'selected'} disabled>Choisir un chapitre</option>${subjects.filter(subject => courses.some(item => item.subject === subject.id)).map(subject => `<optgroup label="${subject.name}">${courses.filter(item => item.subject === subject.id).map(item => `<option value="${item.id}" ${course?.id === item.id ? 'selected' : ''}>${item.title}${isCourseWorked(state, item.id) ? '' : ' · à découvrir'}</option>`).join('')}</optgroup>`).join('')}</select></label>
          <div class="reader-links">${suggested ? link(`Autre défi ${icon('arrow', 17)}`, `feynman/${suggested.id}`, 'secondary') : ''}${course ? link(`${icon('book', 17)} Relire le cours`, `cours/${course.id}`, 'secondary') : ''}</div>
        </section>
        <section class="panel padded"><div class="panel-title">${tile('book', 'purple')}<div><h2>Mes notes</h2><p>${countLabel(notes.length, 'explication')}</p></div></div>
          ${notes.length ? `<ul class="item-list">${notes.map(item => `<li>${button(`<span><strong>${escapeHtml(item.title)}</strong><small>${subjectById(item.subject)?.name} · ${shortDate.format(item.updatedAt)}</small></span>${icon('chevron', 17)}`, 'open-note', 'list-button', `data-value="${item.id}" aria-pressed="${item.id === note?.id}"`)}</li>`).join('')}</ul>` : '<p>Tes explications enregistrées apparaîtront ici.</p>'}
        </section>
      </div>
    </div>`
}

export function progressView(state) {
  const stats = studyStats(state)
  const level = levelInfo(stats.xp)
  const week = weekActivity(state)
  const ceiling = Math.max(25, ...week.map(day => day.minutes))
  const bySubject = subjects.map(subject => {
    const sessions = state.sessions.filter(item => item.subject === subject.id)
    const reviews = state.reviews.filter(item => item.subject === subject.id)
    const games = Object.values(state.arcade.days).map(day => day.subjects[subject.id]).filter(Boolean)
    return {
      ...subject, minutes: sessions.length * 25, reviews: reviews.length,
      games: games.reduce((sum, item) => sum + item.rounds, 0),
      xp: [...sessions, ...reviews, ...games].reduce((sum, item) => sum + item.xp, 0),
    }
  }).filter(item => item.minutes || item.reviews || item.games).sort((first, second) => second.xp - first.xp)
  const activity = [
    ...state.sessions.map(item => ({ ...item, icon: 'timer', title: 'Session focus', detail: `${item.minutes} min` })),
    ...state.reviews.map(item => ({ ...item, icon: 'cards', title: 'Carte révisée', detail: { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' }[item.grade] })),
    ...state.notes.map(item => ({ ...item, icon: 'pen', title: 'Explication Feynman', detail: item.title, at: item.createdAt, xp: 0 })),
    ...state.arcade.recent.filter(item => item.correct).map(item => ({
      ...item, icon: 'arcade', title: arcadeModes[item.mode].name, detail: `${item.correct} / ${item.total} ${item.mode === 'memory' ? 'paires' : 'bonnes réponses'}`,
    })),
  ].filter(item => !item.subject || hasSubject(item.subject)).sort((first, second) => second.at - first.at).slice(0, 8)
  return `${heading('STATISTIQUES', 'Ta progression', 'Retrouve le temps investi et les récompenses gagnées.')}
    <section class="panel padded progress-level"><div class="panel-title">${tile('award', 'purple')}<div><h2>Niveau ${level.current.number} · ${level.current.title}</h2><p>${level.next ? `${level.next.xp - stats.xp} XP avant le niveau ${level.next.title}` : 'Tu as atteint le niveau Légende.'}</p></div></div>${bar(level.progress, 'Progression du niveau')}<div class="quest-caption"><span>${stats.xp} XP${level.next ? ` / ${level.next.xp} XP` : ''}</span><a href="#pass">Voir le Pass Focus ${icon('arrow', 15)}</a></div></section>
    <div class="progress-grid">
      <section class="panel padded"><div class="panel-title">${tile('chart', 'sky')}<div><h2>Les 7 derniers jours</h2><p>Minutes passées en focus</p></div></div>
        <ul class="week-chart">${week.map(day => `<li class="${dayKey(day.date) === dayKey() ? 'current' : ''}" aria-label="${weekday.format(day.date)}, ${day.minutes} minutes"><strong>${day.minutes}</strong><span class="chart-slot"><span style="height:${day.minutes / ceiling * 100}%"></span></span><small>${dayLabel.format(day.date)}</small></li>`).join('')}</ul>
      </section>
      <section class="panel padded"><div class="panel-title">${tile('book', 'mint')}<div><h2>Par matière</h2><p>Ton travail et ton XP</p></div></div>
        ${bySubject.length ? `<ul class="item-list">${bySubject.map(item => `<li class="activity-row">${tile(item.icon, item.color)}<span><strong>${item.name}</strong><small>${timeLabel(item.minutes)} · ${countLabel(item.reviews, 'carte')}${item.games ? ` · ${countLabel(item.games, 'partie')}` : ''}</small></span><b>${item.xp} XP</b></li>`).join('')}</ul>` : '<p>Termine une session focus, révise une carte ou joue dans l’Arcade pour voir apparaître une matière.</p>'}
      </section>
    </div>
    <section class="panel padded recent"><div class="panel-title">${tile('clock', 'purple')}<div><h2>Activité récente</h2><p>Tes dernières sessions, cartes, explications et parties</p></div></div>
      ${activity.length ? `<ul class="item-list">${activity.map(item => `<li class="activity-row">${tile(item.icon, subjectById(item.subject)?.color ?? 'purple')}<span><strong>${item.title}</strong><small>${subjectById(item.subject)?.name ?? 'Toutes les matières'} · ${escapeHtml(item.detail)} · ${shortDate.format(item.at)}</small></span>${item.xp ? `<b>+${item.xp} XP</b>` : ''}</li>`).join('')}</ul>` : '<p>Ton historique se remplira au fil de tes révisions.</p>'}
    </section>`
}

export function avatarArt(item, size) {
  if (glyphs[item.id]) return icon(item.id, size)
  return `<span class="avatar-emoji" style="--emoji-size:${size}px" aria-hidden="true">${item.visual}</span>`
}

function cosmeticArt(item) {
  const { type, visual } = item
  if (type === 'theme') return themePreview(item, 'cosmetic-art')
  const art = { frame: 'target', banner: 'grid', trail: 'flight' }
  const color = visual.startsWith('#') ? visual : 'var(--accent)'
  const mark = type === 'avatar' ? avatarArt(item, 23) : art[type] ? icon(art[type], 22) : visual
  return `<span class="cosmetic-art" data-kind="${type}" style="--reward-color:${color}" aria-hidden="true">${mark}</span>`
}

function themePreview(item, variant = '') {
  return `<span class="theme-preview ${variant}" data-palette="${item.id}" aria-hidden="true">
    <span class="theme-preview-nav"></span>
    <span class="theme-preview-main"><i></i><i></i><i></i></span>
  </span>`
}

function rewardChoice(item, state, xp) {
  const locked = xp < item.xp
  const active = state.profile[item.type] === item.id
  const status = locked ? `Niv. ${item.level}` : active ? 'Équipé' : 'Équiper'
  const content = `${cosmeticArt(item)}<span class="cosmetic-copy"><small>${cosmeticTypes[item.type]}</small><strong>${item.label}</strong><span>${status}</span></span>${icon(locked ? 'lock' : active ? 'check' : 'plus', 15)}`
  return button(content, 'reward', 'cosmetic-choice', `data-type="${item.type}" data-value="${item.id}" aria-pressed="${active}" ${locked ? 'disabled' : ''}`)
}

export function passView(state) {
  const { xp } = studyStats(state)
  const { current, next, progress } = levelInfo(xp)
  const owned = cosmetics.filter(item => item.xp <= xp).length
  const acts = [
    ['Décollage', 'sky'], ['Vitesse de croisière', 'mint'], ['En orbite', 'amber'], ['Au-delà des étoiles', 'purple'],
  ]
  return `${heading('RÉCOMPENSES DE RÉVISION', 'Pass Focus', 'Gagne de l’XP en révisant, franchis les paliers et équipe tes récompenses.')}
    <section class="pass-hero panel">
      <div class="pass-hero-copy"><div class="pass-chip">${icon('award', 16)} NIVEAU ${current.number} / ${levels.length}</div>
        <h2>${current.title}</h2><p>${next ? `Plus que ${number.format(next.xp - xp)} XP avant le palier ${next.number} · ${next.title}.` : 'Tu as débloqué toutes les récompenses du Pass Focus.'}</p>
        ${bar(progress, 'Progression vers le prochain palier')}
        <div class="pass-meter-caption"><span>${number.format(xp)} XP au total</span><span>${next ? `${number.format(next.xp)} XP pour le prochain palier` : 'Palier final atteint'}</span></div>
        <div class="toolbar-actions">${button(`Voir ${next ? 'le prochain palier' : 'le dernier palier'} ${icon('arrow', 17)}`, 'jump-to-tier', 'primary', `data-value="${(next ?? current).number}"`)}${link('Voir les thèmes', 'pass/themes', 'secondary')}${link('Ma collection', 'profil', 'secondary')}</div>
      </div>
      <div class="pass-hero-loot"><span class="pass-loot-label">${next ? 'PROCHAIN DÉBLOCAGE' : 'DERNIER PALIER'}</span><div class="pass-loot-art">${(next ?? current).rewards.map(cosmeticArt).join('')}</div><strong>${(next ?? current).rewards.map(item => item.label).join(' + ')}</strong><small>${owned} / ${cosmetics.length} cosmétiques débloqués</small></div>
    </section>
    ${acts.map(([name, color], index) => `<section class="pass-act" aria-labelledby="act-${index}">
      <div class="pass-act-heading">${tile('spark', color)}<div><span class="section-kicker">ACTE 0${index + 1}</span><h2 id="act-${index}">${name}</h2></div></div>
      <ol class="pass-track" start="${index * 5 + 1}">${levels.slice(index * 5, index * 5 + 5).map(level => {
        const reached = xp >= level.xp
        const status = level === current ? 'Ton niveau' : reached ? 'Débloqué' : level === next ? 'Prochain palier' : 'Verrouillé'
        const rewards = `<div class="tier-rewards">${level.rewards.map(item => rewardChoice(item, state, xp)).join('')}</div>`
        return `<li class="pass-tier panel${level === current ? ' current' : ''}${level === next ? ' upcoming' : ''}" id="pass-tier-${level.number}" tabindex="-1">
          <div class="tier-heading"><span class="tier-number">${String(level.number).padStart(2, '0')}</span><div><h3>${level.title}</h3><span>${number.format(level.xp)} XP · ${status}</span></div></div>
          ${level.number === 1 ? `<details class="tier-starter"><summary>${level.rewards.length} cosmétiques de départ</summary>${rewards}</details>` : rewards}</li>`
      }).join('')}</ol></section>`).join('')}
    <div class="toolbar-actions pass-footer">${link(`${icon('arcade', 17)} Jouer dans l’Arcade`, 'arcade', 'primary')}${link('Voir mes statistiques', 'progression', 'secondary')}</div>`
}

export function themeGalleryView(state) {
  const { xp } = studyStats(state)
  const themes = cosmetics.filter(item => item.type === 'theme')
  return `<a class="back-link" href="#pass">${icon('back', 17)} Retour au Pass Focus</a>
    ${heading('PASS FOCUS', 'Les thèmes du site', 'Choisis une palette pour l’accueil, les cours, le vestiaire et l’Arcade.')}
    <div class="theme-gallery">${themes.map(item => {
      const locked = xp < item.xp
      const active = state.profile.theme === item.id
      const status = locked ? 'Verrouillé' : active ? 'Équipé' : 'Équiper'
      const mark = locked ? icon('lock', 16) : active ? icon('check', 16) : ''
      return `<article class="theme-card panel">
      ${themePreview(item)}<div class="theme-card-content"><div><h2>${item.label}</h2><p>Palier ${item.level} · ${number.format(item.xp)} XP</p></div>
        ${button(`${mark} ${status}`, 'reward', 'secondary', `data-type="theme" data-value="${item.id}" aria-label="${status} · ${item.label}" aria-pressed="${active}" ${locked ? 'disabled' : ''}`)}
      </div></article>`
    }).join('')}</div>`
}

export function accountPanel({ account, status }) {
  const messages = {
    pending: 'Synchronisation en cours…',
    saved: 'Progression sauvegardée en ligne.',
    offline: 'Synchronisation indisponible. Tes changements restent sur cet appareil en attendant.',
    reconnect: 'Reconnecte-toi pour retrouver la synchronisation.',
    conflict: 'Cet appareil et ton compte ont chacun une version différente. Choisis celle que tu veux garder.',
    invalid: 'La synchronisation a été refusée. Ta progression reste sur cet appareil.',
  }
  return `<section id="account-panel" class="panel padded account-panel">
    <div class="panel-title">${tile('lock', 'mint')}<div><h2>${account ? `Compte ${escapeHtml(account)}` : 'Mon compte'}</h2>
    <p role="status">${account ? messages[status] : 'Sauvegarde ta progression et retrouve-la sur un autre appareil.'}</p></div></div>
    <div class="toolbar-actions">${!account
      ? `${button('Créer un compte', 'account-form', 'primary', 'data-value="register"')}${button('Se connecter', 'account-form', 'secondary', 'data-value="login"')}`
      : status === 'conflict'
        ? `${button('Garder la version en ligne', 'account-resolve', 'secondary', 'data-value="remote"')}${button('Garder cet appareil', 'account-resolve', 'secondary', 'data-value="local"')}`
        : `${status === 'reconnect' ? button('Se reconnecter', 'account-form', 'primary', 'data-value="login"') : button('Synchroniser maintenant', 'account-sync', 'secondary')}${button('Se déconnecter', 'account-logout', 'secondary')}`}</div>
  </section>`
}

export function accountForm(registration, account) {
  return `<form id="account-form" class="stack-form" data-action-type="${registration ? 'register' : 'login'}">
    ${registration ? '<p>La progression de ce navigateur sera copiée dans ton nouveau compte.</p>' : ''}
    <label class="field"><span>Pseudo du compte</span><input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" minlength="3" maxlength="24" required value="${escapeHtml(account ?? '')}" ${account ? 'readonly' : ''}>
      ${registration ? '<small>3 à 24 caractères. Lettres sans accents, chiffres, points, tirets ou traits bas.</small>' : ''}</label>
    <label class="field"><span>Mot de passe</span><input name="password" type="password" autocomplete="${registration ? 'new-password' : 'current-password'}" minlength="12" maxlength="128" required>
      ${registration ? '<small>12 caractères minimum. Garde-le dans ton gestionnaire de mots de passe.</small>' : ''}</label>
    <p class="account-error" role="alert"></p>
    <button type="submit" class="btn primary">${registration ? 'Créer mon compte' : 'Me connecter'}</button>
  </form>`
}

export function profileView(state, account) {
  const { xp } = studyStats(state)
  const name = escapeHtml(state.profile.name || 'FocusBro')
  const avatar = equippedCosmetic(state.profile, 'avatar')
  const frame = equippedCosmetic(state.profile, 'frame')
  const banner = equippedCosmetic(state.profile, 'banner')
  const title = equippedCosmetic(state.profile, 'title')
  const trail = equippedCosmetic(state.profile, 'trail')
  const unlocked = cosmetics.filter(item => item.xp <= xp)
  const categories = { theme: 'Thèmes', avatar: 'Avatars', frame: 'Cadres', banner: 'Bannières', trail: 'Traînées', title: 'Titres' }
  return `${heading('PERSONNALISATION', 'Ton vestiaire', 'Mélange les cosmétiques débloqués avec le Pass Focus.')}
    ${accountPanel(account)}
    <div class="progress-grid profile-overview">
      <section class="profile-banner panel" data-design="${banner.id}" style="--banner-color:${banner.visual}" aria-label="Aperçu du profil">
        <div class="profile-showcase"><span class="profile-frame" data-frame="${frame.id}" style="--frame-color:${frame.visual}">${avatarArt(avatar, 39)}</span><div><h2>${name}</h2><p>${title.visual} ${title.label}</p></div></div>
        <div class="profile-flight-preview" style="--trail-color:${trail.visual}">${icon('flight', 23)} <span>${trail.label} en vol</span></div>
      </section>
      <section class="panel padded"><div class="panel-title">${tile('settings', 'purple')}<div><h2>Préférences</h2><p>${account.account ? 'Enregistrées dans ton compte.' : 'Enregistrées dans ce navigateur.'}</p></div></div><form id="profile-form" class="stack-form"><label class="field"><span>Prénom ou pseudo</span><input name="name" placeholder="FocusBro" maxlength="24" value="${escapeHtml(state.profile.name)}"></label><label class="toggle-field"><input type="checkbox" name="chime" ${state.profile.chime ? 'checked' : ''}> Jouer un son à la fin d’une session</label><button type="submit" class="btn primary">${icon('check', 17)} Enregistrer</button></form></section>
    </div>
    <div class="collection-heading"><div><h2>Ma collection</h2><p>${unlocked.length} / ${cosmetics.length} cosmétiques débloqués</p></div>${link(`${icon('gift', 17)} Voir le Pass Focus`, 'pass', 'secondary')}</div>
    <div class="collection-grid">${Object.entries(categories).map(([type, label]) => {
      const items = unlocked.filter(item => item.type === type)
      return `<section class="panel padded"><h3>${label} <span>${items.length}</span></h3><div class="tier-rewards">${items.map(item => rewardChoice(item, state, xp)).join('')}</div></section>`
    }).join('')}</div>`
}

export function cardForm(card) {
  return `<form id="card-form" class="stack-form" data-id="${card.id}">
    <label class="field"><span id="custom-subject-label">Matière</span><select name="subject" aria-labelledby="custom-subject-label" required>${subjectOptions(card.subject)}</select></label>
    <label class="field"><span>Question</span><textarea name="question" rows="2" maxlength="240" required>${escapeHtml(card.question)}</textarea></label>
    <label class="field"><span>Réponse</span><textarea name="answer" rows="3" maxlength="900" required>${escapeHtml(card.answer)}</textarea></label>
    <div class="toolbar-actions"><button type="submit" class="btn primary">${icon('check', 17)} Enregistrer</button>${button(`${icon('trash', 17)} Supprimer`, 'delete-card', 'secondary danger', `data-value="${card.id}"`)}</div>
  </form>`
}

export function customCardList(state) {
  return `<ul class="item-list">${availableCustomCards(state).map(card => `<li>${button(`<span><strong>${escapeHtml(card.question)}</strong><small>${subjectById(card.subject).name}</small></span>${icon('chevron', 17)}`, 'edit-card', 'list-button', `data-value="${card.id}"`)}</li>`).join('')}</ul>`
}
