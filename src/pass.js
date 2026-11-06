export const cosmeticTypes = {
  theme: 'Thème', avatar: 'Avatar', frame: 'Cadre', banner: 'Bannière', trail: 'Traînée', title: 'Titre',
}

const milestones = [
  [0, 'Novice', [
    ['theme', 'violet', 'Violet', '#b9c1ff'], ['avatar', 'bolt', 'Éclair', '⚡'],
    ['frame', 'plain', 'Classique', '#aeb9e8'], ['banner', 'midnight', 'Minuit', '#737fdf'],
    ['trail', 'pixel', 'Pixels', '#b9c1ff'], ['title', 'recruit', 'Nouvelle recrue', '✦'],
  ]],
  [50, 'Éclaireur', [['avatar', 'frog', 'Grenouille pilote', '🐸'], ['trail', 'mint-dust', 'Poussière de menthe', '#8ce5c9']]],
  [100, 'Explorateur', [['banner', 'lagoon', 'Lagon', '#46d8c2'], ['frame', 'copper', 'Cuivre', '#ffad86']]],
  [150, 'Érudit', [['theme', 'mint', 'Menthe', '#88e8be'], ['avatar', 'planet', 'Orbite', '🪐']]],
  [225, 'Stratège', [['title', 'quick-mind', 'Esprit vif', '↗'], ['avatar', 'fox', 'Renard futé', '🦊']]],
  [300, 'Voltigeur', [['theme', 'coral', 'Corail', '#ffab9c'], ['trail', 'flare', 'Étincelles', '#ffac6e']]],
  [400, 'Tacticien', [['banner', 'sunset', 'Dernier soleil', '#f38cbd'], ['frame', 'neon', 'Néon', '#7af1d8']]],
  [500, 'Maître', [['theme', 'sky', 'Bleu électrique', '#8dbdff'], ['avatar', 'ghost', 'Fantôme', '👻']]],
  [650, 'Vigie', [['title', 'silent', 'Fantôme du focus', '◐'], ['trail', 'ion', 'Ions', '#87c8ff']]],
  [800, 'Expert', [['avatar', 'robot', 'Robot de poche', '🤖'], ['banner', 'grid', 'Circuit', '#64a9ff']]],
  [1000, 'Prodige', [['theme', 'honey', 'Miel', '#ffd478'], ['frame', 'gold', 'Or solaire', '#ffe087']]],
  [1200, 'Capitaine', [['avatar', 'owl', 'Hibou de nuit', '🦉'], ['title', 'ace', 'As des révisions', '♜']]],
  [1450, 'Phénix', [['banner', 'ember', 'Braises', '#fb8b59'], ['trail', 'ember-dust', 'Braises vives', '#ff765d']]],
  [1700, 'Astronaute', [['avatar', 'rocket', 'Fusée', '🚀'], ['theme', 'aurora', 'Aurore', '#b6f494']]],
  [2000, 'Pilote stellaire', [['frame', 'prism', 'Prisme', '#e9acff'], ['banner', 'aurora', 'Ciel polaire', '#8eeaa9']]],
  [2350, 'Gardien', [['avatar', 'dragon', 'Dragon de poche', '🐉'], ['trail', 'plasma', 'Plasma', '#e0a6ff']]],
  [2700, 'Commandant', [['theme', 'nebula', 'Nébuleuse', '#eab0ff'], ['title', 'orbit-master', 'Architecte des étoiles', '✺']]],
  [3100, 'Champion', [['banner', 'eclipse', 'Éclipse', '#af94ff'], ['frame', 'ice', 'Cristal', '#a8f0ff']]],
  [3600, 'Mythique', [['avatar', 'ufo', 'Soucoupe', '🛸'], ['trail', 'starlight', 'Lumière stellaire', '#fff0ab']]],
  [4200, 'Légende', [['avatar', 'crown', 'Couronne', '👑'], ['title', 'legend', 'Légende du QG', '★']]],
]

export const levels = milestones.map(([xp, title, items], index) => ({
  xp, title, number: index + 1,
  rewards: items.map(([type, id, label, visual]) => ({ type, id, label, visual, xp, level: index + 1 })),
}))

export const cosmetics = levels.flatMap(level => level.rewards)

export function findCosmetic(type, id) {
  return cosmetics.find(item => item.type === type && item.id === id)
}

export function defaultCosmetics() {
  return Object.fromEntries(levels[0].rewards.map(({ type, id }) => [type, id]))
}

export function equippedCosmetic(profile, type) {
  return findCosmetic(type, profile[type]) ?? levels[0].rewards.find(item => item.type === type)
}

export function equipCosmetic(state, type, id, xp) {
  const item = findCosmetic(type, id)
  if (!item || item.xp > xp || state.profile[type] === id) return false
  state.profile[type] = id
  return item
}
