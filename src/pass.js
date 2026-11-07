export const cosmeticTypes = {
  theme: 'Thème', avatar: 'Avatar', frame: 'Cadre', banner: 'Bannière', trail: 'Traînée', title: 'Titre',
}

export const cosmeticCategories = {
  theme: 'Thèmes', avatar: 'Avatars', frame: 'Cadres', banner: 'Bannières', trail: 'Traînées', title: 'Titres',
}

const milestones = [
  [0, 'Novice', [
    ['theme', 'violet', 'Violet'], ['avatar', 'bolt', 'Éclair', '⚡'],
    ['frame', 'plain', 'Classique', '#aeb9e8'], ['banner', 'midnight', 'Minuit', '#737fdf'],
    ['trail', 'pixel', 'Pixels', '#b9c1ff'], ['title', 'recruit', 'Nouvelle recrue', '✦'],
  ]],
  [50, 'Éclaireur', [['avatar', 'frog', 'Grenouille pilote', '🐸'], ['trail', 'mint-dust', 'Poussière de menthe', '#8ce5c9'], ['theme', 'paper', 'Papier ivoire']]],
  [100, 'Explorateur', [['banner', 'lagoon', 'Lagon', '#46d8c2'], ['frame', 'copper', 'Cuivre', '#ffad86']]],
  [150, 'Érudit', [['theme', 'mint', 'Menthe'], ['avatar', 'planet', 'Orbite', '🪐']]],
  [225, 'Stratège', [['title', 'quick-mind', 'Esprit vif', '↗'], ['avatar', 'fox', 'Renard futé', '🦊'], ['theme', 'terminal', 'Terminal']]],
  [300, 'Voltigeur', [['theme', 'coral', 'Corail'], ['trail', 'flare', 'Étincelles', '#ffac6e']]],
  [400, 'Tacticien', [['banner', 'sunset', 'Dernier soleil', '#f38cbd'], ['frame', 'neon', 'Néon', '#7af1d8'], ['theme', 'glacier', 'Glacier']]],
  [500, 'Maître', [['theme', 'sky', 'Bleu électrique'], ['avatar', 'ghost', 'Fantôme', '👻']]],
  [650, 'Vigie', [['title', 'silent', 'Fantôme du focus', '◐'], ['trail', 'ion', 'Ions', '#87c8ff'], ['theme', 'magma', 'Magma']]],
  [800, 'Expert', [['avatar', 'robot', 'Robot de poche', '🤖'], ['banner', 'grid', 'Circuit', '#64a9ff']]],
  [1000, 'Prodige', [['theme', 'honey', 'Miel'], ['frame', 'gold', 'Or solaire', '#ffe087']]],
  [1200, 'Capitaine', [['avatar', 'owl', 'Hibou de nuit', '🦉'], ['title', 'ace', 'As des révisions', '♜'], ['theme', 'sakura', 'Sakura']]],
  [1450, 'Phénix', [['banner', 'ember', 'Braises', '#fb8b59'], ['trail', 'ember-dust', 'Braises vives', '#ff765d']]],
  [1700, 'Astronaute', [['avatar', 'rocket', 'Fusée', '🚀'], ['theme', 'aurora', 'Aurore']]],
  [2000, 'Pilote stellaire', [['frame', 'prism', 'Prisme', '#e9acff'], ['banner', 'aurora', 'Ciel polaire', '#8eeaa9']]],
  [2350, 'Gardien', [['avatar', 'dragon', 'Dragon de poche', '🐉'], ['trail', 'plasma', 'Plasma', '#e0a6ff'], ['theme', 'arcade', 'Arcade néon']]],
  [2700, 'Commandant', [['theme', 'nebula', 'Nébuleuse'], ['title', 'orbit-master', 'Architecte des étoiles', '✺']]],
  [3100, 'Champion', [['banner', 'eclipse', 'Éclipse', '#af94ff'], ['frame', 'ice', 'Cristal', '#a8f0ff']]],
  [3600, 'Mythique', [['avatar', 'ufo', 'Soucoupe', '🛸'], ['trail', 'starlight', 'Lumière stellaire', '#fff0ab']]],
  [4200, 'Légende', [['avatar', 'crown', 'Couronne', '👑'], ['title', 'legend', 'Légende du QG', '★'], ['theme', 'royal', 'Or royal']]],
]

export const levels = milestones.map(([xp, title, items], index) => ({
  xp, title, number: index + 1,
  rewards: items.map(([type, id, label, visual]) => ({ type, id, label, visual, xp, level: index + 1 })),
}))

export const passCosmetics = levels.flatMap(level => level.rewards)

export const shopCollections = [
  { name: 'Atelier cosy', description: 'Des tons pêche pour tes sessions au calme.', palette: 'peach', items: [
    ['avatar', 'cat', 'Chat de bureau', '🐈', 15, 0],
    ['title', 'tea-break', 'Pause thé', '♨', 20, 0],
    ['frame', 'porcelain', 'Porcelaine', '#e3a66c', 25, 0],
    ['trail', 'petals', 'Pétales', '#ffb8bc', 30, 50],
    ['banner', 'gingham', 'Nappe à carreaux', '#f4ab87', 40, 100],
    ['theme', 'peach', 'Pêche givrée', null, 60, 100],
  ] },
  { name: 'Sous-bois', description: 'Mousse, fougères et une loutre en vadrouille.', palette: 'canopy', items: [
    ['avatar', 'otter', 'Loutre curieuse', '🦦', 25, 0],
    ['title', 'forest-scout', 'Pisteur du savoir', '❧', 30, 50],
    ['frame', 'ivy', 'Lierre', '#69c58e', 35, 100],
    ['trail', 'fireflies', 'Lucioles', '#edff91', 45, 150],
    ['banner', 'ferns', 'Fougères', '#83d5a2', 50, 150],
    ['theme', 'canopy', 'Canopée', null, 75, 225],
  ] },
  { name: 'Pixel club', description: 'L’esprit des salles d’arcade rétro.', palette: 'pixel-night', items: [
    ['avatar', 'alien', 'Alien rétro', '👾', 35, 150],
    ['title', 'combo-keeper', 'Machine à combos', '⚑', 45, 225],
    ['frame', 'pixel-cut', 'Bits roses', '#fb80c5', 45, 300],
    ['trail', 'bitstream', 'Flux de bits', '#77ffdf', 55, 400],
    ['banner', 'scanlines', 'Écran cathodique', '#a996ff', 65, 500],
    ['theme', 'pixel-night', 'Nuit pixel', null, 90, 650],
  ] },
  { name: 'Station astrale', description: 'Des équipements pour réviser en orbite.', palette: 'deep-space', items: [
    ['avatar', 'astronaut', 'Astronaute lunaire', '🧑‍🚀', 55, 400],
    ['title', 'moon-pilot', 'Pilote de comètes', '☾', 65, 500],
    ['frame', 'orbit-ring', 'Anneaux de Saturne', '#fad789', 70, 650],
    ['trail', 'comets', 'Queue de comète', '#a9dfff', 80, 800],
    ['banner', 'constellations', 'Carte du ciel', '#8aaeff', 90, 1000],
    ['theme', 'deep-space', 'Espace profond', null, 120, 1200],
  ] },
].map(collection => ({
  ...collection,
  items: collection.items.map(([type, id, label, visual, price, xp]) => ({ type, id, label, visual, price, xp })),
}))

export const shopItems = shopCollections.flatMap(collection => collection.items)
export const cosmetics = [...passCosmetics, ...shopItems]

export function findCosmetic(type, id) {
  return cosmetics.find(item => item.type === type && item.id === id)
}

export function defaultCosmetics() {
  return Object.fromEntries(levels[0].rewards.map(({ type, id }) => [type, id]))
}

export function equippedCosmetic(profile, type) {
  return findCosmetic(type, profile[type]) ?? levels[0].rewards.find(item => item.type === type)
}

export function ownsCosmetic(state, item, xp) {
  return item.price ? state.shop.owned.includes(item.id) : xp >= item.xp
}

export function equipCosmetic(state, type, id, xp) {
  const item = findCosmetic(type, id)
  if (!item || !ownsCosmetic(state, item, xp) || state.profile[type] === id) return false
  state.profile[type] = id
  return item
}

export function buyCosmetic(state, type, id, xp) {
  const item = findCosmetic(type, id)
  if (!item?.price || xp < item.xp || state.shop.tokens < item.price || ownsCosmetic(state, item, xp)) return false
  state.shop.tokens -= item.price
  state.shop.owned.push(id)
  return item
}
