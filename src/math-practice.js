import numberSkills from './math-numbers.js'
import topicSkills from './math-topics.js'
import { checkProblem, randomTools } from './math-problem.js'

export const mathSkills = Object.entries({ ...numberSkills, ...topicSkills }).flatMap(([course, skills]) =>
  skills.map(([id, name, generate]) => ({ id, name, course, generate })),
)

export const skillById = new Map(mathSkills.map(skill => [skill.id, skill]))

const cardSkills = {
  arithmetique: ['prime', 'divisibility', 'prime-factors'],
  'reels-intervalles': ['decimal-class', 'interval-intersection', 'absolute-distance'],
  'calcul-litteral': ['exponent-product', 'square-expansion', 'sqrt-square'],
  'equations-inequations': ['distributed-equation', 'negative-inequality', 'product-zero'],
  'logique-ensembles': ['counterexample', 'exists-quantifier', 'negation'],
  'vecteurs-plan': ['vector-coordinates', 'vector-determinant', 'midpoint'],
  'droites-plan': ['slope', 'point-on-line', 'vertical-line'],
  'fonctions-images': ['function-image', 'function-antecedent', 'function-domain'],
  'variations-fonctions': ['absolute-min', 'affine-variation', 'inverse-compare'],
  'pourcentages-statistiques': ['percent-coefficient', 'median', 'weighted-average'],
  'tableaux-croises': ['marginal-count', 'conditional-frequency', 'global-frequency'],
  probabilites: ['complement-probability', 'weighted-probability', 'event-intersection'],
  'python-algorithmes': ['range-count', 'modulo-condition', 'python-return'],
}
const legacySkills = ['slope', 'midpoint', 'square-expansion', 'difference-squares', 'linear-equation', 'point-distance']

export const courseExerciseSkills = {
  arithmetique: 'reduce-fraction',
  'reels-intervalles': 'absolute-interval',
  'calcul-litteral': 'difference-squares',
  'equations-inequations': 'product-inequality',
  'logique-ensembles': 'universal-counterexample',
  'vecteurs-plan': 'point-alignment',
  'droites-plan': 'line-intersection',
  'fonctions-images': 'function-antecedent',
  'variations-fonctions': 'square-compare',
  'pourcentages-statistiques': 'successive-rates',
  'tableaux-croises': 'compare-frequencies',
  probabilites: 'event-union',
  'python-algorithmes': 'range-sum',
}

export function skillForCard(card) {
  if (card.subject !== 'maths') return null
  const index = Number(card.id.match(/:card-(\d+)$/)?.[1]) - 1
  const legacyIndex = Number(card.id.match(/^maths-(\d+)$/)?.[1])
  return skillById.get(cardSkills[card.course]?.[index] ?? legacySkills[legacyIndex]) ?? null
}

export function mathContext(detail = '') {
  const skill = skillById.get(detail)
  if (skill) return { key: skill.id, course: skill.course, skill, options: [skill] }
  const options = mathSkills.filter(item => item.course === detail)
  if (options.length) return { key: detail, course: detail, skill: null, options }
  return { key: 'mix', course: '', skill: null, options: mathSkills }
}

export function createMathPractice() {
  return { tracks: {}, skills: {}, recent: {}, days: {} }
}

export const problemFor = current => skillById.get(current.skill).generate(randomTools(current.seed))
const signature = problem => [problem.prompt, ...(problem.options?.map(option => option.label).sort() ?? [])].join('|')
const valueKey = text => text.match(/[-−]?\d+(?:[,.]\d+)?/g)?.join('|') ?? ''

function chooseSkill(model, context, track) {
  const current = track.current?.skill
  const candidates = context.options.filter(skill => skill.id !== current)
  if (!candidates.length) return context.options[0].id
  const pending = candidates.filter(skill => model.skills[skill.id]?.recovery)
  if (pending.length) {
    pending.sort((first, second) => model.skills[second.id].recovery - model.skills[first.id].recovery)
    return pending[0].id
  }
  const fresh = candidates.filter(skill => !track.recentSkills.includes(skill.id))
  const eligible = fresh.length ? fresh : candidates
  const weighted = eligible.flatMap(skill => {
    const stats = model.skills[skill.id]
    const weight = stats ? 1 + Math.min(4, Math.floor(3 * stats.missed / (stats.correct + 1))) : 3
    return Array(weight).fill(skill.id)
  })
  return weighted[Math.floor(Math.random() * weighted.length)]
}

function statsFor(model, skill) {
  model.skills[skill] ??= { correct: 0, missed: 0, recovery: 0 }
  return model.skills[skill]
}

function variant(model, skill, { source = '', previous } = {}) {
  const recent = model.recent[skill] ?? []
  const excludedValues = valueKey(source)
  const previousKey = previous?.skill === skill ? signature(problemFor(previous)) : ''
  const firstSeed = Math.floor(Math.random() * 2 ** 32)
  let fallback
  for (let offset = 0; offset < 120; offset += 1) {
    const current = { skill, seed: (firstSeed + Math.imul(offset, 2654435761)) >>> 0 }
    const problem = problemFor(current)
    const key = signature(problem)
    if (key === previousKey || key === recent.at(-1) || (excludedValues && valueKey(problem.prompt) === excludedValues)) continue
    if (!recent.includes(key)) {
      model.recent[skill] = [...recent.slice(-23), key]
      return current
    }
    fallback ??= { current, key }
  }
  if (!fallback) throw new Error(`Impossible de varier l’exercice ${skill}`)
  model.recent[skill] = [...recent.slice(-23), fallback.key]
  return fallback.current
}

export function beginMathTrack(model, context, { source = '', recovery = false, restart = false } = {}) {
  const existing = model.tracks[context.key]
  if (existing && !recovery && !restart) return false
  const track = existing ?? { recentSkills: [], chain: 0, answered: 0, correct: 0 }
  const skill = chooseSkill(model, context, track)
  if (recovery) {
    statsFor(model, skill).recovery = 2
    track.chain = 0
  }
  track.current = variant(model, skill, { source, previous: track.current })
  track.recentSkills = [...track.recentSkills.slice(-3), skill]
  track.result = null
  model.tracks[context.key] = track
  return true
}

function matchingTrack(model, context, current) {
  const track = model.tracks[context.key]
  return track?.current && current && track.current.skill === current.skill && track.current.seed === current.seed ? track : null
}

export function recordMathAttempt(model, context, current, values, day) {
  const track = matchingTrack(model, context, current)
  if (!track || track.result) return false
  const result = values ? checkProblem(problemFor(current), values) : { kind: 'stuck', submitted: [], feedback: '' }
  if (!result) return 'invalid'
  const stats = statsFor(model, current.skill)
  const recovering = stats.recovery > 0
  if (result.kind === 'correct') {
    stats.correct += 1
    stats.recovery = Math.max(0, stats.recovery - 1)
    track.correct += 1
    track.chain += 1
  } else {
    stats.missed += 1
    stats.recovery = 2
    track.chain = 0
  }
  track.answered += 1
  track.result = { ...result, recovered: recovering && stats.recovery === 0 }
  model.days[day] = true
  return true
}

export function advanceMathTrack(model, context, current) {
  const track = matchingTrack(model, context, current)
  if (!track?.result) return false
  const skill = model.skills[current.skill]?.recovery ? current.skill : chooseSkill(model, context, track)
  track.current = variant(model, skill, { previous: track.current })
  track.recentSkills = [...track.recentSkills.slice(-3), skill]
  track.result = null
  return true
}
