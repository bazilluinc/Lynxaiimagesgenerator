import React from 'react';
import { Square, LayoutTemplate, Monitor, Smartphone } from 'lucide-react';
import { GenerationSettings, AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface ControlPanelProps {
  settings: GenerationSettings;
  onSettingsChange: (newSettings: GenerationSettings) => void;
  disabled: boolean;
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange, disabled, className = "" }) => {

  const handleRatioChange = (aspectRatio: AspectRatio) => {
    onSettingsChange({ ...settings, aspectRatio });
  };
  
  const getIcon = (iconName: string) => {
    switch(iconName) {
        case 'Square': return <Square className="w-4 h-4" />;
        case 'RectangleHorizontal': return <LayoutTemplate className="w-4 h-4 rotate-90" />;
        case 'RectangleVertical': return <LayoutTemplate className="w-4 h-4" />;
        case 'Monitor': return <Monitor className="w-4 h-4" />;
        case 'Smartphone': return <Smartphone className="w-4 h-4" />;
        default: return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Aspect Ratio */}
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Aspect Ratio</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => handleRatioChange(ratio.value)}
              disabled={disabled}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-xs gap-2
                ${settings.aspectRatio === ratio.value 
                  ? 'bg-lynx-500/20 border-lynx-500/50 text-lynx-100' 
                  : 'bg-obsidian-950 border-white/5 text-slate-400 hover:bg-slate-900'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {getIcon(ratio.icon)}
              <span>{ratio.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;