import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckCircle2,
  Filter,
  Building2,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Layers,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActiveTab, classrooms, buildings, timetable } = useApp();

  // Scroll smooth to "How It Works" section
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 py-6 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-12 lg:p-16 glass-panel shadow-2xl">
        {/* Glow Background Decorators */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Smart Timetable Interval Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Find a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">Free Classroom</span> in Seconds
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Search for available classrooms across your campus based on your date, time, building, floor, and capacity requirements.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveTab('find')}
                className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-teal-950/50 transition-all flex items-center justify-center gap-2 group hover:scale-105"
              >
                <Search className="w-4 h-4" />
                <span>Find a Classroom</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto py-3.5 px-8 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm rounded-2xl border border-slate-700/80 transition-all flex items-center justify-center gap-2"
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Quick Metrics Badge */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="text-2xl font-extrabold text-white">{classrooms.length}</span>
                <span className="text-[11px] text-slate-400 block font-medium">Total Classrooms</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-teal-400">{buildings.length}</span>
                <span className="text-[11px] text-slate-400 block font-medium">Campus Blocks</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-emerald-400">{timetable.length}+</span>
                <span className="text-[11px] text-slate-400 block font-medium">Scheduled Classes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Graphic Representation of Campus */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-3xl p-6 bg-slate-950/80 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-white">Academic Block A</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  4 Rooms Free
                </span>
              </div>

              {/* Sample Mini Cards */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Room A-204</span>
                    <span className="text-[10px] text-slate-400">Floor 2 • 60 Seats</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg">
                    ✓ Available
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between opacity-80">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Room A-101</span>
                    <span className="text-[10px] text-slate-500">Floor 1 • 120 Seats</span>
                  </div>
                  <span className="text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg">
                    Occupied (HIS101)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Room A-301</span>
                    <span className="text-[10px] text-slate-400">Floor 3 • 40 Seats</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg">
                    ✓ Available
                  </span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400 italic">
                  Instant interval analysis with 0% overlap tolerance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE CORE FEATURE CARDS */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Designed for Campus Efficiency
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to find an empty classroom without walking through building corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Quick Search */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all duration-300 space-y-4 glass-card group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
              Quick Search
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find classrooms by selecting your required date, start time, and end time in 24-hour format.
            </p>
          </div>

          {/* Card 2: Smart Availability */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 space-y-4 glass-card group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Smart Availability
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The system checks active timetable data and shows only classrooms that are free for the entire requested duration.
            </p>
          </div>

          {/* Card 3: Flexible Filters */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 space-y-4 glass-card group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Flexible Filters
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter results by specific building, floor, seating capacity, or room type (Lecture Hall, Computer Lab, etc.).
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="p-8 sm:p-12 rounded-3xl bg-slate-950 border border-slate-800 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase text-teal-400 tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How It Works</h2>
          <p className="text-slate-400 text-sm">
            Get instant classroom availability results in under 5 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-extrabold text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-white text-sm">Select Date</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose the target date you need a room for (defaults to today).
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-extrabold text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-white text-sm">Enter Start & End Time</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specify your timeframe in 24-hour format (e.g. 14:00 to 16:00).
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-extrabold text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-white text-sm">Apply Optional Filters</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optionally narrow down by building, floor level, or min seating capacity.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-white text-sm">View Free Classrooms</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly view all unoccupied classrooms with full schedule timelines.
            </p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={() => setActiveTab('find')}
            className="py-3 px-8 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl shadow-lg transition-colors inline-flex items-center gap-2"
          >
            <span>Start Searching Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
