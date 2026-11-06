# FocusBro

FocusBro est un espace de révision pour la Seconde générale et technologique. Il réunit une bibliothèque de cours, des exercices de maths adaptatifs, un minuteur Pomodoro, des flashcards à répétition espacée et un carnet Feynman guidé.

## Lancer l’application

Il suffit d’avoir Node.js 20 ou plus récent.

```sh
npm run dev
```

Ouvre [FocusBro en local](http://127.0.0.1:4173/). Le serveur utilise uniquement Node.js.

Pour vérifier ou modifier le projet, consulte le [guide de maintenance](docs/maintenance.md). `npm run check` vérifie le code et `npm run build` prépare les fichiers statiques dans `dist/`.

## Réviser

- **Focus**. Choisis une matière et lance l’activité proposée. FocusBro utilise tes chapitres travaillés pour proposer des révisions et te suggère un cours quand tu commences une matière. Le minuteur flottant permet de suivre les 25 minutes, de suspendre la session ou de la reprendre depuis chaque page. Une session terminée rapporte 50 XP et propose une pause de cinq minutes. Les ambiances sonores se règlent dans la page Focus.
- **Cours**. Explore 84 chapitres courts. Dans une matière, indique « Travaillé » pour les chapitres déjà vus en classe ou à la maison. Clique à nouveau pour les remettre à « Pas encore ». Un chapitre marqué comme lu rejoint tes révisions par défaut. Tu peux régler son statut séparément.
- **Exercices de maths**. Entraîne-toi d’abord sur tes chapitres travaillés. Le menu permet aussi de choisir un chapitre ou de mélanger les 13 chapitres. Après une erreur, lis la correction puis reprends la même méthode avec d’autres valeurs. Deux variantes réussies d’affilée valident la reprise.
- **Flashcards**. Les questions portent par défaut sur tes chapitres travaillés, en révision espacée comme en entraînement libre. Choisis « Toute la collection » pour accéder aux 288 cartes. Dix rappels faciles en révision espacée rapportent 20 XP. Sur une carte de maths fournie, « Moyen » ou « Difficile » lance une reprise immédiate avec d’autres valeurs.
- **Feynman**. Le carnet te propose des défis sur les chapitres travaillés. Tu peux aussi choisir une autre notion. Chaque défi donne un indice et une réponse à consulter après avoir enregistré ton explication.
- **Progression**. Suis ta série de jours, ton temps par matière et ton XP. Les niveaux Érudit et Maître débloquent des thèmes et des avatars.

Les notes, cartes personnelles, chapitres lus, exercices en cours et statistiques sont sauvegardés dans le navigateur utilisé. Garde le même navigateur et la même adresse pour retrouver ta progression. Une adresse locale et une adresse hébergée ont chacune leur sauvegarde.

## Contenu pédagogique

La bibliothèque couvre dix matières de Seconde GT. L’anglais et l’espagnol sont les deux langues proposées. En français, les cours travaillent les genres et méthodes que l’élève peut appliquer aux œuvres choisies par son professeur.

- [Tronc commun et programmes sur Éduscol](https://eduscol.education.gouv.fr/4368/enseigner-au-lycee-generaltechnologique)
- [Programme de mathématiques de Seconde applicable à la rentrée 2026](https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602914A)
- [Programmes de langues vivantes étrangères et annexes par langue](https://www.education.gouv.fr/bo/2025/Hebdo22/MENE2504621A)

## Ouvrir sur un téléphone du même réseau

Lance le serveur en écoutant sur le réseau local. Dans PowerShell, utilise `$env:HOST = '0.0.0.0'; npm run dev`. Depuis le téléphone connecté au même Wi-Fi, ouvre l’adresse IP locale de l’ordinateur sur le port `4173` pendant que le serveur tourne.

## Illustration d’accueil

L’illustration `assets/study-station.webp` a été créée avec l’outil ImageGen intégré. Prompt de génération ci-dessous.

> Use case: stylized-concept. Create one polished landscape 3:2 hero illustration for the right half of a dark French study dashboard. A cozy isometric gaming study station at night, in a beautiful collectible 3D game-art style with matte rounded materials, intricate clean modeling, and soft violet neon edge light. On the right-center, a dark graphite retro computer with a large glowing lavender lightning bolt icon on its screen, compact keyboard, stack of purple books and a mint green tiny succulent, and a lavender desk lamp arching over the desk. Floating tiny four-point purple sparkles, tiny mint accent lights, soft shadows. Simple deep aubergine gradient environment close to #1b132b, with a faint receding grid floor confined to the bottom. Desk at 3/4 angle, fully visible, no clutter. Leftmost 25% transitions to dark purple negative space for fading into the website background. Keep the desk and glowing shapes away from the extreme edges. Premium game launchpad atmosphere, no people, no lettering, no typography, no logo or watermark, no UI. The lightning bolt is a simple geometric shape.
