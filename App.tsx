import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Gallery from './components/Gallery';
import { GenerationSettings, GeneratedImage, GenerationState, AspectRatio } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { generateImage } from './services/geminiService';
import { Wand2, Loader2, AlertCircle, ChevronDown, ChevronUp, History } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
  });
  const [showSettings, setShowSettings] = useState(false);

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

      // Add to start of list
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

  const handleSettingsChange = (newSettings: GenerationSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
  };

  return (
    <div className="flex h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-lynx-500/30 overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 overflow-y-auto relative flex flex-col items-center justify-start p-6">
          <div className="w-full max-w-2xl mt-[10vh] space-y-6">
            
            <div className="text-center space-y-2 mb-8">
               <h2 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  Imagine Anything
               </h2>
               <p className="text-slate-400 text-lg">Turn your words into stunning visuals in seconds.</p>
            </div>

            {/* Prompt & Controls Container */}
            <div className="relative z-10">
              <form onSubmit={handleGenerate} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-lynx-600 to-lynx-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                  <div className="relative bg-obsidian-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                      <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="A futuristic city with flying cars in a neon sunset..."
                          className="w-full bg-transparent text-white placeholder-slate-500 p-5 min-h-[120px] focus:outline-none resize-none font-medium text-lg leading-relaxed"
                          disabled={generationState.isGenerating}
                      />
                      
                      {/* Toolbar within the input box */}
                      <div className="bg-obsidian-950/50 backdrop-blur-md border-t border-white/5 p-2 flex items-center justify-between">
                          <button
                             type="button"
                             onClick={() => setShowSettings(!showSettings)}
                             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                ${showSettings ? 'bg-white/10 text-lynx-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                             `}
                          >
                             {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                             <span>Settings</span>
                          </button>

                          <div className="flex items-center gap-3">
                             <span className="text-xs text-slate-500 font-mono hidden sm:block">
                                  {prompt.length} chars
                             </span>
                             <button
                                  type="submit"
                                  disabled={!prompt.trim() || generationState.isGenerating}
                                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all duration-300
                                      ${!prompt.trim() || generationState.isGenerating 
                                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                          : 'bg-lynx-500 hover:bg-lynx-400 text-obsidian-950 shadow-lg shadow-lynx-500/20'
                                      }`}
                              >
                                  {generationState.isGenerating ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                      <Wand2 className="w-4 h-4" />
                                  )}
                                  <span>Generate</span>
                              </button>
                          </div>
                      </div>
                  </div>
              </form>

              {/* Popout Settings Panel */}
              {showSettings && (
                  <div className="mt-2 p-5 bg-obsidian-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in slide-in-from-top-2 fade-in duration-200">
                      <ControlPanel 
                          settings={settings} 
                          onSettingsChange={handleSettingsChange} 
                          disabled={generationState.isGenerating}
                      />
                  </div>
              )}
            </div>

            {/* Error Display */}
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
              
             <div className="text-xs text-center text-slate-600 mt-8">
                  Powered by Gemini 2.5 Flash
             </div>

          </div>
        </main>
      </div>

      {/* Right Sidebar - History/Gallery */}
      <aside className="w-80 border-l border-white/5 bg-obsidian-900/50 hidden md:flex flex-col">
         <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <History className="w-4 h-4 text-lynx-500" />
            <h2 className="font-semibold text-slate-200">Recent Creations</h2>
            <span className="ml-auto text-xs bg-white/5 px-2 py-0.5 rounded-full text-slate-400">
                {generatedImages.length}
            </span>
         </div>
         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <Gallery images={generatedImages} onDelete={handleDelete} />
         </div>
      </aside>
    </div>
  );
};

export default App;