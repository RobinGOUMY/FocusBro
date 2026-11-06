export const subjects = [
  { id: 'maths', name: 'Mathématiques', icon: 'math', color: 'purple' },
  { id: 'francais', name: 'Français', icon: 'book', color: 'rose' },
  { id: 'histoire', name: 'Histoire-géo', icon: 'globe', color: 'amber' },
  { id: 'physique', name: 'Physique-chimie', icon: 'flask', color: 'sky' },
  { id: 'svt', name: 'SVT', icon: 'leaf', color: 'mint' },
  { id: 'anglais', name: 'Anglais', icon: 'message', color: 'purple' },
  { id: 'espagnol', name: 'Espagnol', icon: 'message', color: 'amber' },
  { id: 'ses', name: 'SES', icon: 'chart', color: 'amber' },
  { id: 'snt', name: 'SNT', icon: 'grid', color: 'sky' },
  { id: 'emc', name: 'EMC', icon: 'globe', color: 'purple' },
  { id: 'autre', name: 'Autre matière', icon: 'book', color: 'sky' },
]

export const hasSubject = id => subjects.some(subject => subject.id === id)

const decks = {
  maths: [
    ['Quelle est l’expression d’une fonction affine ?', 'f(x) = ax + b. Le nombre a est le coefficient directeur et b est l’ordonnée à l’origine.'],
    ['Comment calculer le milieu du segment [AB] ?', 'On fait la moyenne des deux abscisses et celle des deux ordonnées.'],
    ['Développe (x + 3)².', 'x² + 6x + 9, grâce à (a + b)² = a² + 2ab + b².'],
    ['Factorise x² − 16.', '(x − 4)(x + 4), grâce à a² − b² = (a − b)(a + b).'],
    ['Résous 3x − 7 = 8.', '3x = 15, donc x = 5.'],
    ['Quelle est la distance entre A(1 ; 2) et B(4 ; 6) dans un repère orthonormé ?', '√((4 − 1)² + (6 − 2)²) = √25 = 5.'],
  ],
  francais: [
    ['Quelle différence entre comparaison et métaphore ?', 'La comparaison utilise un mot-outil comme « comme ». La métaphore rapproche directement deux éléments.'],
    ['Que désigne le point de vue interne ?', 'On perçoit la scène à travers un personnage, avec ce qu’il voit, ressent ou pense.'],
    ['Qu’est-ce qu’une anaphore ?', 'La répétition d’un même mot ou groupe de mots au début de plusieurs phrases, propositions ou vers.'],
    ['Qu’est-ce qu’un champ lexical ?', 'Un ensemble de mots ou expressions qui renvoient à une même idée ou à un même thème.'],
    ['Quelle est la différence entre une thèse et un argument ?', 'La thèse est la position défendue. Un argument est une raison donnée pour soutenir cette position.'],
    ['Comment appelle-t-on un vers de douze syllabes ?', 'Un alexandrin.'],
  ],
  histoire: [
    ['Pourquoi 1492 marque-t-elle une étape des explorations européennes ?', 'L’expédition de Christophe Colomb atteint les Caraïbes en cherchant une route vers l’Asie par l’ouest.'],
    ['Que désigne la Renaissance en Europe ?', 'Un mouvement culturel et artistique des XVe et XVIe siècles marqué notamment par le regain d’intérêt pour l’Antiquité.'],
    ['Quel procédé Gutenberg met-il au point en Europe au XVe siècle ?', 'L’imprimerie utilisant des caractères métalliques mobiles, qui accélère la diffusion des livres.'],
    ['Qu’est-ce que la transition démographique ?', 'Le passage d’un régime de forte natalité et mortalité à un régime où elles sont toutes les deux faibles.'],
    ['Que signifie être vulnérable face à un risque ?', 'Être susceptible de subir des dommages lorsque survient un aléa. La vulnérabilité varie selon les populations et les territoires.'],
    ['À quelle date est adoptée la Déclaration des droits de l’homme et du citoyen ?', 'Le 26 août 1789, pendant la Révolution française.'],
  ],
  physique: [
    ['Quelle relation relie vitesse moyenne, distance et durée ?', 'v = d ÷ Δt. Avec des mètres et des secondes, la vitesse s’exprime en m/s.'],
    ['Comment convertir 72 km/h en m/s ?', 'On divise par 3,6. 72 km/h = 20 m/s.'],
    ['Quelle relation donne la masse volumique ?', 'ρ = m ÷ V. Son unité SI est le kilogramme par mètre cube (kg/m³).'],
    ['De quoi est composé un atome ?', 'D’un noyau contenant des protons et, en général, des neutrons, entouré d’électrons.'],
    ['Que représente le numéro atomique Z ?', 'Le nombre de protons dans le noyau. Un atome neutre contient aussi Z électrons.'],
    ['Quelle différence entre un corps pur et un mélange ?', 'Un corps pur contient une seule espèce chimique. Un mélange en contient plusieurs.'],
  ],
  svt: [
    ['Qu’est-ce qu’une cellule spécialisée ?', 'Une cellule dont la structure et le fonctionnement sont adaptés à un rôle précis, par exemple une cellule musculaire.'],
    ['Que produit une cellule chlorophyllienne par photosynthèse ?', 'En utilisant l’énergie lumineuse, elle fabrique de la matière organique à partir d’eau et de CO₂ et libère du dioxygène.'],
    ['Que désigne un allèle ?', 'Une version d’un gène. Deux allèles d’un même gène peuvent différer dans leur séquence d’ADN.'],
    ['À quels niveaux peut-on observer la biodiversité ?', 'À l’échelle des écosystèmes, des espèces et de la diversité génétique au sein d’une espèce.'],
    ['Qu’est-ce que le microbiote ?', 'L’ensemble des micro-organismes qui vivent dans un milieu donné, par exemple l’intestin.'],
    ['Comment une mutation peut-elle contribuer à la diversité génétique ?', 'Une modification de la séquence d’ADN peut créer un nouvel allèle, qui peut être transmis à la descendance.'],
  ],
  anglais: [
    ['Quand emploie-t-on le prétérit en anglais ?', 'Pour une action terminée située dans le passé. Exemple : I watched a film yesterday.'],
    ['Complète : She usually ___ (go) to school by bike.', 'She usually goes to school by bike. On ajoute -s ou -es à la troisième personne du singulier au présent simple.'],
    ['Comment demander depuis combien de temps une situation dure ?', 'Avec How long et le present perfect. Exemple : How long have you lived here?'],
    ['Quelle différence entre since et for ?', 'Since introduit le point de départ (since Monday). For introduit la durée (for three days).'],
    ['Traduis « Je suis d’accord avec toi » en anglais.', 'I agree with you.'],
    ['Quel est le comparatif de good ?', 'Better. Exemple : This book is better than the first one.'],
  ],
}

export const starterCards = Object.entries(decks).flatMap(([subject, cards]) =>
  cards.map(([question, answer], index) => ({ id: `${subject}-${index}`, subject, question, answer })),
)
