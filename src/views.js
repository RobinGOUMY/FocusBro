import { subjects } from './content.js'
import { courseById, courses } from './courses.js'
import { courseExerciseSkills, mathSkills, problemFor, skillById, skillForCard } from './math-practice.js'
import { dailyGoal, dayKey, durations, dueCards, levelInfo, remainingTime, reviewCards, studyStats, weekActivity } from './study.js'

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
  { id: 'progression', name: 'Progression', icon: 'chart' },
  { id: 'profil', name: 'Personnalisation', icon: 'settings' },
]

export const sounds = [
  ['off', 'Silence', 'mute'], ['rain', 'Pluie', 'rain'], ['lofi', 'Lo-fi', 'music'], ['white', 'Bruit blanc', 'waves'],
]
const themes = [['violet', 'Violet', 0], ['mint', 'Menthe', 1], ['sky', 'Bleu électrique', 2]]
const avatars = [['bolt', 'Éclair', 0], ['planet', 'Orbite', 1], ['ghost', 'Fantôme', 2]]

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

const tile = (name, color) => `<span class="icon-tile ${color}">${icon(name)}</span>`
const button = (content, action, variant = 'primary', attributes = '') => `<button type="button" class="btn ${variant}" data-action="${action}" ${attributes}>${content}</button>`
const link = (content, page, variant = 'primary') => `<a class="btn ${variant}" href="#${page}">${content}</a>`

function bar(progress, label) {
  return `<div class="meter" role="progressbar" aria-label="${label}" aria-valuenow="${Math.round(progress * 100)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress * 100}%"></span></div>`
}

function heading(kicker, title, description) {
  return `<div class="page-heading"><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${description}</p></div>`
}

function navItem(page, active, mobile = false) {
  return `<a class="nav-link${page.id === active ? ' active' : ''}" href="#${page.id}" ${page.id === active ? 'aria-current="page"' : ''}>${icon(page.icon, mobile ? 20 : 19)}<span>${mobile ? page.mobile : page.name}</span></a>`
}

export function layout(state, page, content) {
  const stats = studyStats(state)
  const level = levelInfo(stats.xp)
  const name = escapeHtml(state.profile.name || 'FocusBro')
  return `<aside class="sidebar">
    <a class="brand" href="#accueil"><img src="./assets/bolt.svg" width="38" height="38" alt=""><span>Focus<span>Bro</span><small>TON QG DE RÉVISION</small></span></a>
    <div class="nav-caption">ESPACE DE TRAVAIL</div>
    <nav class="main-nav" aria-label="Navigation principale">${pages.slice(0, -1).map(item => navItem(item, page)).join('')}</nav>
    <div class="sidebar-bottom">
      <a class="sidebar-level" href="#progression">
        <div class="level-heading">${tile('award', 'purple')}<div><b>${level.current.title}</b><small>Niveau ${level.index + 1}</small></div>${icon('chevron', 16)}</div>
        ${bar(level.progress, 'Progression du niveau')}
        <div class="level-caption">${level.next ? `${number.format(stats.xp)} / ${level.next.xp} XP` : 'Niveau max'}<span>${Math.round(level.progress * 100)} %</span></div>
      </a>
      ${navItem(pages.at(-1), page)}
    </div>
  </aside>
  <div class="workspace">
    <header class="topbar">
      <a class="brand mobile-brand" href="#accueil"><img src="./assets/bolt.svg" width="34" height="34" alt=""><span>Focus<span>Bro</span></span></a>
      <span class="today-date">${icon('calendar', 16)} <span>${weekday.format(new Date())}</span></span>
      <div class="top-actions">
        ${state.timer.status !== 'ready' && page !== 'focus' ? `<a href="#focus" class="timer-pill" aria-label="Revenir au minuteur">${icon('timer', 16)} <span data-live-timer>${formatClock(remainingTime(state.timer))}</span></a>` : ''}
        <a href="#progression" class="xp-pill" title="Voir ma progression">${icon('bolt', 16)} <strong>${number.format(stats.xp)} XP</strong></a>
        <a class="avatar" href="#profil" aria-label="Profil de ${name}" title="Profil de ${name}">${icon(state.profile.avatar, 19)}</a>
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
  return `<a href="#${page}" class="module-card panel">${tile(symbol, color)}<span class="module-arrow">${icon('arrow', 18)}</span><h3>${title}</h3><p>${detail}</p><span class="module-status ${color}">${status}</span></a>`
}

export function dashboard(state) {
  const stats = studyStats(state)
  const due = dueCards(state).length
  const latest = latestCourse(state)
  const goal = Math.min(1, stats.todayMinutes / dailyGoal)
  const greeting = state.profile.name ? `Salut, ${escapeHtml(state.profile.name)} !` : 'Ton QG de révision'
  return `${heading('TABLEAU DE BORD', greeting, 'Un petit effort aujourd’hui, un grand pas pour demain.')}
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-art" aria-hidden="true"></div>
      <div class="hero-copy">
        <span class="hero-tag">${icon('spark', 14)} MODE FOCUS</span>
        <h2 id="hero-title">Prêt à passer au<br><em>niveau supérieur&nbsp;?</em></h2>
        <p>Une matière, 25 minutes et un objectif. À toi de jouer.</p>
        <div class="hero-actions">${link(`${icon('play', 18)} ${state.timer.status === 'ready' ? 'Lancer une session' : 'Revenir à la session'} ${icon('arrow', 18)}`, 'focus', 'primary hero-button')}${link(`${icon('book', 17)} Lire un cours`, 'cours', 'hero-course-link')}</div>
      </div>
    </section>
    <section class="stats-grid" aria-label="Mes statistiques">
      ${statCard('fire', 'amber', 'Série en cours', countLabel(stats.streak, 'jour'), stats.streak ? 'La régularité paie' : 'Ta série commence aujourd’hui')}
      ${statCard('clock', 'sky', 'Temps concentré', timeLabel(stats.minutes), 'Toutes matières confondues')}
      ${statCard('bolt', 'purple', 'XP total', `${number.format(stats.xp)} XP`, 'Gagnés en révisant')}
    </section>
    <div class="dashboard-bottom">
      <section aria-labelledby="modules-title">
        <div class="section-heading"><h2 id="modules-title">Tes modules</h2><p>Change de méthode selon ce que tu veux travailler.</p></div>
        <div class="module-grid">
          ${moduleCard(latest ? `cours/${latest.id}` : 'cours', 'book', 'sky', latest ? 'Reprendre un cours' : 'Bibliothèque de cours', latest ? `Reprends ta lecture de « ${latest.title} ». ` : 'Lis les cours de l’année à ton rythme, avec des exemples et des exercices corrigés.', `${courses.length} chapitres`)}
          ${moduleCard('flashcards', 'cards', 'purple', 'Flashcards', 'Teste ta mémoire et revois les notions au bon moment.', due ? `${countLabel(due, 'carte')} à réviser` : 'À jour')}
          ${moduleCard('feynman', 'pen', 'mint', 'Carnet Feynman', 'Choisis un défi guidé et explique la notion avec tes mots.', state.notes.length ? countLabel(state.notes.length, 'note') : 'Défis guidés')}
        </div>
      </section>
      <section aria-labelledby="mission-title">
        <div class="section-heading"><h2 id="mission-title">Objectif du jour</h2><p>Une première session suffit.</p></div>
        <div class="quest panel">
          <div class="quest-heading">${tile(goal === 1 ? 'check' : 'target', 'mint')}<div><h3>${goal === 1 ? 'Objectif atteint !' : 'Première mission'}</h3><p>${goal === 1 ? 'Bien joué pour aujourd’hui.' : 'Concentre-toi 25 minutes.'}</p></div></div>
          ${bar(goal, 'Objectif du jour')}
          <div class="quest-caption"><span>${stats.todayMinutes} / ${dailyGoal} min</span><span>${goal === 1 ? 'Terminé' : '+50 XP par session'}</span></div>
        </div>
      </section>
    </div>`
}

function subjectOptions(selected = '', all = false) {
  return `<option value="" ${selected ? '' : 'selected'} ${all ? '' : 'disabled'}>${all ? 'Toutes les matières' : 'Choisir une matière'}</option>${subjects.map(subject => `<option value="${subject.id}" ${selected === subject.id ? 'selected' : ''}>${subject.name}</option>`).join('')}`
}

export function latestCourse(state) {
  const recent = Object.entries(state.reading).filter(([id]) => courseById.has(id))
    .sort((first, second) => second[1].openedAt - first[1].openedAt)
  return courseById.get(recent[0]?.[0])
}

const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export function courseResults(state, subjectId, query, filter) {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean)
  const matches = courses.filter(course => {
    const done = Boolean(state.reading[course.id]?.completedAt)
    if ((subjectId && course.subject !== subjectId) || (filter === 'done' && !done) || (filter === 'new' && done)) return false
    const text = normalize([course.title, course.topic, course.intro, subjectById(course.subject).name, ...course.sections.map(section => `${section.heading} ${section.text}`)].join(' '))
    return words.every(word => text.includes(word))
  })

  if (!subjectId && !words.length && filter === 'all') {
    return `<div class="library-grid">${subjects.filter(subject => matches.some(course => course.subject === subject.id)).map(subject => {
      const chapters = matches.filter(course => course.subject === subject.id)
      const read = chapters.filter(course => state.reading[course.id]?.completedAt).length
      return `<a class="panel subject-card" href="#cours/${subject.id}">${tile(subject.icon, subject.color)}<div><h2>${subject.name}</h2><p>${countLabel(chapters.length, 'chapitre')} · ${read} lu${read === 1 ? '' : 's'}</p></div>${icon('chevron', 17)}${bar(read / chapters.length, `Chapitres lus en ${subject.name}`)}</a>`
    }).join('')}</div>`
  }

  return `<p class="result-count" role="status">${countLabel(matches.length, 'chapitre')}</p>${matches.length ? `<div class="chapter-list">${matches.map(course => {
    const subject = subjectById(course.subject)
    const read = Boolean(state.reading[course.id]?.completedAt)
    return `<a class="panel chapter-row" href="#cours/${course.id}">${tile(read ? 'check' : subject.icon, read ? 'mint' : subject.color)}<span><small>${subject.name} · ${course.topic}</small><strong>${course.title}</strong><span class="chapter-summary">${course.intro}</span></span><span class="read-state">${read ? 'Lu · Reprendre' : 'Lire'} ${icon('chevron', 16)}</span></a>`
  }).join('')}</div>` : '<div class="panel empty-state"><h2>Aucun chapitre trouvé</h2><p>Essaie un autre mot-clé ou change de filtre.</p></div>'}`
}

export function libraryView(state, subjectId, query, filter) {
  const subject = subjectById(subjectId)
  const latest = latestCourse(state)
  const read = courses.filter(course => state.reading[course.id]?.completedAt).length
  return `${subject ? '<a class="back-link" href="#cours">' + icon('back', 17) + ' Toutes les matières</a>' : ''}
    ${heading('PROGRAMME DE SECONDE', subject ? subject.name : 'Bibliothèque de cours', subject ? 'Choisis un chapitre pour le découvrir ou le relire.' : 'Lis les cours dans l’ordre qui te convient. Chaque chapitre a un exercice corrigé et des cartes prêtes à réviser.')}
    ${!subject ? `<section class="panel library-banner"><div>${tile('book', 'sky')}<span><strong>${read} / ${courses.length} chapitres lus</strong><small>Ton parcours de Seconde</small></span></div>${latest ? link(`Reprendre ma lecture ${icon('arrow', 17)}`, `cours/${latest.id}`, 'secondary') : ''}</section>` : ''}
    ${!subject || subject.id === 'maths' ? `<section class="panel library-banner math-banner"><div>${tile('math', 'mint')}<span><strong>Entraînement de maths</strong><small>Des exercices différents à chaque essai</small></span></div>${link(`S’entraîner ${icon('arrow', 17)}`, 'exercices', 'secondary')}</section>` : ''}
    <div class="library-tools"><label class="field"><span>Rechercher un cours</span><input id="course-search" type="search" value="${escapeHtml(query)}" placeholder="Ex. vecteurs, biodiversité, poésie…" autocomplete="off"></label><label class="field"><span id="course-filter-label">Avancement</span><select id="course-filter" aria-labelledby="course-filter-label"><option value="all">Tous les chapitres</option><option value="new" ${filter === 'new' ? 'selected' : ''}>À découvrir</option><option value="done" ${filter === 'done' ? 'selected' : ''}>Déjà lus</option></select></label></div>
    <section id="course-results" aria-label="Chapitres disponibles">${courseResults(state, subjectId, query, filter)}</section>`
}

export function readerView(state, course) {
  const subject = subjectById(course.subject)
  const chapterList = courses.filter(item => item.subject === course.subject)
  const previous = chapterList[course.number - 2]
  const next = chapterList[course.number]
  const read = Boolean(state.reading[course.id]?.completedAt)
  const retrySkill = courseExerciseSkills[course.id]
  return `<a class="back-link" href="#cours/${subject.id}">${icon('back', 17)} ${subject.name}</a>
    ${heading(`CHAPITRE ${course.number} / ${chapterList.length} · ${course.topic.toLocaleUpperCase('fr')}`, course.title, course.intro)}
    <div class="reader-layout"><article class="panel reading-panel">
      ${course.sections.map((section, index) => `<section class="lesson-section"><h2><span>${index + 1}</span>${section.heading}</h2><p>${escapeHtml(section.text)}</p></section>`).join('')}
      <section class="exercise-box"><h2>${icon('target', 20)} À toi de jouer</h2><p>${escapeHtml(course.exercise.question)}</p><details><summary>Voir la correction</summary><p>${escapeHtml(course.exercise.answer)}</p></details>${retrySkill ? link(`${icon('rotate', 17)} Essayer avec d’autres valeurs`, `exercices/${retrySkill}/variante`, 'secondary exercise-variant') : ''}</section>
      <div class="reader-actions">${read ? `<span class="read-confirm">${icon('check', 18)} Chapitre lu</span>${button('Marquer à relire', 'mark-course', 'secondary')}` : button(`${icon('check', 17)} Marquer comme lu`, 'mark-course')}</div>
      <nav class="chapter-pagination" aria-label="Navigation entre chapitres"><span>${previous ? link(`${icon('back', 17)} Chapitre précédent`, `cours/${previous.id}`, 'secondary') : ''}</span><span>${next ? link(`Chapitre suivant ${icon('arrow', 17)}`, `cours/${next.id}`, 'secondary') : link('Voir les matières', 'cours', 'secondary')}</span></nav>
    </article>
    <aside class="focus-aside"><section class="panel padded"><div class="panel-title">${tile('cards', 'purple')}<div><h2>Entraîne-toi</h2><p>${countLabel(course.cards.length, 'carte')} sur ce chapitre</p></div></div><div class="reader-links">${retrySkill ? link(`${icon('math', 17)} Faire les exercices du chapitre`, `exercices/${course.id}`, 'primary') : ''}${link(`${icon('cards', 17)} Réviser les cartes`, `flashcards/${course.id}`, 'secondary')}${link(`${icon('pen', 17)} Relever le défi Feynman`, `feynman/${course.id}`, 'secondary')}</div></section>
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
  const selected = context.skill?.id ?? context.course
  const lead = course ? `Travaille ${context.skill ? 'cette compétence' : 'les compétences du chapitre'} avec des valeurs qui changent à chaque essai.` : 'Un mélange de compétences de Seconde. Quand une réponse coince, tu retravailles tout de suite la même méthode.'
  const controls = `<div class="math-controls"><label class="field"><span id="math-context-label">Ce que tu veux travailler</span><select id="math-context" aria-labelledby="math-context-label"><option value="">Mélanger les chapitres</option>${context.skill ? `<option value="${context.skill.id}" selected>${context.skill.name}</option>` : ''}${courses.filter(item => item.subject === 'maths').map(item => `<option value="${item.id}" ${selected === item.id ? 'selected' : ''}>${item.title}</option>`).join('')}</select></label>${returnTo ? link(`${icon('back', 17)} Retour aux flashcards`, returnTo, 'secondary') : ''}</div>`
  const header = `${course ? `<a class="back-link" href="#cours/${course.id}">${icon('back', 17)} Relire ${course.title}</a>` : ''}${heading('MATHS · ENTRAÎNEMENT ADAPTATIF', context.skill?.name ?? course?.title ?? 'Exercices de maths', lead)}${controls}`
  if (!track) return `${header}<section class="panel empty-state" role="status"><h2>Préparation de l’exercice…</h2></section>`
  const problem = problemFor(track.current)
  const skill = skillById.get(track.current.skill)
  const recovery = state.mathPractice.skills[skill.id]?.recovery ?? 0
  const pending = mathSkills.filter(item => item.id !== skill.id && state.mathPractice.skills[item.id]?.recovery)
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

export function focusView(state, sound) {
  const timer = state.timer
  const isBreak = timer.phase === 'break'
  const active = timer.status !== 'ready'
  return `${heading('POMODORO', 'Session focus', 'Choisis une matière, puis donne-toi 25 minutes pour avancer.')}
    <div class="focus-layout">
      <section class="focus-card panel ${isBreak ? 'break-mode' : ''}" aria-label="Minuteur Pomodoro">
        <div class="phase-label">${icon(isBreak ? 'coffee' : 'timer', 17)} ${isBreak ? 'Pause · 5 min' : 'Focus · 25 min'}</div>
        <div class="dial">
          <svg class="dial-ring" viewBox="0 0 240 240" aria-hidden="true"><circle class="dial-track" cx="120" cy="120" r="108"/><circle class="dial-progress" cx="120" cy="120" r="108" pathLength="100" style="stroke-dashoffset:${100 * (1 - remainingTime(timer) / durations[timer.phase])}"/></svg>
          <div class="dial-label"><strong data-live-timer>${formatClock(remainingTime(timer))}</strong><span>${timer.status === 'paused' ? 'En pause' : isBreak ? 'Respire un peu' : 'Temps restant'}</span></div>
        </div>
        <label class="field timer-subject"><span id="timer-subject-label">Matière</span><select id="timer-subject" aria-labelledby="timer-subject-label" ${active ? 'disabled' : ''}>${subjectOptions(timer.subject)}</select></label>
        <div class="timer-controls">
          ${timer.status === 'running' ? button(`${icon('pause', 18)} Mettre en pause`, 'pause-timer') : button(`${icon('play', 18)} ${timer.status === 'paused' ? 'Reprendre' : isBreak ? 'Démarrer la pause' : 'Démarrer le focus'}`, 'start-timer')}
          ${active ? button(`${icon('stop', 18)} Arrêter`, 'stop-timer', 'secondary') : ''}
          ${isBreak && !active ? button('Passer la pause', 'skip-break', 'secondary') : ''}
        </div>
        <p class="timer-hint" id="timer-hint">${isBreak ? 'Profites-en pour te lever ou boire un verre d’eau.' : `${icon('bolt', 16)} +50 XP quand tu termines la session.`}</p>
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
  const subject = card && subjectById(card.subject)
  const course = courseById.get(study.course)
  const practice = study.mode === 'practice'
  const deck = reviewCards(state, study, 'practice')
  const nextDue = deck
    .map(item => state.schedule[item.id]?.due)
    .filter(date => date && date > dayKey()).sort()[0]
  const nextReview = nextDue ? `Prochaine révision espacée le ${shortDate.format(new Date(`${nextDue}T12:00:00`))}. Tu peux continuer en entraînement libre.`
    : deck.length ? 'Tes cartes sont disponibles en entraînement libre. En maths, tu peux aussi essayer de nouvelles variantes.' : 'Choisis une matière de la bibliothèque pour démarrer.'
  const reviewed = state.reviews.filter(item => dayKey(item.at) === dayKey()).length
  const mastered = state.reviews.filter(item => item.grade === 'easy' && !item.practice).length
  const title = study.started ? 'Série terminée !' : practice ? 'Prêt à t’entraîner ?' : cards.length ? 'Prêt à tester ta mémoire ?' : 'Tu es à jour !'
  return `${heading('RAPPEL ACTIF', 'Flashcards', 'Cherche la réponse de mémoire, puis retourne la carte pour te corriger.')}
    <div class="study-toolbar"><label class="field compact-field"><span id="card-subject-label">Matière</span><select id="card-subject" aria-labelledby="card-subject-label">${subjectOptions(study.subject, true)}</select></label><div class="toolbar-actions">${state.customCards.length ? button(`${icon('cards', 17)} Mes cartes`, 'manage-cards', 'secondary') : ''}${link(`${icon('book', 17)} ${course ? 'Relire le chapitre' : 'Parcourir les cours'}`, course ? `cours/${course.id}` : 'cours', 'secondary')}${!study.subject || study.subject === 'maths' ? link(`${icon('math', 17)} Exercices de maths`, course ? `exercices/${course.id}` : 'exercices', 'secondary') : ''}</div></div>
    ${course ? `<div class="deck-filter"><strong>${course.title}</strong><a href="#flashcards">Voir tous les chapitres ${icon('close', 14)}</a></div>` : ''}
    <div class="review-modes" aria-label="Mode de révision">${button(`${icon('calendar', 16)} À revoir`, 'review-mode', 'secondary', `data-value="due" aria-pressed="${!practice}"`)}${button(`${icon('rotate', 16)} Entraînement libre`, 'review-mode', 'secondary', `data-value="practice" aria-pressed="${practice}"`)}</div>
    <div class="focus-layout">
      <section class="panel study-panel" aria-label="Révision des cartes">
        ${card ? `<div class="deck-header"><span class="subject-tag ${subject.color}">${icon(subject.icon, 15)} ${subject.name}</span><span>${countLabel(queue.length, 'carte restante', 'cartes restantes')}</span></div>
        <button class="flashcard ${study.flipped ? 'revealed' : ''}" type="button" data-action="flip-card" aria-pressed="${study.flipped}"><span class="card-face">${study.flipped ? 'VERSO · RÉPONSE' : 'RECTO · QUESTION'}</span><span class="flashcard-text">${escapeHtml(study.flipped ? card.answer : card.question)}</span><span class="flip-hint">${icon('rotate', 16)} ${study.flipped ? 'Revoir la question' : 'Retourner la carte'}</span></button>
        ${study.flipped ? `<p class="rating-hint">Comment s’est passé le rappel ?</p><div class="ratings">${button(`${icon('close', 17)} Difficile`, 'grade-card', 'rating hard', 'data-value="hard"')}${button(`${icon('minus', 17)} Moyen`, 'grade-card', 'rating medium', 'data-value="medium"')}${button(`${icon('check', 17)} Facile`, 'grade-card', 'rating easy', 'data-value="easy"')}</div>${skillForCard(card) ? '<p class="rating-hint">« Difficile » et « Moyen » ouvrent tout de suite un exercice du même type.</p>' : ''}` : '<p class="rating-hint">Essaie de formuler la réponse avant de la lire.</p>'}`
        : `<div class="empty-state">${tile(study.started ? 'check' : 'cards', 'purple')}<h2>${title}</h2><p>${cards.length ? `${countLabel(cards.length, 'carte')} ${practice ? 'dans la collection' : 'à revoir'}. Lance une série de ${Math.min(10, cards.length)}.` : nextReview}</p>${cards.length ? button(`${icon('play', 17)} ${study.started ? 'Relancer une série' : 'Commencer la révision'}`, 'start-review') : deck.length && !practice ? button(`${icon('rotate', 17)} Continuer en entraînement libre`, 'review-mode', 'primary', 'data-value="practice"') : link('Voir les cours', 'cours', 'secondary')}</div>`}
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
  if (!currentId && latest && !answered.has(latest.id)) return latest
  const first = currentId ? courses.findIndex(course => course.id === currentId) + 1 : 0
  const ordered = [...courses.slice(first), ...courses.slice(0, first)]
  return ordered.find(course => course.id !== currentId && !answered.has(course.id)) ?? ordered[0]
}

export function feynmanView(state, courseId, selectedId) {
  const legacyNote = state.notes.find(item => item.id === selectedId && !item.course)
  const course = legacyNote ? null : courseById.get(courseId) ?? suggestedChallenge(state)
  const note = legacyNote ?? state.notes.find(item => item.course === course?.id)
  const notes = [...state.notes].sort((first, second) => second.updatedAt - first.updatedAt)
  const suggested = suggestedChallenge(state, course?.id)
  return `${heading('MÉTHODE FEYNMAN', 'Carnet Feynman', 'Relève un défi guidé et explique la notion avec des mots simples, comme à quelqu’un de 10 ans.')}
    <div class="focus-layout">
      <section class="panel padded"><div class="panel-title">${tile('pen', 'mint')}<div><h2>${escapeHtml(course?.title ?? note.title)}</h2><p>${subjectById(course?.subject ?? note.subject).name} · ${course ? 'Défi guidé' : 'Ancienne explication'}</p></div></div>
        ${course ? `<div class="guide-prompt"><strong>${escapeHtml(course.guide.prompt)}</strong><details><summary>Voir un indice</summary><p>${escapeHtml(course.guide.hint)}</p></details></div>` : ''}
        <form id="note-form" class="stack-form" data-id="${note?.id ?? ''}" data-course="${course?.id ?? ''}">
          <label class="field"><span id="note-body-label">${course ? '1. Ton explication' : 'Ton explication'}</span><textarea name="body" aria-labelledby="note-body-label" rows="5" maxlength="5000" placeholder="Explique l’idée en deux ou trois phrases avec tes mots…" required>${escapeHtml(note?.body)}</textarea></label>
          ${course ? `<label class="field"><span id="note-example-label">2. Ton exemple ou ta comparaison</span><textarea name="example" aria-labelledby="note-example-label" rows="2" maxlength="1000" placeholder="Imagine une situation ou un exemple qui rend l’idée concrète…" required>${escapeHtml(note?.example)}</textarea></label>` : ''}
          <label class="field"><span id="note-gap-label">${course ? '3. Le point à retravailler' : 'Un point à éclaircir'} <small>(facultatif)</small></span><textarea name="gap" aria-labelledby="note-gap-label" rows="2" maxlength="800" placeholder="Quelle partie reste difficile à expliquer ?">${escapeHtml(note?.gap)}</textarea></label>
          <div class="toolbar-actions"><button class="btn primary" type="submit">${icon('check', 17)} Enregistrer</button>${note ? button(icon('trash', 18), 'delete-note', 'secondary icon-button', `data-value="${note.id}" aria-label="Supprimer cette note"`) : ''}</div>
        </form>
        ${course && note ? `<details class="guide-model"><summary>Comparer avec une explication possible</summary><p>${escapeHtml(course.guide.model)}</p><p>Vérifie que ton exemple aide à comprendre, puis reprends ta réponse si nécessaire.</p></details>` : ''}
      </section>
      <div class="focus-aside">
        <section class="panel padded"><div class="panel-title">${tile('spark', 'mint')}<div><h2>Choisir un défi</h2><p>Une notion proposée dans chaque chapitre</p></div></div>
          <label class="field"><span id="challenge-label">Notion à expliquer</span><select id="challenge-course" aria-labelledby="challenge-label"><option value="" ${course ? '' : 'selected'} disabled>Choisir un chapitre</option>${subjects.filter(subject => courses.some(item => item.subject === subject.id)).map(subject => `<optgroup label="${subject.name}">${courses.filter(item => item.subject === subject.id).map(item => `<option value="${item.id}" ${course?.id === item.id ? 'selected' : ''}>${item.title}</option>`).join('')}</optgroup>`).join('')}</select></label>
          <div class="reader-links">${link(`Autre défi ${icon('arrow', 17)}`, `feynman/${suggested.id}`, 'secondary')}${course ? link(`${icon('book', 17)} Relire le cours`, `cours/${course.id}`, 'secondary') : ''}</div>
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
    return { ...subject, minutes: sessions.length * 25, reviews: reviews.length, xp: [...sessions, ...reviews].reduce((sum, item) => sum + item.xp, 0) }
  }).filter(item => item.minutes || item.reviews).sort((first, second) => second.xp - first.xp)
  const activity = [
    ...state.sessions.map(item => ({ ...item, icon: 'timer', title: 'Session focus', detail: `${item.minutes} min` })),
    ...state.reviews.map(item => ({ ...item, icon: 'cards', title: 'Carte révisée', detail: { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' }[item.grade] })),
    ...state.notes.map(item => ({ ...item, icon: 'pen', title: 'Explication Feynman', detail: item.title, at: item.createdAt, xp: 0 })),
  ].sort((first, second) => second.at - first.at).slice(0, 8)
  return `${heading('STATISTIQUES', 'Ta progression', 'Retrouve le temps investi et les récompenses gagnées.')}
    <section class="panel padded progress-level"><div class="panel-title">${tile('award', 'purple')}<div><h2>Niveau ${level.index + 1} · ${level.current.title}</h2><p>${level.next ? `${level.next.xp - stats.xp} XP avant le niveau ${level.next.title}` : 'Tu as atteint le niveau Maître.'}</p></div></div>${bar(level.progress, 'Progression du niveau')}<div class="quest-caption"><span>${stats.xp} XP${level.next ? ` / ${level.next.xp} XP` : ''}</span><a href="#profil">Voir mes récompenses ${icon('arrow', 15)}</a></div></section>
    <div class="progress-grid">
      <section class="panel padded"><div class="panel-title">${tile('chart', 'sky')}<div><h2>Les 7 derniers jours</h2><p>Minutes passées en focus</p></div></div>
        <ul class="week-chart">${week.map(day => `<li class="${dayKey(day.date) === dayKey() ? 'current' : ''}" aria-label="${weekday.format(day.date)}, ${day.minutes} minutes"><strong>${day.minutes}</strong><span class="chart-slot"><span style="height:${day.minutes / ceiling * 100}%"></span></span><small>${dayLabel.format(day.date)}</small></li>`).join('')}</ul>
      </section>
      <section class="panel padded"><div class="panel-title">${tile('book', 'mint')}<div><h2>Par matière</h2><p>Ton travail et ton XP</p></div></div>
        ${bySubject.length ? `<ul class="item-list">${bySubject.map(item => `<li class="activity-row">${tile(item.icon, item.color)}<span><strong>${item.name}</strong><small>${timeLabel(item.minutes)} · ${countLabel(item.reviews, 'carte')}</small></span><b>${item.xp} XP</b></li>`).join('')}</ul>` : '<p>Termine une session focus ou révise une carte pour voir apparaître une matière.</p>'}
      </section>
    </div>
    <section class="panel padded recent"><div class="panel-title">${tile('clock', 'purple')}<div><h2>Activité récente</h2><p>Tes dernières sessions, cartes et explications</p></div></div>
      ${activity.length ? `<ul class="item-list">${activity.map(item => `<li class="activity-row">${tile(item.icon, subjectById(item.subject)?.color ?? 'purple')}<span><strong>${item.title}</strong><small>${subjectById(item.subject)?.name} · ${escapeHtml(item.detail)} · ${shortDate.format(item.at)}</small></span>${item.xp ? `<b>+${item.xp} XP</b>` : ''}</li>`).join('')}</ul>` : '<p>Ton historique se remplira au fil de tes révisions.</p>'}
    </section>`
}

export function profileView(state) {
  const level = levelInfo(studyStats(state).xp)
  const choices = (options, type) => options.map(([id, label, required]) => {
    const locked = level.index < required
    const active = state.profile[type] === id
    const visual = type === 'theme' ? `<span class="theme-swatch ${id}"></span>` : tile(id, 'purple')
    return button(`${visual}<span><strong>${label}</strong><small>${locked ? `Niveau ${required + 1} · ${required === 1 ? 'Érudit' : 'Maître'}` : active ? 'Sélectionné' : 'Disponible'}</small></span>${locked ? icon('lock', 16) : active ? icon('check', 16) : ''}`, 'reward', 'reward-button', `data-type="${type}" data-value="${id}" aria-pressed="${active}" ${locked ? 'disabled' : ''}`)
  }).join('')
  return `${heading('RÉCOMPENSES ET PARAMÈTRES', 'Ton profil', 'Personnalise ton espace au fil de ta progression.')}
    <div class="progress-grid">
      <section class="panel padded"><div class="panel-title">${tile('settings', 'purple')}<div><h2>Préférences</h2><p>Enregistrées dans ce navigateur.</p></div></div><form id="profile-form" class="stack-form"><label class="field"><span>Prénom ou pseudo</span><input name="name" placeholder="FocusBro" maxlength="24" value="${escapeHtml(state.profile.name)}"></label><label class="toggle-field"><input type="checkbox" name="chime" ${state.profile.chime ? 'checked' : ''}> Jouer un son à la fin d’une session</label><button type="submit" class="btn primary">${icon('check', 17)} Enregistrer</button></form></section>
      <section class="panel padded"><div class="panel-title">${tile('crown', 'amber')}<div><h2>Thèmes</h2><p>De nouvelles couleurs à chaque niveau.</p></div></div><div class="reward-list">${choices(themes, 'theme')}</div></section>
      <section class="panel padded"><div class="panel-title">${tile('ghost', 'mint')}<div><h2>Avatars</h2><p>Choisis ton emblème.</p></div></div><div class="reward-list">${choices(avatars, 'avatar')}</div></section>
    </div>`
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
  return `<ul class="item-list">${state.customCards.map(card => `<li>${button(`<span><strong>${escapeHtml(card.question)}</strong><small>${subjectById(card.subject)?.name}</small></span>${icon('chevron', 17)}`, 'edit-card', 'list-button', `data-value="${card.id}"`)}</li>`).join('')}</ul>`
}
