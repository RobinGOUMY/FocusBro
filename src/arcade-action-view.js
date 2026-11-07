import { fruitPosition, runnerDuration, shotDuration, snakeSize } from './arcade-action-games.js'
import { courseById } from './courses.js'
import { equippedCosmetic } from './pass.js'
import { avatarArt, button, escapeHtml, icon } from './views.js'

const instructions = {
  slice: 'Fais glisser le doigt ou la souris sur les objets à trancher. Tu peux aussi les toucher un à un. Un intrus te coûte une vie.',
  snake: 'Guide le serpent avec les flèches ou les boutons. Il grandit à chaque bonne bouchée et traverse les bords du plateau.',
  runner: 'Change de voie avec ← et → ou touche une traduction avant que les portes arrivent sur toi.',
  sling: 'Choisis une tour et lance. Tu peux aussi tirer la bille vers le bas et la relâcher, dans la direction opposée à la tour visée.',
}

const lanePosition = lane => 100 * (lane + .5) / 3
const laneLabels = ['Gauche', 'Centre', 'Droite']

function choiceControls(run) {
  const question = run.questions[run.index]
  return `<div class="action-choices" aria-label="${run.mode === 'sling' ? 'Tours à viser' : 'Voies de traduction'}">
    ${question.options.map((option, index) => button(`<small>${laneLabels[index]}</small><span>${escapeHtml(option)}</span>`, 'arcade-lane', 'secondary',
      `data-value="${index}" aria-pressed="${run.motion.lane === index}" ${run.phase === 'feedback' || (run.mode === 'sling' && run.phase === 'playing') ? 'disabled' : ''}`)).join('')}
  </div>`
}

function fruitStage(run) {
  return `<div class="action-field slice-field" data-motion="slice" tabindex="-1" aria-label="Aire de découpe">
    ${run.phase === 'playing' ? run.motion.fruits.map((fruit, index) => button(escapeHtml(fruit.label), 'arcade-slice', 'flying-fruit', `hidden data-value="${index}" style="--fruit-column:${index % 3}; --fruit-color:${['var(--amber)', 'var(--mint)', 'var(--rose)'][index % 3]}"`)).join('')
      : `<span class="slice-emblem" aria-hidden="true">${icon('slice', 60)}</span>`}
  </div>`
}

function cellStyle(cell) {
  return `--col:${cell % snakeSize}; --row:${Math.floor(cell / snakeSize)}`
}

function snakeStage(run) {
  return `<div class="snake-play">
    <div class="action-field snake-field" data-motion="snake" tabindex="-1" aria-label="Plateau du serpent" style="--snake-size:${snakeSize}">
      ${run.motion.food.map((item, index) => `<span class="snake-food" style="${cellStyle(item.cell)}" data-snake-food="${index}" ${index < run.correct ? 'hidden' : ''}>${escapeHtml(item.label)}</span>`).join('')}
      ${Array.from({ length: run.total + 2 }, (_, index) => `<i class="snake-part${index === 0 ? ' snake-head' : ''}" data-snake-part="${index}" aria-hidden="true" ${run.motion.body[index] == null ? 'hidden' : `style="${cellStyle(run.motion.body[index])}"`}></i>`).join('')}
    </div>
    <div class="snake-controls" aria-label="Diriger le serpent">
      ${[['up', '↑', 'Haut'], ['left', '←', 'Gauche'], ['down', '↓', 'Bas'], ['right', '→', 'Droite']].map(([direction, symbol, label]) =>
        button(symbol, 'arcade-turn', 'secondary', `data-value="${direction}" aria-label="${label}" ${run.phase !== 'playing' ? 'disabled' : ''}`)).join('')}
    </div>
  </div>`
}

function runnerStage(state, run) {
  const { options } = run.questions[run.index]
  const avatar = equippedCosmetic(state.profile, 'avatar')
  const result = run.outcome ? run.outcome.correct ? ' is-hit' : ' is-miss' : ''
  return `<div class="action-field rail-field${result}" data-motion="runner" tabindex="-1" aria-label="Les trois voies" style="--pilot-x:${lanePosition(run.motion.lane)}%; --travel:${run.phase === 'feedback' ? 1 : 0}">
    <div class="rail-tracks" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="rail-doors" aria-hidden="true">${options.map((option, index) => `<span class="${run.outcome?.choice === index ? 'contact' : ''}">${escapeHtml(option)}</span>`).join('')}</div>
    <span class="rail-pilot" aria-hidden="true">${avatarArt(avatar, 27)}</span>
  </div>
  ${choiceControls(run)}`
}

function slingStage(state, run) {
  const { options } = run.questions[run.index]
  const avatar = equippedCosmetic(state.profile, 'avatar')
  const result = run.outcome ? run.outcome.correct ? ' is-hit' : ' is-miss' : ''
  return `<div class="action-field sling-field${result}" data-motion="sling" tabindex="-1" aria-label="Terrain du lance-pierre" style="--aim-x:${lanePosition(run.motion.lane)}%; --shot-x:${run.outcome ? lanePosition(run.motion.lane) : 50}%; --shot-y:${run.outcome ? 39 : 82}%">
    <div class="sling-towers" aria-hidden="true">${options.map((option, index) => `<div class="sling-tower ${run.motion.lane === index ? 'targeted' : ''}"><span>${escapeHtml(option)}</span><i></i><i></i><i></i></div>`).join('')}</div>
    <span class="sling-base" aria-hidden="true">${icon('sling', 42)}</span>
    <span class="sling-orb" aria-hidden="true">${avatarArt(avatar, 25)}</span>
  </div>
  ${choiceControls(run)}`
}

function actionFeedback(run) {
  const { outcome } = run
  const question = run.questions[run.index]
  if (run.mode === 'slice') return [outcome.found === outcome.targets.length, `${outcome.found} / ${outcome.targets.length} objets trouvés`, `À trancher dans cette manche · ${outcome.targets.join(' · ')}`]
  if (run.mode === 'snake') return [outcome.success, outcome.success ? 'Ordre parfait !' : outcome.wrong ? `Mauvaise bouchée · ${outcome.wrong}` : 'Le serpent s’est mordu !', `Le bon ordre · ${question.sequence.join(' → ')}`]
  const title = run.mode === 'sling' ? outcome.correct ? 'En plein dans le mille !' : 'Le projectile a rebondi !'
    : outcome.correct ? 'Bonne voie !' : 'Obstacle percuté !'
  return [outcome.correct, title, `Bonne réponse · ${question.answer}${question.explanation ? ` · ${question.explanation}` : ''}`]
}

export function actionGameView(state, run) {
  const question = run.questions[run.index]
  const stage = { slice: fruitStage, snake: snakeStage }[run.mode]?.(run)
    ?? (run.mode === 'runner' ? runnerStage(state, run) : slingStage(state, run))
  const last = run.index + 1 === run.questions.length || run.lives === 0
  const feedback = run.outcome && actionFeedback(run)
  const launch = run.mode === 'sling' ? 'Tirer' : run.mode === 'runner' ? 'Courir' : 'Démarrer'
  return `<div class="action-game">
    <div class="quiz-question">
      <span class="section-kicker">${escapeHtml(courseById.get(question.course).title)}</span>
      <h2 id="game-question" tabindex="-1">${escapeHtml(question.prompt)}</h2>
      <p>${instructions[run.mode]}</p>
    </div>
    <div class="action-hud">
      <span>Score <b data-motion-score>${run.score} pts</b></span>
      ${run.mode === 'slice' ? `<span>Vies <b data-motion-count>${run.lives} / 3</b></span>` : ''}
      ${run.mode === 'snake' ? `<span>Dans l’ordre <b data-motion-count>${run.correct} / ${run.total}</b></span>` : ''}
      ${run.mode === 'runner' ? `<progress aria-label="Temps avant l’obstacle" max="${runnerDuration}" value="${run.phase === 'feedback' ? 0 : runnerDuration - run.motion.elapsed}"></progress>` : ''}
      ${run.mode !== 'snake' ? `<span>Manche <b>${run.index + 1} / ${run.questions.length}</b></span>` : ''}
      ${run.phase === 'playing' && run.mode !== 'sling' ? button(`${icon('pause', 15)} Pause`, 'arcade-pause', 'secondary') : ''}
    </div>
    ${stage}
    ${feedback ? `<div id="game-feedback" class="game-feedback ${feedback[0] ? 'right' : 'wrong'}" tabindex="-1">${icon(feedback[0] ? 'check' : 'rotate', 20)}<div><h3>${escapeHtml(feedback[1])}</h3><p>${escapeHtml(feedback[2])}</p></div></div>` : ''}
    ${run.phase === 'ready' || feedback ? `<div class="game-actions">
      ${feedback ? button(last ? 'Voir le score' : 'Manche suivante', 'arcade-next', 'primary', 'id="game-primary"')
        : button(`${icon('play', 17)} ${launch}`, 'arcade-launch', 'primary', 'id="game-primary"')}
    </div>` : ''}
  </div>`
}

export function paintActionStage(run, stage) {
  const { motion } = run
  const game = stage.closest('.action-game')
  const setText = (selector, value) => {
    const element = game.querySelector(selector)
    if (element.textContent !== value) element.textContent = value
  }
  setText('[data-motion-score]', `${run.score} pts`)
  if (run.mode === 'slice') {
    setText('[data-motion-count]', `${run.lives} / 3`)
    for (const element of stage.children) {
      const index = Number(element.dataset.value)
      const { visible, y } = fruitPosition(run, index)
      element.hidden = !visible || motion.fruits[index].cut
      if (!element.hidden) element.style.bottom = `${y}%`
    }
  } else if (run.mode === 'snake') {
    setText('[data-motion-count]', `${run.correct} / ${run.total}`)
    for (const element of stage.children) {
      if (Object.hasOwn(element.dataset, 'snakeFood')) element.hidden = Number(element.dataset.snakeFood) < run.correct
      else {
        const cell = motion.body[Number(element.dataset.snakePart)]
        element.hidden = cell == null
        if (!element.hidden && Number(element.dataset.cell ?? -1) !== cell) {
          element.style.cssText = cellStyle(cell)
          element.dataset.cell = cell
        }
      }
    }
  } else if (run.mode === 'runner') {
    const progress = Math.min(1, motion.elapsed / runnerDuration)
    stage.style.setProperty('--travel', progress)
    stage.style.setProperty('--pilot-x', `${lanePosition(motion.lane)}%`)
    game.querySelector('progress').value = runnerDuration * (1 - progress)
  } else if (run.mode === 'sling') {
    const progress = Math.min(1, motion.elapsed / shotDuration)
    const arc = Math.sin(Math.PI * progress) * 21
    stage.style.setProperty('--shot-x', `${50 + (lanePosition(motion.lane) - 50) * progress}%`)
    stage.style.setProperty('--shot-y', `${82 - 43 * progress - arc}%`)
  }
}
