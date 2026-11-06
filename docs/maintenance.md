# Maintenance de FocusBro

## Lancer et vérifier

Le projet utilise Node.js 20 ou plus récent. Le navigateur charge des modules JavaScript natifs et le serveur local utilise uniquement les modules standard de Node.js.

```sh
npm run dev
npm run check
npm run build
```

`npm run dev` et `npm start` servent le projet à `http://127.0.0.1:4173/`. Les variables `HOST` et `PORT` permettent de changer l’interface réseau et le port. `npm run check` vérifie la syntaxe des points d’entrée et charge les modules de données. `npm run build` reconstruit `dist/` avec les fichiers à héberger.

Vérifie en plus les parcours concernés dans un navigateur. Pour une modification transverse, utilise ces scénarios.

| Parcours | Vérification |
| --- | --- |
| Cours | Chercher une notion, ouvrir la correction, marquer le chapitre comme lu et retrouver cet état après rechargement. |
| Maths | Entrer une réponse fausse, lire la correction, comparer les valeurs de la variante suivante et réussir deux variantes de suite. En mode mixte, l’exercice suivant porte sur une autre compétence. |
| Flashcards | Vérifier qu’une carte de maths fournie marquée « Difficile » ouvre la reprise ciblée. Vérifier sur une autre matière que le rappel espacé conserve sa date après un passage en entraînement libre. |
| Feynman | Enregistrer une explication et un exemple, ouvrir la réponse proposée et recharger pour retrouver le texte. |
| Focus | Interrompre une session pour vérifier l’absence d’XP, puis terminer un Pomodoro et vérifier le gain de 50 XP ainsi que le passage en pause. |
| Mobile | Ouvrir les écrans modifiés à 320 et 390 pixels de large et vérifier l’accès aux commandes et l’absence de défilement horizontal. |

## Structure

| Emplacement | Rôle |
| --- | --- |
| `index.html`, `src/app.js` | Chargement de l’application, navigation par fragment d’URL et gestion des interactions. |
| `src/views.js`, `src/style.css` | Vues, formulaires et mise en page mobile. |
| `src/study.js` | État de départ, minuteur, planification des cartes, XP et statistiques. |
| `src/course-*.js`, `src/courses.js` | Chapitres par matière, index de cours et génération des identifiants de cartes. |
| `src/math-numbers.js`, `src/math-topics.js` | Types d’exercices de maths, valeurs variables, indices et corrections. |
| `src/math-practice.js`, `src/math-problem.js` | Sélection des variantes, reprises ciblées et vérification des réponses numériques ou à choix. |
| `src/audio.js` | Ambiances de concentration et son de fin de session. |
| `server.mjs`, `build.mjs` | Serveur local et préparation du site statique. |

Les données d’étude sont stockées dans `localStorage` sous la clé `focusbro:v1`. Lorsqu’un champ est ajouté, complète l’état de départ et vérifie le chargement d’une sauvegarde antérieure. Conserve les identifiants utilisés dans les sauvegardes et les liens vers les cours.

Lorsqu’une matière est retirée du catalogue, la progression acquise compte dans les totaux. Les cartes, notes et entrées d’historique de cette matière sont masquées. Une session de focus déjà lancée reprend sous « Autre matière ».

## Ajouter ou corriger du contenu

Un chapitre regroupe ses explications, un exercice corrigé, un défi Feynman avec indice et réponse proposée, et ses cartes. Ajoute-le dans le fichier de sa matière avec un identifiant unique. Les identifiants des cartes suivent leur ordre dans le chapitre. Pour préserver les révisions existantes, corrige les cartes en place et ajoute les nouvelles à la fin.

Pour les maths, mets à jour les correspondances entre cartes et compétences dans `src/math-practice.js` si tu modifies leur ordre ou leur contenu. Associe l’exercice du cours à la compétence qui permet de refaire le même raisonnement avec d’autres valeurs. Chaque générateur fournit un énoncé, un indice, les réponses attendues et une correction. Vérifie plusieurs tirages, notamment les changements de signe, les fractions et les choix de réponse distincts.

## Documenter, committer et pousser

1. Actualise le `README.md` si la modification change ce que l’élève voit ou utilise. Actualise ce guide si elle change le lancement, la structure, les données ou les vérifications.
2. Exécute les vérifications et prépare les fichiers de la modification. Relis le diff préparé avec `git diff --cached`.
3. Crée le commit puis exécute `git push` sur la branche de travail. Pour une nouvelle branche, utilise `git push -u origin HEAD` afin de définir son suivi.

Pour héberger l’application, déploie le contenu de `dist/` sur un hébergement statique. Le site hébergé avec Sites utilise la configuration de `.openai/hosting.json`. Un push Git et une publication du site sont deux opérations distinctes.
