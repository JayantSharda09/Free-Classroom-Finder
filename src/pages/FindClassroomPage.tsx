import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SearchFilter, ClassroomAvailability } from '../types';
import { checkClassroomsAvailability } from '../utils/availability';
import { ClassroomCard } from '../components/classroom/ClassroomCard';
import { ClassroomDetailModal } from '../components/classroom/ClassroomDetailModal';
import {
  Search,
  Calendar,
  Clock,
  Building2,
  Layers,
  Users,
  Filter,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';

export const FindClassroomPage: React.FC = () => {
  const {
    classrooms,
    buildings,
    timetable,
    addSearchRecord,
    currentUser,
    searchPresetFilter,
    setSearchPresetFilter,
  } = useApp();

  // Get current date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Default to 14:00 - 16:00 as specified in sample
  const [filter, setFilter] = useState<SearchFilter>({
    date: searchPresetFilter?.date || '2026-09-10', // Default to sample date 10 Sept 2026
    startTime: searchPresetFilter?.startTime || '14:00',
    endTime: searchPresetFilter?.endTime || '16:00',
    buildingId: searchPresetFilter?.buildingId || 'all',
    floor: searchPresetFilter?.floor || 'all',
    minCapacity: searchPresetFilter?.minCapacity || 0,
    type: searchPresetFilter?.type || 'all',
  });

  const [hasSearched, setHasSearched] = useState(true);
  const [results, setResults] = useState<ClassroomAvailability[]>([]);
  const [selectedForModal, setSelectedForModal] = useState<ClassroomAvailability | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Run initial search on load
  useEffect(() => {
    handleSearch();
    if (searchPresetFilter) {
      setSearchPresetFilter(null);
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Check validity of start < end
    if (filter.startTime >= filter.endTime) {
      alert('End time must be after start time.');
      return;
    }

    const availResults = checkClassroomsAvailability(classrooms, timetable, filter);
    setResults(availResults);
    setHasSearched(true);

    const availableCount = availResults.filter((r) => r.isAvailable).length;

    // Log to history
    const bName =
      filter.buildingId && filter.buildingId !== 'all'
        ? buildings.find((b) => b.id === filter.buildingId)?.name
        : 'All Buildings';

    addSearchRecord({
      userId: currentUser?.id || 'guest',
      date: filter.date,
      startTime: filter.startTime,
      endTime: filter.endTime,
      buildingName: bName,
      floor: filter.floor === 'all' ? 'All Floors' : `Floor ${filter.floor}`,
      capacity: filter.minCapacity,
      availableCount,
    });
  };

  const handleResetFilters = () => {
    setFilter({
      date: '2026-09-10',
      startTime: '14:00',
      endTime: '16:00',
      buildingId: 'all',
      floor: 'all',
      minCapacity: 0,
      type: 'all',
    });
    setShowOnlyAvailable(false);
  };

  // Shortcut presets
  const applyPreset = (presetType: 'now' | 'afternoon' | 'morning') => {
    if (presetType === 'now') {
      const now = new Date();
      const currentHrs = now.getHours().toString().padStart(2, '0');
      const endHrs = (now.getHours() + 2).toString().padStart(2, '0');
      setFilter((prev) => ({
        ...prev,
        date: todayStr,
        startTime: `${currentHrs}:00`,
        endTime: `${endHrs}:00`,
      }));
    } else if (presetType === 'afternoon') {
      setFilter((prev) => ({
        ...prev,
        date: '2026-09-10',
        startTime: '14:00',
        endTime: '16:00',
      }));
    } else if (presetType === 'morning') {
      setFilter((prev) => ({
        ...prev,
        date: '2026-09-10',
        startTime: '09:00',
        endTime: '11:00',
      }));
    }
  };

  // Filtered displayed results
  const displayedResults = showOnlyAvailable
    ? results.filter((r) => r.isAvailable)
    : results;

  const availableCount = results.filter((r) => r.isAvailable).length;

  return (
    <div className="space-y-8 py-6 pb-16">
      {/* Header Title */}
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Search className="w-8 h-8 text-teal-400" />
          Find Available Classrooms
        </h1>
        <p className="text-slate-400 text-sm">
          Select date, time, and campus building parameters to check real-time room availability.
        </p>
      </div>

      {/* PROMINENT SEARCH PANEL */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl glass-panel relative">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Quick Presets Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Time Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('afternoon')}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                14:00 – 16:00 Slot
              </button>

              <button
                type="button"
                onClick={() => applyPreset('morning')}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                09:00 – 11:00 Slot
              </button>

              <button
                type="button"
                onClick={() => applyPreset('now')}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-teal-950 text-teal-300 border border-teal-500/30 hover:bg-teal-900 transition-colors"
              >
                Next 2 Hours Today
              </button>
            </div>
          </div>

          {/* REQUIRED FIELDS GRID */}
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-3">
              Required Search Period
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  Date
                </label>
                <input
                  type="date"
                  value={filter.date}
                  onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  Start Time (24h)
                </label>
                <input
                  type="time"
                  value={filter.startTime}
                  onChange={(e) => setFilter({ ...filter, startTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  End Time (24h)
                </label>
                <input
                  type="time"
                  value={filter.endTime}
                  onChange={(e) => setFilter({ ...filter, endTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* OPTIONAL FILTERS GRID */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Optional Filters
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Building Dropdown */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Building
                </label>
                <select
                  value={filter.buildingId || 'all'}
                  onChange={(e) => setFilter({ ...filter, buildingId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 transition-all"
                >
                  <option value="all">All Campus Buildings</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor Dropdown */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Floor
                </label>
                <select
                  value={filter.floor !== undefined ? filter.floor : 'all'}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      floor: e.target.value === 'all' ? 'all' : Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 transition-all"
                >
                  <option value="all">All Floors</option>
                  <option value="0">Floor 0 (Ground / 000-030)</option>
                  <option value="1">Floor 1 (100-130)</option>
                  <option value="2">Floor 2 (200-230)</option>
                </select>
              </div>

              {/* Minimum Capacity */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Minimum Capacity
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  step="5"
                  value={filter.minCapacity || ''}
                  onChange={(e) =>
                    setFilter({ ...filter, minCapacity: Number(e.target.value) || 0 })
                  }
                  placeholder="e.g. 50 students"
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Classroom Type
                </label>
                <select
                  value={filter.type || 'all'}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 transition-all"
                >
                  <option value="all">All Classroom Types</option>
                  <option value="Lecture Hall">Lecture Hall</option>
                  <option value="Standard Classroom">Standard Classroom</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Science Lab">Science Lab</option>
                  <option value="Seminar Room">Seminar Room</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-teal-950/60 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <Search className="w-4 h-4" />
              <span>Search Available Classrooms</span>
            </button>
          </div>
        </form>
      </div>

      {/* SEARCH RESULTS SECTION */}
      {hasSearched && (
        <div className="space-y-6 pt-4">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {availableCount > 0 ? (
                  <span className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {availableCount} classrooms available for your selected time.
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    No classrooms available
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting Date: <strong className="text-slate-200">{filter.date}</strong> | Slot: <strong className="text-teal-300">{filter.startTime} – {filter.endTime}</strong>
              </p>
            </div>

            {results.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    showOnlyAvailable
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {showOnlyAvailable ? '✓ Only Available Shown' : 'Show All Rooms'}
                </button>
              </div>
            )}
          </div>

          {/* Results Grid or Empty State */}
          {displayedResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedResults.map((item) => (
                <ClassroomCard
                  key={item.classroom.id}
                  availability={item}
                  onSelectDetails={(avail) => setSelectedForModal(avail)}
                />
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold text-white">No Classrooms Available</h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                All matching rooms have scheduled classes or events during your selected timeframe (
                <span className="text-white font-semibold">{filter.startTime} – {filter.endTime}</span>).
              </p>

              <p className="text-xs text-slate-500">
                Try changing the time, building, floor, or minimum seating capacity.
              </p>

              <button
                onClick={handleResetFilters}
                className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-teal-400" />
                <span>Modify Search & Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Classroom Details Modal */}
      <ClassroomDetailModal
        availability={selectedForModal}
        onClose={() => setSelectedForModal(null)}
      />
    </div>
  );
};
