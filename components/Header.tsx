import React from 'react';
import { Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-white/5 bg-obsidian-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-lynx-500 blur-lg opacity-20 rounded-full"></div>
            <Zap className="w-8 h-8 text-lynx-500 relative z-10" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-white">
            Lynx<span className="text-lynx-500">.ai</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
             <div className="px-3 py-1 rounded-full bg-lynx-500/10 border border-lynx-500/20 text-lynx-400 text-xs font-mono">
                v1.0.0
             </div>
        </div>
      </div>
    </header>
  );
};

export default Header;