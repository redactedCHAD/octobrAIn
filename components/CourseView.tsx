import React, { useState, useEffect } from 'react';
import { Course, Module, QuizQuestion } from '../types';
import { CheckCircle, PlayCircle, FileText, HelpCircle, ChevronRight, AlertCircle } from 'lucide-react';

interface CourseViewProps {
  course: Course;
  initialModuleId?: string;
}

export const CourseView: React.FC<CourseViewProps> = ({ course, initialModuleId }) => {
  const [activeModule, setActiveModule] = useState<Module>(course.modules[0]);

  useEffect(() => {
    if (initialModuleId) {
      const found = course.modules.find(m => m.id === initialModuleId);
      if (found) setActiveModule(found);
    }
  }, [initialModuleId, course.modules]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
      {/* Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          <span className="text-sm font-semibold text-indigo-600 mb-2 block uppercase tracking-wider">{course.title}</span>
          <h1 className="text-3xl font-bold text-slate-900 mb-6">{activeModule.title}</h1>
          
          {/* Simulated Content Rendering */}
          <div className="prose prose-slate max-w-none mb-12">
             {activeModule.content.split('\n').map((line, i) => {
                 if (line.startsWith('###')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-slate-800">{line.replace('###', '')}</h3>;
                 if (line.startsWith('1.')) return <div key={i} className="ml-4 mb-2 flex items-start"><span className="font-bold mr-2">{line.substring(0, 2)}</span><span>{line.substring(2)}</span></div>;
                 if (line.startsWith('*')) return <li key={i} className="ml-4 mb-2 list-disc">{line.replace('*', '')}</li>;
                 if (line.trim() === '') return <br key={i} />;
                 return <p key={i} className="mb-4 text-slate-600 leading-relaxed">{line}</p>;
             })}
          </div>

          {/* Quiz Section */}
          {activeModule.quiz && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <HelpCircle className="text-indigo-600 mr-2" />
                <h3 className="text-lg font-bold text-indigo-900">Knowledge Check</h3>
              </div>
              {activeModule.quiz.map((q, idx) => (
                <QuizItem key={q.id} question={q} index={idx} />
              ))}
            </div>
          )}

          {activeModule.type === 'lab' && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-bold text-amber-900 mb-2">Interactive Lab Required</h3>
                <p className="text-amber-800 mb-4">This module requires you to use the AI Tools to complete the assignment.</p>
                <p className="text-sm text-amber-700">Go to <strong>AI Tools</strong> in the sidebar to access the Campaign Generator or Visual Lab.</p>
            </div>
          )}
        </div>
      </div>

      {/* Module List */}
      <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Course Modules</h3>
          <p className="text-xs text-slate-500">{course.modules.length} lessons • 2h 15m total</p>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {course.modules.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod)}
              className={`w-full text-left p-3 rounded-lg transition-all flex items-start group ${
                activeModule.id === mod.id 
                ? 'bg-indigo-50 border-indigo-200' 
                : 'hover:bg-slate-50 border-transparent'
              } border`}
            >
              <div className={`mt-1 mr-3 flex-shrink-0 ${activeModule.id === mod.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                {mod.type === 'video' && <PlayCircle size={18} />}
                {mod.type === 'reading' && <FileText size={18} />}
                {mod.type === 'lab' && <CheckCircle size={18} />}
              </div>
              <div>
                <span className={`text-sm font-medium block mb-1 ${activeModule.id === mod.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {idx + 1}. {mod.title}
                </span>
                <span className="text-xs text-slate-400">{mod.duration}</span>
              </div>
              {activeModule.id === mod.id && <ChevronRight size={16} className="ml-auto mt-1 text-indigo-400" />}
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
    <div className="mb-6 last:mb-0">
      <p className="font-medium text-slate-800 mb-3">{index + 1}. {question.question}</p>
      <div className="space-y-2">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={isSubmitted}
            onClick={() => setSelected(idx)}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm border transition-all ${
              isSubmitted
                ? idx === question.correctAnswer
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : idx === selected
                  ? 'bg-red-100 border-red-300 text-red-800'
                  : 'bg-white border-slate-200 text-slate-400'
                : selected === idx
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 ring-1 ring-indigo-300'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!isSubmitted && selected !== null && (
        <button 
          onClick={() => setIsSubmitted(true)}
          className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Submit Answer
        </button>
      )}
      {isSubmitted && (
        <div className={`mt-3 p-3 rounded-lg text-sm flex items-start ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="mr-2 mt-0.5">
                {isCorrect ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            </div>
            <div>
                <span className="font-bold block mb-1">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                {question.explanation}
            </div>
        </div>
      )}
    </div>
  );
};