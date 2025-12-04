import React, { useState, useEffect } from 'react';
import { generateImage } from '../../services/geminiService';
import { Loader2, Image as ImageIcon, Wand2, AlertTriangle, Sparkles, BookOpen, Save, Search, X, Tag, Filter, Trash2 } from 'lucide-react';

interface PromptEntry {
  id: string;
  title: string;
  prompt: string;
  style: string;
  category: string;
  isCustom?: boolean;
}

interface ImageGenLabProps {
  initialAction?: 'openLibrary';
}

const DEFAULT_LIBRARY: PromptEntry[] = [
  {
    id: '1',
    title: 'Neon Cyberpunk City',
    prompt: 'A futuristic city with flying cars at sunset, neon lights, cyberpunk aesthetic, rain-slicked streets, highly detailed, 8k resolution.',
    style: 'Cyberpunk',
    category: 'Environment'
  },
  {
    id: '2',
    title: 'Minimalist Tech Product',
    prompt: 'Sleek modern gadget on a white background, studio lighting, 4k resolution, product photography, minimalist design, soft shadows.',
    style: 'Minimalist',
    category: 'Marketing'
  },
  {
    id: '3',
    title: 'Corporate Portrait',
    prompt: 'Professional headshot of a diverse team leader, confident smile, blurred office background, cinematic lighting, high quality.',
    style: 'Photorealistic',
    category: 'People'
  },
  {
    id: '4',
    title: 'Abstract Data Flow',
    prompt: 'Swirling streams of glowing data particles, blue and purple gradient, 3d render, abstract visualization of internet speed, motion blur.',
    style: '3D Render',
    category: 'Abstract'
  },
  {
    id: '5',
    title: 'Luxury Perfume Bottle',
    prompt: 'Elegant glass perfume bottle on a marble surface, gold accents, soft floral elements in background, macro photography, bokeh effect.',
    style: 'Cinematic',
    category: 'Marketing'
  },
  {
    id: '6',
    title: 'Oil Painting Landscape',
    prompt: 'Rolling hills of Tuscany at golden hour, cypress trees, textured brushstrokes, vibrant colors, impressionist style, masterpiece.',
    style: 'Oil Painting',
    category: 'Environment'
  }
];

export const ImageGenLab: React.FC<ImageGenLabProps> = ({ initialAction }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Library State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryPrompts, setLibraryPrompts] = useState<PromptEntry[]>(DEFAULT_LIBRARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Handle Initial Action (Deep Linking)
  useEffect(() => {
    if (initialAction === 'openLibrary') {
        setIsLibraryOpen(true);
    }
  }, [initialAction]);

  // Derived Library Data
  const categories = ['All', 'Custom', ...Array.from(new Set(DEFAULT_LIBRARY.map(p => p.category)))];
  
  const filteredPrompts = libraryPrompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' 
        ? true 
        : selectedCategory === 'Custom' 
            ? p.isCustom 
            : p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    const fullPrompt = `${style} style. ${prompt}`;

    try {
      const imgData = await generateImage(fullPrompt);
      setGeneratedImage(imgData);
    } catch (e) {
      setError("Failed to generate image. Note: Image generation might require a specific paid tier or model access.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToLibrary = () => {
    if (!prompt) return;
    const newEntry: PromptEntry = {
      id: Date.now().toString(),
      title: `Saved Prompt ${libraryPrompts.filter(p => p.isCustom).length + 1}`,
      prompt: prompt,
      style: style,
      category: 'Marketing', // Default to marketing
      isCustom: true
    };
    setLibraryPrompts([newEntry, ...libraryPrompts]);
  };

  const handleSelectFromLibrary = (entry: PromptEntry) => {
    setPrompt(entry.prompt);
    setStyle(entry.style);
    setIsLibraryOpen(false);
  };

  const handleDeletePrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLibraryPrompts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto relative animate-slide-up">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-[#0F172A] mb-2">Visual Prompt Lab</h2>
        <p className="text-[#64748B]">Experiment with styles and adjectives to master the text-to-image pipeline.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Controls */}
        <div className="w-full lg:w-[400px] space-y-6 flex-shrink-0">
          <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center">
                    <div className="p-2 bg-[#2563EB]/10 rounded-lg mr-3">
                        <Sparkles className="text-[#2563EB] w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-[#0F172A]">Configuration</h3>
                 </div>
                 <button 
                    onClick={() => setIsLibraryOpen(true)}
                    className="flex items-center text-xs font-bold text-[#2563EB] bg-[#2563EB]/5 px-3 py-2 rounded-full hover:bg-[#2563EB]/10 transition-colors"
                 >
                    <BookOpen size={14} className="mr-1.5" /> Library
                 </button>
            </div>
            
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Visual Description</label>
            <textarea 
              className="w-full p-4 bg-[#F8FAFC] border border-transparent rounded-2xl focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all h-40 resize-none font-medium text-[#0F172A] placeholder:text-gray-400 mb-2"
              placeholder="A futuristic city with flying cars at sunset, neon lights, cyberpunk aesthetic..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="text-xs text-[#9CA3AF] mb-6">Tip: Be specific about lighting, camera angle, and mood.</p>

            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Art Style</label>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {['Cinematic', 'Photorealistic', '3D Render', 'Oil Painting', 'Cyberpunk', 'Minimalist'].map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    style === s 
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md transform scale-[1.02]' 
                    : 'bg-white text-[#475569] border-slate-100 hover:border-slate-300 hover:bg-[#F8FAFC]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:scale-[1.02] text-white font-bold py-4 rounded-full transition-all shadow-[0px_8px_20px_rgba(37,99,235,0.3)] flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2" size={18}/> Generate</>}
                </button>
                <button 
                    onClick={handleSaveToLibrary}
                    disabled={!prompt}
                    className="p-4 rounded-full bg-[#F8FAFC] text-[#475569] hover:text-[#2563EB] hover:bg-[#2563EB]/5 border border-transparent hover:border-[#2563EB]/20 transition-all disabled:opacity-50"
                    title="Save to Library"
                >
                    <Save size={20} />
                </button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-white rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-center overflow-hidden relative min-h-[500px] p-4">
          <div className="absolute top-0 left-0 w-full h-full bg-[#F8FAFC] opacity-50 z-0"></div>
          
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
               <div className="relative">
                 <div className="w-20 h-20 rounded-full border-4 border-[#F1F5F9] border-t-[#2563EB] animate-spin"></div>
                 <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2563EB]" size={24} />
               </div>
               <p className="mt-6 text-lg font-display font-bold text-[#0F172A] animate-[pulse-soft_2s_infinite]">Dreaming up your image...</p>
            </div>
          )}

          {generatedImage ? (
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl animate-fade-in group">
                <img 
                src={generatedImage} 
                alt="Generated Result" 
                className="w-full h-full object-contain bg-[#0F172A]" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                    <p className="text-white/90 text-sm font-medium line-clamp-2 w-3/4">{prompt}</p>
                    <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-white hover:text-black transition-colors">Download</button>
                </div>
            </div>
          ) : error ? (
            <div className="text-center p-8 max-w-md z-10 animate-fade-in">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="text-red-500" size={32} />
                </div>
                <h3 className="font-display font-bold text-[#0F172A] text-lg mb-2">Generation Failed</h3>
                <p className="text-[#64748B] leading-relaxed">{error}</p>
            </div>
          ) : (
            <div className="text-center text-[#94A3B8] z-10">
              <div className="w-24 h-24 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-6">
                 <ImageIcon className="opacity-40" size={40} />
              </div>
              <h3 className="font-display font-bold text-[#0F172A] text-xl mb-2">Preview Canvas</h3>
              <p className="text-sm font-medium">Your AI-generated artwork will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Library Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm transition-opacity" onClick={() => setIsLibraryOpen(false)} />
            <div className="bg-white rounded-[24px] shadow-[0px_8px_30px_rgba(0,0,0,0.12)] w-full max-w-4xl max-h-[85vh] flex flex-col relative animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] border border-white/20">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-[#0F172A]">Prompt Library</h2>
                        <p className="text-sm text-[#64748B]">Discover effective prompts or access your saved favorites.</p>
                    </div>
                    <button onClick={() => setIsLibraryOpen(false)} className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 bg-[#F8FAFC] border-b border-slate-100 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search prompts..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/50 text-sm font-medium text-[#0F172A]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedCategory === cat 
                                    ? 'bg-[#0F172A] text-white shadow-md' 
                                    : 'bg-white text-[#64748B] border border-slate-200 hover:border-[#2563EB] hover:text-[#2563EB]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
                    {filteredPrompts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-[#94A3B8]">
                            <Filter size={32} className="mb-3 opacity-50" />
                            <p className="font-medium">No prompts found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredPrompts.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectFromLibrary(item)}
                                    className="text-left bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-[#2563EB]/30 hover:-translate-y-0.5 transition-all group relative"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-[#0F172A] font-display">{item.title}</h4>
                                        <div className="flex gap-2">
                                            {item.isCustom && (
                                                <div 
                                                    onClick={(e) => handleDeletePrompt(item.id, e)}
                                                    className="p-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors z-10"
                                                >
                                                    <Trash2 size={14} />
                                                </div>
                                            )}
                                            <span className="text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] px-2 py-1 rounded-md uppercase tracking-wider border border-slate-200">
                                                {item.style}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#475569] line-clamp-3 leading-relaxed mb-3">
                                        {item.prompt}
                                    </p>
                                    <div className="flex items-center text-xs font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                                        Use this prompt <Wand2 size={12} className="ml-1" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};