export function randomTools(seed) {
  let state = seed >>> 0
  function random() {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 2 ** 32
  }
  const int = (min, max) => min + Math.floor(random() * (max - min + 1))
  const pick = items => items[int(0, items.length - 1)]
  return { int, pick, shuffle(items) {
    const shuffled = [...items]
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const other = int(0, index)
      ;[shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]]
    }
    return shuffled
  } }
}

export const num = value => String(value).replaceAll('-', '−').replaceAll('.', ',')
export const term = value => `${value < 0 ? '−' : '+'} ${num(Math.abs(value))}`
export const coefficient = value => value === 1 ? 'x' : value === -1 ? '−x' : `${num(value)}x`
export const pair = (x, y) => `(${num(x)} ; ${num(y)})`

export function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}

export function fraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator)
  const sign = denominator < 0 ? -1 : 1
  return Math.abs(denominator) === divisor ? String(sign * numerator / divisor)
    : `${sign * numerator / divisor}/${Math.abs(denominator) / divisor}`
}

export function numeric(prompt, hint, solution, fields, mistakes = []) {
  return { prompt, hint, solution, fields: fields.map(([label, expected]) => ({ label, expected: String(expected) })), mistakes }
}

export function choice(rng, prompt, hint, solution, answer, ...alternatives) {
  return { prompt, hint, solution, options: rng.shuffle([[answer, ''], ...alternatives]).map(([label, feedback]) => ({ label, feedback })), answer }
}

function parseNumber(value, percent) {
  const cleaned = value.trim().replaceAll('−', '-').replaceAll(',', '.').replace(/\s*\/\s*/g, '/')
  const text = percent ? cleaned.replace(/\s*%$/, '') : cleaned
  const match = /^([+-]?)(\d*)(?:\.(\d+))?(?:\/([+-]?\d+))?$/.exec(text)
  if (!match || !(match[2] || match[3]) || (match[3] && match[4]) || text.length > 40) return null
  const denominator = match[4] ? BigInt(match[4]) : 10n ** BigInt(match[3]?.length ?? 0)
  if (!denominator) return null
  const numerator = BigInt((match[2] || '0') + (match[3] ?? '')) * (match[1] === '-' ? -1n : 1n)
  return [numerator, denominator]
}

function equals(first, second) {
  return first[0] * second[1] === first[1] * second[0]
}

export function checkProblem(problem, values) {
  if (problem.options) {
    const option = /^\d$/.test(values[0] ?? '') && problem.options[Number(values[0])]
    if (!option) return null
    return { kind: option.label === problem.answer ? 'correct' : 'incorrect', submitted: [option.label], feedback: option.feedback }
  }
  const parsed = problem.fields.map((field, index) => parseNumber(values[index] ?? '', field.label.includes('%')))
  if (parsed.some(value => !value)) return null
  const matches = parsed.map((value, index) => equals(value, parseNumber(problem.fields[index].expected)))
  const correct = matches.every(Boolean)
  const misconception = correct ? null : problem.mistakes.find(([answers]) => parsed.every((value, index) => equals(value, parseNumber(String(answers[index])))))
  const remaining = problem.fields.filter((_, index) => !matches[index]).map(field => field.label.toLocaleLowerCase('fr'))
  const partial = !correct && matches.some(Boolean) ? `Une partie de ta réponse est juste. Vérifie ${remaining.join(' et ')}.` : ''
  return { kind: correct ? 'correct' : 'incorrect', submitted: values, feedback: misconception?.[1] ?? partial }
}
