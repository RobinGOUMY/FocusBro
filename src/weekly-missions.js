import { dayKey, weekKey } from './dates.js'
import { studyDayKeys } from './progression.js'

const goals = [
  { id: 'regularity', title: 'Un rythme qui tient', description: 'Révise pendant 4 jours de la semaine.', target: 4, metric: 'days', tokens: 120, xp: 80, route: 'focus', icon: 'calendar' },
  { id: 'focus', title: 'Du temps pour comprendre', description: 'Cumule 100 minutes de Pomodoro dans la semaine.', target: 100, metric: 'minutes', tokens: 100, xp: 80, route: 'focus', icon: 'timer' },
  { id: 'recall', title: 'Faire revenir les idées', description: 'Révise 30 cartes dans la semaine. Une carte compte une fois par jour, dans les deux modes.', target: 30, metric: 'cards', tokens: 80, xp: 60, route: 'flashcards', icon: 'cards' },
]

export function weeklyOverview(state, now = Date.now()) {
  const currentWeek = weekKey(now)
  const activity = new Map()
  function entry(week) {
    if (!activity.has(week)) activity.set(week, { days: 0, minutes: 0, cards: new Set() })
    return activity.get(week)
  }
  entry(currentWeek)
  for (const day of studyDayKeys(state)) entry(weekKey(`${day}T12:00:00`)).days += 1
  for (const session of state.sessions) entry(weekKey(session.at)).minutes += session.minutes
  for (const review of state.reviews) entry(weekKey(review.at)).cards.add(`${dayKey(review.at)}:${review.card}`)
  const weeks = [...activity].filter(([week]) => week <= currentWeek).map(([week, totals]) => ({
    week,
    missions: goals.map(goal => {
      const progress = Math.min(goal.target, goal.metric === 'cards' ? totals.cards.size : totals[goal.metric])
      const collected = state.journey.weeks[week]?.claimed.includes(goal.id) ?? false
      return { ...goal, week, progress, collected, completed: collected || progress === goal.target }
    }),
  }))
  return {
    week: currentWeek,
    missions: weeks.find(item => item.week === currentWeek).missions,
    backlog: weeks.filter(item => item.week < currentWeek).flatMap(item => item.missions).filter(mission => mission.completed && !mission.collected),
  }
}

function award(state, mission) {
  const entry = state.journey.weeks[mission.week] ??= { claimed: [], xp: 0 }
  entry.claimed.push(mission.id)
  entry.xp += mission.xp
  state.shop.tokens += mission.tokens
}

export function claimWeeklyMission(state, id, week, now = Date.now()) {
  const overview = weeklyOverview(state, now)
  const mission = [...overview.missions, ...overview.backlog].find(item => item.id === id && item.week === week)
  if (!mission?.completed || mission.collected) return false
  award(state, mission)
  return { xp: mission.xp, tokens: mission.tokens }
}

export function claimWeeklyBacklog(state, now = Date.now()) {
  const { backlog } = weeklyOverview(state, now)
  if (!backlog.length) return false
  for (const mission of backlog) award(state, mission)
  return backlog.reduce((total, mission) => ({ xp: total.xp + mission.xp, tokens: total.tokens + mission.tokens }), { xp: 0, tokens: 0 })
}
