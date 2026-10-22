import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Classroom, RoomType } from '../../types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Layers,
  Users,
  Filter,
  X,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export const ClassroomManagement: React.FC = () => {
  const { classrooms, buildings, addClassroom, updateClassroom, deleteClassroom } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Classroom | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    buildingId: buildings[0]?.id || 'b1',
    floor: 1,
    capacity: 60,
    type: 'Standard Classroom' as RoomType,
    features: ['Projector', 'AC', 'Whiteboard'],
  });

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      buildingId: buildings[0]?.id || 'b1',
      floor: 1,
      capacity: 60,
      type: 'Standard Classroom',
      features: ['Projector', 'AC'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Classroom) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      buildingId: room.buildingId,
      floor: room.floor,
      capacity: room.capacity,
      type: room.type,
      features: room.features || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomNumber.trim()) return;

    const bObj = buildings.find((b) => b.id === formData.buildingId);
    const buildingName = bObj ? bObj.name : 'Main Building';

    if (editingRoom) {
      updateClassroom({
        ...editingRoom,
        roomNumber: formData.roomNumber,
        buildingId: formData.buildingId,
        buildingName,
        floor: Number(formData.floor),
        capacity: Number(formData.capacity),
        type: formData.type,
        features: formData.features,
      });
    } else {
      addClassroom({
        roomNumber: formData.roomNumber,
        buildingId: formData.buildingId,
        buildingName,
        floor: Number(formData.floor),
        capacity: Number(formData.capacity),
        type: formData.type,
        features: formData.features,
      });
    }
    setIsModalOpen(false);
  };

  // Filtered Classrooms
  const filteredRooms = classrooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.buildingName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding = buildingFilter === 'all' || room.buildingId === buildingFilter;
    const matchesFloor = floorFilter === 'all' || room.floor === Number(floorFilter);

    return matchesSearch && matchesBuilding && matchesFloor;
  });

  return (
    <div className="space-y-6 py-6 pb-16">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-400" />
            Classroom Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Maintain campus classroom master records, seating capacities, and room types.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Classroom</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search room number or building..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>

        {/* Building Filter */}
        <select
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 transition-all"
        >
          <option value="all">Filter by Building (All)</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.code})
            </option>
          ))}
        </select>

        {/* Floor Filter */}
        <select
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
          className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 transition-all"
        >
          <option value="all">Filter by Floor (All)</option>
          <option value="0">Floor 0 (Ground / 000-030)</option>
          <option value="1">Floor 1 (100-130)</option>
          <option value="2">Floor 2 (200-230)</option>
        </select>
      </div>

      {/* CLASSROOMS TABLE (Section 8) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Room Number</th>
                <th className="py-4 px-6">Building</th>
                <th className="py-4 px-6">Floor</th>
                <th className="py-4 px-6">Capacity</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white font-mono text-sm">
                    {room.roomNumber}
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-medium">{room.buildingName}</td>
                  <td className="py-4 px-6 text-slate-300">Floor {room.floor}</td>
                  <td className="py-4 px-6 font-semibold text-teal-400">
                    {room.capacity} seats
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium text-[11px]">
                      {room.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(room)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Room"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete classroom ${room.roomNumber}?`)) {
                          deleteClassroom(room.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 transition-colors"
                      title="Delete Room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRooms.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No classrooms found matching search or filter criteria.
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 glass-panel">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Classroom'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Classroom Name / Room Number
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder="e.g. Room A-204"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Building</label>
                  <select
                    value={formData.buildingId}
                    onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  >
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Floor Level</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Room Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as RoomType })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Standard Classroom">Standard Classroom</option>
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Science Lab">Science Lab</option>
                    <option value="Seminar Room">Seminar Room</option>
                  </select>
                </div>
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
                  className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                >
                  {editingRoom ? 'Save Changes' : 'Create Classroom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
