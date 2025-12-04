import React, { useState, useEffect } from 'react';
import { Course, Module, QuizQuestion } from '../types';
import { CheckCircle, PlayCircle, FileText, HelpCircle, ChevronRight, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface CourseViewProps {
  course: Course;
  initialModuleId?: string;
}

export const CourseView: React.FC<CourseViewProps> = ({ course, initialModuleId }) => {
  const [activeModule, setActiveModule] = useState<Module>(course.modules[0]);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (initialModuleId) {
      const found = course.modules.find(m => m.id === initialModuleId);
      if (found) setActiveModule(found);
    }
  }, [initialModuleId, course.modules]);

  const handleModuleChange = (mod: Module) => {
    if (mod.id === activeModule.id) return;
    setIsChanging(true);
    setTimeout(() => {
        setActiveModule(mod);
        setIsChanging(false);
        // Scroll top of content
        const contentArea = document.getElementById('module-content-area');
        if(contentArea) contentArea.scrollTop = 0;
    }, 200);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] animate-slide-up">
      {/* Content Area */}
      <div id="module-content-area" className="flex-1 bg-white rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 overflow-y-auto p-8 md:p-10 relative scroll-smooth">
        <div className={`max-w-3xl mx-auto transition-opacity duration-200 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center space-x-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider">{course.title}</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Module {course.modules.findIndex(m => m.id === activeModule.id) + 1}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[#0F172A] mb-8 leading-tight">{activeModule.title}</h1>
          
          {/* Simulated Content Rendering */}
          <div className="prose prose-lg prose-slate max-w-none mb-12 font-light text-[#334155]">
             {activeModule.content.split('\n').map((line, i) => {
                 if (line.startsWith('###')) return <h3 key={i} className="text-2xl font-display font-bold mt-10 mb-4 text-[#0F172A]">{line.replace('###', '')}</h3>;
                 if (line.startsWith('1.')) return <div key={i} className="ml-4 mb-3 flex items-start"><span className="font-bold mr-3 text-[#2563EB]">{line.substring(0, 2)}</span><span className="text-[#334155]">{line.substring(2)}</span></div>;
                 if (line.startsWith('*')) return <li key={i} className="ml-6 mb-2 list-disc marker:text-[#2563EB] text-[#334155]">{line.replace('*', '')}</li>;
                 if (line.trim() === '') return <br key={i} />;
                 return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
             })}
          </div>

          {/* Quiz Section */}
          {activeModule.quiz && (
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-[24px] p-8 mt-12 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-[#2563EB] rounded-lg mr-3 shadow-lg shadow-blue-500/30">
                    <HelpCircle className="text-white w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#0F172A]">Knowledge Check</h3>
              </div>
              {activeModule.quiz.map((q, idx) => (
                <QuizItem key={q.id} question={q} index={idx} />
              ))}
            </div>
          )}

          {activeModule.type === 'lab' && (
            <div className="bg-gradient-to-br from-[#F59E0B]/5 to-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-[24px] p-8 mt-8 flex flex-col sm:flex-row items-start gap-5 animate-fade-in hover:shadow-lg transition-shadow">
                <div className="p-3 bg-[#F59E0B] rounded-xl shadow-lg shadow-orange-500/20 text-white flex-shrink-0">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2 font-display">Interactive Lab Required</h3>
                    <p className="text-[#475569] mb-5 text-sm leading-relaxed">This module requires you to use the AI Tools to complete the assignment. The best way to learn is by doing.</p>
                    <div className="inline-flex items-center text-[#B45309] text-sm font-bold bg-white px-5 py-2.5 rounded-full shadow-sm border border-[#F59E0B]/10 hover:bg-[#FFFBEB] transition-colors cursor-pointer">
                        Go to AI Tools in Sidebar <ArrowRight size={14} className="ml-2" />
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Module List */}
      <div className="w-full lg:w-[340px] bg-white rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden h-fit max-h-full">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-display font-bold text-lg text-[#0F172A]">Course Modules</h3>
          <p className="text-xs text-[#64748B] mt-1 font-medium">{course.modules.length} lessons • 2h 15m total</p>
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {course.modules.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => handleModuleChange(mod)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-start group relative overflow-hidden ${
                activeModule.id === mod.id 
                ? 'bg-[#EFF6FF]' 
                : 'hover:bg-slate-50 hover:shadow-sm'
              }`}
            >
              {activeModule.id === mod.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#2563EB] rounded-r-full"></div>}
              
              <div className={`mt-0.5 mr-4 flex-shrink-0 transition-colors ${activeModule.id === mod.id ? 'text-[#2563EB]' : 'text-[#CBD5E1] group-hover:text-[#94A3B8]'}`}>
                {mod.type === 'video' && <PlayCircle size={20} strokeWidth={activeModule.id === mod.id ? 2.5 : 2} />}
                {mod.type === 'reading' && <FileText size={20} strokeWidth={activeModule.id === mod.id ? 2.5 : 2} />}
                {mod.type === 'lab' && <CheckCircle size={20} strokeWidth={activeModule.id === mod.id ? 2.5 : 2} />}
              </div>
              <div className="flex-1">
                <span className={`text-[15px] font-bold block mb-1 font-display transition-colors ${activeModule.id === mod.id ? 'text-[#2563EB]' : 'text-[#64748B] group-hover:text-[#0F172A]'}`}>
                  {idx + 1}. {mod.title}
                </span>
                <span className="text-xs text-[#94A3B8] font-medium">{mod.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizItem: React.FC<{ question: QuizQuestion; index: number }> = ({ question, index }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="mb-8 last:mb-0">
      <p className="font-bold text-[#0F172A] mb-4 text-lg">{index + 1}. {question.question}</p>
      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={isSubmitted}
            onClick={() => setSelected(idx)}
            className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
              isSubmitted
                ? idx === question.correctAnswer
                  ? 'bg-[#10B981]/10 border-[#10B981] text-[#065F46]'
                  : idx === selected
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'bg-white border-transparent text-slate-400'
                : selected === idx
                ? 'bg-white border-[#2563EB] text-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,0.1)]'
                : 'bg-white border-transparent hover:bg-white hover:border-slate-200 hover:shadow-md text-[#475569]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!isSubmitted && selected !== null && (
        <button 
          onClick={() => setIsSubmitted(true)}
          className="mt-5 text-sm font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-8 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-blue-500/25"
        >
          Submit Answer
        </button>
      )}
      {isSubmitted && (
        <div className={`mt-5 p-5 rounded-2xl text-sm flex items-start animate-fade-in ${isCorrect ? 'bg-[#10B981]/10 text-[#065F46]' : 'bg-red-50 text-red-800'}`}>
            <div className={`mr-3 mt-0.5 p-1 rounded-full ${isCorrect ? 'bg-[#10B981] text-white' : 'bg-red-500 text-white'}`}>
                {isCorrect ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            </div>
            <div>
                <span className="font-bold block mb-1 text-base">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                <p className="opacity-90 leading-relaxed">{question.explanation}</p>
            </div>
        </div>
      )}
    </div>
  );
};