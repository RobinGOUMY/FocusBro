import { courseById } from './courses.js'

// Chaque ligne associe une notion à un cours, une réponse et deux distracteurs.
const questions = [
  ['arithmetique', 'Quel nombre est premier ?', '29', '21', '27', '29 n’est divisible que par 1 et 29. 21 et 27 sont divisibles par 3.'],
  ['arithmetique', 'Quel nombre est divisible à la fois par 2 et par 3 ?', '42', '35', '44', '42 est pair et 4 + 2 est divisible par 3.'],
  ['arithmetique', 'Quel est le plus grand diviseur commun de 18 et 24 ?', '6', '3', '12', '6 divise 18 et 24. 3 est un diviseur commun plus petit et 12 ne divise pas 18.'],
  ['calcul-litteral', 'Quel est le développement de (x + 3)² ?', 'x² + 6x + 9', 'x² + 9', 'x² + 3x + 9', 'Le terme du milieu vaut 2 × x × 3 = 6x.'],
  ['fonctions-images', 'Quelle est l’image de 4 par f(x) = 2x − 1 ?', '7', '8', '9', 'On remplace x par 4. On obtient 2 × 4 − 1 = 7.'],
  ['pourcentages-statistiques', 'Quel est le prix d’un article à 80 € après une remise de 25 % ?', '60 €', '55 €', '20 €', '25 % de 80 € vaut 20 €. Il reste 80 − 20 = 60 €.'],

  ['poesie-vers', 'Comment appelle-t-on un vers de douze syllabes ?', 'Un alexandrin', 'Un octosyllabe', 'Un décasyllabe', 'Un alexandrin compte douze syllabes, un octosyllabe huit et un décasyllabe dix.'],
  ['poesie-vers', 'Quelle figure reconnais-tu dans « ses yeux sont des étoiles » ?', 'Une métaphore', 'Une anaphore', 'Une comparaison', 'La métaphore rapproche deux éléments sans mot-outil comme « comme ».'],
  ['poesie-vers', 'Quelle suite décrit des rimes embrassées ?', 'ABBA', 'ABAB', 'AABB', 'Dans ABBA, les deux rimes A entourent les deux rimes B.'],
  ['recit-narration', 'Quel point de vue donne accès aux pensées d’un seul personnage ?', 'Le point de vue interne', 'Le point de vue externe', 'Le point de vue omniscient', 'Le récit en point de vue interne suit ce que perçoit, sait et pense le personnage.'],
  ['theatre-scene', 'Comment appelle-t-on une indication de mise en scène dans un texte de théâtre ?', 'Une didascalie', 'Une réplique', 'Une tirade', 'Une didascalie donne des indications de jeu, de décor ou de déplacement.'],
  ['idees-presse', 'Que défend une personne qui présente une thèse ?', 'Une position', 'Une source', 'Un exemple', 'La thèse est la position défendue. Arguments et exemples servent à l’appuyer.'],

  ['ouverture-atlantique', 'Quelle date correspond à l’arrivée de Christophe Colomb aux Caraïbes ?', '1492', '1453', '1519', 'L’expédition de 1492 atteint les Caraïbes en cherchant une route vers l’Asie.'],
  ['ouverture-atlantique', 'Quel océan traverse l’expédition de 1492 ?', 'L’Atlantique', 'L’Indien', 'Le Pacifique', 'Elle traverse l’Atlantique depuis l’Europe jusqu’aux Caraïbes.'],
  ['ouverture-atlantique', 'Quelle monarchie soutient le voyage de Colomb en 1492 ?', 'La monarchie espagnole', 'La monarchie portugaise', 'La monarchie française', 'Isabelle de Castille et Ferdinand d’Aragon financent l’expédition.'],
  ['athenes-rome', 'À Athènes au Ve siècle av. J.-C., quelle assemblée réunit les citoyens ?', 'L’Ecclésia', 'Le Sénat', 'Les États généraux', 'L’Ecclésia permet aux citoyens athéniens de débattre et de voter.'],
  ['renaissance-reformes', 'Quel procédé Gutenberg contribue-t-il à diffuser en Europe ?', 'L’imprimerie à caractères mobiles', 'La photographie', 'Le télégraphe électrique', 'Les caractères métalliques mobiles permettent de reproduire des livres plus vite.'],
  ['populations-developpement', 'Quels indicateurs passent d’un niveau élevé à un niveau faible durant la transition démographique ?', 'La natalité et la mortalité', 'L’immigration et l’émigration', 'Le PIB et le chômage', 'La mortalité baisse d’abord, puis la natalité diminue à son tour.'],

  ['mouvements-vitesse', 'Quelle formule donne la vitesse moyenne ?', 'Distance ÷ durée', 'Durée ÷ distance', 'Distance × durée', 'La vitesse moyenne est la distance parcourue divisée par la durée du trajet.'],
  ['mouvements-vitesse', 'À combien de m/s correspondent 72 km/h ?', '20 m/s', '72 m/s', '26 m/s', 'On divise 72 par 3,6 pour convertir les km/h en m/s.'],
  ['mouvements-vitesse', 'Quelle forme a la trajectoire d’un mouvement rectiligne ?', 'Une droite', 'Un cercle', 'Une parabole', 'Le mot rectiligne signifie que les positions successives sont alignées.'],
  ['atomes-ions', 'Que compte le numéro atomique Z ?', 'Les protons', 'Les neutrons', 'Les nucléons', 'Z est le nombre de protons, qui identifie l’élément chimique.'],
  ['sons-ondes', 'Quelle unité mesure une fréquence sonore ?', 'Le hertz', 'Le volt', 'Le mètre', 'Un hertz correspond à une oscillation par seconde.'],
  ['electricite-capteurs', 'Quelle relation correspond à la loi d’Ohm ?', 'U = R × I', 'U = R ÷ I', 'U = I ÷ R', 'Pour un conducteur ohmique, la tension vaut la résistance multipliée par l’intensité.'],

  ['adn-mutations', 'Qu’est-ce qu’un allèle ?', 'Une version d’un gène', 'Une cellule spécialisée', 'Une protéine de défense', 'Deux allèles d’un même gène peuvent différer dans leur séquence d’ADN.'],
  ['adn-mutations', 'Comment appelle-t-on une modification de la séquence de l’ADN ?', 'Une mutation', 'Une fécondation', 'Une sédimentation', 'Une mutation peut créer un nouvel allèle si elle touche la séquence d’un gène.'],
  ['adn-mutations', 'Quelle molécule porte l’information génétique dans la cellule ?', 'L’ADN', 'Le glucose', 'Le dioxygène', 'L’ordre des nucléotides de l’ADN constitue l’information génétique.'],
  ['metabolisme-cellules', 'Quel gaz une cellule chlorophyllienne libère-t-elle par photosynthèse ?', 'Du dioxygène', 'Du dioxyde de carbone', 'Du diazote', 'La photosynthèse consomme du dioxyde de carbone et libère du dioxygène.'],
  ['biodiversite-evolution', 'À quelle échelle étudie-t-on la diversité des allèles au sein d’une espèce ?', 'À l’échelle génétique', 'À l’échelle des écosystèmes', 'À l’échelle des espèces', 'La diversité génétique correspond aux différences entre individus d’une même espèce.'],
  ['erosion-sedimentation', 'Comment appelle-t-on le dépôt de particules transportées ?', 'La sédimentation', 'L’altération', 'Le ruissellement', 'La sédimentation se produit lorsque les particules se déposent.'],

  ['english-past-memory', 'Complète « We ___ the museum yesterday. »', 'visited', 'have visited', 'visit', '« Yesterday » situe une action terminée dans le passé. On emploie le prétérit.'],
  ['english-past-memory', 'Complète « I have lived here ___ 2022. »', 'since', 'for', 'during', '« Since » introduit le point de départ. « For » introduit une durée.'],
  ['english-past-memory', 'Quel est le prétérit de « go » ?', 'went', 'gone', 'goed', '« Went » est le prétérit irrégulier. « Gone » est le participe passé.'],
  ['english-generations', 'Quel est le comparatif de « good » ?', 'better', 'gooder', 'best', '« Better » est le comparatif irrégulier. « Best » est le superlatif.'],
  ['english-identity', 'Complète « Where ___ she live? »', 'does', 'do', 'is', 'On emploie « does » avec « she » au présent simple dans cette question.'],
  ['english-transitions', 'Quelle phrase signifie « Nous devrions recycler » ?', 'We should recycle.', 'We used to recycle.', 'We can’t recycle.', '« Should » sert à donner un conseil.'],

  ['spanish-identidad', 'Complète « Yo ___ de Madrid. »', 'soy', 'estoy', 'tengo', 'On exprime l’origine avec « ser ». « Soy » est sa forme à la première personne.'],
  ['spanish-identidad', 'Complète « El libro ___ en la mesa. »', 'está', 'es', 'tiene', 'On utilise « estar » pour localiser un objet.'],
  ['spanish-identidad', 'Complète « Ella ___ quince años. »', 'tiene', 'es', 'está', 'En espagnol, on utilise le verbe « tener » pour donner l’âge.'],
  ['spanish-generaciones', 'Quel mot complète « Ana es más alta ___ su hermano » ?', 'que', 'de', 'como', 'Le comparatif de supériorité se construit avec « más … que ».'],
  ['spanish-transicion', 'Comment dit-on « Je vais étudier » ?', 'Voy a estudiar.', 'Tengo que estudiar.', 'Acabo de estudiar.', '« Ir a » suivi d’un infinitif exprime un projet ou un futur proche.'],
  ['spanish-memoria', 'Quel verbe complète « Ayer ___ en casa », pour dire « j’ai mangé » ?', 'comí', 'como', 'comeré', '« Comí » est le passé simple de « comer » à la première personne du singulier.'],

  ['production-richesses', 'Comment calcule-t-on la valeur ajoutée d’une entreprise ?', 'Production − consommations intermédiaires', 'Production + consommations intermédiaires', 'Salaires − bénéfices', 'On retire de la valeur de la production les biens et services consommés pour produire.'],
  ['production-richesses', 'Une entreprise produit pour 100 € avec 40 € de consommations intermédiaires. Quelle est sa valeur ajoutée ?', '60 €', '140 €', '40 €', 'La valeur ajoutée est de 100 − 40 = 60 €.'],
  ['production-richesses', 'Quel indicateur mesure la richesse produite sur un territoire en une période donnée ?', 'Le PIB', 'Le taux de chômage', 'Le salaire médian', 'Le produit intérieur brut mesure la production réalisée sur le territoire.'],
  ['marches-prix', 'Que désigne la demande sur un marché ?', 'Ce que les acheteurs souhaitent acheter', 'Ce que les producteurs souhaitent vendre', 'Le coût des matières premières', 'La demande correspond aux quantités que les acheteurs veulent acheter à différents prix.'],
  ['socialisation', 'Comment appelle-t-on l’apprentissage des normes et des valeurs d’une société ?', 'La socialisation', 'La production', 'La concurrence', 'Famille, école et groupes de pairs participent à la socialisation.'],
  ['demarche-ses', 'Quel outil sert surtout à interroger beaucoup de personnes de façon standardisée ?', 'Un questionnaire', 'Un entretien libre', 'Un journal de terrain', 'Un questionnaire pose les mêmes questions aux personnes interrogées.'],

  ['web-hyperliens', 'Quel langage structure le contenu d’une page web ?', 'HTML', 'CSS', 'SQL', 'HTML décrit la structure du contenu. CSS décrit sa présentation.'],
  ['web-hyperliens', 'Comment appelle-t-on l’adresse d’une ressource web ?', 'Une URL', 'Un pixel', 'Un paquet', 'Une URL identifie où et comment accéder à une ressource web.'],
  ['web-hyperliens', 'Quel protocole indique une connexion web chiffrée ?', 'HTTPS', 'HTML', 'HTTP', 'HTTPS protège les échanges entre le navigateur et le serveur avec TLS.'],
  ['internet-paquets', 'Quel équipement oriente les paquets entre des réseaux ?', 'Un routeur', 'Un écran', 'Une webcam', 'Un routeur choisit vers quel réseau envoyer chaque paquet.'],
  ['donnees-structurees', 'Dans un CSV décrivant des livres, que représente généralement une ligne de données ?', 'Un livre', 'Un caractère', 'Le nom d’une colonne', 'Chaque ligne de données décrit un enregistrement. Les colonnes représentent ses champs.'],
  ['photo-numerique', 'Que représentent les lettres de « RVB » ?', 'Rouge, vert, bleu', 'Rouge, violet, blanc', 'Rose, vert, beige', 'Les trois composantes rouge, verte et bleue permettent de coder les couleurs à l’écran.'],

  ['etat-droit', 'Dans un État de droit, qui doit respecter le droit ?', 'Les citoyens et les pouvoirs publics', 'Les citoyens seulement', 'Les pouvoirs publics seulement', 'Les autorités sont aussi soumises aux règles de droit et peuvent être contrôlées par la justice.'],
  ['etat-droit', 'Quelle institution tranche un litige en appliquant le droit ?', 'Un tribunal', 'Un parti politique', 'Un journal', 'Un tribunal examine le litige et rend une décision de justice.'],
  ['etat-droit', 'À quoi sert la séparation des pouvoirs ?', 'À limiter les abus de pouvoir', 'À supprimer les élections', 'À concentrer les décisions', 'Répartir les pouvoirs permet de créer des contre-pouvoirs.'],
  ['laicite-egalite', 'Quel principe implique la neutralité religieuse des services publics ?', 'La laïcité', 'La souveraineté', 'La solidarité', 'La laïcité associe liberté de conscience et neutralité des services publics.'],
  ['expression-numerique', 'Quel geste aide à vérifier une publication avant de la partager ?', 'Remonter à sa source', 'Compter les mentions « J’aime »', 'Se fier au titre seul', 'La source permet de vérifier l’origine, la date et le contexte de l’information.'],
  ['droit-environnement', 'Qu’étudie le principe de prévention ?', 'Les mesures pour éviter un risque connu', 'La manière de supprimer tout débat', 'Les moyens d’ignorer un danger', 'La prévention consiste à agir sur un risque identifié pour éviter ou limiter ses effets.'],
]

export const arcadeQuestions = questions.map(([course, prompt, answer, wrongA, wrongB, explanation], index) => ({
  id: index, course, subject: courseById.get(course).subject, prompt, answer, options: [answer, wrongA, wrongB], explanation,
}))
