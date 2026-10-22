import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Building, Classroom, TimetableEntry, SearchRecord } from '../types';
import {
  INITIAL_USERS,
  INITIAL_BUILDINGS,
  INITIAL_CLASSROOMS,
  INITIAL_TIMETABLE,
  INITIAL_SEARCH_HISTORY,
} from '../data/mockData';
import { validateTimetableConflict } from '../utils/availability';

export type AppTab =
  | 'home'
  | 'find'
  | 'history'
  | 'about'
  | 'admin-dashboard'
  | 'admin-classrooms'
  | 'admin-timetable';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  buildings: Building[];
  classrooms: Classroom[];
  timetable: TimetableEntry[];
  searchHistory: SearchRecord[];
  activeTab: AppTab;
  toasts: ToastMessage[];
  searchPresetFilter: any | null;
  setCurrentUser: (user: User | null) => void;
  setActiveTab: (tab: AppTab) => void;
  setSearchPresetFilter: (filter: any) => void;
  login: (email: string, role?: 'student' | 'admin') => boolean;
  logout: () => void;

  // Classroom CRUD
  addClassroom: (room: Omit<Classroom, 'id'>) => boolean;
  updateClassroom: (room: Classroom) => boolean;
  deleteClassroom: (id: string) => void;

  // Timetable CRUD
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => { success: boolean; message: string };
  updateTimetableEntry: (entry: TimetableEntry) => { success: boolean; message: string };
  deleteTimetableEntry: (id: string) => void;

  // Search History
  addSearchRecord: (record: Omit<SearchRecord, 'id' | 'timestamp'>) => void;
  clearSearchHistory: () => void;

  // Tools
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'free_classroom_finder_state_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return null;
  };

  const savedState = loadInitialState();

  const [currentUser, setCurrentUser] = useState<User | null>(
    savedState?.currentUser ?? INITIAL_USERS[0] // Default to student Alex Rivera
  );
  const [buildings] = useState<Building[]>(savedState?.buildings ?? INITIAL_BUILDINGS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(savedState?.classrooms ?? INITIAL_CLASSROOMS);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(savedState?.timetable ?? INITIAL_TIMETABLE);
  const [searchHistory, setSearchHistory] = useState<SearchRecord[]>(
    savedState?.searchHistory ?? INITIAL_SEARCH_HISTORY
  );
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchPresetFilter, setSearchPresetFilter] = useState<any | null>(null);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      const stateToSave = {
        currentUser,
        buildings,
        classrooms,
        timetable,
        searchHistory,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [currentUser, buildings, classrooms, timetable, searchHistory]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (email: string, preferredRole?: 'student' | 'admin'): boolean => {
    const foundUser = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || (preferredRole && u.role === preferredRole)
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      showToast(`Welcome back, ${foundUser.name}! Logged in as ${foundUser.role.toUpperCase()}.`, 'success');
      if (foundUser.role === 'admin') {
        setActiveTab('admin-dashboard');
      } else {
        setActiveTab('find');
      }
      return true;
    }

    // Generic fallback for demo
    const mockUser: User = {
      id: 'u_' + Date.now(),
      name: email.split('@')[0] || 'Campus User',
      email,
      role: preferredRole || 'student',
    };
    setCurrentUser(mockUser);
    showToast(`Logged in as ${mockUser.role.toUpperCase()}`, 'success');
    if (mockUser.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('find');
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    showToast('You have been logged out.', 'info');
  };

  // Classroom Management
  const addClassroom = (roomData: Omit<Classroom, 'id'>): boolean => {
    const newId = 'c_' + Date.now();
    const newRoom: Classroom = { ...roomData, id: newId };
    setClassrooms((prev) => [newRoom, ...prev]);
    showToast(`Classroom ${newRoom.roomNumber} added successfully!`, 'success');
    return true;
  };

  const updateClassroom = (updatedRoom: Classroom): boolean => {
    setClassrooms((prev) => prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)));
    showToast(`Classroom ${updatedRoom.roomNumber} updated successfully!`, 'success');
    return true;
  };

  const deleteClassroom = (id: string) => {
    const roomToDelete = classrooms.find((r) => r.id === id);
    setClassrooms((prev) => prev.filter((r) => r.id !== id));
    // Also cleanup timetable entries for this classroom
    setTimetable((prev) => prev.filter((t) => t.classroomId !== id));
    showToast(`Classroom ${roomToDelete?.roomNumber || ''} removed.`, 'info');
  };

  // Timetable Management with Conflict Validation
  const addTimetableEntry = (entryData: Omit<TimetableEntry, 'id'>): { success: boolean; message: string } => {
    const validation = validateTimetableConflict(entryData, timetable);

    if (validation.hasConflict) {
      const conflict = validation.conflictingEntry;
      const errorMsg = `Schedule conflict! Room ${entryData.roomNumber} is already occupied by "${conflict?.courseCode}: ${conflict?.courseName}" (${conflict?.startTime} - ${conflict?.endTime}).`;
      showToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    }

    const newEntry: TimetableEntry = { ...entryData, id: 't_' + Date.now() };
    setTimetable((prev) => [newEntry, ...prev]);
    showToast(`Timetable entry for ${newEntry.courseCode} added cleanly!`, 'success');
    return { success: true, message: 'Added successfully' };
  };

  const updateTimetableEntry = (updatedEntry: TimetableEntry): { success: boolean; message: string } => {
    const validation = validateTimetableConflict(updatedEntry, timetable);

    if (validation.hasConflict) {
      const conflict = validation.conflictingEntry;
      const errorMsg = `Schedule conflict! Room ${updatedEntry.roomNumber} is occupied by "${conflict?.courseCode}" (${conflict?.startTime} - ${conflict?.endTime}).`;
      showToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    }

    setTimetable((prev) => prev.map((t) => (t.id === updatedEntry.id ? updatedEntry : t)));
    showToast(`Timetable entry ${updatedEntry.courseCode} updated!`, 'success');
    return { success: true, message: 'Updated successfully' };
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetable((prev) => prev.filter((t) => t.id !== id));
    showToast('Timetable entry deleted.', 'info');
  };

  // Search History
  const addSearchRecord = (recordData: Omit<SearchRecord, 'id' | 'timestamp'>) => {
    const newRecord: SearchRecord = {
      ...recordData,
      id: 'sh_' + Date.now(),
      timestamp: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setSearchHistory((prev) => [newRecord, ...prev]);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    showToast('Search history cleared.', 'info');
  };

  const resetToDemoData = () => {
    setClassrooms(INITIAL_CLASSROOMS);
    setTimetable(INITIAL_TIMETABLE);
    setSearchHistory(INITIAL_SEARCH_HISTORY);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('Reset all campus data to demo default values.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        buildings,
        classrooms,
        timetable,
        searchHistory,
        activeTab,
        toasts,
        searchPresetFilter,
        setCurrentUser,
        setActiveTab,
        setSearchPresetFilter,
        login,
        logout,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
        addSearchRecord,
        clearSearchHistory,
        showToast,
        removeToast,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
