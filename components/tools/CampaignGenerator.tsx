import React, { useState } from 'react';
import { generateCampaignContent } from '../../services/geminiService';
import { GeneratedCampaign } from '../../types';
import { Loader2, Copy, Share2, Layout, Video, Hash } from 'lucide-react';

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
      // Basic cleanup in case model wraps in markdown code block
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Mini-Campaign Generator</h2>
          <p className="text-slate-500 text-sm">Project Module 1: Create a full asset package.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g., EcoStride"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Description</label>
            <textarea 
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32"
              placeholder="Describe the product features, benefits, and USP..."
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g., Urban professionals aged 25-35"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Generating Assets...
              </>
            ) : (
              'Generate Campaign'
            )}
          </button>
        </form>
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        {!result && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-12">
            <Layout size={48} className="mb-4 opacity-20" />
            <p>Campaign assets will appear here</p>
          </div>
        )}

        {result && (
          <>
            {/* Script Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center"><Video className="mr-2 text-indigo-500" size={18}/> Video Script (30s)</h3>
                <button className="text-slate-400 hover:text-indigo-600"><Copy size={16} /></button>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap text-slate-700 border border-slate-200">
                {result.script}
              </div>
            </div>

            {/* Social Posts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Share2 className="mr-2 text-pink-500" size={18}/> Social Copy</h3>
               <div className="space-y-4">
                 {result.socialPosts.map((post, idx) => (
                   <div key={idx} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{post.platform}</span>
                     <p className="mt-1 text-slate-800">{post.content}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* SEO Keywords */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Hash className="mr-2 text-green-500" size={18}/> SEO Targets</h3>
               <div className="flex flex-wrap gap-2">
                 {result.seoKeywords.map((kw, idx) => (
                   <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                     {kw}
                   </span>
                 ))}
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};