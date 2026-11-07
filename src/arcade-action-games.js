import { shuffle } from './study.js'

export const actionModes = ['slice', 'snake', 'runner', 'sling']
export const snakeSize = 7
export const runnerDuration = 6_500
export const shotDuration = 680

const fruitsPerWave = 3
const fruitFlight = 2_200
const fruitDelays = [0, 210, 420, 2_000, 2_210, 2_420]
const snakeDelay = 390
const directions = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] }

export function setupActionRound(run) {
  const question = run.questions[run.index]
  if (run.mode === 'slice') {
    run.lives ??= 3
    run.total = run.questions.length * fruitsPerWave
    const targets = shuffle(question.targets).slice(0, fruitsPerWave).map(label => ({ label, target: true }))
    const intruders = shuffle(question.intruders).slice(0, fruitsPerWave).map(label => ({ label, target: false }))
    run.motion = { elapsed: 0, fruits: shuffle([...targets, ...intruders]) }
  } else if (run.mode === 'snake') {
    const cells = shuffle(Array.from({ length: snakeSize * (snakeSize - 2) }, (_, cell) => cell))
    run.total = question.sequence.length
    run.motion = {
      elapsed: 0, nextStep: snakeDelay, direction: 'up', nextDirection: 'up',
      body: [(snakeSize - 1) * snakeSize + 3, (snakeSize - 1) * snakeSize + 2],
      food: question.sequence.map((label, index) => ({ label, cell: cells[index] })),
    }
  } else if (run.mode === 'runner' || run.mode === 'sling') {
    run.motion = { elapsed: 0, lane: 1 }
  }
}

export function fruitPosition(run, index) {
  const time = (run.motion.elapsed - fruitDelays[index]) / fruitFlight
  return { visible: time >= 0 && time < 1, y: -9 + 286 * time * (1 - time) }
}

function closeWave(run) {
  run.outcome = {
    targets: run.motion.fruits.filter(fruit => fruit.target).map(fruit => fruit.label),
    found: run.motion.fruits.filter(fruit => fruit.target && fruit.cut).length,
  }
  run.phase = 'feedback'
}

export function sliceFruit(run, index) {
  if (run?.mode !== 'slice' || run.phase !== 'playing') return false
  const fruit = run.motion.fruits[index]
  if (!fruit || fruit.cut || !fruitPosition(run, index).visible) return false
  fruit.cut = true
  if (fruit.target) {
    run.correct += 1
    run.score += 100
  } else {
    run.lives -= 1
    run.score = Math.max(0, run.score - 30)
  }
  if (!run.lives || run.motion.fruits.filter(fruit => fruit.target).every(fruit => fruit.cut)) closeWave(run)
  return true
}

export function turnSnake(run, direction) {
  if (run?.mode !== 'snake' || run.phase !== 'playing' || !Object.hasOwn(directions, direction)) return
  const [x, y] = directions[run.motion.direction]
  const [nextX, nextY] = directions[direction]
  if (x + nextX || y + nextY) run.motion.nextDirection = direction
}

function advanceSnake(run) {
  const { motion } = run
  motion.direction = motion.nextDirection
  const [dx, dy] = directions[motion.direction]
  const head = motion.body[0]
  const x = (head % snakeSize + dx + snakeSize) % snakeSize
  const y = (Math.floor(head / snakeSize) + dy + snakeSize) % snakeSize
  const cell = y * snakeSize + x
  const food = motion.food.findIndex((item, index) => item.cell === cell && index >= run.correct)
  const eats = food === run.correct
  if (food > run.correct || (eats ? motion.body : motion.body.slice(0, -1)).includes(cell)) {
    run.outcome = { success: false, wrong: food > run.correct ? motion.food[food].label : '' }
    run.phase = 'feedback'
    return
  }
  motion.body.unshift(cell)
  if (!eats) {
    motion.body.pop()
    return
  }
  run.correct += 1
  run.score += 100
  if (run.correct === run.total) {
    run.outcome = { success: true }
    run.phase = 'feedback'
  }
}

export function advanceActionRound(run, elapsed) {
  const { motion } = run
  motion.elapsed += Math.min(elapsed, 80)
  if (run.mode === 'slice' && motion.elapsed >= fruitDelays.at(-1) + fruitFlight) closeWave(run)
  if (run.mode === 'snake' && motion.elapsed >= motion.nextStep) {
    motion.nextStep += snakeDelay
    advanceSnake(run)
  }
  if (run.mode === 'runner' && motion.elapsed >= runnerDuration) return motion.lane
  if (run.mode === 'sling' && motion.elapsed >= shotDuration) return motion.lane
  return null
}
