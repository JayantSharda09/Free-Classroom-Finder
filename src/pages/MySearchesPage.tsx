import React from 'react';
import { useApp } from '../context/AppContext';
import { History, Search, Trash2, RotateCcw, Calendar, Clock, Building2, Users, Layers, ArrowRight } from 'lucide-react';

export const MySearchesPage: React.FC = () => {
  const { searchHistory, clearSearchHistory, setActiveTab, setSearchPresetFilter } = useApp();

  const handleRepeatSearch = (record: any) => {
    setSearchPresetFilter({
      date: record.date,
      startTime: record.startTime,
      endTime: record.endTime,
      buildingId: 'all',
      floor: record.floor === 'All Floors' ? 'all' : record.floor.replace('Floor ', ''),
      minCapacity: record.capacity || 0,
    });
    setActiveTab('find');
  };

  return (
    <div className="space-y-8 py-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-teal-400" />
            My Recent Searches
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review previous classroom search queries and rerun them with a single click.
          </p>
        </div>

        {searchHistory.length > 0 && (
          <button
            onClick={clearSearchHistory}
            className="self-start sm:self-auto py-2.5 px-4 bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Search History</span>
          </button>
        )}
      </div>

      {/* History Items */}
      {searchHistory.length > 0 ? (
        <div className="space-y-4">
          {searchHistory.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card"
            >
              {/* Search details */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-500/10 text-teal-300 border border-teal-500/20 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    {item.startTime} – {item.endTime}
                  </span>

                  <span className="text-[11px] text-slate-500 font-mono ml-auto">
                    Recorded {item.timestamp}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Building: <strong className="text-white">{item.buildingName || 'All Buildings'}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Floor: <strong className="text-white">{item.floor || 'All Floors'}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Min Seats: <strong className="text-white">{item.capacity ? `${item.capacity}+` : 'Any'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status & Repeat Action */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Found</span>
                  <span className="text-lg font-extrabold text-emerald-400">
                    {item.availableCount} Rooms Free
                  </span>
                </div>

                <button
                  onClick={() => handleRepeatSearch(item)}
                  className="py-2.5 px-5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 group"
                >
                  <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
                  <span>Repeat Search</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Search History Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your recent classroom searches will be logged here automatically so you can repeat them anytime.
          </p>
          <button
            onClick={() => setActiveTab('find')}
            className="py-2.5 px-6 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Perform Your First Search</span>
          </button>
        </div>
      )}
    </div>
  );
};
