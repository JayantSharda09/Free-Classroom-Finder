import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, resetToDemoData } = useApp();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">Free Classroom Finder</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              A centralized campus classroom availability system designed to eliminate physical searches and optimize room utilization based on active academic timetables.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Live Timetable Engine Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm tracking-wide">Quick Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Campus Landing Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('find')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Search Available Classrooms
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-teal-400 transition-colors"
                >
                  My Search History
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-teal-400 transition-colors"
                >
                  System Architecture & About
                </button>
              </li>
            </ul>
          </div>

          {/* Administration & System */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm tracking-wide">Administration</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin-classrooms')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Classroom Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin-timetable')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Timetable Schedules
                </button>
              </li>
              <li>
                <button
                  onClick={resetToDemoData}
                  className="hover:text-amber-400 transition-colors"
                >
                  Reset Demo Database
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <p>© 2026 Free Classroom Finder. Software Engineering Capstone Project.</p>
          <p>Built for university campus efficiency. Interval-overlap timetable algorithm enabled.</p>
        </div>
      </div>
    </footer>
  );
};
