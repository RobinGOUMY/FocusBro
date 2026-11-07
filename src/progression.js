import { dayKey } from './dates.js'

export const studyDayTargets = { minutes: 25, cards: 10, maths: 3, explanation: 80, example: 20 }
export const dailyMemoryXp = 60
export const dailyMathXp = 50
export const mathAnswerXp = 10
export const explanationXp = 30

export function createJourney() {
  return { version: 1, legacyOwned: [], days: [], claimedTiers: [], weeks: {}, explanations: {} }
}

export function detailedExplanation(note) {
  return (note.body?.trim().length ?? 0) >= studyDayTargets.explanation
    && (note.example?.trim().length ?? 0) >= studyDayTargets.example
}

export function studyDayKeys(state) {
  const qualified = new Set(state.journey.days)
  const minutes = new Map()
  const cards = new Map()
  for (const session of state.sessions) {
    const day = dayKey(session.at)
    minutes.set(day, (minutes.get(day) ?? 0) + session.minutes)
  }
  for (const review of state.reviews) {
    const day = dayKey(review.at)
    if (!cards.has(day)) cards.set(day, new Set())
    cards.get(day).add(review.card)
  }
  for (const [day, total] of minutes) if (total >= studyDayTargets.minutes) qualified.add(day)
  for (const [day, unique] of cards) if (unique.size >= studyDayTargets.cards) qualified.add(day)
  for (const [day, entry] of Object.entries(state.mathPractice.days)) {
    if ((entry?.correct ?? 0) >= studyDayTargets.maths) qualified.add(day)
  }
  for (const note of state.notes) if (detailedExplanation(note)) qualified.add(dayKey(note.createdAt))
  for (const day of Object.keys(state.journey.explanations)) qualified.add(day)
  return [...qualified].sort()
}

export function syncJourney(state) {
  state.journey.days = studyDayKeys(state)
}

export function earnedXp(state) {
  return [...state.sessions, ...state.reviews].reduce((total, item) => total + item.xp, 0)
    + Object.values(state.arcade.days).reduce((total, entry) => total + entry.xp, 0)
    + Object.values(state.mathPractice.days).reduce((total, entry) => total + (entry?.xp ?? 0), 0)
    + Object.values(state.journey.weeks).reduce((total, entry) => total + entry.xp, 0)
    + Object.values(state.journey.explanations).reduce((total, entry) => total + entry.xp, 0)
}

export function rewardExplanation(state, note, now = Date.now(), previous) {
  const day = dayKey(now)
  const unchanged = previous && previous.body === note.body && previous.example === note.example
  if (unchanged || (!previous && dayKey(note.createdAt) !== day) || !detailedExplanation(note) || state.journey.explanations[day]) return 0
  state.journey.explanations[day] = { note: note.id, subject: note.subject, xp: explanationXp }
  return explanationXp
}
