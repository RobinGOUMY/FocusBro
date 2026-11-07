import { dailyBonus, dailyMissions } from './missions.js'
import { cosmeticCategories, cosmeticTypes, ownsCosmetic, shopCollections, shopItems, shopRarities } from './pass.js'
import { studyStats } from './study.js'
import { weeklyOverview } from './weekly-missions.js'
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
      ${heading('LE BUTIN FOCUS', missions ? 'Missions et objectifs' : 'Boutique Focus', missions
        ? 'De petites avancées chaque jour et des objectifs pour construire ton rythme au fil des semaines.'
        : 'Choisis tes cosmétiques avec les jetons des missions. Ton expérience et tes jours de révision ouvrent les collections de prestige.')}
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
      <p class="weekly-intro">Les trois récompenses du jour se récupèrent avant minuit.</p>
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
    </section>
    ${weeklyView(state)}`
}

function weeklyView(state) {
  const { week, missions, backlog } = weeklyOverview(state)
  return `<section class="weekly-missions" aria-labelledby="weekly-title">
    <div class="loot-section-heading"><div><p class="section-kicker">SEMAINE DU ${dateLabel.format(new Date(`${week}T12:00:00`))}</p><h2 id="weekly-title" tabindex="-1">Ton rythme de la semaine</h2></div><span class="loot-chip">Jusqu’à 220 XP et 300 jetons</span></div>
    <p class="weekly-intro">Les objectifs suivent tes révisions du lundi au dimanche. Les bonus des semaines terminées restent disponibles.</p>
    <div class="daily-mission-grid">${missions.map(mission => `<article class="panel daily-mission" data-weekly="${mission.id}" data-ready="${mission.completed && !mission.collected}">
      <div class="daily-mission-top">${tile(mission.icon, 'purple')}<span class="loot-chip">+${mission.xp} XP · ${mission.tokens} jetons</span></div>
      <div class="daily-mission-copy"><h3 tabindex="-1">${mission.title}</h3><p>${mission.description}</p></div>
      <div class="daily-mission-progress"><progress aria-label="${mission.title}" max="${mission.target}" value="${mission.progress}"></progress><span>${mission.progress} / ${mission.target}</span></div>
      ${mission.collected ? `<p class="daily-mission-collected">${icon('check', 17)} Récompense récupérée</p>`
        : mission.completed ? button('Récupérer', 'claim-weekly', 'primary', `data-value="${mission.id}" data-week="${week}"`)
          : link('Continuer à réviser', mission.route, 'secondary')}
    </article>`).join('')}</div>
    ${backlog.length ? `<div class="panel loot-bonus"><div><h3>${backlog.length} bonus de semaines passées</h3><p>Ton travail t’attend dans les récompenses disponibles.</p></div>${button('Tout récupérer', 'claim-weekly-backlog', 'secondary')}</div>` : ''}
  </section>`
}

function shopCard(item, collection, state, xp, studyDays) {
  const rarity = shopRarities[item.rarity]
  const owned = ownsCosmetic(state, item, xp, studyDays)
  const active = state.profile[item.type] === item.id
  const accessLocked = xp < item.xp || studyDays < item.days
  const missing = Math.max(0, item.price - state.shop.tokens)
  const unavailable = accessLocked || missing > 0
  const status = owned ? (active ? 'Porté en ce moment' : 'Dans ton vestiaire')
    : accessLocked ? `Accès à ${number.format(item.xp)} XP et ${item.days} jours de révision`
      : missing ? `Il te manque ${tokensLabel(missing)}` : 'Disponible'
  const action = owned ? (active ? 'Équipé' : 'Équiper') : accessLocked ? 'Verrouillé' : 'Acheter'
  const attributes = `data-type="${item.type}" data-value="${item.id}" aria-label="${action} · ${item.label}" aria-describedby="shop-status-${item.id}"`
  return `<article class="panel shop-card" data-collection="${collection.palette}" data-rarity="${item.rarity}">
    <div class="shop-card-art">
      ${cosmeticArt(item)}
      <span class="shop-card-tag">${cosmeticTypes[item.type]}</span>
    </div>
    <div class="shop-card-content">
      <span class="shop-rarity-label">${icon(rarity.icon, 14)} ${rarity.label}</span>
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

export function shopView(state, detail, rarityDetail = '') {
  const { xp, studyDays } = studyStats(state)
  const filter = Object.hasOwn(cosmeticCategories, detail) ? detail : ''
  const rarity = Object.hasOwn(shopRarities, rarityDetail) ? rarityDetail : ''
  const matches = item => (!filter || filter === item.type) && (!rarity || rarity === item.rarity)
  const count = shopItems.filter(matches).length
  const categoryRoute = category => `boutique${category || rarity ? `/${category || 'tout'}` : ''}${rarity ? `/${rarity}` : ''}`
  const cards = collection => collection.items.filter(matches)
    .map(item => shopCard(item, collection, state, xp, studyDays)).join('')
  return `${lootHeader(state, false)}
    <section class="shop-rarity-guide" aria-label="Les cinq raretés">
      ${Object.entries(shopRarities).map(([id, entry]) => {
        const minimum = Math.min(...shopItems.filter(item => item.rarity === id).map(item => item.price))
        return `<div data-rarity="${id}">${icon(entry.icon, 19)}<strong>${entry.label}</strong><small>Dès ${tokensLabel(minimum)}</small></div>`
      }).join('')}
    </section>
    <div class="loot-section-heading shop-heading">
      <div><p class="section-kicker">${count} OBJETS À COLLECTIONNER</p><h2>${filter ? cosmeticCategories[filter] : rarity ? `Objets ${shopRarities[rarity].label.toLocaleLowerCase('fr')}s` : 'Les collections'}</h2></div>
      <span class="loot-chip">${icon('bolt', 16)} ${number.format(xp)} XP · ${studyDays} jours de révision</span>
    </div>
    <div class="shop-filter-toolbar">
      <nav class="shop-filters" aria-label="Filtrer les objets">
        ${tab(categoryRoute(''), 'Tout', !filter)}
        ${Object.entries(cosmeticCategories).map(([type, label]) => tab(categoryRoute(type), label, type === filter)).join('')}
      </nav>
      <label class="field shop-rarity-filter"><span>Rareté</span><select id="shop-rarity" data-category="${filter || 'tout'}">
        <option value="">Toutes les raretés</option>
        ${Object.entries(shopRarities).map(([id, entry]) => `<option value="${id}" ${rarity === id ? 'selected' : ''}>${entry.label}</option>`).join('')}
      </select></label>
    </div>
    ${!count ? `<section class="panel padded shop-empty"><h3>Aucun objet pour ces filtres</h3><p>Choisis une autre rareté ou explore les collections.</p>${link('Tous les objets', 'boutique', 'secondary')}</section>`
      : filter || rarity ? `<div class="shop-grid">${shopCollections.map(cards).join('')}</div>` : shopCollections.map(collection => `
      <section class="shop-collection">
        <div class="shop-collection-heading" data-collection="${collection.palette}">
          <span class="shop-collection-mark">${icon('spark', 19)}</span>
          <div><h2>${collection.name}</h2><p>${collection.description}</p></div>
        </div>
        <div class="shop-grid">${cards(collection)}</div>
      </section>`).join('')}`
}
