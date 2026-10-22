import React from 'react';
import { ClassroomAvailability } from '../../types';
import { useApp } from '../../context/AppContext';
import { generateRoomTimeline } from '../../utils/availability';
import {
  X,
  Building2,
  Layers,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Monitor,
  Sparkles,
  BookOpen,
  UserCheck,
} from 'lucide-react';

interface ClassroomDetailModalProps {
  availability: ClassroomAvailability | null;
  onClose: () => void;
}

export const ClassroomDetailModal: React.FC<ClassroomDetailModalProps> = ({
  availability,
  onClose,
}) => {
  const { timetable } = useApp();

  if (!availability) return null;

  const { classroom, isAvailable, requestedSlot } = availability;

  // Generate hourly schedule breakdown (08:00 - 20:00)
  const timelineSlots = generateRoomTimeline(
    classroom.id,
    timetable,
    requestedSlot.date,
    requestedSlot.startTime,
    requestedSlot.endTime
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden glass-panel my-8">
        {/* Top Header Banner */}
        <div
          className={`p-6 border-b border-slate-800 ${
            isAvailable
              ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900'
              : 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
                  isAvailable
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {isAvailable ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    Room {classroom.roomNumber}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {classroom.type}
                  </span>
                </div>
                <p className="text-xs font-semibold text-teal-400 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {classroom.buildingName} • Floor {classroom.floor}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Capacity
              </span>
              <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-400" />
                {classroom.capacity} Students
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Floor Level
              </span>
              <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-400" />
                Floor {classroom.floor}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Requested Date
              </span>
              <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" />
                {requestedSlot.date}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Availability
              </span>
              <span
                className={`text-xs font-extrabold flex items-center gap-1 ${
                  isAvailable ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isAvailable ? '✓ Fully Free' : 'Occupied'}
              </span>
            </div>
          </div>

          {/* Features */}
          {classroom.features && classroom.features.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Room Amenities & Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {classroom.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700/60 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Timeline Header */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  Daily Schedule Timeline ({requestedSlot.date})
                </h3>
                <p className="text-xs text-slate-400">
                  Highlighting requested slot: <span className="text-teal-300 font-bold">{requestedSlot.startTime} – {requestedSlot.endTime}</span>
                </p>
              </div>
            </div>

            {/* Timeline List */}
            <div className="space-y-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              {timelineSlots.map((slot, index) => {
                const isRequestedSlot = slot.isRequested;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs transition-all border ${
                      isRequestedSlot
                        ? slot.isOccupied
                          ? 'bg-rose-950/60 border-rose-500/50 ring-2 ring-rose-500/20'
                          : 'bg-emerald-950/60 border-emerald-500/50 ring-2 ring-emerald-500/30'
                        : slot.isOccupied
                        ? 'bg-slate-900 border-slate-800 text-slate-300'
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                    }`}
                  >
                    {/* Time Label */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-300 w-24">
                        {slot.timeLabel}
                      </span>

                      {/* Status / Class info */}
                      {slot.isOccupied && slot.entry ? (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="font-bold text-white">
                            {slot.entry.courseCode}: {slot.entry.courseName}
                          </span>
                          {slot.entry.faculty && (
                            <span className="text-slate-400 text-[11px] hidden sm:inline">
                              ({slot.entry.faculty})
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-semibold">Free / Unoccupied</span>
                        </div>
                      )}
                    </div>

                    {/* Tag badge for requested slot */}
                    {isRequestedSlot && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-sm ${
                          slot.isOccupied
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {slot.isOccupied ? 'Conflict' : '★ Requested Period'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
