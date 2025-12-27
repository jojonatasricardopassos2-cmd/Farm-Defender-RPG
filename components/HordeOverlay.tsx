import React from 'react';
import { HordeState, Player } from '../types';
import { LucideSkull, LucideSword, LucideShieldAlert, LucideShield, LucideDna } from 'lucide-react';

interface HordeOverlayProps {
  horde: HordeState;
  player: Player;
  onBattle: () => void;
}

export const HordeOverlay: React.FC<HordeOverlayProps> = ({ horde, player, onBattle }) => {
  if (!horde.active && !horde.battleInProgress) return null;

  // Battle In Progress View
  if (horde.battleInProgress) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm">
        <div className="flex flex-col items-center animate-pulse">
          <LucideSword className="w-24 h-24 text-red-500 mb-4 animate-bounce" />
          <h2 className="text-4xl font-black text-white uppercase tracking-widest">Battling...</h2>
        </div>
      </div>
    );
  }

  // Pre-Battle / Active Attack View
  return (
    <div className="fixed inset-0 z-50 bg-red-900/40 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-900 border-2 border-red-500 p-6 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.5)] max-w-md w-full text-center relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse"></div>

        <LucideSkull className="w-12 h-12 text-red-500 mx-auto mb-2 animate-bounce" />
        
        <h2 className="text-2xl font-black text-white mb-1 uppercase">Horde At Gates!</h2>
        <p className="text-gray-300 mb-4 text-sm">
          Compare stats! If you win 2 out of 3, you defend successfully.
        </p>

        <div className="bg-gray-800 p-4 rounded-lg mb-6 grid grid-cols-3 gap-4">
          
          {/* Header */}
          <div className="col-span-1 text-xs text-gray-500 uppercase font-bold text-left">Stat</div>
          <div className="col-span-1 text-xs text-blue-400 uppercase font-bold">You</div>
          <div className="col-span-1 text-xs text-red-400 uppercase font-bold">Enemy</div>

          {/* Defense */}
          <div className="col-span-1 flex items-center gap-1 text-gray-300 font-bold text-sm"><LucideShield size={14}/> Def</div>
          <div className={`col-span-1 font-bold ${player.villageStats.defense >= horde.stats.defense ? 'text-green-500' : 'text-red-500'}`}>
            {player.villageStats.defense}
          </div>
          <div className="col-span-1 font-bold text-red-300">{horde.stats.defense}</div>

          {/* Strength */}
          <div className="col-span-1 flex items-center gap-1 text-gray-300 font-bold text-sm"><LucideSword size={14}/> Str</div>
          <div className={`col-span-1 font-bold ${player.villageStats.strength >= horde.stats.strength ? 'text-green-500' : 'text-red-500'}`}>
            {player.villageStats.strength}
          </div>
          <div className="col-span-1 font-bold text-red-300">{horde.stats.strength}</div>

          {/* Skill */}
          <div className="col-span-1 flex items-center gap-1 text-gray-300 font-bold text-sm"><LucideDna size={14}/> Skl</div>
          <div className={`col-span-1 font-bold ${player.villageStats.skill >= horde.stats.skill ? 'text-green-500' : 'text-red-500'}`}>
            {player.villageStats.skill}
          </div>
          <div className="col-span-1 font-bold text-red-300">{horde.stats.skill}</div>

        </div>

        <button 
          onClick={onBattle}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg uppercase tracking-widest shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
        >
          <LucideShieldAlert /> Fight
        </button>
      </div>
    </div>
  );
};