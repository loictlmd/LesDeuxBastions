export const RULES = Object.freeze({ hp: 120, startingCoins: 12, correctReward: 12, supply: 3, roundMs: 30_000, answerMs: 25_000, actionCooldownMs: 2000, siegeRound: 9, stormRound: 13, stormIntervalMs: 10_000, stormDamage: 8, disconnectMs: 90_000 });

export const ITEMS = Object.freeze([
  { id: 'arrows', name: 'Volée de flèches', kind: 'attack', icon: 'arrows', cost: 8, damage: 12, flight: 4000, tagline: 'Rapide et précise', description: '12 dégâts · impact dans 4 s', cooldown: 4000 },
  { id: 'catapult', name: 'Catapulte', kind: 'attack', icon: 'catapult', cost: 18, damage: 32, flight: 7000, tagline: 'Le grand fracas', description: '32 dégâts · impact dans 7 s', cooldown: 7000 },
  { id: 'lightning', name: 'Éclair perçant', kind: 'attack', icon: 'lightning', cost: 14, damage: 18, flight: 6000, pierce: true, tagline: 'Droit au cœur', description: '18 dégâts · ignore le bouclier · 6 s', cooldown: 6000 },
  { id: 'sabotage', name: 'Sabotage', kind: 'attack', icon: 'sabotage', cost: 10, damage: 6, shieldDamage: 24, flight: 5000, tagline: 'À bas les remparts', description: 'Retire 24 de bouclier, puis 6 dégâts · 5 s', cooldown: 5000 },
  { id: 'shield', name: 'Dôme protecteur', kind: 'defense', icon: 'shield', cost: 10, shield: 18, duration: 45_000, tagline: 'Tenez bon, ensemble', description: '+18 bouclier · maximum 36 · dure 45 s', cooldown: 8000 },
  { id: 'repair', name: 'Atelier de réparation', kind: 'defense', icon: 'repair', cost: 14, heal: 16, tagline: 'Une seconde chance', description: '+16 points de vie · repos de 20 s', cooldown: 20_000 },
  { id: 'mirror', name: 'Miroir de riposte', kind: 'defense', icon: 'mirror', cost: 12, duration: 12_000, tagline: 'Retour à l’envoyeur', description: 'Bloque et renvoie 40 % de la prochaine attaque · 12 s', cooldown: 20_000 }
]);
