import { dailyBonus, dailyMissions } from './missions.js'
import { cosmeticCategories, cosmeticTypes, ownsCosmetic, shopCollections, shopItems } from './pass.js'
import { studyStats } from './study.js'
import { button, cosmeticArt, heading, icon, link, tile } from './views.js'

const number = new Intl.NumberFormat('fr-FR')
const dateLabel = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
const tokensLabel = tokens => `${number.format(tokens)} ${tokens === 1 ? 'jeton' : 'jetons'}`

function tab(route, label, active, symbol = '') {
  return `<a class="btn secondary" href="#${route}" ${active ? 'aria-current="page"' : ''}>${symbol ? icon(symbol, 17) : ''}${label}</a>`
}

function lootHeader(state, missions) {
  return `<section class="panel loot-hero">
    <div>
      ${heading('LE BUTIN FOCUS', missions ? 'Missions du jour' : 'Boutique Focus', missions
        ? 'Trois défis chaque jour. Révise à ton rythme et récupère tes jetons avant minuit.'
        : 'Achète tes cosmétiques avec les jetons des missions. Ton XP ouvre l’accès à de nouveaux objets.')}
      <nav class="loot-nav" aria-label="Missions et boutique">
        ${tab('boutique/missions', 'Missions', missions, 'target')}
        ${tab('boutique', 'Boutique', !missions, 'shop')}
        ${link('Vestiaire', 'profil', 'secondary')}
      </nav>
    </div>
    <div class="loot-wallet">
      <span class="loot-wallet-icon">${icon('coin', 32)}</span>
      <div><span>MON SOLDE</span><strong>${tokensLabel(state.shop.tokens)}</strong></div>
    </div>
  </section>`
}

export function missionsView(state) {
  const { day, missions } = dailyMissions(state)
  const collected = missions.filter(mission => mission.collected).length
  const bonusEarned = collected === missions.length
  return `${lootHeader(state, true)}
    <section class="daily-missions" aria-labelledby="daily-missions-title">
      <div class="loot-section-heading">
        <div><p class="section-kicker">${dateLabel.format(new Date(`${day}T12:00:00`))}</p><h2 id="daily-missions-title">Tes trois défis</h2></div>
        <span class="loot-chip">${collected} / ${missions.length} récompenses récupérées</span>
      </div>
      <div class="daily-mission-grid">${missions.map(mission => `
        <article class="panel daily-mission" data-mission="${mission.id}" data-ready="${mission.completed && !mission.collected}">
          <div class="daily-mission-top">${tile(mission.icon, mission.color)}<span class="loot-chip">${icon('coin', 15)} +${mission.tokens} jetons</span></div>
          <div class="daily-mission-copy"><p class="section-kicker">${mission.activity}</p><h3 tabindex="-1">${mission.title}</h3><p>${mission.description}</p></div>
          <div class="daily-mission-progress"><progress aria-label="Progression de la mission ${mission.title}" max="${mission.target}" value="${mission.progress}"></progress><span>${mission.progress} / ${mission.target}</span></div>
          ${mission.collected ? `<p class="daily-mission-collected">${icon('check', 17)} Récompense récupérée</p>`
            : mission.completed ? button(`${icon('gift', 17)} Récupérer`, 'claim-mission', 'primary', `data-value="${mission.id}" data-day="${day}" aria-label="Récupérer ${mission.tokens} jetons pour ${mission.title}"`)
              : link(`Ouvrir ${mission.activity} ${icon('arrow', 16)}`, mission.route, 'secondary')}
        </article>`).join('')}</div>
    </section>
    <section class="panel loot-bonus">
      ${tile(bonusEarned ? 'check' : 'gift', 'amber')}
      <div><h2>Bonus trio</h2><p>${bonusEarned ? 'Bonus ajouté à ton solde. Reviens demain pour de nouveaux défis.' : 'Récupère les trois récompenses du jour pour toucher le bonus.'}</p></div>
      <span class="loot-chip">${icon('coin', 16)} +${dailyBonus} jetons</span>
    </section>`
}

function shopCard(item, collection, state, xp) {
  const owned = ownsCosmetic(state, item, xp)
  const active = state.profile[item.type] === item.id
  const xpLocked = xp < item.xp
  const missing = Math.max(0, item.price - state.shop.tokens)
  const unavailable = xpLocked || missing > 0
  const status = owned ? (active ? 'Porté en ce moment' : 'Dans ton vestiaire')
    : xpLocked ? `Dès ${number.format(item.xp)} XP`
      : missing ? `Il te manque ${tokensLabel(missing)}` : 'Disponible'
  const action = owned ? (active ? 'Équipé' : 'Équiper') : xpLocked ? 'Verrouillé' : 'Acheter'
  const attributes = `data-type="${item.type}" data-value="${item.id}" aria-label="${action} · ${item.label}" aria-describedby="shop-status-${item.id}"`
  return `<article class="panel shop-card" data-collection="${collection.palette}">
    <div class="shop-card-art">
      ${cosmeticArt(item)}
      <span class="shop-card-tag">${cosmeticTypes[item.type]}</span>
    </div>
    <div class="shop-card-content">
      <span class="shop-card-collection">${collection.name}</span>
      <h3>${item.label}</h3>
      <p id="shop-status-${item.id}">${status}</p>
      <div class="shop-card-actions">
        <span class="loot-price">${icon(owned ? 'check' : 'coin', 16)} ${owned ? 'Acquis' : tokensLabel(item.price)}</span>
        ${owned
          ? button(action, 'reward', 'secondary', `${attributes} aria-pressed="${active}"`)
          : button(action, 'buy-cosmetic', unavailable ? 'secondary' : 'primary', `${attributes} ${unavailable ? 'disabled' : ''}`)}
      </div>
    </div>
  </article>`
}

export function shopView(state, detail) {
  const { xp } = studyStats(state)
  const filter = Object.hasOwn(cosmeticCategories, detail) ? detail : ''
  const cards = collection => collection.items.filter(item => !filter || filter === item.type)
    .map(item => shopCard(item, collection, state, xp)).join('')
  return `${lootHeader(state, false)}
    <div class="loot-section-heading shop-heading">
      <div><p class="section-kicker">${shopItems.length} OBJETS À COLLECTIONNER</p><h2>${filter ? cosmeticCategories[filter] : 'Les collections'}</h2></div>
      <span class="loot-chip">${icon('bolt', 16)} ${number.format(xp)} XP au total</span>
    </div>
    <nav class="shop-filters" aria-label="Filtrer les objets">
      ${tab('boutique', 'Tout', !filter)}
      ${Object.entries(cosmeticCategories).map(([type, label]) => tab(`boutique/${type}`, label, type === filter)).join('')}
    </nav>
    ${filter ? `<div class="shop-grid">${shopCollections.map(cards).join('')}</div>` : shopCollections.map(collection => `
      <section class="shop-collection">
        <div class="shop-collection-heading" data-collection="${collection.palette}">
          <span class="shop-collection-mark">${icon('spark', 19)}</span>
          <div><h2>${collection.name}</h2><p>${collection.description}</p></div>
        </div>
        <div class="shop-grid">${cards(collection)}</div>
      </section>`).join('')}`
}
