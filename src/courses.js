import maths from './course-maths.js'
import french from './course-french.js'
import history from './course-history.js'
import physics from './course-physics.js'
import biology from './course-biology.js'
import languages from './course-languages.js'
import society from './course-society.js'

const syllabuses = {
  maths, francais: french, histoire: history, physique: physics, svt: biology,
  ...languages, ...society,
}

export const courses = Object.entries(syllabuses).flatMap(([subject, chapters]) =>
  chapters.map((chapter, index) => ({ ...chapter, subject, number: index + 1 })),
)

export const courseById = new Map(courses.map(course => [course.id, course]))

export const courseCards = courses.flatMap(course =>
  course.cards.map(([question, answer], index) => ({
    id: `${course.id}:card-${index + 1}`, course: course.id, subject: course.subject, question, answer,
  })),
)
