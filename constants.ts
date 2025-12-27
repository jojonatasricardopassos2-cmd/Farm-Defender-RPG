import { Hoe, Rarity, Seed, Pet, Difficulty } from './types';

// --- Generators ---

const generateSeeds = (): Seed[] => {
  const seeds: Seed[] = [];
  const prefixes = ['Star', 'Moon', 'Sun', 'Void', 'Fire', 'Ice', 'Earth', 'Wind', 'Thunder', 'Life'];
  const suffixes = ['Root', 'Berry', 'Leaf', 'Bloom', 'Fruit', 'Sprout', 'Melon', 'Nut', 'Gourd', 'Rose'];
  
  // Rarity Configs
  const rarityConfig = {
    [Rarity.COMMON]: { count: 60, timeMult: 1, priceMult: 1, color: '#a3e635' }, // Lime
    [Rarity.RARE]: { count: 50, timeMult: 2.5, priceMult: 4, color: '#60a5fa' }, // Blue
    [Rarity.EPIC]: { count: 40, timeMult: 5, priceMult: 10, color: '#c084fc' }, // Purple
    [Rarity.MYSTIC]: { count: 30, timeMult: 10, priceMult: 30, color: '#f472b6' }, // Pink
    [Rarity.ULTIMATE]: { count: 20, timeMult: 25, priceMult: 100, color: '#facc15' }, // Yellow
  };

  let idCounter = 1;

  Object.entries(rarityConfig).forEach(([rarity, config]) => {
    for (let i = 0; i < config.count; i++) {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      const name = `${rarity === Rarity.ULTIMATE ? 'Golden ' : ''}${p}${s} ${i+1}`;
      
      // Progression Curve
      const tierProgress = i / config.count; 
      const baseTime = 5 + (config.timeMult * 5) + (tierProgress * 10);
      const price = Math.floor(10 + (config.priceMult * 10) + (tierProgress * 50));
      const sell = Math.floor(price * 1.8);
      const reqLevel = (Object.keys(rarityConfig).indexOf(rarity) * 5) + Math.floor(tierProgress * 5);

      seeds.push({
        id: `seed_${idCounter++}`,
        name,
        rarity: rarity as Rarity,
        basePrice: price,
        sellPrice: sell,
        growTimeSeconds: Math.floor(baseTime),
        reqLevel,
        color: config.color,
      });
    }
  });

  return seeds;
};

// --- Data ---

export const SEEDS_DB: Seed[] = generateSeeds();

export const HOES: Hoe[] = [
  // Starter
  { id: 'hoe_start', name: 'Rusty Hoe', rarity: Rarity.COMMON, growthSpeedMultiplier: 1.0, price: 0, actionCost: 2, canDoubleSeed: false },
  // Progressive Pricing
  { id: 'hoe_1', name: 'Copper Hoe', rarity: Rarity.COMMON, growthSpeedMultiplier: 1.2, price: 1000, actionCost: 5, canDoubleSeed: false },
  { id: 'hoe_2', name: 'Iron Hoe', rarity: Rarity.RARE, growthSpeedMultiplier: 1.4, price: 2000, actionCost: 10, canDoubleSeed: false },
  { id: 'hoe_3', name: 'Steel Hoe', rarity: Rarity.RARE, growthSpeedMultiplier: 1.6, price: 3000, actionCost: 15, canDoubleSeed: false },
  { id: 'hoe_4', name: 'Silver Hoe', rarity: Rarity.EPIC, growthSpeedMultiplier: 1.8, price: 5000, actionCost: 25, canDoubleSeed: false },
  { id: 'hoe_5', name: 'Gold Hoe', rarity: Rarity.EPIC, growthSpeedMultiplier: 2.0, price: 8000, actionCost: 50, canDoubleSeed: false },
  { id: 'hoe_6', name: 'Diamond Hoe', rarity: Rarity.MYSTIC, growthSpeedMultiplier: 2.5, price: 10000, actionCost: 100, canDoubleSeed: false },
  // The Ultimate
  { id: 'hoe_ultimate', name: 'Omni Hoe', rarity: Rarity.ULTIMATE, growthSpeedMultiplier: 3.0, price: 15000, actionCost: 200, canDoubleSeed: true },
];

export const SHOVEL_PRICE = 500;

export const PETS: Pet[] = [
  { id: 'pet_dog', name: 'Guard Dog', description: '+10 Base Defense', price: 500, rarity: Rarity.COMMON, bonusType: 'defense', bonusValue: 10 },
  { id: 'pet_cat', name: 'Lucky Cat', description: '+10% Harvest Money', price: 1000, rarity: Rarity.RARE, bonusType: 'money_multiplier', bonusValue: 0.1 },
  { id: 'pet_fairy', name: 'Nature Fairy', description: '+20% Growth Speed', price: 1500, rarity: Rarity.EPIC, bonusType: 'growth_speed', bonusValue: 0.2 },
  { id: 'pet_golem', name: 'Rock Golem', description: '+100 Base Defense', price: 2000, rarity: Rarity.MYSTIC, bonusType: 'defense', bonusValue: 100 },
  { id: 'pet_dragon', name: 'Sky Dragon', description: 'x2 Harvest Money', price: 3000, rarity: Rarity.ULTIMATE, bonusType: 'money_multiplier', bonusValue: 1.0 },
];

export const GENERATOR_UPGRADE_COST = 5000;
export const GENERATOR_MAX_INPUT = 20;
export const GENERATOR_WINS_TO_RECHARGE = 2;

export const GENERATOR_ODDS_LV1 = { common: 50, rare: 20, epic: 15, mystic: 10, ultimate: 5 }; 
export const GENERATOR_ODDS_LV2 = { common: 30, rare: 25, epic: 20, mystic: 15, ultimate: 10 }; 

export const INITIAL_PLOTS = 9;
export const MAX_PLOTS = 36;
export const PLOT_COST_INCREMENT = 500; 

export const VILLAGE_STAT_COST = 500; 

export const HORDE_INTERVAL_SEC = 300; 
export const TICK_RATE_MS = 200; 

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: { costMult: 0.75, speedMult: 1.25, label: 'Easy' },
  [Difficulty.NORMAL]: { costMult: 1.0, speedMult: 1.0, label: 'Normal' },
  [Difficulty.HARD]: { costMult: 1.5, speedMult: 0.8, label: 'Hard' },
};