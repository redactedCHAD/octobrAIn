import React from 'react';
import { Course } from '../types';
import { ViewState } from '../App';
import { PlayCircle, Clock, Award, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  courses: Course[];
  onNavigate: (view: ViewState) => void;
}

const data = [
  { name: 'Writing', score: 85 },
  { name: 'SEO', score: 65 },
  { name: 'Visuals', score: 92 },
  { name: 'Strategy', score: 70 },
];

export const Dashboard: React.FC<DashboardProps> = ({ courses, onNavigate }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Alex</h1>
        <p className="text-slate-500">Continue your journey in AI Marketing Mastery.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-6 flex items-center">
            <Award className="mr-2 text-indigo-600" size={20} />
            Skill Assessment
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-md text-white">
                <h3 className="text-indigo-100 font-medium mb-1">Course Progress</h3>
                <div className="text-4xl font-bold mb-4">72%</div>
                <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full w-[72%]"></div>
                </div>
                <p className="mt-4 text-sm text-indigo-100">Keep going! You're almost at the certification level.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4">Next Up</h3>
                <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                        <Clock className="text-orange-600" size={20} />
                    </div>
                    <div>
                        <h4 className="font-medium text-slate-900">Prompt Engineering Lab</h4>
                        <p className="text-sm text-slate-500 mb-2">Visual Asset Creation</p>
                        <button 
                            onClick={() => onNavigate({type: 'course', courseId: 'marketing-ai-101', moduleId: 'm2-visuals'})}
                            className="text-indigo-600 text-sm font-medium hover:underline"
                        >
                            Resume Module
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Active Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => (
            <div key={course.id} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 overflow-hidden relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">{course.modules.length} Modules</span>
                  <button 
                    onClick={() => onNavigate({ type: 'course', courseId: course.id })}
                    className="flex items-center text-indigo-600 font-semibold text-sm hover:text-indigo-800"
                  >
                    Start Learning <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};