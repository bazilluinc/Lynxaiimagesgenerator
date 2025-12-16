import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { GeneratedImage } from '../types';

interface GalleryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-500 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <p className="text-sm font-medium">No creations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {images.map((img) => (
        <div key={img.id} className="group relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow-lg hover:border-lynx-500/30 transition-all">
          <div className="aspect-square w-full">
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
          </div>
          
          <div className="p-3 bg-obsidian-950/50 backdrop-blur-sm border-t border-white/5">
             <p className="text-white text-xs font-medium line-clamp-2 mb-2 opacity-80">{img.prompt}</p>
             <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                    {img.settings.model.includes('flash') ? 'FLASH' : 'PRO'} • {img.settings.aspectRatio}
                </span>
                <div className="flex gap-1">
                    <a 
                      href={img.url} 
                      download={`lynx-${img.id}.png`}
                      className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                     <button 
                      onClick={() => onDelete(img.id)}
                      className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;