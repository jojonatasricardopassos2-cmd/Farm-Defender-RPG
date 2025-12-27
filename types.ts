export enum Rarity {
  COMMON = 'Common',
  RARE = 'Rare',
  EPIC = 'Epic',
  MYSTIC = 'Mystic',
  ULTIMATE = 'Ultimate'
}

export enum ToolType {
  HAND = 'Hand',
  HOE = 'Hoe',
  SEED = 'Seed',
  SHOVEL = 'Shovel',
}

export enum Difficulty {
  EASY = 'Easy',
  NORMAL = 'Normal',
  HARD = 'Hard',
}

export interface Seed {
  id: string;
  name: string;
  rarity: Rarity;
  basePrice: number;
  sellPrice: number;
  growTimeSeconds: number; // Base time
  reqLevel: number;
  color: string;
}

export interface Hoe {
  id: string;
  name: string;
  rarity: Rarity;
  growthSpeedMultiplier: number; // Higher is faster
  price: number;
  actionCost: number; // Cost to use (till)
  canDoubleSeed: boolean; // Ultimate ability
}

export interface Pet {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: Rarity;
  bonusType: 'defense' | 'growth_speed' | 'money_multiplier';
  bonusValue: number;
}

export interface Plot {
  id: number;
  status: 'locked' | 'empty' | 'tilled' | 'growing' | 'ready' | 'withered';
  seedId: string | null;
  seedCount: number; // How many seeds are planted (1 or 2)
  progress: number; // 0 to 100
  hoeQuality: number; // Snapshot of hoe multiplier when tilled
  plantedAt?: number;
}

export interface Item {
  id: string; // seedId or itemId
  type: 'seed' | 'material';
  count: number;
}

export interface VillageStats {
  defense: number;
  strength: number;
  skill: number;
}

export interface Player {
  money: number;
  level: number;
  xp: number;
  maxXp: number;
  villageStats: VillageStats; 
  equippedHoeId: string;
  hasShovel: boolean;
  inventory: Item[];
  unlockedPlots: number;
  activePets: string[]; // IDs of owned pets
  day: number;
  generatorLevel: number;
  generatorCharges: number; // How many times can use generator
  consecutiveHordeWins: number; // Track for recharging generator
}

export interface GameNotification {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'info' | 'earning';
  x?: number;
  y?: number;
}

export interface HordeState {
  active: boolean;
  timeLeft: number; // Time until attack
  stats: VillageStats; // Horde now has stats too
  battleInProgress: boolean;
}