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

export const shopRarities = {
  common: { label: 'Commun', icon: 'spark' },
  rare: { label: 'Rare', icon: 'award' },
  epic: { label: 'Épique', icon: 'planet' },
  legendary: { label: 'Légendaire', icon: 'crown' },
  mythic: { label: 'Mythique', icon: 'star' },
}

export const shopCollections = [
  { name: 'Atelier cosy', description: 'Des tons pêche pour tes sessions au calme.', palette: 'peach', items: [
    ['avatar', 'cat', 'Chat de bureau', '🐈', 150, 0, 'common'],
    ['title', 'tea-break', 'Pause thé', '♨', 200, 0, 'common'],
    ['frame', 'porcelain', 'Porcelaine', '#e3a66c', 300, 0, 'rare'],
    ['trail', 'petals', 'Pétales', '#ffb8bc', 400, 50, 'rare'],
    ['banner', 'gingham', 'Nappe à carreaux', '#f4ab87', 600, 100, 'rare'],
    ['theme', 'peach', 'Pêche givrée', null, 1000, 100, 'epic'],
  ] },
  { name: 'Sous-bois', description: 'Mousse, fougères et une loutre en vadrouille.', palette: 'canopy', items: [
    ['avatar', 'otter', 'Loutre curieuse', '🦦', 250, 0, 'common'],
    ['title', 'forest-scout', 'Pisteur du savoir', '❧', 350, 50, 'rare'],
    ['frame', 'ivy', 'Lierre', '#69c58e', 450, 100, 'rare'],
    ['trail', 'fireflies', 'Lucioles', '#edff91', 700, 150, 'epic'],
    ['banner', 'ferns', 'Fougères', '#83d5a2', 850, 150, 'epic'],
    ['theme', 'canopy', 'Canopée', null, 1400, 225, 'epic'],
  ] },
  { name: 'Pixel club', description: 'L’esprit des salles d’arcade rétro.', palette: 'pixel-night', items: [
    ['avatar', 'alien', 'Alien rétro', '👾', 600, 150, 'rare'],
    ['title', 'combo-keeper', 'Machine à combos', '⚑', 800, 225, 'epic'],
    ['frame', 'pixel-cut', 'Bits roses', '#fb80c5', 1000, 300, 'epic'],
    ['trail', 'bitstream', 'Flux de bits', '#77ffdf', 1200, 400, 'epic'],
    ['banner', 'scanlines', 'Écran cathodique', '#a996ff', 1600, 500, 'legendary'],
    ['theme', 'pixel-night', 'Nuit pixel', null, 2000, 650, 'legendary'],
  ] },
  { name: 'Station astrale', description: 'Des équipements pour réviser en orbite.', palette: 'deep-space', items: [
    ['avatar', 'astronaut', 'Astronaute lunaire', '🧑‍🚀', 1000, 400, 'epic'],
    ['title', 'moon-pilot', 'Pilote de comètes', '☾', 1300, 500, 'epic'],
    ['frame', 'orbit-ring', 'Anneaux de Saturne', '#fad789', 1600, 650, 'legendary'],
    ['trail', 'comets', 'Queue de comète', '#a9dfff', 1900, 800, 'legendary'],
    ['banner', 'constellations', 'Carte du ciel', '#8aaeff', 2200, 1000, 'legendary'],
    ['theme', 'deep-space', 'Espace profond', null, 2800, 1200, 'legendary'],
  ] },
  { name: 'Reliques du Focus', description: 'Des pièces de prestige à viser sur plusieurs semaines.', palette: 'singularity', items: [
    ['avatar', 'unicorn', 'Licorne astrale', '🦄', 3500, 1700, 'legendary'],
    ['frame', 'astral-crown', 'Couronne astrale', '#ffd78c', 4200, 2350, 'legendary'],
    ['title', 'beyond-rank-s', 'Au-delà du rang S', '✵', 5000, 2700, 'mythic'],
    ['trail', 'quasar', 'Faille quantique', '#f3b4ff', 5500, 3100, 'mythic'],
    ['banner', 'supernova', 'Supernova', '#ffc0e8', 6000, 3600, 'mythic'],
    ['theme', 'singularity', 'Singularité', null, 7500, 4200, 'mythic'],
  ] },
].map(collection => ({
  ...collection,
  items: collection.items.map(([type, id, label, visual, price, xp, rarity]) => ({ type, id, label, visual, price, xp, rarity })),
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
