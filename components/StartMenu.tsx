import React from 'react';
import { Difficulty } from '../types';
import { LucideShield, LucideSkull, LucideSmile, LucideSword } from 'lucide-react';

interface StartMenuProps {
  onStart: (diff: Difficulty) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
      <div className="mb-10 text-center animate-in fade-in slide-in-from-top-10 duration-700">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-4 drop-shadow-2xl">
          FARM DEFENDER
        </h1>
        <p className="text-gray-400 text-lg">Plant. Grow. Defend.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {/* EASY */}
        <button 
          onClick={() => onStart(Difficulty.EASY)}
          className="group relative bg-gray-800 border-2 border-emerald-500/30 hover:border-emerald-500 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
            <LucideSmile size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">EASY MODE</h2>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Cheaper Prices (x0.75)</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Faster Growth (x1.25)</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Relaxed Economy</li>
          </ul>
        </button>

        {/* NORMAL */}
        <button 
          onClick={() => onStart(Difficulty.NORMAL)}
          className="group relative bg-gray-800 border-2 border-blue-500/30 hover:border-blue-500 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        >
           <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
            <LucideShield size={48} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-blue-400 mb-2">NORMAL MODE</h2>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-center gap-2"><span className="text-blue-500">•</span> Standard Prices</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">•</span> Standard Growth</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">•</span> Balanced Experience</li>
          </ul>
        </button>

        {/* HARD */}
        <button 
          onClick={() => onStart(Difficulty.HARD)}
          className="group relative bg-gray-800 border-2 border-red-500/30 hover:border-red-500 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        >
           <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
            <LucideSkull size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">HARD MODE</h2>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-center gap-2"><span className="text-red-500">⚠</span> Expensive Prices (x1.5)</li>
            <li className="flex items-center gap-2"><span className="text-red-500">⚠</span> Slower Growth (x0.8)</li>
            <li className="flex items-center gap-2"><span className="text-red-500">⚠</span> Unforgiving</li>
          </ul>
        </button>
      </div>
    </div>
  );
};