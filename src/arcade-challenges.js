import { courseById } from './courses.js'

function fromCourse(entries, fields) {
  return entries.map(([course, ...values], id) => ({
    id, course, subject: courseById.get(course).subject,
    ...Object.fromEntries(fields.map((field, index) => [field, values[index]])),
  }))
}

export const sliceChallenges = fromCourse([
  ['arithmetique', 'Tranche uniquement les nombres premiers.', ['11', '17', '29', '31', '43'], ['1', '9', '15', '21', '33']],
  ['arithmetique', 'Tranche les nombres divisibles par 3.', ['18', '24', '45', '57', '81'], ['20', '25', '38', '52', '82']],
  ['reels-intervalles', 'Tranche les nombres strictement négatifs.', ['−7', '−0,5', '−12', '−1/4', '−2'], ['0', '0,5', '8', '1/4', '11']],
  ['langue-phrases', 'Tranche les verbes conjugués à l’imparfait.', ['il lisait', 'elle partait', 'tu jouais', 'je savais', 'on croyait'], ['il lira', 'elle part', 'tu joues', 'je saurai', 'on croit']],
  ['roman-personnages', 'Tranche les synonymes de « courageux ».', ['brave', 'vaillant', 'hardi', 'intrépide', 'audacieux'], ['peureux', 'lâche', 'craintif', 'timoré', 'poltron']],
  ['poesie-vers', 'Tranche les mots qui riment avec « lumière ».', ['pierre', 'mer', 'hiver', 'fière', 'terre'], ['jour', 'nuit', 'blanc', 'éclat', 'halo']],
  ['english-past-memory', 'Tranche les formes au prétérit.', ['went', 'saw', 'bought', 'visited', 'took'], ['go', 'seen', 'buy', 'visits', 'taken']],
  ['spanish-identidad', 'Tranche les formes du verbe « ser » au présent.', ['soy', 'eres', 'somos', 'sois', 'son'], ['estoy', 'estás', 'estamos', 'estáis', 'están']],
], ['prompt', 'targets', 'intruders'])

export const snakeChallenges = fromCourse([
  ['arithmetique', 'Mange les multiples de 7 du plus petit au plus grand.', ['7', '14', '21', '28', '35']],
  ['reels-intervalles', 'Range les nombres du plus petit au plus grand.', ['−7', '−2', '0', '1/2', '2']],
  ['reels-intervalles', 'Range les fractions de la plus petite à la plus grande.', ['1/8', '1/4', '1/3', '1/2', '3/4']],
  ['reels-intervalles', 'Range les nombres du plus proche de zéro au plus éloigné.', ['0', '−0,2', '1/2', '−2', '3']],
  ['periodes-histoire', 'Mange les siècles dans l’ordre chronologique.', ['Ve', 'Xe', 'XVe', 'XVIIIe', 'XXIe']],
  ['ouverture-atlantique', 'Mange les dates de l’époque des explorations dans l’ordre.', ['1488', '1492', '1498', '1519', '1522']],
  ['cellules-specialisees', 'Remonte du plus petit niveau d’organisation au plus grand.', ['Cellule', 'Tissu', 'Organe', 'Organisme']],
], ['prompt', 'sequence'])

export const runnerQuestions = fromCourse([
  ['english-identity', 'Where do you live?', 'Où habites-tu ?', 'Où vas-tu ?', 'D’où viens-tu ?'],
  ['english-identity', 'She is playing now.', 'Elle joue en ce moment.', 'Elle joue tous les jours.', 'Elle jouait avant.'],
  ['english-identity', 'I enjoy drama.', 'J’aime le théâtre.', 'Je quitte la salle.', 'Je joue au tennis.'],
  ['english-generations', 'I used to take the bus.', 'Je prenais le bus avant.', 'Je prends le bus demain.', 'Je dois prendre le bus.'],
  ['english-generations', 'Cheaper than', 'Moins cher que', 'Aussi cher que', 'Plus cher que'],
  ['english-past-memory', 'The museum opened in 1998.', 'Le musée a ouvert en 1998.', 'Le musée ferme en 1998.', 'Le musée existe depuis 1898.'],
  ['english-past-memory', 'I have been here since Monday.', 'Je suis ici depuis lundi.', 'J’étais ici avant lundi.', 'Je serai ici lundi.'],
  ['english-transitions', 'We should recycle.', 'Nous devrions recycler.', 'Nous recyclions avant.', 'Nous savons recycler.'],
  ['english-transitions', 'We could repair our bikes.', 'On pourrait réparer nos vélos.', 'On doit acheter des vélos.', 'On réparait nos vélos.'],
  ['english-stories', 'The villagers were sleeping.', 'Les villageois dormaient.', 'Les villageois ont couru.', 'Les villageois dormiront.'],
  ['english-stories', 'Finally', 'Enfin', 'D’abord', 'Pourtant'],
  ['spanish-identidad', 'Soy de Madrid.', 'Je viens de Madrid.', 'Je suis à Madrid.', 'Je vais à Madrid.'],
  ['spanish-identidad', 'El libro está en la mesa.', 'Le livre est sur la table.', 'La table est dans le livre.', 'Le livre est sous la table.'],
  ['spanish-identidad', 'Tengo quince años.', 'J’ai quinze ans.', 'J’ai cinquante ans.', 'J’ai cinq ans.'],
  ['spanish-generaciones', 'Ana es más alta que su hermano.', 'Ana est plus grande que son frère.', 'Ana est aussi grande que son frère.', 'Ana est plus petite que son frère.'],
  ['spanish-transicion', 'Voy a estudiar.', 'Je vais étudier.', 'Je dois étudier.', 'Je viens d’étudier.'],
  ['spanish-memoria', 'Ayer comí en casa.', 'Hier, j’ai mangé chez moi.', 'Demain, je mangerai chez moi.', 'Hier, j’ai dormi chez moi.'],
], ['prompt', 'answer', 'wrongA', 'wrongB']).map(({ wrongA, wrongB, ...question }) => ({
  ...question, options: [question.answer, wrongA, wrongB],
}))
