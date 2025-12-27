import React, { useState } from 'react';
import { Player, Rarity, Seed, Hoe, Item, Pet, Difficulty } from '../types';
import { SEEDS_DB, HOES, PETS, PLOT_COST_INCREMENT, MAX_PLOTS, VILLAGE_STAT_COST, GENERATOR_UPGRADE_COST, DIFFICULTY_CONFIG, SHOVEL_PRICE, GENERATOR_MAX_INPUT, GENERATOR_WINS_TO_RECHARGE } from '../constants';
import { LucideCoins, LucideStar, LucideShield, LucideShovel, LucideShoppingBag, LucideBackpack, LucideMap, LucideDog, LucideCastle, LucideZap, LucideSword, LucideDna, LucideHammer } from 'lucide-react';

interface SidebarProps {
  player: Player;
  difficulty: Difficulty;
  selectedSeedId: string | null;
  selectedToolId: string;
  onSelectSeed: (id: string | null) => void;
  onSelectTool: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  buySeed: (seed: Seed) => void;
  buyHoe: (hoe: Hoe) => void;
  buyShovel: () => void;
  buyPet: (pet: Pet) => void;
  upgradeVillageStat: (stat: 'defense' | 'strength' | 'skill') => void;
  unlockPlot: (cost: number) => void;
  useGenerator: (amount: number) => void;
  upgradeGenerator: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  player, 
  difficulty,
  selectedSeedId, 
  selectedToolId,
  onSelectSeed,
  onSelectTool,
  activeTab, 
  setActiveTab,
  buySeed,
  buyHoe,
  buyShovel,
  buyPet,
  upgradeVillageStat,
  unlockPlot,
  useGenerator,
  upgradeGenerator
}) => {
  const [genAmount, setGenAmount] = useState<string>('10');
  const diffConfig = DIFFICULTY_CONFIG[difficulty];

  const getPrice = (base: number) => Math.floor(base * diffConfig.costMult);

  const getRarityColor = (r: Rarity) => {
    switch (r) {
      case Rarity.COMMON: return 'text-gray-400';
      case Rarity.RARE: return 'text-blue-400';
      case Rarity.EPIC: return 'text-purple-400';
      case Rarity.MYSTIC: return 'text-pink-400';
      case Rarity.ULTIMATE: return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  const getRarityBorder = (r: Rarity) => {
    switch (r) {
      case Rarity.COMMON: return 'border-gray-600';
      case Rarity.RARE: return 'border-blue-600';
      case Rarity.EPIC: return 'border-purple-600';
      case Rarity.MYSTIC: return 'border-pink-600';
      case Rarity.ULTIMATE: return 'border-yellow-600';
      default: return 'border-gray-700';
    }
  };

  const currentHoe = HOES.find(h => h.id === player.equippedHoeId);

  // Territory Cost
  const expansionLevel = player.unlockedPlots - 8;
  const plotCost = getPrice(expansionLevel * PLOT_COST_INCREMENT);
  
  // Stat Cost
  const getStatCost = (val: number) => getPrice(Math.floor(VILLAGE_STAT_COST * (1 + (val * 0.1))));

  const shovelCost = getPrice(SHOVEL_PRICE);

  return (
    <div className="h-full flex flex-col bg-gray-800 border-l border-gray-700 w-80 shadow-2xl z-10">
      {/* Player Stats Header */}
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1">
          Farm Manager
        </h2>
        <div className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-bold">{difficulty} Mode</div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-yellow-400">
            <LucideCoins size={16} className="mr-2" />
            <span className="font-mono font-bold">{player.money.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-blue-400">
            <LucideStar size={16} className="mr-2" />
            <span className="font-mono">Lvl {player.level}</span>
          </div>
          <div className="flex items-center text-gray-300 col-span-2 text-xs">
            <span className="mr-2">⚔️ {player.villageStats.strength}</span>
            <span className="mr-2">🛡️ {player.villageStats.defense}</span>
            <span>✨ {player.villageStats.skill}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-900/50">
        <button onClick={() => setActiveTab('inventory')} className={`flex-1 p-3 ${activeTab === 'inventory' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:text-gray-300'}`} title="Inventory"><LucideBackpack size={20} className="mx-auto"/></button>
        <button onClick={() => setActiveTab('shop')} className={`flex-1 p-3 ${activeTab === 'shop' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:text-gray-300'}`} title="Shop"><LucideShoppingBag size={20} className="mx-auto"/></button>
        <button onClick={() => setActiveTab('territory')} className={`flex-1 p-3 ${activeTab === 'territory' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:text-gray-300'}`} title="Territory"><LucideMap size={20} className="mx-auto"/></button>
        <button onClick={() => setActiveTab('defense')} className={`flex-1 p-3 ${activeTab === 'defense' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:text-gray-300'}`} title="Village"><LucideCastle size={20} className="mx-auto"/></button>
        <button onClick={() => setActiveTab('generator')} className={`flex-1 p-3 ${activeTab === 'generator' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:text-gray-300'}`} title="Generator"><LucideZap size={20} className="mx-auto"/></button>
        <button onClick={() => setActiveTab('pets')} className={`flex-1 p-3 ${activeTab === 'pets' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:text-gray-300'}`} title="Pets"><LucideDog size={20} className="mx-auto"/></button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        
        {/* INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Tools */}
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tools</h3>
              <div className="flex gap-2">
                 {/* Hoe */}
                 <button 
                   onClick={() => onSelectTool('hoe')}
                   className={`p-2 rounded border flex flex-col items-center gap-1 ${selectedToolId === 'hoe' ? 'bg-emerald-900 border-emerald-500 text-emerald-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                 >
                   <LucideShovel size={24} />
                   <span className="text-xs font-bold">Hoe</span>
                 </button>
                 
                 {/* Shovel */}
                 {player.hasShovel && (
                   <button 
                    onClick={() => onSelectTool('shovel')}
                    className={`p-2 rounded border flex flex-col items-center gap-1 ${selectedToolId === 'shovel' ? 'bg-red-900 border-red-500 text-red-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                   >
                     <LucideHammer size={24} />
                     <span className="text-xs font-bold">Clear</span>
                   </button>
                 )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Seeds</h3>
              <div className="grid grid-cols-1 gap-2">
                {player.inventory.filter(i => i.type === 'seed').length === 0 && (
                  <div className="text-gray-500 text-sm italic p-4 text-center">No seeds. Visit Shop or Generator!</div>
                )}
                {player.inventory.filter(i => i.type === 'seed').map(item => {
                  const seed = SEEDS_DB.find(s => s.id === item.id);
                  if (!seed) return null;
                  const isSelected = selectedSeedId === item.id;

                  return (
                    <div 
                      key={item.id}
                      onClick={() => onSelectSeed(isSelected ? null : item.id)}
                      className={`
                        flex items-center justify-between p-2 rounded cursor-pointer border
                        ${isSelected ? 'bg-emerald-900/50 border-emerald-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-750'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: seed.color, color: '#000' }}
                        >
                          {item.count}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${getRarityColor(seed.rarity)}`}>{seed.name}</div>
                          <div className="text-xs text-gray-500">Sell: ${Math.floor(seed.sellPrice * diffConfig.costMult)}</div>
                        </div>
                      </div>
                      {isSelected && <div className="text-emerald-400 text-xs font-bold px-2">SELECTED</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SHOP */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            
            {/* Tools Section */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Tools & Equipment</h3>
              <div className="space-y-2">
                {/* Buy Shovel */}
                {!player.hasShovel && (
                  <button
                    disabled={player.money < shovelCost}
                    onClick={buyShovel}
                    className={`
                       w-full flex items-center justify-between p-3 rounded border text-left
                       ${player.money >= shovelCost ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed'}
                    `}
                  >
                    <div>
                      <div className="font-bold text-sm text-red-400">Shovel</div>
                      <div className="text-xs text-gray-400">Clear withered/unwanted crops</div>
                    </div>
                    <div className="text-yellow-400 font-mono text-sm">${shovelCost.toLocaleString()}</div>
                  </button>
                )}

                {/* Hoes */}
                {HOES.map(hoe => {
                  const currentHoeIndex = HOES.findIndex(h => h.id === player.equippedHoeId);
                  const thisHoeIndex = HOES.findIndex(h => h.id === hoe.id);
                  const isNextUpgrade = thisHoeIndex === currentHoeIndex + 1;

                  if (!isNextUpgrade) return null;
                  const price = getPrice(hoe.price);

                  return (
                    <button
                      key={hoe.id}
                      disabled={player.money < price}
                      onClick={() => buyHoe(hoe)}
                      className={`
                        w-full flex items-center justify-between p-3 rounded border text-left
                        ${player.money >= price ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed'}
                      `}
                    >
                      <div>
                        <div className={`font-bold text-sm ${getRarityColor(hoe.rarity)}`}>{hoe.name}</div>
                        <div className="text-xs text-gray-400">Speed: {hoe.growthSpeedMultiplier}x | Cost: ${hoe.actionCost}</div>
                        {hoe.canDoubleSeed && <div className="text-xs text-yellow-400">Effect: Double Yields!</div>}
                      </div>
                      <div className="text-yellow-400 font-mono text-sm">
                         ${price.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
                 {HOES.findIndex(h => h.id === player.equippedHoeId) === HOES.length - 1 && player.hasShovel && (
                    <div className="text-center text-sm text-yellow-500 py-2">All Tools Unlocked!</div>
                 )}
              </div>
            </div>

            {/* Buy Seeds (Restored) */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Seeds Market</h3>
              <div className="grid grid-cols-1 gap-2">
                {SEEDS_DB.filter(s => s.reqLevel <= player.level + 2).map(seed => {
                  const finalPrice = getPrice(seed.basePrice);
                  const canAfford = player.money >= finalPrice;
                  const isLocked = player.level < seed.reqLevel;

                  return (
                    <button
                      key={seed.id}
                      disabled={!canAfford || isLocked}
                      onClick={() => buySeed(seed)}
                      className={`
                        relative flex items-center justify-between p-2 rounded border group
                        ${isLocked 
                          ? 'bg-gray-900 border-gray-800 opacity-60' 
                          : canAfford 
                            ? 'bg-gray-800 border-gray-700 hover:border-gray-500' 
                            : 'bg-gray-800 border-red-900/50 opacity-70'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-8 rounded-full" style={{backgroundColor: seed.color}}></div>
                         <div className="text-left">
                           <div className={`text-sm font-medium ${getRarityColor(seed.rarity)}`}>
                             {seed.name}
                             {isLocked && <span className="ml-2 text-xs text-red-400">(Lvl {seed.reqLevel})</span>}
                           </div>
                           <div className="text-xs text-gray-500">{seed.growTimeSeconds}s</div>
                         </div>
                      </div>
                      <div className="text-yellow-400 font-mono text-sm px-2">
                        ${finalPrice}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TERRITORY */}
        {activeTab === 'territory' && (
          <div className="space-y-4">
             <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700 text-center">
               <LucideMap className="mx-auto text-emerald-500 mb-2 w-12 h-12" />
               <h3 className="text-lg font-bold text-white mb-1">Expand Territory</h3>
               <p className="text-sm text-gray-400 mb-4">Unlock more plots to farm.</p>
               
               {player.unlockedPlots < MAX_PLOTS ? (
                 <button 
                  onClick={() => unlockPlot(plotCost)}
                  disabled={player.money < plotCost}
                  className={`w-full py-2 rounded font-bold border ${player.money >= plotCost ? 'bg-emerald-600 border-emerald-500 hover:bg-emerald-500' : 'bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed'}`}
                 >
                   Unlock Plot (${plotCost.toLocaleString()})
                 </button>
               ) : (
                 <div className="text-emerald-400 font-bold uppercase tracking-widest border border-emerald-500 p-2 rounded">
                   Fully Expanded
                 </div>
               )}
               <p className="text-xs text-gray-500 mt-2">Current plots: {player.unlockedPlots} / {MAX_PLOTS}</p>
             </div>
          </div>
        )}

        {/* VILLAGE / DEFENSE */}
        {activeTab === 'defense' && (
          <div className="space-y-4">
             <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <LucideCastle /> Village Stats
               </h3>
               
               <div className="space-y-4">
                 {/* Defense */}
                 <div className="bg-gray-800 p-3 rounded">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-blue-400 font-bold flex items-center gap-2"><LucideShield size={16}/> Defense</span>
                     <span className="text-xl font-mono">{player.villageStats.defense}</span>
                   </div>
                   <button 
                     onClick={() => upgradeVillageStat('defense')}
                     className="w-full text-xs bg-blue-900/50 border border-blue-700 hover:bg-blue-800 py-1 rounded"
                   >
                     Upgrade (${getStatCost(player.villageStats.defense)})
                   </button>
                 </div>

                 {/* Strength */}
                 <div className="bg-gray-800 p-3 rounded">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-red-400 font-bold flex items-center gap-2"><LucideSword size={16}/> Strength</span>
                     <span className="text-xl font-mono">{player.villageStats.strength}</span>
                   </div>
                   <button 
                     onClick={() => upgradeVillageStat('strength')}
                     className="w-full text-xs bg-red-900/50 border border-red-700 hover:bg-red-800 py-1 rounded"
                   >
                     Upgrade (${getStatCost(player.villageStats.strength)})
                   </button>
                 </div>

                 {/* Skill */}
                 <div className="bg-gray-800 p-3 rounded">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-yellow-400 font-bold flex items-center gap-2"><LucideDna size={16}/> Skill</span>
                     <span className="text-xl font-mono">{player.villageStats.skill}</span>
                   </div>
                   <button 
                     onClick={() => upgradeVillageStat('skill')}
                     className="w-full text-xs bg-yellow-900/50 border border-yellow-700 hover:bg-yellow-800 py-1 rounded"
                   >
                     Upgrade (${getStatCost(player.villageStats.skill)})
                   </button>
                 </div>
               </div>
               <div className="mt-4 text-xs text-gray-500 italic text-center">
                 Higher stats help you win against Hordes!
               </div>
             </div>
          </div>
        )}

        {/* GENERATOR */}
        {activeTab === 'generator' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700 text-center">
              <LucideZap className="mx-auto text-yellow-500 mb-2 w-12 h-12 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Seed Generator</h3>
              
              {player.generatorCharges > 0 ? (
                <>
                  <p className="text-xs text-green-400 mb-4 font-bold">CHARGED ({player.generatorCharges} left)</p>
                  <p className="text-xs text-gray-400 mb-4">Max Input: ${GENERATOR_MAX_INPUT}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-400 font-bold">$</span>
                    <input 
                      type="number" 
                      value={genAmount}
                      onChange={(e) => setGenAmount(e.target.value)}
                      className="bg-gray-800 border border-gray-600 rounded p-2 w-full text-white"
                      min="1"
                      max={GENERATOR_MAX_INPUT}
                    />
                  </div>

                  <button 
                    onClick={() => useGenerator(parseInt(genAmount) || 0)}
                    disabled={player.money < (parseInt(genAmount) || 0) || (parseInt(genAmount) || 0) <= 0 || (parseInt(genAmount) || 0) > GENERATOR_MAX_INPUT}
                    className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded font-bold text-white shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                  >
                    GENERATE
                  </button>
                </>
              ) : (
                <div className="bg-red-900/30 border border-red-500/50 p-4 rounded mb-6">
                   <p className="text-red-400 font-bold text-sm mb-1">GENERATOR DEPLETED</p>
                   <p className="text-xs text-gray-300">
                     Survive {GENERATOR_WINS_TO_RECHARGE - player.consecutiveHordeWins} more Hordes without failing to recharge.
                   </p>
                   <div className="flex gap-1 justify-center mt-2">
                     {[...Array(GENERATOR_WINS_TO_RECHARGE)].map((_, i) => (
                       <div key={i} className={`w-3 h-3 rounded-full ${i < player.consecutiveHordeWins ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                     ))}
                   </div>
                </div>
              )}

              <div className="border-t border-gray-700 pt-4">
                 <p className="text-xs text-gray-500 mb-2">Generator Level: {player.generatorLevel}</p>
                 {player.generatorLevel === 1 ? (
                    <button 
                      onClick={upgradeGenerator}
                      disabled={player.money < GENERATOR_UPGRADE_COST}
                      className="w-full py-2 border border-purple-500 text-purple-400 rounded hover:bg-purple-900/20 disabled:opacity-50 text-xs"
                    >
                      Upgrade Chances (${GENERATOR_UPGRADE_COST.toLocaleString()})
                    </button>
                 ) : (
                   <div className="text-purple-400 font-bold text-xs uppercase">Max Level Reached</div>
                 )}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1 px-2">
              <p className="font-bold text-gray-400">Current Odds:</p>
              <div className="flex justify-between"><span>Common:</span> <span>{player.generatorLevel === 1 ? '50%' : '30%'}</span></div>
              <div className="flex justify-between text-blue-400"><span>Rare:</span> <span>{player.generatorLevel === 1 ? '20%' : '25%'}</span></div>
              <div className="flex justify-between text-purple-400"><span>Epic:</span> <span>{player.generatorLevel === 1 ? '15%' : '20%'}</span></div>
              <div className="flex justify-between text-pink-400"><span>Mystic:</span> <span>{player.generatorLevel === 1 ? '10%' : '15%'}</span></div>
              <div className="flex justify-between text-yellow-400"><span>Ultimate:</span> <span>{player.generatorLevel === 1 ? '5%' : '10%'}</span></div>
            </div>
          </div>
        )}

        {/* PETS */}
        {activeTab === 'pets' && (
          <div className="space-y-3">
             <div className="p-2 text-center text-xs text-gray-400">
               Pets provide passive bonuses.
             </div>
             {PETS.map(pet => {
               const isOwned = player.activePets.includes(pet.id);
               const price = getPrice(pet.price);
               return (
                 <div key={pet.id} className={`p-3 rounded-lg border ${isOwned ? 'bg-emerald-900/20 border-emerald-500' : 'bg-gray-900 border-gray-700'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className={`font-bold ${getRarityColor(pet.rarity)}`}>{pet.name}</div>
                        <div className="text-xs text-gray-400">{pet.description}</div>
                      </div>
                      {isOwned && <LucideCheck className="text-emerald-500 w-5 h-5" />}
                    </div>
                    {!isOwned && (
                      <button 
                        onClick={() => buyPet(pet)}
                        disabled={player.money < price}
                        className={`w-full py-1 text-sm rounded border ${player.money >= price ? 'bg-purple-600 border-purple-500 hover:bg-purple-500' : 'bg-gray-800 border-gray-600 opacity-50'}`}
                      >
                        Adopt (${price.toLocaleString()})
                      </button>
                    )}
                    {isOwned && (
                      <div className="text-center text-xs font-bold text-emerald-500 uppercase">Active</div>
                    )}
                 </div>
               );
             })}
          </div>
        )}

      </div>
    </div>
  );
};
import { LucideCheck } from 'lucide-react';