import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimetableEntry } from '../../types';
import {
  Calendar,
  Search,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Building2,
  BookOpen,
  UserCheck,
  X,
  AlertOctagon,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const TimetableManagement: React.FC = () => {
  const {
    timetable,
    classrooms,
    buildings,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formError, setFormError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    classroomId: classrooms[0]?.id || 'c101',
    courseCode: '',
    courseName: '',
    faculty: '',
    date: '2026-09-10',
    startTime: '09:00',
    endTime: '11:00',
  });

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormError('');
    setFormData({
      classroomId: classrooms[0]?.id || 'c101',
      courseCode: '',
      courseName: '',
      faculty: '',
      date: '2026-09-10',
      startTime: '09:00',
      endTime: '11:00',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormError('');
    setFormData({
      classroomId: entry.classroomId,
      courseCode: entry.courseCode,
      courseName: entry.courseName,
      faculty: entry.faculty,
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (formData.startTime >= formData.endTime) {
      setFormError('End time must be strictly after start time.');
      return;
    }

    const roomObj = classrooms.find((c) => c.id === formData.classroomId);
    if (!roomObj) return;

    const payload = {
      classroomId: formData.classroomId,
      roomNumber: roomObj.roomNumber,
      buildingName: roomObj.buildingName,
      courseCode: formData.courseCode,
      courseName: formData.courseName,
      faculty: formData.faculty,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    let result;
    if (editingEntry) {
      result = updateTimetableEntry({ ...payload, id: editingEntry.id });
    } else {
      result = addTimetableEntry(payload);
    }

    if (result.success) {
      setIsModalOpen(false);
    } else {
      setFormError(result.message);
    }
  };

  // Filtered timetable entries
  const filteredEntries = timetable.filter((entry) => {
    const matchesSearch =
      entry.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRoom = roomFilter === 'all' || entry.classroomId === roomFilter;
    const matchesDate = !dateFilter || entry.date === dateFilter;

    const roomObj = classrooms.find((r) => r.id === entry.classroomId);
    const matchesBuilding =
      buildingFilter === 'all' || (roomObj && roomObj.buildingId === buildingFilter);

    return matchesSearch && matchesRoom && matchesDate && matchesBuilding;
  });

  return (
    <div className="space-y-6 py-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-teal-400" />
            Timetable Schedule Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Maintain master class schedules. The system automatically enforces zero-overlap schedule conflict validation.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-3 px-5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timetable Entry</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search course, room, or faculty..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>

        {/* Room Filter */}
        <select
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 transition-all"
        >
          <option value="all">Filter by Classroom (All)</option>
          {classrooms.map((c) => (
            <option key={c.id} value={c.id}>
              {c.roomNumber} ({c.buildingName})
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          placeholder="Filter by date..."
          className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 transition-all"
        />

        {/* Building Filter */}
        <select
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 transition-all"
        >
          <option value="all">Filter by Building (All)</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* TIMETABLE TABLE (Section 9) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Course / Class</th>
                <th className="py-4 px-6">Classroom</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Time Slot (24h)</th>
                <th className="py-4 px-6">Faculty</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-sm">{entry.courseCode}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {entry.courseName}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-teal-300 font-mono">
                    {entry.roomNumber}
                    <span className="text-[10px] text-slate-500 block font-normal">
                      {entry.buildingName}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-200 font-semibold">{entry.date}</td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-100">
                    {entry.startTime} – {entry.endTime}
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-medium">{entry.faculty}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-500/30">
                      Scheduled
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete timetable entry for ${entry.courseCode}?`)) {
                          deleteTimetableEntry(entry.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No timetable entries found matching filter parameters.
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL WITH CONFLICT WARNING */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 glass-panel">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingEntry ? `Edit Timetable Entry` : 'Add New Timetable Entry'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Classroom</label>
                <select
                  value={formData.classroomId}
                  onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.roomNumber} ({c.buildingName} • Cap: {c.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    placeholder="e.g. CS101"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Course Name</label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    placeholder="e.g. Data Structures"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Faculty / Instructor</label>
                <input
                  type="text"
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  placeholder="e.g. Dr. Alan Turing"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md"
                >
                  {editingEntry ? 'Update Entry' : 'Schedule Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
