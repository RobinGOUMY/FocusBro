export function chapter(id, title, topic, intro, sections, exercise, guide, cards) {
  return {
    id, title, topic, intro,
    sections: sections.map(([heading, text]) => ({ heading, text })),
    exercise: { question: exercise[0], answer: exercise[1] },
    guide: { prompt: guide[0], hint: guide[1], model: guide[2] },
    cards,
  }
}
