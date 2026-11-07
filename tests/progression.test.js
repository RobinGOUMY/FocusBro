import assert from 'node:assert/strict'
import test from 'node:test'
import { saveArcadeResult } from '../src/arcade.js'
import { dayKey, weekKey } from '../src/dates.js'
import { courses, courseCards } from '../src/courses.js'
import { beginMathTrack, mathContext, problemFor, recordMathAttempt, advanceMathTrack } from '../src/math-practice.js'
import { buyCosmetic, claimPassRewards, levels, ownsCosmetic, passCosmetics, shopItems } from '../src/pass.js'
import { earnedXp, rewardExplanation, studyDayKeys, syncJourney } from '../src/progression.js'
import { createState, gradeCard, levelInfo, restoreState } from '../src/study.js'
import { claimWeeklyBacklog, claimWeeklyMission, weeklyOverview } from '../src/weekly-missions.js'

const at = (day, month = 0, year = 2026) => new Date(year, month, day, 12).getTime()
function focus(state, now, count = 1) {
  for (let index = 0; index < count; index += 1) {
    state.sessions.push({ id: `${now}:${index}`, at: now, subject: 'maths', minutes: 25, xp: 50 })
  }
}
function recall(state, now, count = 10) {
  state.reviews.push(...courseCards.slice(0, count).map((card, index) => ({
    at: now, card: card.id, subject: card.subject, grade: 'easy', xp: index === 9 ? 20 : 0,
  })))
}

test('le parcours demande une année de régularité, même avec beaucoup d’XP', () => {
  const state = createState()
  for (let day = 1; day <= 30; day += 1) focus(state, at(day), 20)
  assert(earnedXp(state) > levels.at(-1).xp)
  assert.equal(studyDayKeys(state).length, 30)
  assert(levelInfo(earnedXp(state), 30).current.number < 40)
  assert.equal(levels.length, 40)
  assert.equal(levels.at(-1).days, 160)
})

test('un rythme de quatre jours de 50 minutes et dix cartes aboutit à la quarantième semaine', () => {
  const state = createState()
  let completedWeek = 0
  for (let week = 0; week < 40; week += 1) {
    for (let offset = 0; offset < 4; offset += 1) {
      const now = at(5 + week * 7 + offset)
      focus(state, now, 2)
      recall(state, now)
      syncJourney(state)
      for (const mission of weeklyOverview(state, now).missions) {
        claimWeeklyMission(state, mission.id, mission.week, now)
      }
    }
    if (levelInfo(earnedXp(state), studyDayKeys(state).length).current.number === 40 && !completedWeek) completedWeek = week + 1
  }
  assert.equal(completedWeek, 40)
  assert.equal(earnedXp(state), 28000)
  assert.equal(studyDayKeys(state).length, 160)
})

test('les anciennes sauvegardes gardent leurs cosmétiques acquis, même sous les nouveaux seuils', () => {
  for (const xp of [0, 150, 500, 4200]) {
    const old = createState()
    delete old.journey
    old.sessions.push({ id: 'old', subject: 'maths', minutes: 25, at: at(1), xp })
    old.profile.theme = xp >= 500 ? 'sky' : xp >= 150 ? 'mint' : 'violet'
    old.shop.owned = ['petals']
    const state = restoreState(old)
    const acquired = passCosmetics.filter(item => item.legacyXp !== undefined && item.legacyXp <= xp)
    for (const item of acquired) assert(ownsCosmetic(state, item, xp, 1), `${xp} · ${item.id}`)
    assert(!ownsCosmetic(state, passCosmetics.find(item => item.id === 'zenith'), xp, 1))
    assert(ownsCosmetic(state, shopItems.find(item => item.id === 'petals'), xp, 1))
    assert.equal(earnedXp(state), xp)
    assert.deepEqual(restoreState(JSON.parse(JSON.stringify(state))).journey.legacyOwned, state.journey.legacyOwned)
  }
})

test('une journée compte une fois, et les vacances ne retirent aucun jour acquis', () => {
  const state = createState()
  focus(state, at(1), 4)
  recall(state, at(1), 20)
  state.mathPractice.days[dayKey(at(1))] = { correct: 8, xp: 50 }
  state.arcade.days[dayKey(at(2))] = { xp: 30, subjects: {}, correct: 15 }
  syncJourney(state)
  assert.deepEqual(studyDayKeys(state), [dayKey(at(1))])
  focus(state, at(1, 3))
  assert.equal(studyDayKeys(state).length, 2)
})

test('les cartes répétées ne gonflent ni les jours ni le compteur hebdomadaire', () => {
  const state = createState()
  const review = { card: courseCards[0].id, at: at(5), subject: 'maths', grade: 'easy', xp: 0 }
  state.reviews = Array.from({ length: 50 }, () => ({ ...review }))
  assert.equal(studyDayKeys(state).length, 0)
  assert.equal(weeklyOverview(state, at(5)).missions.find(item => item.id === 'recall').progress, 1)
})

test('les objectifs et leurs bonus restent récupérables une seule fois après changement de semaine', () => {
  const state = createState()
  for (let day = 5; day <= 8; day += 1) {
    focus(state, at(day))
    recall(state, at(day))
  }
  const nextWeek = at(12)
  assert.equal(weeklyOverview(state, nextWeek).backlog.length, 3)
  assert.deepEqual(claimWeeklyBacklog(state, nextWeek), { xp: 220, tokens: 300 })
  assert.equal(earnedXp(state), 500)
  assert.equal(state.shop.tokens, 300)
  assert.equal(claimWeeklyBacklog(state, nextWeek), false)
  assert.equal(claimWeeklyMission(state, 'focus', weekKey(at(5)), nextWeek), false)
  assert.equal(claimWeeklyMission(state, 'focus', weekKey(at(19)), nextWeek), false)
  const restored = restoreState(JSON.parse(JSON.stringify(state)))
  assert.equal(claimWeeklyBacklog(restored, nextWeek), false)
})

test('les semaines commencent le lundi, y compris à cheval sur le nouvel an', () => {
  assert.equal(weekKey(at(1)), '2025-12-29')
  assert.equal(weekKey(at(4)), '2025-12-29')
  assert.equal(weekKey(at(5)), '2026-01-05')
})

test('les réserves du pass se récupèrent une fois et les objets prestigieux demandent des jours', () => {
  const state = createState()
  focus(state, at(5))
  assert.equal(claimPassRewards(state), 25)
  assert.equal(claimPassRewards(state), false)
  state.shop.tokens = 100000
  state.sessions[0].xp = 30000
  assert.equal(buyCosmetic(state, 'theme', 'singularity', 30000), false)
  state.journey.days = Array.from({ length: 144 }, (_, index) => dayKey(at(index + 1)))
  assert(buyCosmetic(state, 'theme', 'singularity', 30000))
  assert.equal(state.shop.tokens, 92500)
  assert.equal(buyCosmetic(state, 'theme', 'singularity', 30000), false)
})

test('l’Arcade préserve les anciens gains et ne peut pas soustraire de l’XP après le rééquilibrage', () => {
  const state = createState()
  state.arcade.days[dayKey(at(5))] = { xp: 60, subjects: {} }
  const run = { id: 'run', mode: 'flight', subject: 'maths', score: 100, correct: 1, questions: [{}] }
  assert.equal(saveArcadeResult(state, run, at(5)).xp, 0)
  assert.equal(state.arcade.days[dayKey(at(5))].xp, 60)
  assert.equal(state.arcade.days[dayKey(at(5))].correct, 21)
  saveArcadeResult(state, run, at(5))
  assert.equal(state.arcade.days[dayKey(at(5))].correct, 21)
})

test('les maths gagnent au plus 50 XP par jour et une même réponse ne peut pas être recomptée', () => {
  const state = createState()
  const context = mathContext(courses.find(course => course.subject === 'maths').id)
  beginMathTrack(state.mathPractice, context)
  for (let index = 0; index < 7; index += 1) {
    const current = state.mathPractice.tracks[context.key].current
    const problem = problemFor(current)
    const answer = problem.options ? [String(problem.options.findIndex(item => item.label === problem.answer))] : problem.fields.map(field => field.expected)
    assert(recordMathAttempt(state.mathPractice, context, current, answer, dayKey(at(5))))
    assert.equal(recordMathAttempt(state.mathPractice, context, current, answer, dayKey(at(5))), false)
    advanceMathTrack(state.mathPractice, context, current)
  }
  assert.equal(earnedXp(state), 50)
  assert.equal(studyDayKeys(state).length, 1)
})

test('le bonus mémoire quotidien a un plafond et reprend le lendemain', () => {
  const state = createState()
  for (const card of courseCards.slice(0, 40)) gradeCard(state, card, 'easy', at(5))
  assert.equal(earnedXp(state), 60)
  for (const card of courseCards.slice(40, 50)) gradeCard(state, card, 'easy', at(6))
  assert.equal(earnedXp(state), 80)
})

test('une explication détaillée gagne 30 XP une fois par jour et garde son jour acquis après suppression', () => {
  const state = createState()
  const note = { id: 'note', subject: 'maths', body: 'a'.repeat(80), example: 'b'.repeat(20), createdAt: at(5) }
  assert.equal(rewardExplanation(state, { ...note, body: 'Court' }, at(5)), 0)
  state.notes.push(note)
  assert.equal(rewardExplanation(state, note, at(5)), 30)
  assert.equal(rewardExplanation(state, note, at(5)), 0)
  assert.equal(rewardExplanation(state, { ...note, id: 'other' }, at(5)), 0)
  state.notes = []
  assert.equal(earnedXp(state), 30)
  assert.equal(studyDayKeys(state).length, 1)
  assert.equal(rewardExplanation(state, note, at(6)), 0)
})

test('retravailler une ancienne explication compte, réenregistrer le même texte ne compte pas', () => {
  const state = createState()
  const previous = { id: 'note', subject: 'maths', body: 'a'.repeat(80), example: 'b'.repeat(20), createdAt: at(5) }
  assert.equal(rewardExplanation(state, previous, at(6), previous), 0)
  const revised = { ...previous, body: 'Une autre explication. '.repeat(8) }
  assert.equal(rewardExplanation(state, revised, at(6), previous), 30)
  assert.deepEqual(studyDayKeys(state), [dayKey(at(6))])
  assert.equal(rewardExplanation(state, revised, at(6), previous), 0)
})
