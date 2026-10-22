import React from 'react';
import { useApp } from '../../context/AppContext';
import { checkClassroomsAvailability } from '../../utils/availability';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { classrooms, buildings, timetable, setActiveTab, currentUser } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentHrs = now.getHours().toString().padStart(2, '0');
  const currentSlotEnd = (now.getHours() + 1).toString().padStart(2, '0');

  // Calculate current availability stats right now
  const currentAvailability = checkClassroomsAvailability(classrooms, timetable, {
    date: '2026-09-07', // check today or sample
    startTime: `${currentHrs}:00`,
    endTime: `${currentSlotEnd}:00`,
  });

  const availableCount = currentAvailability.filter((r) => r.isAvailable).length;
  const occupiedCount = classrooms.length - availableCount;

  return (
    <div className="space-y-8 py-6 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 glass-panel shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Administrator Portal</h1>
            <p className="text-xs text-slate-300">
              Welcome back, <strong className="text-emerald-300">{currentUser?.name || 'Administrator'}</strong>. Manage campus infrastructure and timetable schedules.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('admin-classrooms')}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Manage Classrooms
          </button>

          <button
            onClick={() => setActiveTab('admin-timetable')}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-teal-400" />
            Manage Timetable
          </button>
        </div>
      </div>

      {/* DASHBOARD STATISTICS WIDGETS (Section 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Classrooms */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Classrooms</span>
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{classrooms.length}</p>
          <span className="text-[10px] text-slate-500 block">Across {buildings.length} blocks</span>
        </div>

        {/* Available Classrooms */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Available Rooms</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-300">{availableCount}</p>
          <span className="text-[10px] text-emerald-400/80 block">Unoccupied during active slot</span>
        </div>

        {/* Occupied Classrooms */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Occupied Rooms</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-300">{occupiedCount}</p>
          <span className="text-[10px] text-rose-400/80 block">In-use for lectures</span>
        </div>

        {/* Total Buildings */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Buildings</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{buildings.length}</p>
          <span className="text-[10px] text-slate-500 block">Active campus blocks</span>
        </div>

        {/* Total Timetable Entries */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timetable Entries</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{timetable.length}</p>
          <span className="text-[10px] text-slate-500 block">Scheduled course classes</span>
        </div>
      </div>

      {/* BUILDING OVERVIEW CARDS */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Campus Building Occupancy Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buildings.map((b) => {
            const buildingRooms = classrooms.filter((r) => r.buildingId === b.id);
            return (
              <div
                key={b.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 glass-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{b.name}</h4>
                      <span className="text-xs text-slate-400 font-mono">Code: {b.code} • {b.floors} Floors</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold text-slate-200">
                    {buildingRooms.length} Rooms
                  </span>
                </div>

                <p className="text-xs text-slate-400">{b.description}</p>

                {/* Progress Indicator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Capacity Spread</span>
                    <span>
                      {buildingRooms.reduce((acc, curr) => acc + curr.capacity, 0)} total student seats
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                      style={{ width: `${Math.min(100, buildingRooms.length * 20)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
