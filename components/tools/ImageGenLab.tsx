import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import { Loader2, Image as ImageIcon, Wand2, AlertTriangle } from 'lucide-react';

export const ImageGenLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Visual Prompt Lab</h2>
        <p className="text-slate-500">Experiment with styles and adjectives to master the text-to-image pipeline.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Controls */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Prompt</label>
            <textarea 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
              placeholder="Describe the image in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-2">Tip: Mention lighting, camera angle, and mood.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Style Preset</label>
            <div className="grid grid-cols-2 gap-2">
              {['Cinematic', 'Photorealistic', '3D Render', 'Oil Painting', 'Cyberpunk', 'Minimalist'].map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    style === s 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2" size={18}/> Generate Visual</>}
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
               <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                 <div className="w-1/2 h-full bg-indigo-600 animate-sidebar-loading"></div>
               </div>
               <p className="mt-4 text-sm text-indigo-600 font-medium animate-pulse">Diffusing noise...</p>
            </div>
          )}

          {generatedImage ? (
            <img 
              src={generatedImage} 
              alt="Generated Result" 
              className="w-full h-full object-contain" 
            />
          ) : error ? (
            <div className="text-center p-8 max-w-md">
                <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
                <p className="text-slate-600 font-medium">{error}</p>
            </div>
          ) : (
            <div className="text-center text-slate-400">
              <ImageIcon className="mx-auto mb-3 opacity-50" size={64} />
              <p className="font-medium">Preview Canvas</p>
              <p className="text-sm">Your AI-generated artwork will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};