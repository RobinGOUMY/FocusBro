import { hasSubject, starterCards } from './content.js'
import { courseCards } from './courses.js'
import { createMathPractice, mathContext } from './math-practice.js'
import { dayKey } from './dates.js'
import { defaultCosmetics, legacyRewards, levels, reachedTier } from './pass.js'
import { createJourney, dailyMemoryXp, earnedXp, studyDayKeys, syncJourney } from './progression.js'

export { dayKey } from './dates.js'

export const storageKey = 'focusbro:v1'
export const durations = { focus: 25 * 60_000, break: 5 * 60_000 }
export const dailyGoal = 25

export function createState() {
  return {
    timer: freshTimer(),
    sessions: [],
    reviews: [],
    schedule: {},
    customCards: [],
    notes: [],
    reading: {},
    mathPractice: createMathPractice(),
    profile: { name: '', ...defaultCosmetics(), volume: 40, chime: true },
    arcade: { records: {}, days: {}, recent: [] },
    shop: { tokens: 0, owned: [], claimed: {} },
    journey: createJourney(),
  }
}

export function restoreState(stored) {
  const defaults = createState()
  const state = {
    ...defaults, ...stored,
    profile: { ...defaults.profile, ...stored.profile },
    shop: { ...defaults.shop, ...stored.shop },
    journey: { ...defaults.journey, ...stored.journey },
  }
  if (!stored.journey) state.journey.legacyOwned = legacyRewards(earnedXp(state))
  syncJourney(state)
  if (state.timer.subject && !hasSubject(state.timer.subject)) {
    state.timer = { ...state.timer, subject: 'autre', activity: null }
  }
  return state
}

export function freshTimer(phase = 'focus', subject = '') {
  return { phase, subject, status: 'ready', remaining: durations[phase], endsAt: null, id: null, activity: null }
}

export function remainingTime(timer, now = Date.now()) {
  return timer.status === 'running' ? Math.max(0, timer.endsAt - now) : timer.remaining
}

export function settleTimer(state, now = Date.now()) {
  const { timer } = state
  if (timer.status !== 'running' || timer.endsAt > now) return null
  if (timer.phase === 'focus') {
    if (!state.sessions.some(session => session.id === timer.id)) {
      state.sessions.push({ id: timer.id, subject: timer.subject, at: timer.endsAt, minutes: 25, xp: 50 })
    }
    state.timer = freshTimer('break', timer.subject)
  } else {
    state.timer = freshTimer('focus', timer.subject)
  }
  return timer.phase
}

export function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    const item = result[index]
    result[index] = result[target]
    result[target] = item
  }
  return result
}

function addDays(timestamp, days) {
  const date = new Date(timestamp)
  date.setDate(date.getDate() + days)
  return date
}

export function studyStats(state, now = Date.now()) {
  const today = dayKey(now)
  const arcadeDays = Object.entries(state.arcade.days)
  const days = new Set([...state.sessions.map(item => dayKey(item.at)), ...state.reviews.map(item => dayKey(item.at)), ...state.notes.map(item => dayKey(item.createdAt)), ...Object.values(state.reading).filter(item => item.completedAt).map(item => dayKey(item.completedAt)), ...Object.keys(state.mathPractice.days), ...arcadeDays.map(([day]) => day)])
  let offset = days.has(today) ? 0 : -1
  let streak = 0
  while (days.has(dayKey(addDays(now, offset--)))) streak += 1
  return {
    xp: earnedXp(state),
    studyDays: studyDayKeys(state).length,
    minutes: state.sessions.reduce((total, item) => total + item.minutes, 0),
    todayMinutes: state.sessions.reduce((total, item) => total + (dayKey(item.at) === today ? item.minutes : 0), 0),
    streak,
  }
}

export function levelInfo(xp, days = 0) {
  const index = levels.findLastIndex(level => reachedTier(level, xp, days))
  const current = levels[index]
  const next = levels[index + 1]
  const xpProgress = next ? Math.min(1, (xp - current.xp) / (next.xp - current.xp)) : 1
  const dayProgress = next && next.days > current.days ? (days - current.days) / (next.days - current.days) : 1
  const progress = Math.max(0, Math.min(1, xpProgress, dayProgress))
  return { index, current, next, progress }
}

export function availableCustomCards(state) {
  return state.customCards.filter(card => hasSubject(card.subject))
}

export function allCards(state) {
  return [...courseCards, ...starterCards, ...availableCustomCards(state)]
}

export function dueCards(state, now = Date.now()) {
  const today = dayKey(now)
  return allCards(state)
    .filter(card => !state.schedule[card.id] || (state.schedule[card.id].due && state.schedule[card.id].due <= today))
    .sort((first, second) => Number(Boolean(state.schedule[second.id])) - Number(Boolean(state.schedule[first.id]))
      || (state.schedule[first.id]?.due ?? today).localeCompare(state.schedule[second.id]?.due ?? today))
}

export function gradeCard(state, card, grade, now = Date.now()) {
  const intervals = [1, 2, 4, 8, 16]
  const previousBox = state.schedule[card.id]?.box ?? -1
  const box = grade === 'easy' ? Math.min(intervals.length - 1, Math.max(0, previousBox + 1))
    : grade === 'medium' ? Math.max(0, previousBox) : 0
  const days = grade === 'easy' ? intervals[box] : 1
  const todayXp = state.reviews.filter(review => dayKey(review.at) === dayKey(now)).reduce((total, review) => total + review.xp, 0)
  const xp = todayXp < dailyMemoryXp && grade === 'easy' && (state.reviews.filter(review => review.grade === 'easy' && !review.practice).length + 1) % 10 === 0 ? 20 : 0
  state.schedule[card.id] = { box, due: dayKey(addDays(now, days)) }
  state.reviews.push({ subject: card.subject, card: card.id, grade, at: now, xp })
  return xp
}

export function isCourseWorked(state, id) {
  const progress = state.reading[id]
  return progress?.worked ?? Boolean(progress?.completedAt)
}

export function mathReviewContext(state, detail = '') {
  const context = mathContext(detail)
  if (context.key !== 'mix' || detail === 'tous') return context
  return { ...context, key: 'worked', options: context.options.filter(skill => isCourseWorked(state, skill.course)) }
}

export function reviewCards(state, study, mode = study.mode) {
  const cards = mode === 'practice' ? allCards(state) : dueCards(state)
  return cards.filter(card => (!study.subject || card.subject === study.subject)
    && (!study.course || card.course === study.course)
    && (study.scope === 'all' || (card.course && isCourseWorked(state, card.course))))
}

export function weekActivity(state, now = Date.now()) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(now, index - 6)
    const key = dayKey(date)
    const minutes = state.sessions.filter(item => dayKey(item.at) === key).reduce((total, item) => total + item.minutes, 0)
    return { date, minutes }
  })
}
