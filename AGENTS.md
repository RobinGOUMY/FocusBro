# Consignes pour FocusBro

Pour chaque modification du projet, mets à jour la documentation concernée dans le même commit. Utilise `README.md` pour les usages et le lancement, et `docs/maintenance.md` pour l’architecture, le contenu et les vérifications.

Exécute `npm run check` et `npm run build`, puis vérifie dans le navigateur les parcours affectés par un changement de comportement ou d’interface. Contrôle les fichiers préparés pour le commit et garde les modifications sans rapport hors du commit.

Crée le commit et pousse la branche de travail sur `origin` à la fin de la tâche, sauf instruction contraire de l’utilisateur. Si le push est refusé, inspecte l’état distant et signale tout blocage restant. Évite les pushes forcés.
