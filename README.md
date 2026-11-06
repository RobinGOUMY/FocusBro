# FocusBro

FocusBro est un espace de révision pour la Seconde générale et technologique. Il réunit une bibliothèque de cours, des exercices de maths adaptatifs, un minuteur Pomodoro, des flashcards à répétition espacée, un carnet Feynman guidé et une arcade de révision reliée au Pass Focus.

## Installer et lancer en local

Installe Git et Node.js 20 ou plus récent, puis exécute ces commandes dans un terminal.

```sh
git clone https://github.com/RobinGOUMY/FocusBro.git
cd FocusBro
npm run dev
```

Ouvre [FocusBro en local](http://127.0.0.1:4173/). Les modules intégrés à Node.js suffisent pour lancer le serveur. Pour relancer FocusBro plus tard, ouvre un terminal dans le dossier `FocusBro` et exécute `npm run dev`.

Pour vérifier ou modifier le projet, consulte le [guide de maintenance](docs/maintenance.md). `npm run check` vérifie le code et `npm run build` prépare les fichiers statiques dans `dist/`.

## Réviser

- **Accueil**. Lance un Pomodoro ou reprends directement l’activité en cours. Suis ton objectif de 25 minutes et retrouve le dernier cours ouvert ou les flashcards à revoir dans « À suivre ».
- **Focus**. Choisis une matière et lance l’activité proposée. FocusBro utilise tes chapitres travaillés pour proposer des révisions et te suggère un cours quand tu commences une matière. Le minuteur flottant permet de suivre les 25 minutes, de suspendre la session ou de la reprendre depuis chaque page. Une session terminée rapporte 50 XP et propose une pause de cinq minutes. Les ambiances sonores se règlent dans la page Focus.
- **Cours**. Explore 84 chapitres courts. Recherche un thème ou filtre les chapitres par avancement. Indique « Travaillé » pour ceux déjà vus en classe ou à la maison. Clique à nouveau pour les remettre à « Pas encore ». Un chapitre marqué comme lu rejoint tes révisions par défaut. Tu peux régler son statut séparément.
- **Exercices de maths**. Entraîne-toi d’abord sur tes chapitres travaillés. Le menu permet aussi de choisir un chapitre ou de mélanger les 13 chapitres. Après une erreur, lis la correction puis reprends la même méthode avec d’autres valeurs. Deux variantes réussies d’affilée valident la reprise.
- **Flashcards**. Les questions portent par défaut sur tes chapitres travaillés, en révision espacée comme en entraînement libre. Ouvre « Réglages de la révision » pour changer la matière, le mode ou choisir « Toute la collection » et accéder aux 288 cartes. Quand tu commences une série, les réglages se replient et un compteur indique où tu en es. Dix rappels faciles en révision espacée rapportent 20 XP. Sur une carte de maths fournie, « Moyen » ou « Difficile » lance une reprise immédiate avec d’autres valeurs.
- **Feynman**. Le carnet te propose des défis sur les chapitres travaillés. Tu peux aussi choisir une autre notion. Chaque défi donne un indice et une réponse à consulter après avoir enregistré ton explication.
- **Arcade**. Choisis l’une des dix matières ou joue en mode mixte. Les 60 questions sont liées à des cours et peuvent être filtrées sur tes chapitres travaillés. Chaque bonne réponse ou paire trouvée rapporte 3 XP à la fin de la partie, jusqu’à 60 XP d’Arcade par jour. Tes records continuent de compter après ce plafond.
  - **Quiz en vol**. Lis la question avant de décoller. Appuie sur Espace ou touche la zone de vol pour battre des ailes et traverse la porte de la bonne réponse. Tu peux aussi choisir directement une réponse avec l’option sans pilotage.
  - **Sprint cérébral**. Tu as 45 secondes pour répondre à une série de questions. Les bonnes réponses consécutives font monter le combo. Le chrono s’arrête pendant les corrections et reprend à la question suivante.
  - **Mémo Duo**. Retourne des cartes pour associer chaque question à sa réponse. Chaque erreur coûte 15 points et les paires trouvées restent visibles.
- **Pass Focus**. L’XP de tes Pomodoros, flashcards et parties débloque automatiquement 20 paliers répartis en quatre actes. Équipe les récompenses dans le pass ou dans ton vestiaire. Tu peux combiner 44 cosmétiques répartis entre thèmes, avatars, cadres, bannières, titres et traînées. Les avatars et traînées équipés apparaissent dans le Quiz en vol.
- **Progression**. Suis ta série de jours, ton temps par matière, ton XP et tes dernières activités.

Les notes, cartes personnelles, chapitres lus, exercices en cours, cosmétiques équipés, records et statistiques sont sauvegardés dans le navigateur utilisé. Garde le même navigateur et la même adresse pour retrouver ta progression. Une adresse locale et une adresse hébergée ont chacune leur sauvegarde.

## Contenu pédagogique

La bibliothèque couvre dix matières de Seconde GT. L’anglais et l’espagnol sont les deux langues proposées. En français, les cours travaillent les genres et méthodes que l’élève peut appliquer aux œuvres choisies par son professeur.

- [Tronc commun et programmes sur Éduscol](https://eduscol.education.gouv.fr/4368/enseigner-au-lycee-generaltechnologique)
- [Programme de mathématiques de Seconde applicable à la rentrée 2026](https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602914A)
- [Programmes de langues vivantes étrangères et annexes par langue](https://www.education.gouv.fr/bo/2025/Hebdo22/MENE2504621A)

## Ouvrir sur un téléphone du même réseau

Lance le serveur en écoutant sur le réseau local. Dans PowerShell, utilise `$env:HOST = '0.0.0.0'; npm run dev`. Depuis le téléphone connecté au même Wi-Fi, ouvre l’adresse IP locale de l’ordinateur sur le port `4173` pendant que le serveur tourne.

## Illustration d’accueil

L’illustration `assets/focus-illustration.webp` a été créée avec l’outil ImageGen intégré en mode transparent, puis convertie en WebP. Prompt de génération ci-dessous.

> Use case: stylized-concept. Transparent PNG illustration for the right side of a pale periwinkle card in a polished French learning dashboard for teenagers. Create a compact sculptural 3D icon composition showing two stacked soft lavender school notebooks, a rounded periwinkle pomodoro desk timer with a simple white dial with one navy hand, and a big glossy cobalt lightning bolt leaning playfully against them. A tiny mint bookmark and two tiny four-point mint and lavender stars give movement. Contemporary editorial 3D, satin ceramic and matte soft-touch plastic, rounded industrial design, subtle ambient occlusion, crisp silhouette, soft studio light from upper left, youthful and calm. Colors restricted to cobalt blue #3b49ca, periwinkle #8a91f7, pale lilac #c8ccff, cream-white and mint #8fe4cf. Composition roughly square, objects fully in frame and fill 84% with a safe transparent margin. Isolated against genuine transparency with subtle contact shadow only. No scene, no text, no numerals, no lettering, no logo, no watermark.
