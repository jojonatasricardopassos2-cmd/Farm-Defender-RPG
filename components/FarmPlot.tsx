import React, { useMemo } from 'react';
import { Plot, Rarity, Seed } from '../types';
import { LucideFlower2, LucideShovel, LucidePickaxe, LucideBan, LucideCheck, LucideHammer } from 'lucide-react';

interface FarmPlotProps {
  plot: Plot;
  selectedToolId: string;
  selectedSeedId: string | null;
  seedData: Seed | undefined;
  onInteract: (plotId: number) => void;
}

export const FarmPlot: React.FC<FarmPlotProps> = ({ 
  plot, 
  selectedToolId, 
  selectedSeedId, 
  seedData, 
  onInteract 
}) => {
  
  // Dynamic styles based on state
  const getBackground = () => {
    switch (plot.status) {
      case 'locked': return 'bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed';
      case 'tilled': return 'bg-amber-900 border-amber-700';
      case 'growing': return 'bg-amber-900 border-amber-700';
      case 'ready': return 'bg-amber-900 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
      case 'withered': return 'bg-gray-600 border-gray-500';
      default: return 'bg-emerald-900/40 border-emerald-800'; // Empty
    }
  };

  const isInteractable = () => {
    if (plot.status === 'locked') return false;
    return true;
  };

  const seedIconColor = seedData?.color || '#fff';

  return (
    <div 
      onClick={() => isInteractable() && onInteract(plot.id)}
      className={`
        relative w-full pb-[100%] rounded-lg border-2 transition-all duration-150
        flex items-center justify-center overflow-hidden select-none
        ${getBackground()}
        ${isInteractable() ? 'hover:scale-[1.02] active:scale-95 cursor-pointer' : ''}
      `}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        
        {/* Status: Locked */}
        {plot.status === 'locked' && (
          <LucideBan className="text-gray-500 w-8 h-8" />
        )}

        {/* Status: Empty */}
        {plot.status === 'empty' && (
          <div className="text-emerald-700/50 text-xs font-bold uppercase tracking-widest">
            Wild Soil
          </div>
        )}

        {/* Status: Tilled */}
        {plot.status === 'tilled' && (
          <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        )}

        {/* Status: Growing / Ready */}
        {(plot.status === 'growing' || plot.status === 'ready') && seedData && (
          <div className="relative flex flex-col items-center animate-bounce-slow">
            {/* Dual Seed Indicator */}
            {plot.seedCount > 1 && (
               <div className="absolute -top-4 -right-8 bg-yellow-500 text-black font-bold text-[10px] px-1 rounded shadow-sm z-10 animate-pulse">
                 x2
               </div>
            )}
            
            <LucideFlower2 
              size={plot.status === 'ready' ? 48 : 32} 
              color={seedIconColor}
              className={`filter drop-shadow-md transition-all duration-500 ${plot.status === 'ready' ? 'animate-pulse' : ''}`}
            />
            {plot.status === 'growing' && (
              <div className="mt-2 w-12 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-200"
                  style={{ width: `${plot.progress}%` }}
                />
              </div>
            )}
            {plot.status === 'ready' && (
              <div className="absolute -top-6 animate-bounce">
                <LucideCheck className="text-white bg-green-600 rounded-full p-0.5 w-5 h-5" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover Overlay indicating Action */}
      {isInteractable() && (
        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 flex items-center justify-center pointer-events-none transition-opacity">
           {selectedToolId === 'shovel' && plot.status !== 'locked' && plot.status !== 'empty' && <LucideHammer className="text-red-400 w-10 h-10" />}
           
           {selectedToolId === 'hoe' && plot.status === 'empty' && <LucideShovel className="text-white/80" />}
           {selectedToolId === 'seed' && plot.status === 'tilled' && selectedSeedId && <LucideFlower2 className="text-white/80" />}
           {plot.status === 'ready' && selectedToolId !== 'shovel' && <LucideCheck className="text-green-400 w-10 h-10" />}
        </div>
      )}
    </div>
  );
};