import React, { useState } from 'react';
import { analyzeSeoText } from '../../services/geminiService';
import { Loader2, Search, ThumbsUp, ArrowRight, CheckCircle, Target } from 'lucide-react';

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
    <div className="h-full max-w-5xl mx-auto animate-slide-up">
       <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-[#0F172A] mb-2">AI SEO Assistant</h2>
        <p className="text-[#64748B]">Paste your blog post or ad copy to get instant optimization suggestions.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all focus-within:ring-4 focus-within:ring-[#2563EB]/5 focus-within:border-[#2563EB]/30">
            <textarea 
                className="w-full p-8 h-48 outline-none resize-none text-[#0F172A] text-lg placeholder:text-gray-300 font-light leading-relaxed"
                placeholder="Paste your content here to begin analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="bg-[#F8FAFC] px-8 py-4 flex justify-between items-center border-t border-slate-100">
                <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">{text.split(/\s+/).filter(w => w.length > 0).length} words</span>
                <button 
                    onClick={handleAnalyze}
                    disabled={loading || !text}
                    className="bg-[#0F172A] text-white px-6 py-3 rounded-full font-bold hover:bg-[#2563EB] transition-colors disabled:opacity-50 flex items-center shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : <Search className="mr-2" size={16} />}
                    Analyze Content
                </button>
            </div>
        </div>

        {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                {/* Score Card */}
                <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 text-center flex flex-col items-center justify-center">
                    <h3 className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest mb-6">SEO Score</h3>
                    <div className="relative inline-flex items-center justify-center mb-6">
                         <svg className="w-40 h-40 transform -rotate-90">
                           <circle className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                           <circle 
                             className={result.score > 70 ? "text-[#10B981]" : result.score > 40 ? "text-[#F59E0B]" : "text-[#EF4444]"} 
                             strokeWidth="8" 
                             strokeDasharray={440}
                             strokeDashoffset={440 - (440 * result.score) / 100}
                             strokeLinecap="round"
                             stroke="currentColor" 
                             fill="transparent" 
                             r="70" 
                             cx="80" 
                             cy="80" 
                             style={{transition: 'stroke-dashoffset 1.5s ease-out'}}
                           />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-display font-bold text-[#0F172A]">{result.score}</span>
                            <span className="text-xs font-medium text-gray-400">/ 100</span>
                         </div>
                    </div>
                    <div className="inline-block px-4 py-1.5 bg-[#F8FAFC] rounded-full text-xs font-bold text-[#64748B] uppercase tracking-wide border border-slate-100">
                        {result.sentiment} Tone
                    </div>
                </div>

                {/* Suggestions */}
                <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 md:col-span-2 flex flex-col">
                    <h3 className="font-display font-bold text-[#0F172A] mb-6 flex items-center text-xl">
                        <ThumbsUp className="mr-3 text-[#2563EB]" size={20}/> 
                        Actionable Improvements
                    </h3>
                    <ul className="space-y-4 flex-1">
                        {result.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start text-[#475569] leading-relaxed p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors group cursor-default">
                                <div className="mt-1 mr-3 min-w-[20px] h-5 rounded-full bg-[#2563EB]/10 flex items-center justify-center group-hover:bg-[#2563EB]/20 transition-colors">
                                    <ArrowRight size={12} className="text-[#2563EB]" />
                                </div>
                                {imp}
                            </li>
                        ))}
                    </ul>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4 flex items-center"><Target size={14} className="mr-2"/> Keywords Detected</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.keywords.map((k, i) => (
                                <span key={i} className="flex items-center px-3 py-1.5 bg-[#10B981]/5 text-[#0F172A] rounded-lg border border-[#10B981]/20 text-sm font-medium hover:bg-[#10B981]/10 transition-colors cursor-default">
                                    <CheckCircle size={12} className="mr-1.5 text-[#10B981]" /> {k}
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