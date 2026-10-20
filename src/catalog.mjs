export const RULES = Object.freeze({ hp: 300, startingCoins: 12, minReward: 2, maxReward: 5, rewardStepMs: 6000, resultMs: 3000, supply: 1, roundMs: 30_000, answerMs: 25_000, actionCooldownMs: 2000, siegeMs: 480_000, stormMs: 540_000, matchMs: 600_000, stormIntervalMs: 10_000, stormDamage: 8, disconnectMs: 90_000 });

export const ITEMS = Object.freeze([
  { id: 'arrows', costStep: 8, unlockCost: 6, unlockMs: 5000, name: 'Volée de flèches', kind: 'attack', icon: 'arrows', cost: 8, damage: 12, flight: 4000, tagline: 'Rapide et précise', description: '12 dégâts · impact dans 4 s', cooldown: 4000 },
  { id: 'catapult', costStep: 13, unlockCost: 18, unlockMs: 12000, name: 'Catapulte', kind: 'attack', icon: 'catapult', cost: 18, damage: 32, flight: 7000, tagline: 'Le grand fracas', description: '32 dégâts · impact dans 7 s', cooldown: 7000 },
  { id: 'lightning', costStep: 10, unlockCost: 14, unlockMs: 10000, name: 'Éclair perçant', kind: 'attack', icon: 'lightning', cost: 14, damage: 18, flight: 6000, pierce: true, tagline: 'Droit au cœur', description: '18 dégâts · ignore le bouclier · 6 s', cooldown: 6000 },
  { id: 'sabotage', costStep: 8, unlockCost: 10, unlockMs: 8000, name: 'Sabotage', kind: 'attack', icon: 'sabotage', cost: 10, damage: 6, shieldDamage: 24, flight: 5000, tagline: 'À bas les remparts', description: 'Retire 24 de bouclier, puis 6 dégâts · 5 s', cooldown: 5000 },
  { id: 'shield', name: 'Dôme protecteur', kind: 'defense', icon: 'shield', cost: 10, shield: 18, duration: 45_000, tagline: 'Tenez bon, ensemble', description: '+18 bouclier · maximum 36 · dure 45 s', cooldown: 8000 },
  { id: 'repair', name: 'Atelier de réparation', kind: 'defense', icon: 'repair', cost: 20, heal: 8, tagline: 'Une seconde chance', description: '+8 points de vie · repos de 30 s', cooldown: 30_000 },
  { id: 'mirror', name: 'Miroir de riposte', kind: 'defense', icon: 'mirror', cost: 12, duration: 12_000, tagline: 'Retour à l’envoyeur', description: 'Bloque et renvoie 40 % de la prochaine attaque · 12 s', cooldown: 20_000 }
]);

export function itemPrice(item, purchases = {}) {
  return item.cost + (item.kind === 'attack' ? (purchases[item.id] || 0) * item.costStep : 0);
}

export const TEAM_COLORS = Object.freeze([
  { id: 'sage', name: 'Sauge', roof: '#7dc2a0', shade: '#3f897b', flag: '#a9e6b8' },
  { id: 'coral', name: 'Corail', roof: '#e5a18d', shade: '#b96f64', flag: '#f3b69c' },
  { id: 'blue', name: 'Azur', roof: '#76b5f1', shade: '#346ba8', flag: '#b4d9ff' },
  { id: 'purple', name: 'Violet', roof: '#b59bea', shade: '#7853b1', flag: '#d8c5ff' },
  { id: 'gold', name: 'Or', roof: '#e3c15b', shade: '#a0822e', flag: '#fff0a3' },
  { id: 'pink', name: 'Framboise', roof: '#e58ab8', shade: '#a44a78', flag: '#ffc0df' }
]);
