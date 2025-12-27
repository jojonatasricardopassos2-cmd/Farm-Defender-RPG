import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Plot, Seed, Item, Hoe, GameNotification, HordeState, ToolType, Rarity, Pet, VillageStats, Difficulty } from './types';
import { SEEDS_DB, HOES, PETS, INITIAL_PLOTS, MAX_PLOTS, TICK_RATE_MS, HORDE_INTERVAL_SEC, VILLAGE_STAT_COST, GENERATOR_ODDS_LV1, GENERATOR_ODDS_LV2, GENERATOR_UPGRADE_COST, DIFFICULTY_CONFIG, SHOVEL_PRICE, GENERATOR_MAX_INPUT, GENERATOR_WINS_TO_RECHARGE } from './constants';
import { FarmPlot } from './components/FarmPlot';
import { Sidebar } from './components/Sidebar';
import { HordeOverlay } from './components/HordeOverlay';
import { StartMenu } from './components/StartMenu';
import { LucideHammer, LucideClock, LucideAlertTriangle } from 'lucide-react';

export default function App() {
  // --- STATE ---
  
  // Game Flow
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);

  // Player
  const [player, setPlayer] = useState<Player>({
    money: 100,
    level: 1,
    xp: 0,
    maxXp: 100,
    villageStats: {
        defense: 5,
        strength: 5,
        skill: 5
    },
    equippedHoeId: 'hoe_start',
    hasShovel: false,
    inventory: [
      { id: SEEDS_DB[0].id, type: 'seed', count: 5 } // Start with 5 basic seeds
    ],
    unlockedPlots: INITIAL_PLOTS,
    activePets: [],
    day: 1,
    generatorLevel: 1,
    generatorCharges: 1,
    consecutiveHordeWins: 0
  });

  // Farm
  const [plots, setPlots] = useState<Plot[]>(() => {
    return Array.from({ length: MAX_PLOTS }).map((_, i) => ({
      id: i,
      status: i < INITIAL_PLOTS ? 'empty' : 'locked',
      seedId: null,
      seedCount: 1,
      progress: 0,
      hoeQuality: 1,
    }));
  });

  // UI State
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string>('hoe'); // 'hoe' or 'shovel'
  const [sidebarTab, setSidebarTab] = useState<string>('inventory');
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  
  // Horde State
  const [horde, setHorde] = useState<HordeState>({
    active: false,
    timeLeft: HORDE_INTERVAL_SEC,
    stats: { defense: 3, strength: 3, skill: 3 },
    battleInProgress: false
  });

  // --- HELPERS ---

  const diffConfig = DIFFICULTY_CONFIG[difficulty];

  const getPrice = (base: number) => Math.floor(base * diffConfig.costMult);

  const notify = (msg: string, type: GameNotification['type'], x?: number, y?: number) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message: msg, type, x, y }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 1500); 
  };

  const addXp = (amount: number) => {
    setPlayer(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      let leveledUp = false;

      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel++;
        newMaxXp = Math.floor(newMaxXp * 1.5);
        leveledUp = true;
      }

      if (leveledUp) {
        notify(`Level Up! You are now level ${newLevel}`, 'info');
      }

      return { ...prev, xp: newXp, level: newLevel, maxXp: newMaxXp };
    });
  };

  // Calculate passive buffs from pets
  const getPetBuffs = () => {
    let growthSpeed = 0;
    let moneyMult = 0;
    let defenseAdd = 0;

    player.activePets.forEach(petId => {
      const pet = PETS.find(p => p.id === petId);
      if (pet) {
        if (pet.bonusType === 'growth_speed') growthSpeed += pet.bonusValue;
        if (pet.bonusType === 'money_multiplier') moneyMult += pet.bonusValue;
        if (pet.bonusType === 'defense') defenseAdd += pet.bonusValue;
      }
    });
    return { growthSpeed, moneyMult, defenseAdd };
  };

  // --- GAME LOOP ---

  useEffect(() => {
    if (!isPlaying) return;

    const tick = setInterval(() => {
      // 1. Horde Timer
      setHorde(prev => {
        if (prev.active || prev.battleInProgress) return prev;
        
        // Generate stats based on player level approximately when timer hits 0
        if (prev.timeLeft <= 0) {
          // Difficulty scaling: Player stats +/- variance
          const variance = 2 + Math.floor(player.level / 2); 
          const base = 2 + player.level;
          
          const genStat = () => Math.max(1, base + Math.floor(Math.random() * variance * 2) - variance);

          return { 
            ...prev, 
            active: true, 
            timeLeft: 0,
            stats: {
                defense: genStat(),
                strength: genStat(),
                skill: genStat()
            }
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - (TICK_RATE_MS / 1000) };
      });

      // 2. Crop Growth
      const { growthSpeed: petGrowthSpeed } = getPetBuffs();

      setPlots(currentPlots => {
        let changed = false;
        const newPlots = currentPlots.map(plot => {
          if (plot.status === 'growing' && plot.seedId) {
            const seed = SEEDS_DB.find(s => s.id === plot.seedId);
            if (seed) {
              const hoeMultiplier = plot.hoeQuality || 1;
              const totalMultiplier = hoeMultiplier * (1 + petGrowthSpeed) * diffConfig.speedMult; // Apply Difficulty & Pet Buff
              
              const growthPerTick = (100 / (seed.growTimeSeconds / (TICK_RATE_MS / 1000))) * totalMultiplier;
              
              const newProgress = plot.progress + growthPerTick;
              if (newProgress >= 100) {
                changed = true;
                return { ...plot, status: 'ready', progress: 100 } as Plot;
              } else {
                changed = true;
                return { ...plot, progress: newProgress } as Plot;
              }
            }
          }
          return plot;
        });
        return changed ? newPlots : currentPlots;
      });

    }, TICK_RATE_MS);

    return () => clearInterval(tick);
  }, [player.activePets, player.level, isPlaying, difficulty]); 

  // --- ACTIONS ---

  const handleStartGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setIsPlaying(true);
  };

  const handleToolSelect = (tool: string) => {
    setSelectedToolId(tool);
    if (tool !== 'seed') setSelectedSeedId(null);
  };

  const handleSeedSelect = (id: string | null) => {
     setSelectedSeedId(id);
     if (id) setSelectedToolId('seed');
  };

  const handlePlotInteract = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot) return;

    // 0. SHOVEL (Clearing)
    if (selectedToolId === 'shovel') {
       if (plot.status !== 'empty' && plot.status !== 'locked') {
         setPlots(prev => prev.map(p => p.id === plotId ? { ...p, status: 'empty', seedId: null, progress: 0, seedCount: 1 } : p));
         // Sound effect or visual could go here
         return;
       }
    }

    // 1. Till Soil (Costs Money) - Only works with HOE
    if (selectedToolId === 'hoe' && plot.status === 'empty') {
      const equippedHoe = HOES.find(h => h.id === player.equippedHoeId) || HOES[0];
      
      if (player.money < equippedHoe.actionCost) {
        notify("Not enough money to use hoe!", "danger");
        return;
      }

      setPlayer(prev => ({ ...prev, money: prev.money - equippedHoe.actionCost }));
      
      setPlots(prev => prev.map(p => p.id === plotId ? { 
        ...p, 
        status: 'tilled', 
        hoeQuality: equippedHoe.growthSpeedMultiplier,
        seedCount: 1 // reset
      } : p));
      
      return;
    }

    // 2. Plant Seed - Only works with SEED selected
    if (selectedToolId === 'seed' && plot.status === 'tilled' && selectedSeedId) {
      const inventoryItem = player.inventory.find(i => i.id === selectedSeedId);
      const equippedHoe = HOES.find(h => h.id === player.equippedHoeId);

      if (inventoryItem && inventoryItem.count > 0) {
        
        let seedsToPlant = 1;
        // Ultimate Hoe Logic
        if (equippedHoe?.canDoubleSeed && inventoryItem.count >= 2) {
          seedsToPlant = 2;
        }

        // Decrease inventory
        setPlayer(prev => ({
          ...prev,
          inventory: prev.inventory.map(i => i.id === selectedSeedId ? { ...i, count: i.count - seedsToPlant } : i).filter(i => i.count > 0)
        }));
        
        // Start growth
        setPlots(prev => prev.map(p => p.id === plotId ? {
          ...p,
          status: 'growing',
          seedId: selectedSeedId,
          progress: 0,
          seedCount: seedsToPlant
        } : p));

        if (seedsToPlant === 2) notify("Double Seed Planted!", "info");

        // If ran out, deselect
        if (inventoryItem.count <= seedsToPlant) {
          handleSeedSelect(null);
          handleToolSelect('hoe');
        }
      } else {
        notify("Out of seeds!", 'danger');
      }
      return;
    }

    // 3. Harvest - Works with ANY tool (except shovel effectively, but click priority handles it)
    if (plot.status === 'ready' && plot.seedId) {
      const seed = SEEDS_DB.find(s => s.id === plot.seedId);
      if (seed) {
        const { moneyMult } = getPetBuffs();
        
        // Base Calculation
        let moneyEarned = seed.sellPrice * plot.seedCount;
        
        // Apply Pet Bonus & Difficulty
        moneyEarned = Math.floor(moneyEarned * (1 + moneyMult)); // Difficulty affects sell price at purchase/generation logic, but here we can stick to constant base to avoid double penalty, OR apply logic in SEEDS_DB. Currently logic applies diff mult in Sidebar display. Let's act as if sellPrice in DB is base, and we scale it too?
        // To keep it simple, let's say the Market sets the price. The Sidebar shows adjusted Sell Price.
        // We should respect that adjustment here.
        moneyEarned = Math.floor(moneyEarned * diffConfig.costMult); 

        const xpEarned = Math.max(1, Math.floor((seed.sellPrice / 5) * plot.seedCount));

        setPlayer(prev => ({
          ...prev,
          money: prev.money + moneyEarned
        }));
        addXp(xpEarned);
        notify(`+$${moneyEarned}`, 'earning');

        // Reset Plot
        setPlots(prev => prev.map(p => p.id === plotId ? { ...p, status: 'empty', seedId: null, progress: 0, seedCount: 1 } : p));
      }
      return;
    }
    
    // 4. Clear Dead/Withered
    if (plot.status === 'withered') {
       setPlots(prev => prev.map(p => p.id === plotId ? { ...p, status: 'empty', seedId: null, progress: 0, seedCount: 1 } : p));
    }
  };

  const buySeed = (seed: Seed) => {
    const price = getPrice(seed.basePrice);
    if (player.money >= price) {
      setPlayer(prev => {
        const existingItem = prev.inventory.find(i => i.id === seed.id);
        let newInventory;
        if (existingItem) {
          newInventory = prev.inventory.map(i => i.id === seed.id ? { ...i, count: i.count + 1 } : i);
        } else {
          newInventory = [...prev.inventory, { id: seed.id, type: 'seed', count: 1 } as Item];
        }
        return {
          ...prev,
          money: prev.money - price,
          inventory: newInventory
        };
      });
      notify(`Bought ${seed.name}`, 'success');
    }
  };

  const buyHoe = (hoe: Hoe) => {
    const price = getPrice(hoe.price);
    if (player.money >= price) {
      setPlayer(prev => ({
        ...prev,
        money: prev.money - price,
        equippedHoeId: hoe.id
      }));
      notify(`Upgraded to ${hoe.name}!`, 'success');
    }
  };

  const buyShovel = () => {
    const price = getPrice(SHOVEL_PRICE);
    if (player.money >= price) {
      setPlayer(prev => ({
        ...prev,
        money: prev.money - price,
        hasShovel: true
      }));
      notify("Shovel Acquired!", 'success');
    }
  };

  const buyPet = (pet: Pet) => {
    if (player.activePets.includes(pet.id)) return;
    const price = getPrice(pet.price);
    if (player.money >= price) {
      setPlayer(prev => ({
        ...prev,
        money: prev.money - price,
        activePets: [...prev.activePets, pet.id]
      }));
      notify(`Adopted ${pet.name}!`, 'success');
    }
  };

  const upgradeVillageStat = (stat: 'defense' | 'strength' | 'skill') => {
    const currentVal = player.villageStats[stat];
    const cost = getPrice(Math.floor(VILLAGE_STAT_COST * (1 + (currentVal * 0.1))));

    if (player.money >= cost) {
      setPlayer(prev => ({
        ...prev,
        money: prev.money - cost,
        villageStats: {
            ...prev.villageStats,
            [stat]: prev.villageStats[stat] + 1
        }
      }));
      notify(`${stat.toUpperCase()} Upgraded!`, 'success');
    }
  };

  const unlockPlot = (cost: number) => {
     if (player.money >= cost && player.unlockedPlots < MAX_PLOTS) {
       setPlayer(prev => ({
         ...prev,
         money: prev.money - cost,
         unlockedPlots: prev.unlockedPlots + 1
       }));
       setPlots(prev => {
         const updated = [...prev];
         const nextLocked = updated.find(p => p.status === 'locked');
         if(nextLocked) nextLocked.status = 'empty';
         return updated;
       });
       notify("New Land Cleared!", 'success');
     }
  };

  // --- GENERATOR LOGIC ---
  const useGenerator = (amount: number) => {
      // Logic checks
      if (amount > GENERATOR_MAX_INPUT) {
        notify(`Max $${GENERATOR_MAX_INPUT}`, 'danger');
        return;
      }
      if (player.generatorCharges <= 0) {
        notify("Generator needs recharging!", 'danger');
        return;
      }
      if (player.money < amount || amount <= 0) return;

      const odds = player.generatorLevel === 1 ? GENERATOR_ODDS_LV1 : GENERATOR_ODDS_LV2;
      const newInventory = [...player.inventory];
      const seedsToAdd: Record<string, number> = {};

      // $1 = 1 Seed
      for (let i = 0; i < amount; i++) {
          const roll = Math.random() * 100;
          let rarity: Rarity;
          
          if (roll < odds.common) rarity = Rarity.COMMON;
          else if (roll < odds.common + odds.rare) rarity = Rarity.RARE;
          else if (roll < odds.common + odds.rare + odds.epic) rarity = Rarity.EPIC;
          else if (roll < odds.common + odds.rare + odds.epic + odds.mystic) rarity = Rarity.MYSTIC;
          else rarity = Rarity.ULTIMATE;

          // Find a random seed of that rarity
          const candidates = SEEDS_DB.filter(s => s.rarity === rarity);
          if (candidates.length > 0) {
              const seed = candidates[Math.floor(Math.random() * candidates.length)];
              seedsToAdd[seed.id] = (seedsToAdd[seed.id] || 0) + 1;
          }
      }

      // Merge into inventory
      Object.entries(seedsToAdd).forEach(([seedId, count]) => {
          const existing = newInventory.find(i => i.id === seedId);
          if (existing) {
              existing.count += count;
          } else {
              newInventory.push({ id: seedId, type: 'seed', count });
          }
      });

      setPlayer(prev => ({
          ...prev,
          money: prev.money - amount,
          inventory: newInventory,
          generatorCharges: prev.generatorCharges - 1
      }));

      notify(`Generated ${amount} seeds!`, 'success');
  };

  const upgradeGenerator = () => {
      if (player.money >= GENERATOR_UPGRADE_COST) {
          setPlayer(prev => ({
              ...prev,
              money: prev.money - GENERATOR_UPGRADE_COST,
              generatorLevel: 2
          }));
          notify("Generator Upgraded!", 'success');
      }
  };

  // --- BATTLE LOGIC ---
  const resolveHordeBattle = () => {
    setHorde(prev => ({ ...prev, battleInProgress: true, active: false }));

    setTimeout(() => {
      const pStats = player.villageStats;
      const hStats = horde.stats;
      
      let wins = 0;
      if (pStats.defense >= hStats.defense) wins++;
      if (pStats.strength >= hStats.strength) wins++;
      if (pStats.skill >= hStats.skill) wins++;

      // Result
      if (wins >= 2) {
          // WIN
          const rewardBase = wins === 3 ? 1000 : 300;
          // Scale reward by difficulty too (harder = more risk, maybe same reward? usually harder shouldn't give less, but prompt said "everything expensive")
          // Let's keep reward static or slightly scaled up for hard to balance cost? No, user said hard = expensive.
          
          setPlayer(prev => {
             // Logic for generator recharge
             const newStreak = prev.consecutiveHordeWins + 1;
             let newCharges = prev.generatorCharges;
             let finalStreak = newStreak;
             
             if (newStreak >= GENERATOR_WINS_TO_RECHARGE) {
                newCharges += 1;
                finalStreak = 0;
                notify("Generator Recharged!", 'info');
             }

             return { 
               ...prev, 
               money: prev.money + rewardBase,
               consecutiveHordeWins: finalStreak,
               generatorCharges: newCharges
             };
          });
          notify(`Victory! +$${rewardBase}`, 'success');

      } else if (wins === 0 || wins === 1) {
          // LOSS
          const moneyLoss = Math.floor(player.money * 0.1); // 10%
          
          setPlayer(prev => ({ 
            ...prev, 
            money: prev.money - moneyLoss,
            consecutiveHordeWins: 0 // Reset streak on fail
          }));
          
          const growingPlots = plots.filter(p => p.status === 'growing' || p.status === 'ready');
          if (growingPlots.length > 0) {
            const victim = growingPlots[Math.floor(Math.random() * growingPlots.length)];
            setPlots(prev => prev.map(p => p.id === victim.id ? { ...p, status: 'withered', seedId: null } : p));
            notify(`Defeat! Lost $${moneyLoss} & 1 Crop`, 'danger');
          } else {
             notify(`Defeat! Lost $${moneyLoss}`, 'danger');
          }
      }

      setHorde({
        active: false,
        battleInProgress: false,
        timeLeft: HORDE_INTERVAL_SEC,
        stats: { defense: 1, strength: 1, skill: 1 }, 
      });

    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden select-none">
      
      {!isPlaying && (
        <StartMenu onStart={handleStartGame} />
      )}

      {/* Notifications Layer */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center gap-2">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`
              float-text px-4 py-2 rounded-full font-bold shadow-lg border
              ${n.type === 'earning' ? 'bg-yellow-500/90 border-yellow-300 text-white text-xl' : ''}
              ${n.type === 'success' ? 'bg-green-600/90 border-green-400 text-white' : ''}
              ${n.type === 'danger' ? 'bg-red-600/90 border-red-400 text-white' : ''}
              ${n.type === 'info' ? 'bg-blue-600/90 border-blue-400 text-white' : ''}
            `}
          >
            {n.message}
          </div>
        ))}
      </div>

      {/* Main Farm Area */}
      <div className="flex-1 relative flex flex-col">
        {/* Horde Timer Bar */}
        <div className="h-2 bg-gray-800 w-full relative">
          <div 
            className={`h-full transition-all duration-1000 ${horde.timeLeft < 30 ? 'bg-red-600' : 'bg-blue-500'}`}
            style={{ width: `${(horde.timeLeft / HORDE_INTERVAL_SEC) * 100}%` }}
          />
          <div className="absolute top-2 right-4 text-xs font-mono text-gray-400 flex items-center gap-1">
             <LucideAlertTriangle size={12} className={horde.timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-gray-500'} />
             Horde: {(horde.timeLeft / 60).toFixed(1)}m
          </div>
        </div>

        {/* Farm Grid Container */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-gray-900">
           <div className="w-full max-w-4xl">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {plots.map(plot => (
                  <FarmPlot 
                    key={plot.id}
                    plot={plot}
                    selectedToolId={selectedToolId}
                    selectedSeedId={selectedSeedId}
                    seedData={SEEDS_DB.find(s => s.id === plot.seedId)}
                    onInteract={handlePlotInteract}
                  />
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Sidebar (Stats & Inventory) */}
      <Sidebar 
        player={player}
        difficulty={difficulty}
        selectedSeedId={selectedSeedId}
        selectedToolId={selectedToolId}
        onSelectSeed={handleSeedSelect}
        onSelectTool={handleToolSelect}
        activeTab={sidebarTab}
        setActiveTab={setSidebarTab}
        buySeed={buySeed}
        buyHoe={buyHoe}
        buyShovel={buyShovel}
        buyPet={buyPet}
        upgradeVillageStat={upgradeVillageStat}
        unlockPlot={unlockPlot}
        useGenerator={useGenerator}
        upgradeGenerator={upgradeGenerator}
      />

      {/* Overlays */}
      <HordeOverlay horde={horde} player={player} onBattle={resolveHordeBattle} />
      
    </div>
  );
}