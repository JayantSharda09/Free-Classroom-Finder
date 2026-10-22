import React from 'react';
import { useApp } from '../context/AppContext';
import { Info, GraduationCap, ShieldCheck, Zap, Layers, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="space-y-12 py-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About Free Classroom Finder
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Centralized campus availability software designed to eliminate physical corridor checks and maximize academic space utilization.
        </p>
      </div>

      {/* System Purpose & Mission */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 glass-panel">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-teal-400" />
          System Purpose & Mission
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Students frequently spend 15 to 30 minutes between lectures wandering around building floors attempting to locate an empty classroom for study groups, project discussions, or individual study. Physical checks disrupt ongoing lectures and waste student study time.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong>Free Classroom Finder</strong> bridges this gap by correlating master course timetables with room schedules. It performs instant interval-overlap checks across every campus building and presents only classrooms that remain 100% unoccupied for the user's target timeframe.
        </p>
      </div>

      {/* Scope Boundaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
          <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Core Capabilities Included
          </h3>
          <ul className="text-xs text-emerald-100/90 space-y-2">
            <li>✓ Date and 24-hour interval availability search</li>
            <li>✓ Strict interval-overlap algorithm (`max(reqStart, entryStart) &lt; min(reqEnd, entryEnd)`)</li>
            <li>✓ Multi-building, floor, and seating capacity filtering</li>
            <li>✓ Detailed daily schedule timeline (08:00 - 20:00)</li>
            <li>✓ Administrator dashboard with conflict detection on schedule creation</li>
            <li>✓ Search history log &amp; one-click repeat search</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            Scope Restrictions
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            By design, this initial release excludes complex extra modules such as indoor GPS navigation, IoT real-time occupancy hardware sensors, faculty live tracking, payment gateways, or room reservation systems.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            It strictly focuses on fast, reliable, timetable-based classroom availability.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => setActiveTab('find')}
          className="py-3.5 px-8 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs rounded-xl shadow-xl transition-transform hover:scale-105 inline-flex items-center gap-2"
        >
          <span>Find Available Classrooms Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
