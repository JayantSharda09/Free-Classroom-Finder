import React from 'react';
import { ClassroomAvailability } from '../../types';
import { Users, Building2, Layers, CheckCircle2, XCircle, Clock, ArrowRight, Monitor, Sparkles } from 'lucide-react';

interface ClassroomCardProps {
  availability: ClassroomAvailability;
  onSelectDetails: (availability: ClassroomAvailability) => void;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({ availability, onSelectDetails }) => {
  const { classroom, isAvailable, conflictingEntries, requestedSlot } = availability;

  return (
    <div
      className={`group relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between overflow-hidden glass-card ${
        isAvailable
          ? 'border-emerald-500/30 hover:border-emerald-400/60 shadow-lg hover:shadow-emerald-950/40 glow-available'
          : 'border-slate-800 opacity-80 hover:opacity-100 hover:border-slate-700'
      }`}
    >
      {/* Background Subtle Gradient Tint */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isAvailable
            ? 'bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent group-hover:from-emerald-500/10'
            : 'bg-gradient-to-b from-rose-500/5 via-transparent to-transparent'
        }`}
      />

      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-extrabold text-white tracking-tight group-hover:text-teal-300 transition-colors">
                {classroom.roomNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700/60">
                {classroom.type}
              </span>
            </div>
            <p className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {classroom.buildingName}
            </p>
          </div>

          {/* Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${
              isAvailable
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/20'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
            }`}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>✓ Available</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Occupied</span>
              </>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 py-3 px-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Floor: <strong className="text-white">{classroom.floor}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Capacity: <strong className="text-white">{classroom.capacity} seats</strong></span>
          </div>
        </div>

        {/* Features Tags */}
        {classroom.features && classroom.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {classroom.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/60 text-slate-400 border border-slate-700/40"
              >
                {feature}
              </span>
            ))}
            {classroom.features.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/60 text-slate-500">
                +{classroom.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Time slot summary */}
        <div className="text-xs mb-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>Requested Time:</span>
          </div>
          <span className="font-bold text-white tracking-wide">
            {requestedSlot.startTime} – {requestedSlot.endTime}
          </span>
        </div>

        {/* Conflicting notice if occupied */}
        {!isAvailable && conflictingEntries.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-xs text-rose-200">
            <p className="font-semibold text-rose-300 truncate">
              Busy: {conflictingEntries[0].courseCode} ({conflictingEntries[0].startTime} - {conflictingEntries[0].endTime})
            </p>
            {conflictingEntries[0].faculty && (
              <p className="text-[11px] text-rose-300/80 truncate">
                Faculty: {conflictingEntries[0].faculty}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Details Button CTA */}
      <button
        onClick={() => onSelectDetails(availability)}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-md ${
          isAvailable
            ? 'bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/30'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
        }`}
      >
        <span>View Details & Schedule</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};
