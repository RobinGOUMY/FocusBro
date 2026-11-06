# Maintenance de FocusBro

## Lancer et vérifier

Le projet utilise Node.js 20 ou plus récent. Le navigateur charge des modules JavaScript natifs. Le serveur local utilise le pilote Neon pour l’API de sauvegarde.

```sh
npm ci
npm run dev
npm run check
npm run build
```

`npm run dev` et `npm start` servent le projet à `http://127.0.0.1:4173/`. Les variables `HOST` et `PORT` permettent de changer l’interface réseau et le port. `npm run check` vérifie la syntaxe des points d’entrée et charge les modules de données. `npm run build` reconstruit `dist/` avec les fichiers à héberger.

Vérifie en plus les parcours concernés dans un navigateur. Pour une modification transverse, utilise ces scénarios.

| Parcours | Vérification |
| --- | --- |
| Accueil | Vérifier l’objectif du jour et l’accès direct au Pomodoro. Après avoir ouvert un cours, retrouver la lecture dans « À suivre ». En cours de session, vérifier que l’action principale rouvre l’activité. |
| Cours | Marquer un chapitre comme travaillé depuis la liste et un autre depuis sa fiche. Combiner la recherche avec les filtres d’avancement, remettre un chapitre à « Pas encore » et retrouver les statuts après rechargement. |
| Maths | Entrer une réponse fausse, lire la correction, comparer les valeurs de la variante suivante et réussir deux variantes de suite. En mode mixte, l’exercice suivant porte sur une autre compétence. |
| Flashcards | Vérifier que les deux modes sélectionnent les chapitres travaillés, puis ouvrir « Toute la collection ». Démarrer une série, vérifier le repli des réglages, retourner une carte et vérifier que la position avance après l’évaluation. Une carte de maths marquée « Difficile » doit ouvrir la reprise ciblée. |
| Feynman | Enregistrer une explication et un exemple, ouvrir la réponse proposée et recharger pour retrouver le texte. |
| Focus | Choisir une matière et vérifier que le démarrage ouvre l’activité proposée. Naviguer, suspendre puis reprendre depuis le minuteur flottant et vérifier qu’une réponse en cours reste saisie. Terminer le Pomodoro pour vérifier le gain de 50 XP et le démarrage de la pause depuis une autre page. |
| Pass et vestiaire | Charger une ancienne sauvegarde à 150 ou 500 XP avec un ancien avatar. Vérifier l’accès aux anciens déblocages et l’ajout des champs du vestiaire. Équiper un objet depuis le pass puis un autre depuis le profil. Vérifier les changements dans l’en-tête, l’aperçu, le vol et après rechargement. Tester un palier verrouillé et le palier final. |
| Thèmes | Depuis le Pass Focus, ouvrir « Voir les thèmes ». Comparer une palette claire et une palette sombre, puis équiper une palette débloquée. Vérifier les couleurs de l’accueil, d’un cours, du vestiaire et de l’Arcade, le contraste des textes et la conservation du choix après rechargement. |
| Comptes | Créer un compte après avoir gagné de l’XP en invité. Dans un deuxième navigateur, vérifier une tentative de connexion incorrecte, puis retrouver les données du compte. Modifier la progression hors ligne, reconnecter les deux appareils, vérifier la détection d’un conflit et tester les deux choix. Se déconnecter et retrouver la sauvegarde invitée. |
| Arcade | Tester les filtres, y compris une sélection vide. En vol, passer une porte, toucher un obstacle, utiliser le clavier et le tactile, puis essayer le mode sans pilotage. Dans le sprint, vérifier la pause, le combo, les corrections et la fin du chrono. Dans le memory, essayer une erreur puis terminer deux plateaux. Contrôler le record, le gain d’XP, le plafond quotidien et le retour au pass. |
| Mobile | Ouvrir les écrans modifiés à 320 et 390 pixels de large et vérifier l’accès aux commandes et l’absence de défilement horizontal. |

## Structure

| Emplacement | Rôle |
| --- | --- |
| `index.html`, `src/app.js` | Chargement de l’application, navigation par fragment d’URL et gestion des interactions. |
| `src/views.js`, `src/style.css`, `src/play.css` | Vues, formulaires, navigation et styles adaptatifs. Les variables CSS portent les couleurs, les thèmes et les surfaces. |
| `src/themes.css` | Palettes du site et de leurs miniatures, avec couleurs de texte, de surface et d’état. |
| `src/study.js` | État de départ, minuteur, planification des cartes, XP et statistiques. |
| `src/cloud-save.js`, `api/account.js`, `db/` | Cache par compte, synchronisation, sessions, API et schéma Neon. |
| `src/pass.js` | Paliers, seuils d’XP, catalogue des cosmétiques, valeurs de départ et validation de l’équipement. |
| `src/arcade.js`, `src/arcade-controller.js`, `src/arcade-view.js` | Sélection des questions, règles de jeu, boucle de vol et de chrono, résultats et vues. |
| `src/arcade-questions.js` | Banque de questions à trois choix, corrections et correspondances avec les cours. |
| `src/focus-activities.js` | Suggestions du Pomodoro selon la matière, les cours lus, les cartes à revoir et les reprises en maths. |
| `src/course-*.js`, `src/courses.js` | Chapitres par matière, index de cours et génération des identifiants de cartes. |
| `src/math-numbers.js`, `src/math-topics.js` | Types d’exercices de maths, valeurs variables, indices et corrections. |
| `src/math-practice.js`, `src/math-problem.js` | Sélection des variantes, reprises ciblées et vérification des réponses numériques ou à choix. |
| `src/audio.js` | Ambiances de concentration et son de fin de session. |
| `server.mjs`, `build.mjs` | Serveur local et préparation du site statique. |
| `vercel.json` | Déploiement Vercel avec `npm run build`, `dist/` et la politique de sécurité du document. |

Les données d’étude sont stockées dans `localStorage` sous la clé `focusbro:v1`. Lorsqu’un champ est ajouté, complète l’état de départ et vérifie le chargement d’une sauvegarde antérieure. Conserve les identifiants utilisés dans les sauvegardes et les liens vers les cours.

Les récompenses du pass sont déduites de l’XP totale. Une ancienne sauvegarde retrouve ses réglages grâce à la fusion avec les valeurs de départ du profil. Les anciens cosmétiques conservent leurs identifiants et leurs seuils de 0, 150 et 500 XP. Chaque partie reste en mémoire jusqu’à sa fin ou jusqu’à la sortie de l’Arcade. Le résultat final met à jour `arcade.records`, le cumul journalier dans `arcade.days` et les 30 dernières parties dans `arcade.recent`. L’enregistrement passe par le verrou de sauvegarde utilisé par les autres activités lorsque le navigateur le prend en charge. Le plafond d’Arcade suit la date locale et le cumul journalier reste acquis lorsque les anciens résultats sortent de l’historique.

Pour ajouter un thème, associe un identifiant de palette à un palier dans `src/pass.js`. Dans `src/themes.css`, applique la palette aux deux attributs correspondants. `data-theme` porte le thème équipé sur le document, et `data-palette` permet de montrer le même rendu dans la galerie. Pour une palette claire, applique également les couleurs de texte, d’accent et d’état du mode clair.

Le choix explicite d’un chapitre est conservé dans `reading[id].worked`. En l’absence de choix explicite, un chapitre déjà marqué comme lu est considéré comme travaillé. Les révisions par défaut suivent ce périmètre. Les cartes personnelles sans chapitre sont accessibles dans « Toute la collection ».

Le Pomodoro garde l’activité choisie dans `timer.activity`. Le lancement ouvre sa route interne, et les commandes du minuteur fonctionnent indépendamment de la page affichée. Le minuteur flotte sur ordinateur et reste dans l’en-tête fixe sur mobile. Une reprise laisse l’élève sur la page qu’il utilise.

L’accueil déduit ses liens de reprise et son objectif des données existantes. Les filtres de cours et le compteur de la série de flashcards vivent dans l’état de navigation, en mémoire.

La refonte s’appuie sur les exemples publics de Mobbin pour rendre l’action principale et la progression visibles. [Étude des parcours de démarrage](https://mobbin.com/blog/the-long-onboarding-a-study-of-1-460-flows) · [Exemples de navigation et de sélection d’une session](https://mobbin.com/blog/how-to-use-mobbin-mcp)

La police variable Manrope est servie depuis `assets/manrope.woff2` avec sa licence dans `assets/manrope-license.txt`. [Manrope sur Google Fonts](https://fonts.google.com/specimen/Manrope)

Lorsqu’une matière est retirée du catalogue, la progression acquise compte dans les totaux. Les cartes, notes et entrées d’historique de cette matière sont masquées. Une session de focus déjà lancée reprend sous « Autre matière ».

## Ajouter ou corriger du contenu

Un chapitre regroupe ses explications, un exercice corrigé, un défi Feynman avec indice et réponse proposée, et ses cartes. Ajoute-le dans le fichier de sa matière avec un identifiant unique. Les identifiants des cartes suivent leur ordre dans le chapitre. Pour préserver les révisions existantes, corrige les cartes en place et ajoute les nouvelles à la fin.

Pour les maths, mets à jour les correspondances entre cartes et compétences dans `src/math-practice.js` si tu modifies leur ordre ou leur contenu. Associe l’exercice du cours à la compétence qui permet de refaire le même raisonnement avec d’autres valeurs. Chaque générateur fournit un énoncé, un indice, les réponses attendues et une correction. Vérifie plusieurs tirages, notamment les changements de signe, les fractions et les choix de réponse distincts.

Pour l’Arcade, associe chaque question à l’identifiant d’un cours existant. Prévois une seule réponse correcte, deux choix plausibles et une correction courte. Le quiz mélange l’ordre des choix et le memory sélectionne des réponses distinctes. Garde au moins trois questions avec des réponses distinctes sur un chapitre pour que ce chapitre seul puisse alimenter un plateau de memory.

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
