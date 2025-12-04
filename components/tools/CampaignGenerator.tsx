import React, { useState } from 'react';
import { generateCampaignContent } from '../../services/geminiService';
import { GeneratedCampaign } from '../../types';
import { Loader2, Copy, Share2, Layout, Video, Hash, Sparkles } from 'lucide-react';

export const CampaignGenerator: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedCampaign | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const jsonString = await generateCampaignContent(brandName, productDesc, audience);
      const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      setResult({
        script: data.script,
        socialPosts: data.social_posts || [],
        seoKeywords: data.seo_keywords || []
      });
    } catch (error) {
      console.error("Failed to generate campaign", error);
      alert("Failed to generate campaign. Please ensure your API Key is set and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-slide-up">
      {/* Input Section */}
      <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 h-fit">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#2563EB]/10 rounded-xl mb-4">
            <Sparkles className="text-[#2563EB] w-6 h-6" />
          </div>
          <h2 className="text-3xl font-display font-bold text-[#0F172A] mb-2">Campaign Generator</h2>
          <p className="text-[#64748B]">Instantly generate scripts, social copy, and SEO keywords for your brand.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-2">Brand Name</label>
            <input 
              type="text" 
              required
              className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all font-medium text-[#0F172A] placeholder:text-gray-400"
              placeholder="e.g., EcoStride"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-2">Product Description</label>
            <textarea 
              required
              className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all h-32 font-medium text-[#0F172A] placeholder:text-gray-400 resize-none"
              placeholder="Describe the features and benefits..."
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-2">Target Audience</label>
            <input 
              type="text" 
              required
              className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all font-medium text-[#0F172A] placeholder:text-gray-400"
              placeholder="e.g., Urban professionals, 25-35"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:scale-[1.02] text-white font-bold py-4 rounded-full transition-all shadow-[0px_0px_15px_rgba(37,99,235,0.4)] flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 relative overflow-hidden"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Creating Magic...
              </>
            ) : (
              'Generate Campaign Assets'
            )}
          </button>
        </form>
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        {!result && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-[#94A3B8] border-2 border-dashed border-[#E2E8F0] rounded-[24px] p-12 bg-white/50">
            <Layout size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Campaign assets will appear here</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in space-y-6">
            {/* Script Card */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 group hover:border-[#2563EB]/30 transition-all hover:shadow-lg duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-[#0F172A] flex items-center text-xl"><Video className="mr-3 text-[#2563EB]" size={20}/> Video Script</h3>
                <button className="text-[#94A3B8] hover:text-[#2563EB] transition-colors p-2 hover:bg-[#EFF6FF] rounded-full"><Copy size={18} /></button>
              </div>
              <div className="bg-[#F8FAFC] p-6 rounded-2xl text-sm font-mono whitespace-pre-wrap text-[#475569] border border-transparent group-hover:border-[#2563EB]/10 transition-colors leading-relaxed">
                {result.script}
              </div>
            </div>

            {/* Social Posts */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100">
               <h3 className="font-display font-bold text-[#0F172A] mb-6 flex items-center text-xl"><Share2 className="mr-3 text-[#06B6D4]" size={20}/> Social Copy</h3>
               <div className="space-y-4">
                 {result.socialPosts.map((post, idx) => (
                   <div key={idx} className="bg-[#F8FAFC] p-5 rounded-2xl border border-transparent hover:border-[#06B6D4]/20 transition-all hover:bg-white hover:shadow-sm">
                     <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest bg-white px-2 py-1 rounded-md shadow-sm mb-3 inline-block">{post.platform}</span>
                     <p className="mt-1 text-[#0F172A] font-medium leading-relaxed">{post.content}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* SEO Keywords */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100">
               <h3 className="font-display font-bold text-[#0F172A] mb-6 flex items-center text-xl"><Hash className="mr-3 text-[#10B981]" size={20}/> SEO Targets</h3>
               <div className="flex flex-wrap gap-3">
                 {result.seoKeywords.map((kw, idx) => (
                   <span key={idx} className="px-4 py-2 bg-[#10B981]/10 text-[#065F46] rounded-full text-sm font-bold border border-[#10B981]/20 hover:scale-105 transition-transform cursor-default">
                     #{kw}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};