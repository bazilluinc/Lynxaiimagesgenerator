import React from 'react';
import { Zap, Diamond, Monitor, Smartphone, Square, LayoutTemplate } from 'lucide-react';
import { GenerationSettings, ModelType, AspectRatio, ImageSize } from '../types';
import { ASPECT_RATIOS, MODEL_OPTIONS } from '../constants';

interface ControlPanelProps {
  settings: GenerationSettings;
  onSettingsChange: (newSettings: GenerationSettings) => void;
  disabled: boolean;
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange, disabled, className = "" }) => {
  
  const handleModelChange = (model: ModelType) => {
    onSettingsChange({ ...settings, model });
  };

  const handleRatioChange = (aspectRatio: AspectRatio) => {
    onSettingsChange({ ...settings, aspectRatio });
  };
  
  const handleSizeChange = (imageSize: ImageSize) => {
      onSettingsChange({ ...settings, imageSize });
  }

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
    <div className={`space-y-6 ${className}`}>
      {/* Model Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Model</label>
        <div className="grid grid-cols-1 gap-3">
          {MODEL_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleModelChange(option.value)}
              disabled={disabled}
              className={`relative flex items-center p-3 rounded-xl border transition-all duration-200 text-left group
                ${settings.model === option.value 
                  ? 'bg-lynx-500/10 border-lynx-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                  : 'bg-obsidian-950 border-white/5 hover:border-white/10'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`p-2 rounded-lg mr-3 ${settings.model === option.value ? 'bg-lynx-500 text-obsidian-950' : 'bg-slate-800 text-slate-400'}`}>
                {option.value === ModelType.FLASH ? <Zap className="w-5 h-5" /> : <Diamond className="w-5 h-5" />}
              </div>
              <div>
                <div className={`font-medium ${settings.model === option.value ? 'text-lynx-100' : 'text-slate-300'}`}>
                  {option.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aspect Ratio</label>
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
      
      {/* Image Size (Pro Only) */}
       {settings.model === ModelType.PRO && (
           <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quality</label>
                 <span className="text-[10px] bg-lynx-500/20 text-lynx-300 px-1.5 py-0.5 rounded border border-lynx-500/20">PRO ONLY</span>
            </div>
            <div className="flex bg-obsidian-950 p-1 rounded-lg border border-white/5">
                {[ImageSize.SIZE_1K, ImageSize.SIZE_2K, ImageSize.SIZE_4K].map((size) => (
                    <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        disabled={disabled}
                        className={`flex-1 py-1.5 text-xs font-medium rounded transition-all
                            ${settings.imageSize === size 
                                ? 'bg-slate-800 text-white shadow-sm' 
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
           </div>
       )}
    </div>
  );
};

export default ControlPanel;