import React from 'react';
import { Download, Maximize2, Trash2 } from 'lucide-react';
import { GeneratedImage } from '../types';

interface GalleryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <p className="text-lg font-medium">No creations yet</p>
        <p className="text-sm">Enter a prompt to start generating amazing visuals.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((img) => (
        <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
          <img 
            src={img.url} 
            alt={img.prompt} 
            className="w-full h-full object-cover transition-opacity duration-500"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
            <p className="text-white text-sm font-medium line-clamp-2 mb-3">{img.prompt}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                {img.settings.model === 'gemini-2.5-flash-image' ? 'FLASH' : 'PRO'} • {img.settings.aspectRatio}
              </span>
              
              <div className="flex gap-2">
                <a 
                  href={img.url} 
                  download={`lynx-${img.id}.png`}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                 <button 
                  onClick={() => onDelete(img.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg backdrop-blur-sm transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
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
