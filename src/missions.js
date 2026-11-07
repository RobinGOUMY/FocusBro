import { xpPerAnswer } from './arcade.js'
import { dayKey } from './study.js'

const focusMission = {
  id: 'focus', icon: 'timer', color: 'purple', activity: 'Focus', route: 'focus',
  title: 'Dans la zone', description: 'Termine un Pomodoro de 25 minutes.',
  target: 1, tokens: 35,
  count: (state, day) => state.sessions.filter(session => dayKey(session.at) === day).length,
}

const recallMissions = [
  {
    id: 'cards', icon: 'cards', color: 'mint', activity: 'Flashcards', route: 'flashcards',
    title: 'Mémoire vive', description: 'Révise 5 flashcards différentes, dans le mode de ton choix.',
    target: 5, tokens: 20,
    count: (state, day) => new Set(state.reviews.filter(review => dayKey(review.at) === day).map(review => review.card)).size,
  },
  {
    id: 'arcade', icon: 'arcade', color: 'sky', activity: 'Arcade', route: 'arcade',
    title: 'Bon réflexe', description: 'Cumule 5 réussites dans des parties terminées. Les réponses, les paires et les actions correctes comptent.',
    target: 5, tokens: 20,
    count: (state, day) => {
      const entry = state.arcade.days[day]
      return entry?.correct ?? (entry?.xp ?? 0) / xpPerAnswer
    },
  },
]

const studyMissions = [
  {
    id: 'course', icon: 'book', color: 'sky', activity: 'Cours', route: 'cours',
    title: 'Tourne la page', description: 'Marque un chapitre comme lu après ta lecture.',
    target: 1, tokens: 20,
    count: (state, day) => Object.values(state.reading).filter(item => item.completedAt && dayKey(item.completedAt) === day).length,
  },
  {
    id: 'math', icon: 'math', color: 'amber', activity: 'Maths', route: 'exercices',
    title: 'À toi de calculer', description: 'Réussis 3 exercices de maths.',
    target: 3, tokens: 20,
    count: (state, day) => state.mathPractice.days[day]?.correct ?? 0,
  },
  {
    id: 'note', icon: 'pen', color: 'mint', activity: 'Feynman', route: 'feynman',
    title: 'À ta façon', description: 'Enregistre une nouvelle explication dans le carnet.',
    target: 1, tokens: 20,
    count: (state, day) => state.notes.filter(note => dayKey(note.createdAt) === day).length,
  },
]

export const dailyBonus = 25

export function dailyMissions(state, now = Date.now()) {
  const day = dayKey(now)
  const index = Math.floor(Date.parse(day) / 86_400_000)
  const claimed = state.shop.claimed[day] ?? []
  const missions = [focusMission, recallMissions[index % recallMissions.length], studyMissions[index % studyMissions.length]]
  return {
    day,
    missions: missions.map(({ count, ...mission }) => {
      const collected = claimed.includes(mission.id)
      const progress = collected ? mission.target : Math.min(mission.target, count(state, day))
      return { ...mission, progress, completed: progress === mission.target, collected }
    }),
  }
}

export function claimDailyMission(state, id, day, now = Date.now()) {
  const today = dailyMissions(state, now)
  if (today.day !== day) return false
  const mission = today.missions.find(item => item.id === id)
  if (!mission?.completed || mission.collected) return false
  const bonus = today.missions.filter(item => item.collected).length === today.missions.length - 1 ? dailyBonus : 0
  state.shop.claimed[day] = [...(state.shop.claimed[day] ?? []), id]
  state.shop.tokens += mission.tokens + bonus
  return { tokens: mission.tokens, bonus }
}
