import React from 'react';
import { ViewState } from '../App';
import { Home, BookOpen, PenTool, Image as ImageIcon, Search, BarChart } from 'lucide-react';

interface SidebarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView }) => {
  const navItemClass = (isActive: boolean) => 
    `flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
      isActive 
      ? 'bg-indigo-600 text-white shadow-md' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
    }`;

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-8 flex items-center space-x-3 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <BarChart className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">MarketerAI</h1>
      </div>

      <nav className="flex-1">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Learning</h2>
          <button 
            onClick={() => onNavigate({ type: 'dashboard' })}
            className={navItemClass(currentView.type === 'dashboard')}
          >
            <Home size={20} className="mr-3" />
            <span className="font-medium">Dashboard</span>
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">AI Tools</h2>
          
          <button 
            onClick={() => onNavigate({ type: 'tool', toolName: 'campaign' })}
            className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'campaign')}
          >
            <PenTool size={20} className="mr-3" />
            <span className="font-medium">Campaign Gen</span>
          </button>

          <button 
            onClick={() => onNavigate({ type: 'tool', toolName: 'image' })}
            className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'image')}
          >
            <ImageIcon size={20} className="mr-3" />
            <span className="font-medium">Visual Lab</span>
          </button>

          <button 
            onClick={() => onNavigate({ type: 'tool', toolName: 'seo' })}
            className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'seo')}
          >
            <Search size={20} className="mr-3" />
            <span className="font-medium">SEO Analyzer</span>
          </button>
        </div>
      </nav>

      <div className="p-4 bg-slate-100 rounded-xl mt-auto">
        <h3 className="font-semibold text-slate-700 mb-1">Weekly Challenge</h3>
        <p className="text-xs text-slate-500 mb-3">Generate a retro-style sneaker ad campaign.</p>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full w-3/4"></div>
        </div>
      </div>
    </div>
  );
};