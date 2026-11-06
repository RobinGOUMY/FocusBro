import { hasSubject } from './content.js'
import { courses } from './courses.js'
import { mathSkills } from './math-practice.js'
import { isCourseWorked, reviewCards } from './study.js'

export function focusActivities(state, subject = state.timer.subject) {
  if (!hasSubject(subject)) return []

  const options = []
  const chapters = courses.filter(course => course.subject === subject)
  const worked = chapters.filter(course => isCourseWorked(state, course.id))
  if (subject === 'maths' && worked.length) {
    const pending = mathSkills.find(skill => isCourseWorked(state, skill.course) && state.mathPractice.skills[skill.id]?.recovery)
    options.push({
      kind: 'exercise', label: 'Exercices de maths', icon: 'math',
      title: pending?.name ?? 'Un exercice de maths à résoudre',
      detail: pending ? 'Reprends cette compétence avec une nouvelle variante.' : 'Commence par un exercice, puis enchaîne selon tes réponses.',
      route: pending ? `exercices/${pending.id}` : 'exercices',
    })
  }

  const cards = reviewCards(state, { subject }, 'practice')
  const review = cards.length ? {
    kind: 'cards', label: 'Flashcards', icon: 'cards', title: 'Une série de flashcards',
    detail: 'Révise les chapitres que tu as indiqués comme travaillés.', route: `flashcards/${subject}`,
  } : null
  if (review) options.push(review)

  const unread = chapters.filter(course => !state.reading[course.id]?.completedAt)
  const openedAt = course => state.reading[course.id]?.openedAt ?? 0
  const lesson = unread.sort((a, b) => openedAt(b) - openedAt(a))[0]
    ?? chapters.toSorted((a, b) => openedAt(a) - openedAt(b))[0]
  if (lesson) options.push({
    kind: 'course', label: 'Lire un cours', icon: 'book', title: lesson.title,
    detail: 'Lis le chapitre, puis essaie l’exercice avant d’ouvrir la correction.', route: `cours/${lesson.id}`,
  })
  const answered = new Set(state.notes.map(note => note.course))
  const challenge = worked.find(course => !answered.has(course.id)) ?? worked[0]
  if (challenge) options.push({
    kind: 'feynman', label: 'Défi Feynman', icon: 'pen', title: challenge.title,
    detail: 'Réponds à la question guidée avec tes mots et invente un exemple.', route: `feynman/${challenge.id}`,
  })

  options.push({
    kind: 'free', label: 'Travail libre', icon: 'target', title: 'Un objectif sur ton propre cours',
    detail: 'Choisis une page de ton cours. Lis-la, puis explique trois idées de mémoire ou fais un exercice associé.',
  })
  return options
}

export function focusActivity(state, choice, options) {
  if (state.timer.status !== 'ready' && state.timer.activity) return state.timer.activity
  options ??= focusActivities(state)
  return options.find(option => option.kind === choice) ?? options[0]
}
