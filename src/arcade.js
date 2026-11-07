import { setupActionRound } from './arcade-action-games.js'
import { runnerQuestions, sliceChallenges, snakeChallenges } from './arcade-challenges.js'
import { arcadeQuestions } from './arcade-questions.js'
import { courseCards, courses } from './courses.js'
import { dayKey, isCourseWorked, shuffle } from './study.js'

export const arcadeModes = {
  flight: { name: 'Quiz en vol', icon: 'flight', color: 'sky', min: 1, max: 5 },
  sprint: { name: 'Sprint cérébral', icon: 'bolt', color: 'amber', min: 1, max: 8 },
  memory: { name: 'Mémo Duo', icon: 'cards', color: 'mint', min: 4, max: 10 },
  slice: { name: 'Tranche-Méninges', icon: 'slice', color: 'amber', min: 1, max: 3 },
  snake: { name: 'Snake en ordre', icon: 'snake', color: 'mint', min: 1, max: 1 },
  runner: { name: 'Rail Express', icon: 'rail', color: 'sky', min: 1, max: 6 },
  sling: { name: 'Siège du savoir', icon: 'sling', color: 'purple', min: 1, max: 5 },
}
export const dailyArcadeXp = 30
export const xpPerAnswer = 2
export const sprintDuration = 45_000
export const arcadeCorrectCount = entry => entry?.correct ?? Math.floor((entry?.xp ?? 0) / 3)

const memoryBank = [...arcadeQuestions, ...courseCards.map(card => ({
  ...card, prompt: card.question, explanation: card.answer,
}))]
const memoryExercises = courses.map(({ id, subject, exercise }) => ({
  id: `${id}:exercise`, course: id, subject, prompt: exercise.question, answer: exercise.answer, explanation: exercise.answer,
}))
const banks = { memory: memoryBank, slice: sliceChallenges, snake: snakeChallenges, runner: runnerQuestions }
const memoryKey = text => text.toLowerCase().trim().replace(/[.!?…]+$/u, '')

export function arcadePool(state, { subject, scope }, mode = 'flight') {
  const eligible = item => (!subject || item.subject === subject) && (scope === 'all' || isCourseWorked(state, item.course))
  const pool = (banks[mode] ?? arcadeQuestions).filter(eligible)
  if (mode !== 'memory') return pool
  const answers = new Set()
  const prompts = new Set()
  const unique = item => {
    const answer = memoryKey(item.answer)
    const prompt = memoryKey(item.prompt)
    if (answers.has(answer) || prompts.has(prompt)) return false
    answers.add(answer)
    prompts.add(prompt)
    return true
  }
  const pairs = pool.filter(unique)
  if (pairs.length < arcadeModes.memory.min) pairs.push(...memoryExercises.filter(eligible).filter(unique))
  return pairs
}

export function startArcade(state, mode, settings, id) {
  if (!Object.hasOwn(arcadeModes, mode)) return null
  const { min, max } = arcadeModes[mode]
  const questions = shuffle(arcadePool(state, settings, mode)).slice(0, max)
    .map(item => item.options ? { ...item, options: shuffle(item.options) } : item)
  if (questions.length < min) return null
  const run = {
    id, mode, subject: settings.subject, assisted: settings.assisted, questions,
    phase: mode === 'sprint' || mode === 'memory' ? 'playing' : 'ready', index: 0, correct: 0, score: 0, combo: 0,
    total: questions.length,
    remaining: sprintDuration, misses: 0, outcome: null,
  }
  if (mode === 'memory') {
    run.board = shuffle(questions.flatMap(question => ['prompt', 'answer'].map(kind => ({ question, kind }))))
    run.open = []
    run.matched = []
  }
  setupActionRound(run)
  return run
}

export function markAnswer(run, choice, collision = false) {
  const question = run.questions[run.index]
  const correct = !collision && question.options[choice] === question.answer
  run.outcome = { choice, correct, collision }
  run.phase = 'feedback'
  if (correct) {
    run.correct += 1
    run.combo += 1
    run.score += 100 + (run.mode === 'sprint' ? 25 * Math.min(run.combo - 1, 4) : 0)
  } else run.combo = 0
}

export function flipMemory(run, index) {
  if (!run.board[index] || run.phase !== 'playing' || run.open.includes(index) || run.matched.includes(index)) return false
  run.open.push(index)
  if (run.open.length < 2) return true
  const [first, second] = run.open.map(position => run.board[position])
  const correct = first.question.id === second.question.id
  run.outcome = { correct, question: first.question }
  run.phase = 'feedback'
  if (correct) {
    run.matched.push(...run.open)
    run.correct += 1
  } else run.misses += 1
  run.score = Math.max(0, run.correct * 100 - run.misses * 15)
  return true
}

export function beginFlight(run) {
  run.flight = { y: 0.48, speed: -0.12, gate: 1.06 }
  run.phase = 'playing'
}

export function advanceFlight(run, elapsed) {
  const flight = run.flight
  const seconds = Math.min(elapsed, 50) / 1000
  flight.speed += 0.86 * seconds
  flight.y += flight.speed * seconds
  flight.gate -= (0.28 + run.index * 0.023) * seconds
  if (flight.y < 0.055 || flight.y > 0.945) {
    markAnswer(run, -1, true)
  } else if (flight.gate <= 0.22) {
    const lane = Math.min(2, Math.floor(flight.y * 3))
    const center = (lane + 0.5) / 3
    markAnswer(run, lane, Math.abs(flight.y - center) > 0.122)
  }
}

export function saveArcadeResult(state, run, now = Date.now()) {
  const { records, days, recent } = state.arcade
  const existing = recent.find(item => item.id === run.id)
  if (existing) return existing
  const day = dayKey(now)
  const entry = days[day] ?? { xp: 0, subjects: {} }
  const xp = Math.max(0, Math.min(run.correct * xpPerAnswer, dailyArcadeXp - entry.xp))
  if (run.correct) {
    entry.correct = arcadeCorrectCount(entry) + run.correct
    entry.xp += xp
    if (run.subject) {
      const subject = entry.subjects[run.subject] ??= { xp: 0, rounds: 0 }
      subject.xp += xp
      subject.rounds += 1
    }
    days[day] = entry
  }
  const record = run.score > (records[run.mode] ?? 0)
  if (record) records[run.mode] = run.score
  const result = { id: run.id, mode: run.mode, subject: run.subject, score: run.score, correct: run.correct, total: run.total ?? run.questions.length, at: now, xp, record }
  recent.unshift(result)
  recent.length = Math.min(recent.length, 30)
  return result
}
