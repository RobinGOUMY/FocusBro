import { actionModes } from './arcade-action-games.js'
import { actionGameView } from './arcade-action-view.js'
import { arcadeModes, arcadePool, dailyArcadeXp, sprintDuration, xpPerAnswer } from './arcade.js'
import { subjects } from './content.js'
import { courseById, courses } from './courses.js'
import { equippedCosmetic } from './pass.js'
import { dayKey, isCourseWorked } from './study.js'
import { avatarArt, button, escapeHtml, heading, icon, link, subjectOptions, tile, workedButton } from './views.js'

const letters = ['A', 'B', 'C']
const modeCopy = {
  flight: ['ADRESSE', 'Lis la question, puis bats des ailes pour passer dans la porte de la bonne réponse.', 'Jouer au Quiz en vol'],
  sprint: ['RÉFLEXES', 'Enchaîne les bonnes réponses en 45 secondes pour faire monter le combo.', 'Jouer au Sprint'],
  memory: ['MÉMOIRE', 'Retrouve jusqu’à dix paires sur un seul plateau.', 'Jouer au Mémo Duo'],
  slice: ['RÉFLEXES', 'Tranche les bons mots ou nombres et épargne les intrus.', 'Jouer à Tranche-Méninges'],
  snake: ['LOGIQUE', 'Fais grandir ton serpent en avalant les éléments dans le bon ordre.', 'Jouer au Snake'],
  runner: ['LANGUES', 'Change de voie pour traverser les portes de la bonne traduction.', 'Jouer à Rail Express'],
  sling: ['ADRESSE', 'Vise la tour de la bonne réponse et fais tomber le château.', 'Jouer au Siège'],
}

export function arcadeView(state, settings, run) {
  if (!run) return lobby(state, settings)
  const mode = arcadeModes[run.mode]
  const subject = subjects.find(item => item.id === run.subject)?.name ?? 'Toutes les matières'
  return `<div class="arcade-session">
    <div class="game-topline">${button(`${icon('back', 17)} Arcade`, 'arcade-exit', 'secondary')}<span class="game-subject">${escapeHtml(subject)}</span></div>
    ${heading(modeCopy[run.mode][0], mode.name, modeCopy[run.mode][1])}
    ${run.phase === 'done' ? results(run) : `<section class="game-panel panel">${actionModes.includes(run.mode) ? '' : hud(run)}
      ${run.phase === 'paused' ? paused(run) : actionModes.includes(run.mode) ? actionGameView(state, run) : run.mode === 'memory' ? memoryBoard(run) : quiz(state, run)}
    </section>`}
  </div>`
}

function chapterPicker(state, settings) {
  const groups = subjects.filter(subject => courses.some(course => course.subject === subject.id)
    && (!settings.subject || settings.subject === subject.id))
  const workedCount = courses.filter(course => (!settings.subject || course.subject === settings.subject) && isCourseWorked(state, course.id)).length
  return `<details class="panel arcade-chapters" ${!workedCount && settings.scope === 'worked' ? 'open' : ''}>
    <summary>${icon('book', 19)} <strong>Mes chapitres travaillés</strong> <small>${workedCount} sélectionnés</small></summary>
    <p>Marque les chapitres que tu as déjà vus. Cette sélection sert aussi aux flashcards et aux autres révisions.</p>
    <div class="arcade-chapter-groups">${groups.map(subject => {
      const chapters = courses.filter(course => course.subject === subject.id)
      const count = chapters.filter(course => isCourseWorked(state, course.id)).length
      return `<details ${settings.subject ? 'open' : ''}><summary>${escapeHtml(subject.name)} <small>${count} / ${chapters.length}</small></summary>
        <ul>${chapters.map(course => `<li><a href="#cours/${course.id}">${escapeHtml(course.title)}</a>${workedButton(state, course)}</li>`).join('')}</ul>
      </details>`
    }).join('')}</div>
  </details>`
}

function lobby(state, settings) {
  const counts = Object.fromEntries(Object.keys(arcadeModes).map(mode => [mode, arcadePool(state, settings, mode).length]))
  const available = Object.entries(arcadeModes).filter(([id, mode]) => counts[id] >= mode.min).length
  const todayXp = state.arcade.days[dayKey()]?.xp ?? 0
  return `${heading('RÉVISION EN JEU', 'Arcade', 'Choisis ton jeu, révise et bats ton record.')}
    <section class="arcade-hero panel"><div><span class="arcade-tag">${icon('bolt', 15)} XP DU JOUR</span><h2>${todayXp} / ${dailyArcadeXp} XP</h2><p>Chaque bonne réponse ou paire trouvée rapporte ${xpPerAnswer} XP jusqu’au plafond quotidien. Tes scores restent enregistrés après le plafond.</p></div>
      <div class="arcade-hero-art" aria-hidden="true">${icon('arcade', 102)}<i></i><i></i><i></i></div></section>
    <section class="panel arcade-settings" aria-labelledby="arcade-settings-title">
      <div><h2 id="arcade-settings-title">Ton terrain de jeu</h2><p>${available} / ${Object.keys(arcadeModes).length} jeux disponibles pour cette sélection</p></div>
      <label class="field"><span>Matière</span><select id="arcade-subject">${subjectOptions(settings.subject, true, subjects.filter(item => item.id !== 'autre'), 'Toutes')}</select></label>
      <label class="field"><span>Questions</span><select id="arcade-scope"><option value="worked"${settings.scope === 'worked' ? ' selected' : ''}>Chapitres travaillés</option><option value="all"${settings.scope === 'all' ? ' selected' : ''}>Toute la collection</option></select></label>
      <label class="toggle-field arcade-assist"><input id="arcade-assist" type="checkbox"${settings.assisted ? ' checked' : ''}> Jouer au Quiz en vol sans pilotage</label>
      ${available ? '' : `<p class="arcade-empty">Aucun jeu pour cette sélection. Indique les chapitres que tu as travaillés ci-dessous ou change de matière.</p>`}
    </section>
    ${chapterPicker(state, settings)}
    <div class="arcade-grid">${Object.entries(arcadeModes).map(([id, mode]) => {
      const [tag, description, play] = modeCopy[id]
      const count = counts[id]
      const record = state.arcade.records[id]
      const unavailable = id === 'memory' ? '4 paires distinctes minimum' : id === 'runner' ? 'Sélectionne un chapitre d’anglais ou d’espagnol compatible' : 'Aucun défi pour les chapitres sélectionnés'
      return `<article class="arcade-card panel ${mode.color}" data-game="${id}">
        <div class="arcade-card-art" aria-hidden="true">${icon(mode.icon, 54)}<i></i><i></i></div>
        <div class="arcade-card-body"><span class="section-kicker">${tag}</span><h2>${mode.name}</h2><p>${description}</p>
          <div class="game-record">${icon('award', 16)} ${record ? `Record · ${record} pts` : 'Premier record à décrocher'}</div>
          ${button(`${icon('play', 17)} ${play}`, 'arcade-start', 'primary', `data-value="${id}"${count < mode.min ? ' disabled' : ''}`)}
          ${count < mode.min ? `<small class="game-availability">${unavailable}</small>` : ''}</div>
      </article>`
    }).join('')}</div>
    <div class="arcade-footer">${link(`${icon('gift', 17)} Voir le Pass Focus`, 'pass', 'secondary')}</div>`
}

function hud(run) {
  const memory = run.mode === 'memory'
  return `<div class="game-hud">
    <span>${memory ? 'Paires' : 'Question'} <b>${memory ? run.correct : run.index + 1}/${run.questions.length}</b></span>
    <span>Score <b>${run.score} pts</b></span>
    ${run.mode === 'sprint' ? `<span class="game-combo">Combo <b>×${run.combo}</b></span><span class="game-clock">${icon('clock', 16)} <b data-game-clock>${Math.ceil(run.remaining / 1000)} s</b></span>` : ''}
    ${run.phase === 'playing' && (run.mode === 'sprint' || (run.mode === 'flight' && !run.assisted)) ? button(`${icon('pause', 16)} Pause`, 'arcade-pause', 'secondary game-pause') : ''}
  </div>${run.mode === 'sprint' ? `<progress class="game-countdown" max="${sprintDuration}" value="${run.remaining}" aria-label="Temps restant"></progress>` : ''}`
}

function paused(run) {
  return `<div class="game-paused">${tile('pause', 'purple')}<h2>Partie en pause</h2><p>${run.mode === 'flight' ? 'Reprends le vol au même endroit.' : 'Le chrono repart quand tu reprends.'}</p>${button('Reprendre', 'arcade-resume', 'primary', 'id="game-primary"')}</div>`
}

function choiceList(run, question, interactive) {
  return `<ol class="game-answers">${question.options.map((answer, index) => {
    const content = `<span class="answer-letter">${letters[index]}</span><span>${escapeHtml(answer)}</span>`
    const outcome = run.outcome
    const style = outcome && answer === question.answer ? ' right' : outcome?.choice === index ? ' wrong' : ''
    return `<li class="${style.trim()}">${interactive ? button(content, 'arcade-answer', 'game-answer', `data-value="${index}"`) : `<div class="game-answer">${content}</div>`}</li>`
  }).join('')}</ol>`
}

function feedback(question, outcome) {
  const course = courseById.get(question.course)
  const title = outcome.correct ? 'Bonne réponse !' : outcome.collision ? 'Obstacle touché' : 'La bonne réponse était…'
  return `<div id="game-feedback" class="game-feedback ${outcome.correct ? 'right' : 'wrong'}" tabindex="-1">
    ${icon(outcome.correct ? 'check' : 'spark', 21)}
    <div><h3>${title}</h3><p><strong>${escapeHtml(question.answer)}</strong> · ${escapeHtml(question.explanation)}</p><small>Cours associé · ${escapeHtml(course.title)}</small></div>
  </div>`
}

function quiz(state, run) {
  const question = run.questions[run.index]
  const flying = run.mode === 'flight' && !run.assisted
  const playing = run.phase === 'playing'
  const last = run.index + 1 === run.questions.length
  return `<div class="quiz-content">
    <div class="quiz-question"><span class="section-kicker">${subjects.find(item => item.id === question.subject).name}</span><h2 id="game-question" tabindex="-1">${escapeHtml(question.prompt)}</h2></div>
    ${choiceList(run, question, !flying && (playing || run.phase === 'ready'))}
    ${flying && run.phase !== 'feedback' ? flightField(state, run, playing) : ''}
    ${run.phase === 'feedback' ? `${feedback(question, run.outcome)}<div class="game-actions">${button(`${last ? 'Voir le score' : 'Question suivante'} ${icon('arrow', 17)}`, 'arcade-next', 'primary', 'id="game-primary"')}</div>`
      : flying && run.phase === 'ready' ? `<div class="game-actions">${button(`${icon('play', 17)} Décoller`, 'arcade-launch', 'primary', 'id="game-primary"')}${button('Choisir sans pilotage', 'arcade-assist-run', 'secondary')}</div>` : ''}
  </div>`
}

function flightField(state, run, playing) {
  const avatar = equippedCosmetic(state.profile, 'avatar')
  const trail = equippedCosmetic(state.profile, 'trail')
  const { y, gate } = playing ? run.flight : { y: 0.48, gate: 0.82 }
  const art = `<span class="flight-stars"></span><span class="flight-gates">${letters.map(letter => `<span><b>${letter}</b></span>`).join('')}</span>
    <span class="flight-pilot"><span class="flight-trail" data-trail="${trail.id}"><i></i><i></i><i></i></span>${avatarArt(avatar, 23)}</span>`
  const style = `style="--pilot-y:${y * 100}%;--gate-x:${gate * 100}%;--trail-color:${trail.visual}"`
  return `<div class="flight-stage">
    ${playing ? `<button id="game-primary" class="flight-field live" data-action="arcade-jump" aria-label="Battre des ailes" ${style} type="button">${art}</button>` : `<div class="flight-field" aria-hidden="true" ${style}>${art}</div>`}
    <p>Appuie sur <kbd>Espace</kbd> ou touche la zone de vol pour monter. Passe par la porte A, B ou C.</p>
  </div>`
}

function memoryBoard(run) {
  const outcome = run.outcome
  const complete = run.matched.length === run.board.length
  return `<div class="memory-content"><div class="quiz-question"><span class="section-kicker">${run.board.length} CARTES</span><h2 id="game-question" tabindex="-1">Associe les questions et les réponses</h2></div>
    <div class="memory-grid">${run.board.map(({ question, kind }, index) => {
      const matched = run.matched.includes(index)
      const revealed = matched || run.open.includes(index)
      const type = kind === 'prompt' ? 'Question' : 'Réponse'
      const content = revealed ? `<small>${type}</small><span>${escapeHtml(question[kind])}</span>` : `${icon('cards', 24)}<span>Carte ${index + 1}</span>`
      return button(content, 'arcade-flip', `memory-card${revealed ? ' revealed' : ''}${matched ? ' matched' : ''}`, `data-value="${index}"${revealed || run.phase === 'feedback' ? ' disabled' : ''}`)
    }).join('')}</div>
    ${outcome ? `<div id="game-feedback" class="game-feedback ${outcome.correct ? 'right' : 'wrong'}" tabindex="-1">${icon(outcome.correct ? 'check' : 'rotate', 21)}<div><h3>${outcome.correct ? 'Paire trouvée !' : 'Deux cartes différentes'}</h3><p>${outcome.correct ? escapeHtml(outcome.question.explanation) : 'Mémorise leur place avant de les retourner.'}</p></div></div>
      <div class="game-actions">${button(complete ? 'Voir le score' : outcome.correct ? 'Continuer' : 'Retourner les cartes', 'arcade-next', 'primary', 'id="game-primary"')}</div>` : ''}
  </div>`
}

function results(run) {
  if (!run.result) return '<section class="panel game-results"><h2 id="game-question" tabindex="-1">Enregistrement du score…</h2></section>'
  const { score, xp, record } = run.result
  return `<section class="panel game-results">
    ${tile(record ? 'crown' : 'award', record ? 'amber' : 'purple')}
    <h2 id="game-question" tabindex="-1">${record ? 'Nouveau record !' : 'Partie terminée'}</h2>
    <p>${{ memory: 'Paires trouvées', slice: 'Objets à trancher trouvés', snake: 'Éléments mangés dans l’ordre' }[run.mode] ?? 'Bonnes réponses'} · ${run.result.correct} / ${run.result.total}</p>
    <div class="game-result-metrics"><strong>${score}<small>points</small></strong><strong>+${xp}<small>XP</small></strong></div>
    ${xp < run.correct * xpPerAnswer ? '<p>Tu as atteint le plafond d’XP Arcade du jour.</p>' : ''}
    <div class="toolbar-actions">${button(`${icon('rotate', 17)} Rejouer`, 'arcade-start', 'primary', `data-value="${run.mode}"`)}${link('Missions du jour', 'boutique/missions', 'secondary')}${link('Voir le Pass Focus', 'pass', 'secondary')}</div>
  </section>`
}
