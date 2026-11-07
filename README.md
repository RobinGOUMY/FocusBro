# FocusBro

FocusBro est un espace de révision pour la Seconde générale et technologique. Il réunit une bibliothèque de cours, des exercices de maths adaptatifs, un minuteur Pomodoro, des flashcards à répétition espacée, un carnet Feynman guidé et une arcade de révision. Le Pass Focus et les missions quotidiennes récompensent tes révisions.

[Ouvrir FocusBro en ligne](https://focusbro-two.vercel.app/)

Créé par [RobinGOUMY](https://github.com/RobinGOUMY). Le crédit et le lien GitHub figurent en bas de chaque page de l’application.

## Installer et lancer en local

Installe Git et Node.js 20 ou plus récent, puis exécute ces commandes dans un terminal.

```sh
git clone https://github.com/RobinGOUMY/FocusBro.git
cd FocusBro
npm ci
npm run dev
```

Ouvre [FocusBro en local](http://127.0.0.1:4173/). Pour relancer FocusBro plus tard, ouvre un terminal dans le dossier `FocusBro` et exécute `npm run dev`. La sauvegarde en ligne demande une base configurée. [Configuration de la base](docs/maintenance.md#comptes-et-sauvegarde)

Pour vérifier ou modifier le projet, consulte le [guide de maintenance](docs/maintenance.md). `npm run check` vérifie le code et `npm run build` prépare les fichiers statiques dans `dist/`.

## Réviser

- **Accueil**. Lance un Pomodoro ou reprends directement l’activité en cours. Suis ton objectif de 25 minutes et retrouve le dernier cours ouvert ou les flashcards à revoir dans « À suivre ».
- **Focus**. Choisis une matière et lance l’activité proposée. FocusBro utilise tes chapitres travaillés pour proposer des révisions et te suggère un cours quand tu commences une matière. Le minuteur flottant permet de suivre les 25 minutes, de suspendre la session ou de la reprendre depuis chaque page. Une session terminée rapporte 50 XP et propose une pause de cinq minutes. Les ambiances sonores se règlent dans la page Focus.
- **Cours**. Explore 84 chapitres courts. Recherche un thème ou filtre les chapitres par avancement. Indique « Travaillé » pour ceux déjà vus en classe ou à la maison. Clique à nouveau pour les remettre à « Pas encore ». Un chapitre marqué comme lu rejoint tes révisions par défaut. Tu peux régler son statut séparément.
- **Exercices de maths**. Entraîne-toi d’abord sur tes chapitres travaillés. Le menu permet aussi de choisir un chapitre ou de mélanger les 13 chapitres. Après une erreur, lis la correction puis reprends la même méthode avec d’autres valeurs. Deux variantes réussies d’affilée valident la reprise.
- **Flashcards**. Les questions portent par défaut sur tes chapitres travaillés, en révision espacée comme en entraînement libre. Ouvre « Réglages de la révision » pour changer la matière, le mode ou choisir « Toute la collection » et accéder aux 288 cartes. Quand tu commences une série, les réglages se replient et un compteur indique où tu en es. Dix rappels faciles en révision espacée rapportent 20 XP. Sur une carte de maths fournie, « Moyen » ou « Difficile » lance une reprise immédiate avec d’autres valeurs.
- **Feynman**. Le carnet te propose des défis sur les chapitres travaillés. Tu peux aussi choisir une autre notion. Chaque défi donne un indice et une réponse à consulter après avoir enregistré ton explication.
- **Arcade**. Ouvre « Mes chapitres travaillés » et marque les chapitres déjà vus. Par défaut, les jeux utilisent uniquement ces chapitres, dans la matière choisie ou en mode mixte. Tu peux élargir le filtre à « Toute la collection ». Chaque bonne réponse, paire ou action correcte rapporte 3 XP à la fin de la partie, jusqu’à 60 XP d’Arcade par jour. Tes records et les missions continuent de compter après ce plafond.
  - **Quiz en vol**. Lis la question avant de décoller. Appuie sur Espace ou touche la zone de vol pour battre des ailes et traverse la porte de la bonne réponse. Tu peux aussi choisir directement une réponse avec l’option sans pilotage.
  - **Sprint cérébral**. Tu as 45 secondes pour répondre à une série de questions. Les bonnes réponses consécutives font monter le combo. Le chrono s’arrête pendant les corrections et reprend à la question suivante.
  - **Mémo Duo**. Associe les questions aux réponses sur un plateau de 8 à 20 cartes. Il mélange les questions de l’Arcade et les flashcards des chapitres choisis. Chaque erreur coûte 15 points et les paires trouvées restent visibles.
  - **Tranche-Méninges**. Fais glisser le doigt ou la souris sur les mots et les nombres qui suivent la règle affichée. Tu as trois vies pour éviter les intrus.
  - **Snake en ordre**. Dirige le serpent avec les flèches ou les boutons. Mange les éléments dans l’ordre demandé. Une mauvaise bouchée termine la partie et affiche la correction.
  - **Rail Express**. Lis la phrase en anglais ou en espagnol. Change de voie avec les flèches gauche et droite ou les boutons de traduction pour passer par la bonne porte.
  - **Siège du savoir**. Choisis la tour de la bonne réponse et tire. Tu peux aussi armer le lance-pierre en glissant sur le terrain puis en relâchant. Un bon tir fait tomber le château.
- **Missions du jour**. Depuis l’accueil ou le menu « Butin » sur mobile, retrouve trois défis qui suivent tes révisions. Un Pomodoro rapporte 35 jetons. Deux autres défis tournent entre flashcards, Arcade, cours, maths et Feynman, pour 20 jetons chacun. Récupère les récompenses avant minuit, à l’heure de ton appareil. Les trois réunies ajoutent un bonus de 25 jetons.
- **Boutique Focus**. Dépense tes jetons dans quatre collections de six objets. Ton XP ouvre l’accès aux articles les plus rares. Ton solde de jetons reste disponible d’un jour à l’autre.
- **Pass Focus et vestiaire**. L’XP de tes Pomodoros, flashcards et parties débloque automatiquement 20 paliers répartis en quatre actes. Combine les 51 récompenses du pass et les 24 objets de la boutique parmi les thèmes, avatars, cadres, bannières, titres et traînées. Les avatars et traînées équipés apparaissent dans le Quiz en vol.
- **Thèmes du site**. Dans le Pass Focus, ouvre « Voir les thèmes » pour comparer les 14 palettes du pass, puis les 4 palettes de la boutique. Les thèmes changent les couleurs des pages, des menus et de l’Arcade. Tu peux équiper Papier ivoire à 50 XP, Glacier à 400 XP ou Sakura à 1 200 XP si tu préfères un fond clair.
- **Progression**. Suis ta série de jours, ton temps par matière, ton XP et tes dernières activités.

## Créer un compte et retrouver sa progression

Ouvre **Mon compte → Créer un compte**. Choisis un pseudo et un mot de passe de 12 caractères ou plus. FocusBro copie la progression déjà présente dans ce navigateur vers le nouveau compte. Sur un autre appareil, ouvre la même adresse et connecte-toi avec ce pseudo pour récupérer tes notes, tes cartes, tes cours travaillés, ton XP, tes jetons et tes cosmétiques. Garde ton mot de passe dans un gestionnaire, car la récupération par e-mail n’est pas disponible.

La synchronisation se fait automatiquement. Dans **Mon compte**, vérifie que la progression est sauvegardée en ligne avant de changer d’appareil. Si deux appareils ont des versions différentes, FocusBro te propose de choisir celle à garder. En mode invité, la sauvegarde reste dans le navigateur et sur l’adresse utilisés.

## Contenu pédagogique

La bibliothèque couvre dix matières de Seconde GT. L’anglais et l’espagnol sont les deux langues proposées. En français, les cours travaillent les genres et méthodes que l’élève peut appliquer aux œuvres choisies par son professeur.

- [Tronc commun et programmes sur Éduscol](https://eduscol.education.gouv.fr/4368/enseigner-au-lycee-generaltechnologique)
- [Programme de mathématiques de Seconde applicable à la rentrée 2026](https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602914A)
- [Programmes de langues vivantes étrangères et annexes par langue](https://www.education.gouv.fr/bo/2025/Hebdo22/MENE2504621A)

## Ouvrir sur un téléphone du même réseau

Lance le serveur en écoutant sur le réseau local. Dans PowerShell, utilise `$env:HOST = '0.0.0.0'; npm run dev`. Depuis le téléphone connecté au même Wi-Fi, ouvre l’adresse IP locale de l’ordinateur sur le port `4173` pendant que le serveur tourne.

## Publier sur Vercel

Pour partager FocusBro hors de ton réseau, importe le dépôt GitHub dans Vercel et sélectionne la branche qui contient la version à publier comme branche de production. Vercel utilise `vercel.json` pour lancer la compilation et servir `dist/`. Une fois le déploiement prêt, partage le domaine de production affiché par Vercel. [Guide Vercel pour GitHub](https://vercel.com/docs/git/vercel-for-github)

## Illustration d’accueil

L’illustration `assets/focus-illustration.webp` a été créée avec l’outil ImageGen intégré en mode transparent, puis convertie en WebP. Prompt de génération ci-dessous.

> Use case: stylized-concept. Transparent PNG illustration for the right side of a pale periwinkle card in a polished French learning dashboard for teenagers. Create a compact sculptural 3D icon composition showing two stacked soft lavender school notebooks, a rounded periwinkle pomodoro desk timer with a simple white dial with one navy hand, and a big glossy cobalt lightning bolt leaning playfully against them. A tiny mint bookmark and two tiny four-point mint and lavender stars give movement. Contemporary editorial 3D, satin ceramic and matte soft-touch plastic, rounded industrial design, subtle ambient occlusion, crisp silhouette, soft studio light from upper left, youthful and calm. Colors restricted to cobalt blue #3b49ca, periwinkle #8a91f7, pale lilac #c8ccff, cream-white and mint #8fe4cf. Composition roughly square, objects fully in frame and fill 84% with a safe transparent margin. Isolated against genuine transparency with subtle contact shadow only. No scene, no text, no numerals, no lettering, no logo, no watermark.
