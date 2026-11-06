import { choice, coefficient, fraction, gcd, num, numeric, pair, term } from './math-problem.js'

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]
const factors = value => {
  const terms = []
  for (const prime of primes) {
    let count = 0
    while (value % prime === 0) { value /= prime; count += 1 }
    if (count) terms.push(count === 1 ? `${prime}` : `${prime}^${count}`)
  }
  return terms.join(' × ')
}

export default {
  arithmetique: [
    ['prime', 'Reconnaître un nombre premier', rng => {
      const prime = rng.pick(primes.slice(4))
      const a = rng.int(2, 10), b = rng.int(3, 14), c = rng.pick(Array.from({ length: 11 }, (_, index) => index + 4).filter(value => value ** 2 !== a * b))
      return choice(rng, `Quel nombre est premier parmi ${prime}, ${a * b} et ${c ** 2} ?`, 'Un nombre premier a exactement deux diviseurs positifs. Essaie 2, 3, 5 et 7 quand ils sont assez petits.',
        `${a * b} = ${a} × ${b} et ${c ** 2} = ${c} × ${c}, donc ils sont composés. Aucun nombre premier inférieur ou égal à √${prime} ne divise ${prime}.`, `${prime}`,
        [`${a * b}`, `${a} et ${b} sont des facteurs de ce nombre.`], [`${c ** 2}`, `${c ** 2} est le carré de ${c}.`])
    }],
    ['divisibility', 'Tester la divisibilité', rng => {
      const divisor = rng.pick([3, 9]), multiplier = rng.int(20, 130), n = divisor * multiplier + rng.int(0, divisor - 1)
      const sum = [...String(n)].reduce((total, digit) => total + Number(digit), 0)
      return numeric(`Quel est le reste de la division de ${n} par ${divisor} ?`, `Pour ${divisor}, tu peux d’abord additionner les chiffres. Le reste est le même.`,
        `La somme des chiffres de ${n} vaut ${sum}. On peut aussi écrire ${n} = ${divisor} × ${multiplier} + ${n % divisor}. Le reste vaut ${n % divisor}.`, [['Reste', n % divisor]], [[[multiplier], 'Tu as trouvé le quotient. Le reste est ce qu’il reste après avoir retiré le multiple.']])
    }],
    ['prime-factors', 'Décomposer en facteurs premiers', rng => {
      const a = rng.int(1, 5), b = rng.int(1, 3), c = rng.int(0, 3), n = 2 ** a * 3 ** b * 5 ** c
      return numeric(`Décompose ${n} sous la forme 2ᵃ × 3ᵇ × 5ᶜ. Quels sont a, b et c ?`, 'Divise par 2 autant que possible, puis par 3, puis par 5. Note combien de fois chaque division est possible.',
        `La décomposition est ${factors(n)}. Les nombres de facteurs 2, 3 et 5 valent donc ${a}, ${b} et ${c}.`, [['Exposant de 2', a], ['Exposant de 3', b], ['Exposant de 5', c]])
    }],
    ['reduce-fraction', 'Réduire une fraction', rng => {
      const a = rng.int(2, 18), candidates = Array.from({ length: 15 }, (_, index) => index + 3).filter(b => gcd(a, b) === 1)
      const b = rng.pick(candidates), k = rng.int(2, 15)
      return numeric(`Réduis ${a * k}/${b * k} en fraction irréductible.`, 'Cherche le plus grand diviseur commun aux deux nombres, puis divise-les par ce nombre.',
        `Le plus grand diviseur commun vaut ${k}. En divisant le haut et le bas par ${k}, on obtient ${a}/${b}.`, [['Numérateur', a], ['Dénominateur positif', b]], [[[a * k, b * k], 'Il reste un facteur commun dans ta fraction.']])
    }],
  ],
  'reels-intervalles': [
    ['decimal-class', 'Distinguer décimal et rationnel', rng => {
      const decimal = rng.int(3, 30), nonDecimal = rng.pick([3, 7, 9, 11, 13]), top = rng.int(1, nonDecimal - 1)
      return choice(rng, `Laquelle de ces fractions est un nombre décimal ?`, 'Après simplification, un dénominateur composé uniquement de facteurs 2 et 5 peut devenir une puissance de 10.',
        `${decimal}/40 = ${decimal * 25}/1000, donc l’écriture décimale est finie. Les autres dénominateurs gardent un facteur différent de 2 et de 5.`, `${decimal}/40`,
        [`${top}/${nonDecimal}`, 'Une fois la fraction réduite, regarde si le dénominateur garde un facteur autre que 2 ou 5.'], [`1/${rng.pick([17, 19, 23, 29])}`, 'Ce dénominateur ne divise aucune puissance de 10.'])
    }],
    ['interval-intersection', 'Trouver une intersection', rng => {
      const a = rng.int(-16, 10), b = a + rng.int(1, 7), c = b + rng.int(1, 8), d = c + rng.int(1, 7)
      const interval = (left, right, l, r) => `${l}${num(left)} ; ${num(right)}${r}`
      return choice(rng, `Quelle est l’intersection de ${interval(a, c, '[', ']')} et ${interval(b, d, ']', '[')} ?`, 'Garde seulement les valeurs communes, puis vérifie séparément chaque borne.',
        `La partie commune commence juste après ${num(b)} et va jusqu’à ${num(c)}, qui appartient aux deux intervalles.`, interval(b, c, ']', ']'),
        [interval(b, c, '[', ']'), 'La borne basse est exclue par le deuxième intervalle.'], [interval(a, d, '[', '['), 'Cet intervalle contient toutes les valeurs de l’un ou de l’autre. C’est leur union.'], [interval(b, c, ']', '['), 'La borne haute appartient aux deux intervalles.'])
    }],
    ['absolute-distance', 'Calculer une distance sur la droite', rng => {
      const a = rng.int(-24, 24), b = a + rng.pick([-1, 1]) * rng.int(2, 23), distance = Math.abs(a - b)
      return numeric(`Quelle est la distance entre ${num(a)} et ${num(b)} sur une droite graduée ?`, 'Soustrais les deux abscisses, puis prends la valeur absolue.',
        `On calcule |${num(a)} − (${num(b)})| = |${num(a - b)}| = ${distance}. La distance est positive.`, [['Distance', distance]], [[[-distance], 'Pour une distance, prends la valeur absolue de la différence.']])
    }],
    ['absolute-interval', 'Transformer une valeur absolue en intervalle', rng => {
      const center = rng.int(-14, 18), radius = rng.int(2, 12), included = rng.pick([false, true]), a = center - radius, b = center + radius
      const closed = `[${num(a)} ; ${num(b)}]`, open = `]${num(a)} ; ${num(b)}[`
      return choice(rng, `Écris l’ensemble des solutions de |x ${term(-center)}| ${included ? '≤' : '<'} ${radius} sous forme d’intervalle.`, 'La valeur absolue mesure une distance au centre. Pars du centre et déplace-toi du même rayon à gauche et à droite.',
        `Le centre vaut ${num(center)} et le rayon vaut ${radius}. Les bornes sont ${num(a)} et ${num(b)}. Elles sont ${included ? 'incluses avec ≤' : 'exclues avec <'}.`, included ? closed : open,
        [included ? open : closed, 'Les bornes sont justes. Vérifie si l’égalité avec le rayon est autorisée.'], [`[${num(a)} ; ${num(center)}]`, 'Il faut aussi prendre les valeurs à droite du centre.'])
    }],
  ],
  'calcul-litteral': [
    ['exponent-product', 'Multiplier des puissances', rng => {
      const base = rng.int(2, 13), a = rng.int(2, 16), b = -rng.int(1, 11)
      return numeric(`Écris ${base}^${a} × ${base}^(${num(b)}) sous la forme ${base}^k.`, 'Pour deux puissances de même base, additionne les exposants en gardant leur signe.',
        `La base ${base} reste la même et l’exposant vaut ${a} ${term(b)} = ${num(a + b)}.`, [['Exposant k', a + b]], [[[a - b], 'Le second exposant est négatif. Il faut l’ajouter avec son signe.'], [[a * b], 'On additionne les exposants lorsqu’on multiplie deux puissances de même base.']])
    }],
    ['square-expansion', 'Développer un carré', rng => {
      const a = rng.int(1, 9), b = rng.pick([-1, 1]) * rng.int(2, 13), middle = 2 * a * b
      return numeric(`Développe (${coefficient(a)} ${term(b)})² sous la forme Ax² + Bx + C.`, 'Écris le carré du premier terme, deux fois le produit des deux termes, puis le carré du second.',
        `A = ${a}² = ${a ** 2}, B = 2 × ${a} × (${num(b)}) = ${num(middle)} et C = (${num(b)})² = ${b ** 2}.`, [['Coefficient A', a ** 2], ['Coefficient B', middle], ['Coefficient C', b ** 2]], [[[a ** 2, 0, b ** 2], 'Il manque le double produit, qui donne le coefficient de x.'], [[a ** 2, -middle, b ** 2], 'Le signe du double produit suit le signe du second terme.']])
    }],
    ['sqrt-square', 'Simplifier la racine d’un carré', rng => {
      const k = rng.int(2, 15), x = -rng.int(1, 18)
      return numeric(`Calcule √(${k ** 2}x²) pour x = ${num(x)}.`, 'Réécris l’expression sous la forme √((kx)²). La racine carrée est toujours positive ou nulle.',
        `√(${k ** 2}x²) = ${k}|x|. Avec x = ${num(x)}, cela donne ${k} × ${Math.abs(x)} = ${k * Math.abs(x)}.`, [['Valeur exacte', k * Math.abs(x)]], [[[k * x], '√(u²) vaut |u|. La racine carrée ne peut pas être négative.']])
    }],
    ['difference-squares', 'Factoriser une différence de carrés', rng => {
      const a = rng.int(2, 9), b = rng.int(2, 15)
      return choice(rng, `Quelle expression est égale à ${a ** 2}x² − ${b ** 2} ?`, 'Reconnais A² − B² et utilise (A − B)(A + B).',
        `Les carrés sont (${coefficient(a)})² et ${b}². On multiplie la différence par la somme.`, `(${coefficient(a)} − ${b})(${coefficient(a)} + ${b})`,
        [`(${coefficient(a)} − ${b})²`, 'Ce carré ajoute un double produit et son terme constant est positif.'], [`(${coefficient(a)} + ${b})²`, 'Le terme constant doit être négatif. Utilise deux facteurs différents.'], [`(${coefficient(a)} − ${b ** 2})(${coefficient(a)} + ${b ** 2})`, 'Les facteurs utilisent la racine du carré constant.'])
    }],
  ],
  'equations-inequations': [
    ['linear-equation', 'Isoler x dans une équation', rng => {
      const a = rng.int(2, 12), b = rng.pick([-1, 1]) * rng.int(2, 25), x = rng.pick([-1, 1]) * rng.int(2, 19), right = a * x + b
      return numeric(`Résous ${coefficient(a)} ${term(b)} = ${num(right)}.`, 'Isole le terme en x en faisant la même opération de chaque côté, puis divise par son coefficient.',
        `On ${b < 0 ? 'ajoute' : 'soustrait'} ${Math.abs(b)} aux deux membres, ce qui donne ${coefficient(a)} = ${num(a * x)}. En divisant par ${a}, on obtient x = ${num(x)}.`, [['Valeur de x', x]],
        [[[a * x], 'Tu as isolé le terme en x. Divise encore par le coefficient de x.'], [[fraction(right + b, a)], 'Pour retirer le terme constant du membre gauche, applique l’opération inverse aux deux membres.']])
    }],
    ['distributed-equation', 'Résoudre une équation avec parenthèses', rng => {
      const a = rng.int(2, 12), b = rng.int(2, 14), x = rng.pick([-1, 1]) * rng.int(1, 12), c = (a - 1) * x - a * b
      return numeric(`Résous ${a}(x − ${b}) = x ${term(c)}.`, `Distribue ${a} à x et à −${b}, puis regroupe les termes en x.`,
        `Après développement, ${coefficient(a)} − ${a * b} = x ${term(c)}. On obtient ${coefficient(a - 1)} = ${num((a - 1) * x)}, puis x = ${num(x)}.`, [['Valeur de x', x]],
        [[[fraction(c + b, a - 1)], `Le coefficient ${a} doit aussi multiplier le terme −${b} dans la parenthèse.`]])
    }],
    ['negative-inequality', 'Inverser le sens d’une inégalité', rng => {
      const a = rng.int(2, 12), x = rng.pick([-1, 1]) * rng.int(1, 18), sign = rng.pick(['>', '≥', '<', '≤'])
      const opposite = { '>': '<', '≥': '≤', '<': '>', '≤': '≥' }[sign]
      return choice(rng, `Résous ${coefficient(-a)} ${sign} ${num(-a * x)}.`, 'Divise les deux membres par le coefficient de x. Regarde son signe.',
        `En divisant par ${num(-a)}, la borne vaut ${num(x)} et le sens de l’inégalité s’inverse.`, `x ${opposite} ${num(x)}`,
        [`x ${sign} ${num(x)}`, 'Quand on divise par un nombre négatif, on inverse le sens.'], [`x ${opposite} ${num(-x)}`, 'Recalcule le signe du quotient des deux nombres.'], [`x ${sign} ${num(-x)}`, 'Vérifie à la fois le signe du quotient et le sens de l’inégalité.'])
    }],
    ['product-zero', 'Résoudre une équation produit nul', rng => {
      const a = -rng.int(1, 19), b = rng.int(1, 19), k = rng.int(2, 8)
      return numeric(`Trouve les deux solutions de ${k}(x ${term(-a)})(x ${term(-b)}) = 0. Donne-les dans l’ordre croissant.`, 'Un produit est nul si l’un des facteurs est nul. Résous chacune des deux petites équations.',
        `x ${term(-a)} = 0 donne ${num(a)}. x ${term(-b)} = 0 donne ${b}. Le facteur ${k} n’est jamais nul.`, [['Plus petite solution', a], ['Plus grande solution', b]],
        [[[b, a], 'Les deux valeurs sont bonnes. Range-les de la plus petite à la plus grande.']])
    }],
    ['product-inequality', 'Étudier le signe d’un produit', rng => {
      const a = -rng.int(1, 14), b = rng.int(1, 14), included = rng.pick([true, false])
      const closed = `[${num(a)} ; ${b}]`, open = `]${num(a)} ; ${b}[`
      return choice(rng, `Résous (x ${term(-a)})(x ${term(-b)}) ${included ? '≤' : '<'} 0.`, 'Repère les deux valeurs qui annulent les facteurs, puis vérifie leurs signes entre ces valeurs.',
        `Les facteurs s’annulent en ${num(a)} et ${b}. Entre les deux, le premier est positif et le second négatif. Hors de cet intervalle, ils ont le même signe.`, included ? closed : open,
        [included ? open : closed, 'L’intervalle est bien situé. Vérifie si le produit nul est accepté aux bornes.'], [`]−∞ ; ${num(a)}[ ∪ ]${b} ; +∞[`, 'À l’extérieur, les deux facteurs ont le même signe et leur produit est positif.'])
    }],
  ],
  'logique-ensembles': [
    ['counterexample', 'Tester une implication et sa réciproque', rng => {
      const a = rng.int(2, 12), b = rng.int(2, 8)
      return choice(rng, `La réciproque de « Tout multiple de ${a * b} est multiple de ${a} » est fausse. Quel nombre le prouve ?`, 'Pour réfuter la réciproque, cherche un multiple de la petite valeur qui n’est pas multiple de la grande.',
        `${a} est multiple de ${a}, mais pas de ${a * b}. Il vérifie le début de la réciproque et contredit sa conclusion.`, `${a}`, [`${a * b}`, 'Ce nombre est multiple des deux. Il ne contredit pas la conclusion.'], [`${a - 1}`, 'Ce nombre ne vérifie même pas le début de la réciproque.'], [`${2 * a * b}`, 'Ce nombre est multiple des deux.'])
    }],
    ['exists-quantifier', 'Vérifier une affirmation existentielle', rng => {
      const a = rng.int(2, 20), k = rng.int(2, 9), target = k * a ** 2
      return choice(rng, `Quel entier permet de montrer que « il existe un entier n tel que ${k}n² = ${target} » ?`, 'Un seul exemple suffit. Pour tester une valeur, calcule son carré puis applique le coefficient.',
        `Pour n = ${num(-a)}, on obtient ${k} × ${a ** 2} = ${target}. Ce seul exemple prouve que l’affirmation est vraie.`, num(-a), [`${a ** 2}`, 'La valeur demandée est l’entrée avant le calcul du carré.'], [`${a + 1}`, 'Ce carré est trop grand.'], [`${a - 1}`, 'Ce carré est trop petit.'])
    }],
    ['negation', 'Nier une inégalité', rng => {
      const a = rng.int(-20, 24), sign = rng.pick(['>', '≥', '<', '≤'])
      const negation = { '>': '≤', '≥': '<', '<': '≥', '≤': '>' }[sign]
      const symbols = ['>', '≥', '<', '≤'].filter(symbol => symbol !== negation)
      return choice(rng, `Quelle est la négation de « x ${sign} ${num(a)} » ?`, 'Cherche toutes les valeurs exclues par la phrase de départ. Teste en particulier la borne.',
        `L’inégalité x ${negation} ${num(a)} prend exactement les valeurs exclues par x ${sign} ${num(a)}.`, `x ${negation} ${num(a)}`,
        ...symbols.map(symbol => [`x ${symbol} ${num(a)}`, 'Teste la borne et un nombre de chaque côté. Chaque nombre doit vérifier une seule des deux phrases.']))
    }],
    ['universal-counterexample', 'Réfuter une affirmation avec un contre-exemple', rng => {
      const a = rng.pick([-1, 1]) * rng.int(2, 24), k = rng.int(2, 8), expression = `${coefficient(k)} ${term(-k * a)}`
      return choice(rng, `Quel entier réfute l’affirmation « Pour tout entier x, (${expression})² > 0 » ?`, 'Un carré est toujours positif ou nul. Cherche quand le carré vaut zéro.',
        `Pour x = ${num(a)}, la parenthèse vaut 0. L’inégalité stricte est donc fausse et un seul contre-exemple suffit.`, num(a), [num(a - 1), `Le carré vaut ${k ** 2} pour cette valeur. L’affirmation reste vraie dans ce cas.`], [num(a + 1), `Le carré vaut ${k ** 2} et l’inégalité reste vraie.`], [num(-a), 'Vérifie quelle valeur annule la parenthèse.'])
    }],
  ],
  'vecteurs-plan': [
    ['vector-coordinates', 'Calculer les coordonnées d’un vecteur', rng => {
      const ax = rng.int(-12, 8), ay = rng.int(-8, 12), dx = rng.pick([-1, 1]) * rng.int(2, 14), dy = rng.pick([-1, 1]) * rng.int(2, 14)
      const bx = ax + dx, by = ay + dy
      return numeric(`A${pair(ax, ay)} et B${pair(bx, by)} sont donnés. Calcule les coordonnées du vecteur AB.`, 'Soustrais les coordonnées du point de départ à celles du point d’arrivée.',
        `AB = (${num(bx)} − (${num(ax)}) ; ${num(by)} − (${num(ay)})) = ${pair(dx, dy)}.`, [['Composante horizontale', dx], ['Composante verticale', dy]],
        [[[-dx, -dy], 'Ces coordonnées correspondent à BA. Pour AB, le départ est A et l’arrivée est B.'], [[dy, dx], 'La composante horizontale se calcule avec les abscisses et la verticale avec les ordonnées.']])
    }],
    ['vector-determinant', 'Tester la colinéarité', rng => {
      const a = rng.int(1, 8), b = rng.int(-9, 9), k = rng.int(2, 5), shift = rng.pick([0, 0, -2, 1, 3]), c = k * a, d = k * b + shift
      return numeric(`Calcule le déterminant des vecteurs u${pair(a, b)} et v${pair(c, d)}.`, 'Pour u(x ; y) et v(x′ ; y′), calcule xy′ − yx′.',
        `${a} × (${num(d)}) − (${num(b)}) × ${c} = ${num(a * d - b * c)}. Les vecteurs ${shift === 0 ? 'sont' : 'ne sont pas'} colinéaires${shift === 0 ? '.' : ' car le résultat est différent de 0.'}`, [['Déterminant de u et v', a * d - b * c]],
        [[[-(a * d - b * c)], 'Tu as inversé l’ordre des vecteurs dans le déterminant.']])
    }],
    ['midpoint', 'Calculer le milieu d’un segment', rng => {
      const ax = rng.int(-13, 9), ay = rng.int(-11, 11), dx = rng.int(3, 15), dy = -rng.int(3, 14), bx = ax + dx, by = ay + dy
      return numeric(`Calcule le milieu M du segment reliant A${pair(ax, ay)} à B${pair(bx, by)}.`, 'Fais la moyenne des deux abscisses, puis celle des deux ordonnées.',
        `xM = (${num(ax)} ${term(bx)})/2 = ${num((ax + bx) / 2)}. yM = (${num(ay)} ${term(by)})/2 = ${num((ay + by) / 2)}.`, [['Abscisse de M', (ax + bx) / 2], ['Ordonnée de M', (ay + by) / 2]],
        [[[ax + bx, ay + by], 'Tu as calculé les sommes. Divise chacune par 2 pour trouver le milieu.']])
    }],
    ['point-distance', 'Calculer une distance dans un repère', rng => {
      const [dx, dy, distance] = rng.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]])
      const ax = rng.int(-10, 9), ay = rng.int(-11, 10), sign = rng.pick([-1, 1])
      return numeric(`Dans un repère orthonormé, calcule la distance entre A${pair(ax, ay)} et B${pair(ax + dx, ay + sign * dy)}.`, 'Les différences de coordonnées forment les côtés d’un triangle rectangle. Utilise Pythagore.',
        `Les déplacements valent ${dx} et ${num(sign * dy)}. La distance vaut √(${dx}² + (${num(sign * dy)})²) = √${distance ** 2} = ${distance}.`, [['Distance AB', distance]],
        [[[distance ** 2], 'Tu as obtenu le carré de la distance. Termine en prenant la racine.'], [[dx + dy], 'Additionne les carrés des déplacements avant de prendre la racine.']])
    }],
    ['point-alignment', 'Vérifier si trois points sont alignés', rng => {
      const x = rng.int(-12, 10), y = rng.int(-12, 10), a = rng.int(2, 8), b = rng.int(-7, 7), k = rng.int(2, 4), offset = rng.pick([0, 0, -2, 1, 3])
      return choice(rng, `A${pair(x, y)}, B${pair(x + a, y + b)} et C${pair(x + k * a, y + k * b + offset)} sont-ils alignés ?`, 'Calcule AB et AC, puis teste si leurs coordonnées sont proportionnelles.',
        `AB = ${pair(a, b)} et AC = ${pair(k * a, k * b + offset)}. Leur déterminant vaut ${num(a * offset)}, donc les points ${offset ? 'ne sont pas' : 'sont'} alignés.`, offset ? 'Non' : 'Oui',
        [offset ? 'Oui' : 'Non', offset ? `L’abscisse a été multipliée par ${k}. Vérifie si le même facteur convient à l’ordonnée.` : `Les deux composantes de AC sont celles de AB multipliées par ${k}.`])
    }],
  ],
  'droites-plan': [
    ['slope', 'Calculer un coefficient directeur', rng => {
      const x = rng.int(-9, 10), y = rng.int(-12, 12), dx = rng.int(2, 9), dy = rng.pick([-1, 1]) * rng.int(1, 15)
      return numeric(`Calcule la pente de la droite qui passe par A${pair(x, y)} et B${pair(x + dx, y + dy)}.`, 'Divise la différence des ordonnées par la différence des abscisses. Garde le même ordre dans les deux différences.',
        `Le déplacement vertical est ${num(dy)} et l’horizontal ${dx}. Le coefficient directeur vaut ${num(fraction(dy, dx))}.`, [['Coefficient directeur', fraction(dy, dx)]],
        [[[fraction(dx, dy)], 'Le déplacement vertical doit être au numérateur.'], [[fraction(-dy, dx)], 'Tu as peut-être inversé l’ordre des points dans une seule des deux différences.']])
    }],
    ['point-on-line', 'Vérifier qu’un point est sur une droite', rng => {
      const a = rng.int(2, 10), b = rng.int(-12, 12), x = rng.int(-9, 11), y = a * x + b
      return numeric(`Quelle ordonnée doit avoir le point d’abscisse ${num(x)} pour appartenir à y = ${coefficient(a)} ${term(b)} ?`, 'Remplace x par l’abscisse donnée, puis calcule le membre de droite.',
        `y = ${a} × (${num(x)}) ${term(b)} = ${num(y)}.`, [['Ordonnée du point', y]], [[[a * x], 'Après la multiplication, il reste à appliquer le terme constant.']])
    }],
    ['vertical-line', 'Identifier une droite verticale', rng => {
      const x = rng.int(1, 22), y = -rng.int(1, 22), y2 = y - rng.int(1, 6)
      return choice(rng, `Quelle équation décrit la droite passant par A${pair(x, y)} et B${pair(x, y2)} ?`, 'Repère la coordonnée qui ne change pas entre les deux points.',
        `Les points ont tous les deux pour abscisse ${x} et leurs ordonnées diffèrent. La droite est verticale.`, `x = ${x}`, [`y = ${num(y)}`, 'Cela décrit une droite horizontale qui ne passe que par A.'], [`y = ${x}`, 'Tu as utilisé l’abscisse comme ordonnée.'], [`x = ${num(y)}`, 'La droite est bien verticale, mais utilise l’abscisse commune.'])
    }],
    ['line-intersection', 'Trouver l’intersection de deux droites', rng => {
      const a = rng.int(2, 9), b = -rng.int(2, 9), x = rng.pick([-1, 1]) * rng.int(1, 10), c = rng.int(-15, 15), y = a * x + c, d = y - b * x
      return numeric(`Trouve le point d’intersection de y = ${coefficient(a)} ${term(c)} et y = ${coefficient(b)} ${term(d)}.`, 'Au point d’intersection, les deux expressions de y sont égales. Trouve x puis remplace-le dans une équation.',
        `On obtient ${coefficient(a - b)} = ${num(d - c)}, donc x = ${num(x)}. La première équation donne ensuite y = ${num(y)}.`, [['Abscisse du point', x], ['Ordonnée du point', y]])
    }],
  ],
}
