import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CourseView } from './components/CourseView';
import { CampaignGenerator } from './components/tools/CampaignGenerator';
import { ImageGenLab } from './components/tools/ImageGenLab';
import { SeoAnalyzer } from './components/tools/SeoAnalyzer';
import { Course, Module } from './types';
import { COURSES } from './constants';
import { Menu } from 'lucide-react';

// Simple view router state type
export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'course'; courseId: string; moduleId?: string }
  | { type: 'tool'; toolName: 'campaign' | 'image' | 'seo' };

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'dashboard' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (currentView.type) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} courses={COURSES} />;
      case 'course':
        const course = COURSES.find(c => c.id === currentView.courseId);
        if (!course) return <div>Course not found</div>;
        return <CourseView course={course} initialModuleId={currentView.moduleId} />;
      case 'tool':
        switch (currentView.toolName) {
          case 'campaign': return <CampaignGenerator />;
          case 'image': return <ImageGenLab />;
          case 'seo': return <SeoAnalyzer />;
          default: return <div>Tool not found</div>;
        }
      default:
        return <Dashboard onNavigate={handleNavigate} courses={COURSES} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 shadow-sm md:hidden flex items-center p-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-lg text-indigo-600">MarketerAI</span>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;