# Maintenance de FocusBro

## Lancer et vérifier

Le projet utilise Node.js 20 ou plus récent. Le navigateur charge des modules JavaScript natifs. Le serveur local utilise le pilote Neon pour l’API de sauvegarde.

```sh
npm ci
npm run dev
npm run check
npm run build
```

`npm run dev` et `npm start` servent le projet à `http://127.0.0.1:4173/`. Les variables `HOST` et `PORT` permettent de changer l’interface réseau et le port. `npm run check` vérifie la syntaxe, charge les modules et exécute les tests de progression. `npm test` lance ces tests seuls. `npm run build` reconstruit `dist/` avec les fichiers à héberger.

Vérifie en plus les parcours concernés dans un navigateur. Pour une modification transverse, utilise ces scénarios.

| Parcours | Vérification |
| --- | --- |
| Accueil | Vérifier l’objectif du jour et l’accès direct au Pomodoro. Après avoir ouvert un cours, retrouver la lecture dans « À suivre ». En cours de session, vérifier que l’action principale rouvre l’activité. |
| Cours | Marquer un chapitre comme travaillé depuis la liste et un autre depuis sa fiche. Combiner la recherche avec les filtres d’avancement, remettre un chapitre à « Pas encore » et retrouver les statuts après rechargement. |
| Maths | Entrer une réponse fausse, lire la correction, comparer les valeurs de la variante suivante et réussir deux variantes de suite. En mode mixte, l’exercice suivant porte sur une autre compétence. |
| Flashcards | Vérifier que les deux modes sélectionnent les chapitres travaillés, puis ouvrir « Toute la collection ». Démarrer une série, vérifier le repli des réglages, retourner une carte et vérifier que la position avance après l’évaluation. Une carte de maths marquée « Difficile » doit ouvrir la reprise ciblée. |
| Feynman | Enregistrer une explication et un exemple, ouvrir la réponse proposée et recharger pour retrouver le texte. |
| Focus | Choisir une matière et vérifier que le démarrage ouvre l’activité proposée. Naviguer, suspendre puis reprendre depuis le minuteur flottant et vérifier qu’une réponse en cours reste saisie. Terminer le Pomodoro pour vérifier le gain de 50 XP et le démarrage de la pause depuis une autre page. |
| Pass et vestiaire | Charger une ancienne sauvegarde à 150, 500 ou 4 200 XP et vérifier les cosmétiques acquis. Avec une sauvegarde neuve très riche en XP et un seul jour de révision, vérifier le verrou de régularité. Atteindre un palier de jetons, le réclamer deux fois et recharger. Tester le palier 40 à 26 000 XP et 160 jours, puis équiper les six nouvelles récompenses. |
| Missions | Ouvrir les missions depuis l’accueil, puis progresser dans les activités proposées. Récupérer les trois récompenses et vérifier le bonus et le solde de 100 jetons. Réessayer depuis un deuxième onglet et après rechargement. Passer au lendemain avec une récompense en attente et vérifier la rotation, l’expiration et la conservation du solde. |
| Objectifs hebdomadaires | Cumuler quatre journées qualifiées, 100 minutes de focus et 30 cartes. Vérifier chaque gain d’XP et de jetons, puis réessayer depuis un deuxième onglet. Passer au lundi suivant, retrouver les bonus non réclamés, les récupérer et recharger. Vérifier le passage d’année et le calendrier local. |
| XP des activités | Réussir six exercices pour contrôler le plafond de 50 XP en maths. Enregistrer puis modifier une explication de 80 caractères avec un exemple de 20 caractères pour contrôler le gain unique de 30 XP. Vérifier le plafond mémoire de 60 XP et la reprise des gains au lendemain. Charger un ancien jour d’Arcade à 60 XP puis terminer une partie pour vérifier un gain nul. |
| Boutique | Comparer un objet accessible, un objet trop cher et un objet verrouillé par l’XP. Tester un achat à un jeton sous le prix puis au prix exact, et le double clic. Combiner les filtres de type et de rareté, recharger leur URL et tester un résultat vide. Vérifier les cinq raretés sur une palette claire et sombre. Charger une sauvegarde avec un ancien achat et vérifier son équipement. Acheter et équiper Singularité, Supernova et la traînée quantique, puis retrouver leurs effets après rechargement et dans le Quiz en vol. |
| Thèmes | Depuis le Pass Focus, ouvrir « Voir les thèmes ». Comparer une palette claire et une palette sombre, puis équiper une palette débloquée. Vérifier les couleurs de l’accueil, d’un cours, du vestiaire et de l’Arcade, le contraste des textes et la conservation du choix après rechargement. Vérifier aussi les couleurs du logo sur ordinateur et mobile, l’icône de l’onglet et le logo réduit pendant une session sur un écran de 320 pixels. |
| Comptes | Créer un compte après avoir gagné de l’XP en invité. Dans un deuxième navigateur, vérifier une tentative de connexion incorrecte, puis retrouver les données du compte. Modifier la progression hors ligne, reconnecter les deux appareils, vérifier la détection d’un conflit et tester les deux choix. Se déconnecter et retrouver la sauvegarde invitée. |
| Arcade | En invité sans historique, vérifier que les jeux attendent des chapitres travaillés. Marquer un chapitre depuis l’Arcade et retrouver ce statut dans les cours et les flashcards. Vérifier le filtre par matière et le choix explicite « Toute la collection ». En vol, tester les portes, les collisions et le mode sans pilotage. Dans le sprint, vérifier la pause, le combo, les corrections et la fin du chrono. Dans Mémo Duo, vérifier un plateau de 20 cartes, un mauvais essai et la fin de partie. |
| Jeux d’action | Dans Tranche-Méninges, balayer des cibles et trancher trois intrus. Dans Snake, tester un mauvais ordre et une série complète. Dans Rail Express, changer de voie au clavier et au toucher puis vérifier la correction. Dans Siège du savoir, tirer avec les boutons et au glisser, puis vérifier l’effondrement et le rebond. Contrôler les records, le plafond d’XP et la progression de mission après le plafond. |
| Rythme et lisibilité | Vérifier que chaque objet de Tranche-Méninges reste en vol 4,4 secondes et qu’une manche expire au bout de 10 secondes. Dans Rail Express, vérifier le passage de porte après 4,2 secondes et la conservation du délai pendant une pause. Lire les consignes et corrections sur les pages de révision, dans l’Arcade et dans la boutique avec une palette claire et une palette sombre, à 320 et 390 pixels de large. |
| Mobile | Ouvrir les écrans modifiés à 320 et 390 pixels de large et vérifier l’accès aux commandes et l’absence de défilement horizontal. |

## Structure

| Emplacement | Rôle |
| --- | --- |
| `index.html`, `src/app.js` | Chargement de l’application, navigation par fragment d’URL et gestion des interactions. |
| `src/views.js`, `src/style.css`, `src/play.css` | Vues, formulaires, navigation et styles adaptatifs. Les variables CSS portent les couleurs, les thèmes et les surfaces. |
| `src/themes.css` | Palettes du pass et de la boutique, avec miniatures et couleurs de texte, de surface et d’état. |
| `src/study.js` | État de départ, minuteur, planification des cartes, XP et statistiques. |
| `src/progression.js`, `src/dates.js` | Journal annuel, XP cumulée, critères des jours de révision et clés de dates locales. |
| `src/weekly-missions.js` | Agrégation par semaine, objectifs, bonus en attente et récupération unique. |
| `tests/progression.test.js` | Simulation annuelle, migration des sauvegardes, plafonds, changements de semaine et doubles récupérations. |
| `src/cloud-save.js`, `api/account.js`, `db/` | Cache par compte, synchronisation, sessions, API et schéma Neon. |
| `src/pass.js` | Paliers d’XP, catalogues du pass et de la boutique, prix, raretés, achat et validation de l’équipement. |
| `src/missions.js`, `src/shop-view.js`, `src/shop.css` | Rotation quotidienne, calcul des missions, récupération des jetons, vues et styles du butin. |
| `src/arcade.js`, `src/arcade-controller.js`, `src/arcade-view.js` | Sélection des questions, règles de jeu, boucle de vol et de chrono, résultats et vues. |
| `src/arcade-action-games.js`, `src/arcade-action-view.js`, `src/arcade-action.css` | Mécaniques, commandes et affichage de Tranche-Méninges, Snake, Rail Express et Siège du savoir. |
| `src/arcade-questions.js` | Banque de questions à trois choix, corrections et correspondances avec les cours. |
| `src/arcade-challenges.js` | Règles et mots ou nombres à trancher, suites ordonnées, traductions anglaises et espagnoles liées aux cours. |
| `src/focus-activities.js` | Suggestions du Pomodoro selon la matière, les cours lus, les cartes à revoir et les reprises en maths. |
| `src/course-*.js`, `src/courses.js` | Chapitres par matière, index de cours et génération des identifiants de cartes. |
| `src/math-numbers.js`, `src/math-topics.js` | Types d’exercices de maths, valeurs variables, indices et corrections. |
| `src/math-practice.js`, `src/math-problem.js` | Sélection des variantes, reprises ciblées et vérification des réponses numériques ou à choix. |
| `src/audio.js` | Ambiances de concentration et son de fin de session. |
| `server.mjs`, `build.mjs` | Serveur local et préparation du site statique. |
| `vercel.json` | Déploiement Vercel avec `npm run build`, `dist/` et la politique de sécurité du document. |

Les données d’étude sont stockées dans `localStorage` sous la clé `focusbro:v1`. Lorsqu’un champ est ajouté, complète l’état de départ et vérifie le chargement d’une sauvegarde antérieure. Conserve les identifiants utilisés dans les sauvegardes et les liens vers les cours.

Les récompenses du pass dépendent de l’XP totale et des journées de révision. Lors du premier chargement d’une sauvegarde antérieure à `journey`, les anciens seuils d’XP servent à remplir `journey.legacyOwned` avec des clés `type:identifiant`. La migration déduit les cosmétiques acquis avant d’appliquer les nouveaux paliers.

Chaque partie reste en mémoire jusqu’à sa fin ou jusqu’à la sortie de l’Arcade. Le résultat final met à jour `arcade.records`, le cumul journalier dans `arcade.days` et les 30 dernières parties dans `arcade.recent`. L’enregistrement passe par le verrou de sauvegarde utilisé par les autres activités lorsque le navigateur le prend en charge. Les nouveaux résultats rapportent 2 XP par réussite, dans la limite de 30 XP par jour. Un ancien cumul supérieur au plafond donne zéro XP supplémentaire. Le nombre minimal de réussites d’un ancien jour se déduit de l’ancien tarif de 3 XP.

Le parcours annuel contient 40 paliers, jusqu’à 26 000 XP et 160 journées de révision. Les 19 réserves intermédiaires de jetons se réclament une fois, avec des identifiants stables dans `journey.claimedTiers`. Les seuils d’XP et de jours augmentent ensemble. La simulation de référence, quatre jours hebdomadaires avec deux Pomodoros et dix cartes par jour, atteint le palier final à la semaine 40 en récupérant les trois bonus hebdomadaires. Un gros volume d’XP sur trente jours atteint seulement les paliers compatibles avec ces trente jours.

`journey.days` conserve les dates qualifiées, complétées par `syncJourney` lors des modifications. Un jour compte avec 25 minutes de focus, dix cartes distinctes, trois exercices de maths réussis ou une explication de 80 caractères avec un exemple de 20 caractères. Une date compte une fois. Le carnet des explications récompensées garde le jour et l’XP après la suppression d’une note. Les semaines utilisent le calendrier local et commencent le lundi.

Une explication Feynman retravaillée peut gagner le bonus quotidien. L’enregistrement du même texte et du même exemple donne zéro XP. Le journal conserve la récompense sous la date de la nouvelle rédaction.

`journey.weeks[week]` enregistre les objectifs réclamés et leur XP. Le solde de jetons est crédité dans la même opération de sauvegarde. Les bonus non réclamés se recalculent à partir de l’historique, puis se récupèrent depuis la page des missions. Les objectifs sont quatre jours de révision pour 80 XP et 120 jetons, 100 minutes de focus pour 80 XP et 100 jetons et trente cartes pour 60 XP et 80 jetons. Les cartes comptent une fois par jour, y compris en entraînement libre.

Pour ajouter un thème, associe un identifiant de palette à un palier ou une collection dans `src/pass.js`. Dans `src/themes.css`, applique la palette aux deux attributs correspondants. `data-theme` porte le thème équipé sur le document, et `data-palette` permet de montrer le même rendu dans la galerie. Pour une palette claire, applique également les couleurs de texte, d’accent et d’état du mode clair.

`brandLogo` dans `src/views.js` fournit le SVG du logo sur ordinateur et mobile. Il utilise `--accent` pour le fond et `--accent-ink` pour l’éclair. Le changement de thème actualise aussi l’icône de l’onglet à partir du même SVG et des couleurs calculées. `assets/bolt.svg` fournit l’icône initiale dans la palette Violet.

Les missions quotidiennes suivent la date locale. Le Pomodoro est fixe et les deux autres défis forment un cycle de six jours. La mission flashcards adapte son objectif au nombre de cartes des chapitres travaillés. `mathPractice.days[day]` compte les bonnes réponses et l’XP gagnée, avec un maximum de 50 XP par jour. Les anciennes valeurs booléennes restent lisibles pour la série. `arcade.days[day].correct` compte les réponses et les paires, même après le plafond d’XP.

`shop.tokens` contient le solde, `shop.owned` les identifiants achetés et `shop.claimed` les missions récupérées par date. Le bonus s’ajoute lors de la troisième récupération du jour. La récupération et l’achat revalident la date, le solde ou l’accès dans le verrou de sauvegarde existant. Une ancienne sauvegarde démarre avec une boutique vide et garde ses déblocages d’XP. Les nouveaux champs suivent la synchronisation de la progression sans migration de la base.

Les cinq raretés sont définies dans `shopRarities`. Chaque article indique son identifiant de rareté dans le catalogue. Les prix progressent de 150–250 jetons pour les objets communs à 5 000–7 500 pour les mythiques. Les accès demandent l’XP et les jours définis dans `rarityAccess`. Singularité demande 24 000 XP et 144 jours. Les identifiants présents dans `shop.owned` suffisent pour équiper un achat ancien.

Les filtres de la boutique se combinent dans l’URL, par exemple `#boutique/theme/mythic` ou `#boutique/tout/legendary`. La galerie, le compteur et le sélecteur suivent ces deux filtres. Les couleurs des raretés utilisent les variables sémantiques de la palette active pour les fonds clairs et sombres.

Le choix explicite d’un chapitre est conservé dans `reading[id].worked`. En l’absence de choix explicite, un chapitre déjà marqué comme lu est considéré comme travaillé. Les révisions et les sept jeux de l’Arcade suivent ce périmètre par défaut. La sélection dans l’Arcade réutilise les mêmes réglages que les cours. Les cartes personnelles sans chapitre sont accessibles dans « Toute la collection » des flashcards.

Le Pomodoro garde l’activité choisie dans `timer.activity`. Le lancement ouvre sa route interne, et les commandes du minuteur fonctionnent indépendamment de la page affichée. Le minuteur flotte sur ordinateur et reste dans l’en-tête fixe sur mobile. Une reprise laisse l’élève sur la page qu’il utilise.

L’accueil déduit ses liens de reprise et son objectif des données existantes. Les filtres de cours et le compteur de la série de flashcards vivent dans l’état de navigation, en mémoire.

Le pied de page commun affiche le crédit de RobinGOUMY et son profil GitHub. Sur mobile, son espacement tient compte de la navigation fixe.

La refonte s’appuie sur les exemples publics de Mobbin pour rendre l’action principale et la progression visibles. [Étude des parcours de démarrage](https://mobbin.com/blog/the-long-onboarding-a-study-of-1-460-flows) · [Exemples de navigation et de sélection d’une session](https://mobbin.com/blog/how-to-use-mobbin-mcp)

La police variable Manrope est servie depuis `assets/manrope.woff2` avec sa licence dans `assets/manrope-license.txt`. [Manrope sur Google Fonts](https://fonts.google.com/specimen/Manrope)

Les paragraphes de consigne et d’explication utilisent généralement 15 à 16 pixels et un interligne de 1,6 ou plus, y compris sur mobile. Les textes de cours utilisent la couleur principale de la palette. Les variables `--muted` et `--quiet` fournissent un contraste renforcé aux informations secondaires. Vérifie aussi les palettes claires lors d’un changement de ces variables.

Les durées de l’Arcade sont définies dans `src/arcade-action-games.js`. Tranche-Méninges utilise un vol de 4 400 ms et des départs répartis sur 5 600 ms. La durée d’une manche complète se déduit du dernier départ et du temps de vol. Rail Express partage sa durée de 4 200 ms entre la logique du passage de porte et la barre de temps.

Lorsqu’une matière est retirée du catalogue, la progression acquise compte dans les totaux. Les cartes, notes et entrées d’historique de cette matière sont masquées. Une session de focus déjà lancée reprend sous « Autre matière ».

## Ajouter ou corriger du contenu

Un chapitre regroupe ses explications, un exercice corrigé, un défi Feynman avec indice et réponse proposée, et ses cartes. Ajoute-le dans le fichier de sa matière avec un identifiant unique. Les identifiants des cartes suivent leur ordre dans le chapitre. Pour préserver les révisions existantes, corrige les cartes en place et ajoute les nouvelles à la fin.

Pour les maths, mets à jour les correspondances entre cartes et compétences dans `src/math-practice.js` si tu modifies leur ordre ou leur contenu. Associe l’exercice du cours à la compétence qui permet de refaire le même raisonnement avec d’autres valeurs. Chaque générateur fournit un énoncé, un indice, les réponses attendues et une correction. Vérifie plusieurs tirages, notamment les changements de signe, les fractions et les choix de réponse distincts.

Pour l’Arcade, associe chaque question à l’identifiant d’un cours existant. Prévois une seule réponse correcte, deux choix plausibles et une correction courte. Mémo Duo combine les questions de l’Arcade et les flashcards fournies. Si la sélection contient moins de quatre paires distinctes, il utilise aussi les exercices corrigés des cours concernés. Il retire les doublons de questions et de réponses, puis tire entre quatre et dix paires selon la sélection. Pour un nouveau défi à trancher, fournis au moins trois cibles et trois intrus. Pour Snake, donne les éléments dans l’ordre attendu et utilise des libellés courts pour la grille. Les traductions de Rail Express ont deux distracteurs et renvoient à un cours d’anglais ou d’espagnol.

## Documenter, committer et pousser

1. Actualise le `README.md` si la modification change ce que l’élève voit ou utilise. Actualise ce guide si elle change le lancement, la structure, les données ou les vérifications.
2. Exécute les vérifications et prépare les fichiers de la modification. Relis le diff préparé avec `git diff --cached`.
3. Crée le commit puis exécute `git push` sur la branche de travail. Pour une nouvelle branche, utilise `git push -u origin HEAD` afin de définir son suivi.

Pour héberger le mode invité seul, déploie le contenu de `dist/` sur un hébergement statique. Le site hébergé avec Sites utilise `.openai/hosting.json`.

Sur Vercel, importe le dépôt GitHub ou utilise `npx vercel link` puis `npx vercel git connect` dans un terminal connecté. Dans les paramètres du projet, ouvre **Environments → Production → Branch Tracking** et sélectionne la branche à publier. Pour déclencher une première mise en ligne depuis un checkout vérifié, utilise `npx vercel deploy --prod`. Vérifie le domaine de production en navigation privée et ouvre directement `/#pass/themes` puis `/#arcade`. Les sauvegardes locales sont propres à ce domaine. [Branche de production sur Vercel](https://vercel.com/docs/git#production-branch)

Le projet Vercel `focusbro` suit actuellement la branche `codex/pass-arcade` du dépôt GitHub. Un push sur cette branche déclenche un déploiement de production. Les fichiers locaux créés par `vercel link` sont ignorés par Git. [Site de production](https://focusbro-two.vercel.app/)

## Comptes et sauvegarde

Vercel sert l’API `/api/account` en plus des fichiers de `dist/`. La base Neon injecte `DATABASE_URL` côté serveur. Pour vérifier l’API en local, utilise une base de test et définis cette variable dans un fichier ignoré par Git, puis lance les commandes suivantes.

```sh
node --env-file=.env.local db/migrate.mjs
node --env-file=.env.local server.mjs
```

Applique le schéma avec `db/migrate.mjs` avant le premier déploiement sur une nouvelle base. L’API hache les mots de passe avec scrypt, limite les tentatives et authentifie les requêtes par un cookie de session. Elle n’expose jamais `DATABASE_URL` au navigateur.

Le mode invité conserve `focusbro:v1`. Un compte utilise une copie locale séparée et une révision enregistrée dans Neon. La synchronisation vérifie cette révision avant d’écrire et propose un choix si deux appareils ont modifié des versions différentes. Une erreur réseau laisse les modifications en attente sur l’appareil.

Pour examiner toutes les personnalisations, utilise un compte de test préchargé au palier final de 26 000 XP et 160 journées de révision, avec les identifiants du catalogue dans `shop.owned`. Ce profil peut également sélectionner tous les chapitres pour tester les jeux. Ses identifiants de connexion se conservent dans un fichier privé local.
