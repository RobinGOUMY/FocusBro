import { choice, coefficient, fraction, num, numeric, term } from './math-problem.js'

export default {
  'fonctions-images': [
    ['function-image', 'Calculer l’image d’un nombre', rng => {
      const a = rng.pick([-1, 1]) * rng.int(2, 7), b = rng.int(-12, 14), x = -rng.int(1, 9), y = a * x * x + b
      return numeric(`Soit f(x) = ${num(a)}x² ${term(b)}. Calcule f(${num(x)}).`, 'Remplace x par la valeur indiquée entre parenthèses et calcule son carré en premier.',
        `f(${num(x)}) = ${num(a)} × (${num(x)})² ${term(b)} = ${num(y)}.`, [['Image par f', y]],
        [[[-a * x * x + b], 'Le carré d’un nombre négatif est positif. Garde les parenthèses autour de l’entrée.'], [[a * x * x], 'Tu as calculé le premier terme. Il reste à appliquer la constante.']])
    }],
    ['function-antecedent', 'Trouver des antécédents', rng => {
      const x = rng.int(2, 18), a = rng.int(1, 7), b = rng.int(-12, 16), y = a * x * x + b
      const expression = a === 1 ? 'x²' : `${a}x²`
      return numeric(`Pour f(x) = ${expression} ${term(b)}, trouve les deux antécédents de ${num(y)}. Range-les dans l’ordre croissant.`, 'Résous f(x) = la valeur demandée. Une équation x² = un nombre strictement positif a deux solutions.',
        `${expression} = ${a * x * x}, donc x² = ${x * x}. Les deux solutions sont ${num(-x)} et ${x}.`, [['Plus petit antécédent', -x], ['Plus grand antécédent', x]],
        [[[x, -x], 'Tu as les deux antécédents. Commence par le négatif.'], [[-x * x, x * x], 'Prends la racine carrée après avoir isolé x².']])
    }],
    ['function-domain', 'Trouver une valeur interdite', rng => {
      const a = rng.int(2, 10), x = rng.pick([-1, 1]) * rng.int(1, 17), top = rng.int(1, 19), b = -a * x
      return numeric(`Pour quelle valeur de x la fonction f(x) = ${top}/(${coefficient(a)} ${term(b)}) n’est-elle pas définie ?`, 'Un quotient est indéfini quand son dénominateur est nul.',
        `Le dénominateur s’annule quand ${coefficient(a)} ${term(b)} = 0, soit x = ${num(x)}.`, [['Valeur interdite', x]],
        [[[0], 'Zéro est interdit pour 1/x. Ici, cherche plutôt l’entrée qui annule toute l’expression au dénominateur.']])
    }],
  ],
  'variations-fonctions': [
    ['absolute-min', 'Trouver le minimum d’une valeur absolue', rng => {
      const a = rng.pick([-1, 1]) * rng.int(1, 14), b = rng.int(-15, 15), c = rng.int(2, 7)
      return numeric(`Pour f(x) = ${c}|x ${term(-a)}| ${term(b)}, à quelle abscisse est le minimum et quelle est sa valeur ?`, 'Le minimum arrive quand l’expression entre les barres de valeur absolue vaut zéro.',
        `Pour x = ${num(a)}, |x ${term(-a)}| = 0. Ce terme ne peut pas être négatif. Le minimum vaut donc f(${num(a)}) = ${num(b)}.`, [['Abscisse du minimum', a], ['Valeur minimale de f', b]],
        [[[-a, b], 'Résous l’expression entre les barres égale à zéro. Le signe de l’abscisse est inversé.'], [[a, 0], 'Le terme avec la valeur absolue vaut 0, mais il reste le terme constant.']])
    }],
    ['affine-variation', 'Déterminer le sens de variation', rng => {
      const a = rng.int(-19, 19), b = rng.int(-35, 35)
      const answer = a === 0 ? 'Constante' : a > 0 ? 'Strictement croissante' : 'Strictement décroissante'
      return choice(rng, `Quel est le sens de variation de f(x) = ${a === 0 ? `0x ${term(b)}` : `${coefficient(a)} ${term(b)}`} ?`, 'Le sens dépend du nombre qui multiplie x.',
        `Le coefficient directeur vaut ${num(a)}. La fonction est donc ${answer.toLowerCase()}.`, answer,
        ...['Constante', 'Strictement croissante', 'Strictement décroissante'].filter(label => label !== answer).map(label => [label, 'Le terme constant déplace la droite. Le signe de la pente donne le sens de variation.']))
    }],
    ['inverse-compare', 'Comparer des inverses', rng => {
      const sign = rng.pick([-1, 1]), a = sign * rng.int(2, 14), b = a + sign * rng.int(1, 16)
      return choice(rng, `Compare 1/(${num(a)}) et 1/(${num(b)}).`, 'Sur les positifs et sur les négatifs séparément, la fonction inverse est décroissante.',
        `Les dénominateurs sont du même signe. Comme ${num(a)} ${sign > 0 ? '<' : '>'} ${num(b)}, leurs inverses sont dans l’ordre opposé.`, `1/(${num(a)}) ${sign > 0 ? '>' : '<'} 1/(${num(b)})`,
        [`1/(${num(a)}) ${sign > 0 ? '<' : '>'} 1/(${num(b)})`, 'Tu as gardé l’ordre des dénominateurs. Sur cet intervalle, prendre l’inverse renverse l’ordre.'], [`1/(${num(a)}) = 1/(${num(b)})`, 'Deux nombres non nuls distincts ne peuvent pas avoir le même inverse.'])
    }],
    ['square-compare', 'Comparer des carrés avec les variations', rng => {
      const side = rng.pick([-1, 1]), first = rng.int(2, 13), second = first + rng.int(1, 13), [a, b] = rng.shuffle([side * first, side * second])
      const sign = a ** 2 > b ** 2 ? '>' : '<', other = sign === '>' ? '<' : '>'
      const comparison = symbol => `(${num(a)})² ${symbol} (${num(b)})²`
      return choice(rng, `Compare (${num(a)})² et (${num(b)})² en utilisant les variations de la fonction carré.`, 'La fonction carré décroît sur les négatifs et croît sur les positifs.',
        `Comme ${num(a)} ${a > b ? '>' : '<'} ${num(b)} et que la fonction carré est ${side < 0 ? 'décroissante sur les négatifs' : 'croissante sur les positifs'}, on obtient ${comparison(sign)}.`, comparison(sign),
        [comparison(other), side < 0 ? 'Sur les négatifs, la fonction carré inverse l’ordre des nombres.' : 'Sur les positifs, la fonction carré conserve l’ordre des nombres.'], [comparison('='), 'Les deux nombres ont des distances à zéro différentes.'])
    }],
  ],
  'pourcentages-statistiques': [
    ['percent-coefficient', 'Passer d’un taux à un coefficient', rng => {
      const p = rng.int(2, 75), sign = rng.pick([-1, 1]), expected = (100 + sign * p) / 100
      return numeric(`Par quel nombre faut-il multiplier un prix pour appliquer une ${sign < 0 ? 'baisse' : 'hausse'} de ${p} % ?`, 'Pars de 1 et ajoute ou enlève le taux écrit sous forme décimale.',
        `Le coefficient vaut 1 ${term(sign * p / 100)} = ${num(expected)}.`, [['Coefficient multiplicateur', expected]],
        [[[(100 - sign * p) / 100], 'Vérifie le sens de l’évolution. Une baisse donne un coefficient inférieur à 1.'], [[p / 100], 'Ce nombre représente le taux. Le coefficient inclut aussi la valeur de départ.']])
    }],
    ['median', 'Trouver une médiane', rng => {
      const first = rng.int(1, 15), offsets = [0, 1, rng.int(2, 5), rng.int(7, 13), rng.int(14, 25), rng.int(27, 37)]
      const ordered = offsets.map(offset => first + offset), size = rng.pick([5, 6]), numbers = rng.shuffle(ordered.slice(0, size))
      const expected = size === 5 ? ordered[2] : (ordered[2] + ordered[3]) / 2
      return numeric(`Calcule la médiane de la série ${numbers.join(' · ')}.`, size === 5 ? 'Range les cinq valeurs. Prends celle du milieu.' : 'Range les six valeurs. Fais la moyenne des deux valeurs centrales.',
        `Une fois rangée, la série donne ${ordered.slice(0, size).join(' · ')}. ${size === 5 ? `La troisième valeur est ${expected}.` : `Les deux valeurs centrales sont ${ordered[2]} et ${ordered[3]}. Leur moyenne vaut ${num(expected)}.`}`, [['Médiane', expected]],
        [[[fraction(numbers.reduce((sum, value) => sum + value, 0), size)], 'Cette valeur est la moyenne de la série. La médiane se lit dans la liste ordonnée.']])
    }],
    ['weighted-average', 'Calculer une moyenne pondérée', rng => {
      const a = rng.int(4, 12), b = rng.int(13, 20), na = rng.int(2, 6), nb = rng.int(1, 6), sum = a * na + b * nb, total = na + nb
      return numeric(`Une série contient ${na} valeurs égales à ${a} et ${nb} valeurs égales à ${b}. Calcule sa moyenne exacte.`, 'Multiplie chaque valeur par son effectif. Divise la somme des produits par l’effectif total.',
        `La somme des valeurs est ${na} × ${a} + ${nb} × ${b} = ${sum}. La moyenne est ${sum}/${total} = ${fraction(sum, total)}.`, [['Moyenne exacte', fraction(sum, total)]],
        [[[(a + b) / 2], 'La moyenne simple des deux valeurs oublie combien de fois chacune apparaît.']])
    }],
    ['successive-rates', 'Composer deux évolutions', rng => {
      const amount = rng.int(2, 12) * 100, up = rng.int(2, 25), down = rng.int(2, 25), updated = amount * (100 + up) / 100
      const exact = updated * (100 - down) / 100
      return numeric(`Un prix de ${amount} € augmente de ${up} %, puis diminue de ${down} %. Quel est le prix final ?`, 'Applique le deuxième pourcentage au nouveau prix. Tu peux multiplier les deux coefficients.',
        `Après la hausse, le prix est ${updated} €. On multiplie ensuite par ${num((100 - down) / 100)}, ce qui donne ${num(exact)} €.`, [['Prix final en euros', exact]],
        [[[amount * (100 + up - down) / 100], 'Soustraire les taux applique les deux changements au prix initial. La baisse s’applique au prix après la hausse.']])
    }],
  ],
  'tableaux-croises': [
    ['marginal-count', 'Calculer un effectif marginal', rng => {
      const a = rng.int(8, 39), b = rng.int(4, 25), c = rng.int(6, 35), d = rng.int(4, 25)
      return numeric(`Dans un lycée, ${a} élèves de seconde et ${b} de première viennent à vélo. ${c} élèves de seconde et ${d} de première viennent à pied. Combien viennent à vélo au total ?`, 'Additionne uniquement les cases qui correspondent au même mode de transport.',
        `Le total de la colonne « vélo » est ${a} + ${b} = ${a + b}.`, [['Nombre de cyclistes', a + b]], [[[a + c], 'Tu as calculé le total de la ligne « seconde ». On demande la colonne « vélo ».']])
    }],
    ['conditional-frequency', 'Calculer une fréquence conditionnelle', rng => {
      const group = rng.int(12, 43), helmets = rng.int(3, group - 2), total = group + rng.int(11, 50)
      return numeric(`Sur ${total} élèves, ${group} viennent à vélo et ${helmets} viennent à vélo avec un casque. Quelle proportion des cyclistes porte un casque ? Donne une fraction.`, 'Le mot « des cyclistes » donne le groupe à utiliser comme dénominateur.',
        `On compare ${helmets} élèves avec casque aux ${group} cyclistes, donc la proportion vaut ${fraction(helmets, group)}.`, [['Proportion parmi les cyclistes', fraction(helmets, group)]],
        [[[fraction(helmets, total)], 'Tu as divisé par toute la classe. Utilise seulement le nombre de cyclistes.']])
    }],
    ['global-frequency', 'Calculer une fréquence globale', rng => {
      const group = rng.int(15, 48), count = rng.int(4, group - 3), total = group + rng.int(15, 63)
      return numeric(`Une médiathèque compte ${total} livres. ${group} sont des romans, dont ${count} romans historiques. Quelle part de tous les livres sont des romans historiques ? Donne une fraction.`, 'Le dénominateur correspond à « tous les livres ».',
        `On compte ${count} romans historiques sur ${total} livres, soit ${fraction(count, total)}.`, [['Part de la collection', fraction(count, total)]],
        [[[fraction(count, group)], 'Ce résultat serait juste parmi les romans. La question porte sur l’ensemble des livres.']])
    }],
    ['compare-frequencies', 'Comparer deux populations de référence', rng => {
      const group = rng.int(12, 45), count = rng.int(3, group - 1), total = group + rng.int(12, 50)
      return numeric(`Sur ${total} élèves, ${group} font du sport, dont ${count} viennent à pied. Donne la part des sportifs à pied dans toute la classe, puis la part qui vient à pied parmi les sportifs.`, 'Le numérateur ne change pas. Compare le groupe nommé dans chaque question.',
        `Dans toute la classe, on utilise ${count}/${total}. Parmi les sportifs, on utilise ${count}/${group}.`, [['Part dans toute la classe', fraction(count, total)], ['Part parmi les sportifs', fraction(count, group)]],
        [[[fraction(count, group), fraction(count, total)], 'Tu as inversé les populations de référence. Commence par l’ensemble de la classe.']])
    }],
  ],
  probabilites: [
    ['complement-probability', 'Calculer la probabilité contraire', rng => {
      const red = rng.int(3, 23), blue = rng.int(5, 28), green = rng.int(2, 16), total = red + blue + green
      return numeric(`Une urne contient ${red} boules rouges, ${blue} bleues et ${green} vertes. On tire une boule au hasard. Quelle est la probabilité de ne pas tirer une rouge ?`, 'Prends toutes les issues sauf celles qui donnent une boule rouge.',
        `On compte ${blue} + ${green} = ${blue + green} boules non rouges sur ${total}. La probabilité vaut ${fraction(blue + green, total)}.`, [['Probabilité exacte', fraction(blue + green, total)]],
        [[[fraction(red, total)], 'Tu as calculé la probabilité de tirer une rouge. La question demande l’événement contraire.']])
    }],
    ['weighted-probability', 'Additionner des issues non équiprobables', rng => {
      const a = rng.int(8, 33), b = rng.int(10, 42), c = 100 - a - b
      return numeric(`Une roue a trois issues A, B et C. P(A) = ${a} %, P(B) = ${b} % et P(C) = ${c} %. Quelle est la probabilité d’obtenir A ou C ?`, 'Les issues n’ont pas la même probabilité. Additionne uniquement les probabilités qui conviennent.',
        `A et C sont deux issues distinctes, donc P(A ou C) = ${a} % + ${c} % = ${a + c} %.`, [['Probabilité en %', a + c]],
        [[[fraction(a + c, 100)], 'Ta proportion est correcte. Multiplie-la par 100 pour donner le résultat en pourcentage.'], [[fraction(200, 3)], 'On ne peut pas compter simplement deux issues sur trois si les issues ne sont pas équiprobables.']])
    }],
    ['event-intersection', 'Compter les issues communes', rng => {
      const n = rng.int(12, 35), threshold = rng.int(3, n - 4), count = Math.floor(n / 2) - Math.floor(threshold / 2)
      return numeric(`On tire un entier au hasard entre 1 et ${n} inclus. Quelle est la probabilité qu’il soit pair et strictement supérieur à ${threshold} ?`, 'L’entier doit satisfaire les deux critères à la fois. Compte les nombres pairs au-dessus de la borne.',
        `Il y a ${Math.floor(n / 2)} nombres pairs jusqu’à ${n} et ${Math.floor(threshold / 2)} jusqu’à ${threshold}. Il reste ${count} issues favorables sur ${n}, soit ${fraction(count, n)}.`, [['Probabilité exacte', fraction(count, n)]],
        [[[fraction(n - threshold, n)], 'Tu as compté tous les entiers au-dessus de la borne. Garde seulement les pairs.'], [[fraction(Math.floor(n / 2), n)], 'Tu as compté tous les pairs. Enlève ceux qui ne dépassent pas la borne.']])
    }],
    ['event-union', 'Calculer une probabilité avec « ou »', rng => {
      const n = rng.int(13, 33), divisor = rng.pick([2, 3, 4, 5]), threshold = rng.int(3, n - 5), below = Math.floor(threshold / divisor)
      const count = n - threshold + below
      return numeric(`On tire un entier de 1 à ${n} au hasard. Quelle est la probabilité qu’il soit multiple de ${divisor} ou supérieur à ${threshold} ?`, 'Compte tous les entiers au-dessus de la borne, puis ajoute les multiples qui ne sont pas encore comptés.',
        `Il y a ${n - threshold} entiers au-dessus de ${threshold} et ${below} multiples de ${divisor} parmi les autres. Cela fait ${count} issues sur ${n}, soit ${fraction(count, n)}.`, [['Probabilité exacte', fraction(count, n)]],
        [[[fraction(n - threshold + Math.floor(n / divisor), n)], 'Certains multiples dépassent déjà la borne. En les ajoutant tous, tu les comptes deux fois.']])
    }],
  ],
  'python-algorithmes': [
    ['range-count', 'Lire une boucle Python', rng => {
      const start = rng.int(1, 16), step = rng.int(2, 6), count = rng.int(3, 9), stop = start + (count - 1) * step + rng.int(1, step)
      return numeric(`En Python, combien de valeurs produit range(${start}, ${stop}, ${step}) ?`, 'Pars de la première valeur. Ajoute le pas tant que tu restes strictement en dessous de la borne finale.',
        `Les valeurs sont ${Array.from({ length: count }, (_, index) => start + index * step).join(', ')}. Il y en a ${count}. La borne ${stop} est exclue.`, [['Nombre de valeurs', count]],
        [[[count + 1], 'Vérifie que la dernière valeur ajoutée reste strictement sous la borne finale.']])
    }],
    ['modulo-condition', 'Évaluer un test avec le modulo', rng => {
      const divisor = rng.int(3, 13), n = divisor * rng.int(3, 18) + rng.int(1, divisor - 1)
      return numeric(`Le code Python calcule n % ${divisor} avec n = ${n}. Quel résultat obtient-il ?`, 'En Python, % donne le reste d’une division entière.',
        `${n} = ${divisor} × ${Math.floor(n / divisor)} + ${n % divisor}. Python renvoie le reste ${n % divisor}.`, [['Valeur renvoyée', n % divisor]],
        [[[Math.floor(n / divisor)], 'Tu as calculé le quotient. L’opérateur % donne le reste.']])
    }],
    ['python-return', 'Suivre la valeur renvoyée par une fonction', rng => {
      const a = rng.int(2, 13), b = rng.int(2, 17), x = rng.pick([-1, 1]) * rng.int(1, 13), expected = a * x + b
      return numeric(`En Python, que vaut calcul(${num(x)}) ?\n\ndef calcul(x):\n    y = x * ${a}\n    return y + ${b}`, 'Suis l’ordre des lignes. La fonction renvoie la valeur indiquée après return.',
        `Avec x = ${num(x)}, y vaut ${num(a * x)}. La ligne return ajoute ${b} et renvoie ${num(expected)}.`, [['Valeur renvoyée', expected]],
        [[[a * x], 'Tu as calculé y. Lis aussi l’expression après return.']])
    }],
    ['range-sum', 'Suivre une somme dans une boucle', rng => {
      const first = rng.int(1, 13), stop = first + rng.int(3, 9), initial = rng.int(0, 16), count = stop - first
      const sum = count * (first + stop - 1) / 2
      return numeric(`Quelle est la valeur finale de s ?\n\ns = ${initial}\nfor k in range(${first}, ${stop}):\n    s = s + k`, 'Écris les valeurs successives de k. Ajoute chacune à s et arrête-toi avant la borne finale.',
        `On ajoute les entiers de ${first} à ${stop - 1}. Leur somme vaut ${sum}, donc s finit à ${initial} + ${sum} = ${initial + sum}.`, [['Valeur finale de s', initial + sum]],
        [[[initial + sum + stop], 'La borne de fin de range est exclue.'], [[sum], 'Il faut commencer avec la valeur initiale de s.']])
    }],
  ],
}
