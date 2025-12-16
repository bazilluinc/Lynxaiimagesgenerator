import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Gallery from './components/Gallery';
import { GenerationSettings, GeneratedImage, GenerationState, ModelType, AspectRatio, ImageSize } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { generateImage } from './services/geminiService';
import { Wand2, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lynx_history');
    if (saved) {
      try {
        setGeneratedImages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('lynx_history', JSON.stringify(generatedImages));
  }, [generatedImages]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || generationState.isGenerating) return;

    setGenerationState({ isGenerating: true, error: null });

    try {
      const imageUrls = await generateImage(prompt, settings);
      
      const newImages: GeneratedImage[] = imageUrls.map(url => ({
        id: crypto.randomUUID(),
        url,
        prompt,
        settings: { ...settings },
        createdAt: Date.now(),
      }));

      setGeneratedImages(prev => [...newImages, ...prev]);
    } catch (err: any) {
      setGenerationState({
        isGenerating: false,
        error: err.message || "Something went wrong during generation.",
      });
    } finally {
      setGenerationState(prev => ({ ...prev, isGenerating: false }));
    }
  };
  
  const handleDelete = (id: string) => {
      setGeneratedImages(prev => prev.filter(img => img.id !== id));
  };

  const clearError = () => {
    setGenerationState(prev => ({ ...prev, error: null }));
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-lynx-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Controls & Input (Mobile: Top, Desktop: Sticky Left) */}
          <div className="w-full lg:w-[380px] flex-shrink-0 space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              
              {/* Prompt Input */}
              <form onSubmit={handleGenerate} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-lynx-600 to-lynx-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-obsidian-900 rounded-2xl p-1 border border-white/10 shadow-2xl">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your imagination... (e.g., A cyberpunk cat in neon rain)"
                        className="w-full bg-obsidian-950/50 text-white placeholder-slate-500 rounded-xl p-4 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-lynx-500/50 resize-none font-medium leading-relaxed"
                        disabled={generationState.isGenerating}
                    />
                    <div className="p-2 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-mono pl-2">
                             {prompt.length} chars
                        </span>
                        <button
                            type="submit"
                            disabled={!prompt.trim() || generationState.isGenerating}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300
                                ${!prompt.trim() || generationState.isGenerating 
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-lynx-500 to-lynx-600 hover:from-lynx-400 hover:to-lynx-500 text-obsidian-950 shadow-lg shadow-lynx-500/20 hover:shadow-lynx-500/40 transform hover:-translate-y-0.5'
                                }`}
                        >
                            {generationState.isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" />
                                    <span>Generate</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
              </form>

              {/* Error Message */}
              {generationState.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-red-400 text-sm font-bold">Generation Failed</h3>
                    <p className="text-red-300/80 text-xs mt-1 leading-relaxed">{generationState.error}</p>
                  </div>
                  <button onClick={clearError} className="text-red-400 hover:text-red-300">
                    <span className="sr-only">Dismiss</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Settings Panel */}
              <ControlPanel 
                settings={settings} 
                onSettingsChange={setSettings} 
                disabled={generationState.isGenerating}
              />
              
              <div className="text-xs text-center text-slate-600 leading-relaxed px-4">
                  By using Lynx, you agree to generate content responsibly. 
                  Images are generated by AI and may contain artifacts.
              </div>
            </div>
          </div>

          {/* Right Column: Gallery */}
          <div className="flex-1 min-w-0">
             <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                     <Sparkles className="w-5 h-5 text-lynx-500" />
                     Recent Creations
                 </h2>
                 {generatedImages.length > 0 && (
                     <span className="text-sm text-slate-400 font-mono">
                         {generatedImages.length} result{generatedImages.length !== 1 ? 's' : ''}
                     </span>
                 )}
             </div>
             
             <Gallery images={generatedImages} onDelete={handleDelete} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
