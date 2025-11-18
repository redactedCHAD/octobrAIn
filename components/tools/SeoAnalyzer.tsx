import React, { useState } from 'react';
import { analyzeSeoText } from '../../services/geminiService';
import { Loader2, Search, ThumbsUp, ArrowRight, CheckCircle } from 'lucide-react';

interface AnalysisResult {
    score: number;
    sentiment: string;
    keywords: string[];
    improvements: string[];
}

export const SeoAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    setResult(null);
    try {
      const jsonStr = await analyzeSeoText(text);
      const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      setResult({
        score: data.score || 0,
        sentiment: data.sentiment || 'Neutral',
        keywords: data.keywords_detected || [],
        improvements: data.improvements || []
      });
    } catch (e) {
      console.error(e);
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full max-w-4xl mx-auto">
       <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">AI SEO Assistant</h2>
        <p className="text-slate-500">Paste your blog post or ad copy to get instant optimization suggestions.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <textarea 
                className="w-full p-6 h-48 outline-none resize-none text-slate-700 text-lg placeholder:text-slate-300"
                placeholder="Paste your content here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="bg-slate-50 px-6 py-3 flex justify-between items-center border-t border-slate-200">
                <span className="text-xs text-slate-400 font-medium">{text.split(/\s+/).filter(w => w.length > 0).length} words</span>
                <button 
                    onClick={handleAnalyze}
                    disabled={loading || !text}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : <Search className="mr-2" size={16} />}
                    Analyze
                </button>
            </div>
        </div>

        {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                {/* Score Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">SEO Score</h3>
                    <div className="relative inline-flex items-center justify-center">
                         <svg className="w-32 h-32">
                           <circle className="text-slate-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="50" cx="64" cy="64" />
                           <circle 
                             className={result.score > 70 ? "text-green-500" : result.score > 40 ? "text-amber-500" : "text-red-500"} 
                             strokeWidth="10" 
                             strokeDasharray={314}
                             strokeDashoffset={314 - (314 * result.score) / 100}
                             strokeLinecap="round"
                             stroke="currentColor" 
                             fill="transparent" 
                             r="50" 
                             cx="64" 
                             cy="64" 
                             style={{transition: 'stroke-dashoffset 1s ease-in-out'}}
                           />
                         </svg>
                         <span className="absolute text-3xl font-bold text-slate-800">{result.score}</span>
                    </div>
                    <div className="mt-4 inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase">
                        {result.sentiment} Tone
                    </div>
                </div>

                {/* Suggestions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <ThumbsUp className="mr-2 text-indigo-500" size={18}/> 
                        Actionable Improvements
                    </h3>
                    <ul className="space-y-3 flex-1">
                        {result.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-600">
                                <ArrowRight size={16} className="mr-2 mt-0.5 text-indigo-400 flex-shrink-0" />
                                {imp}
                            </li>
                        ))}
                    </ul>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Keywords Detected</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.keywords.map((k, i) => (
                                <span key={i} className="flex items-center px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100 text-xs">
                                    <CheckCircle size={12} className="mr-1" /> {k}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};