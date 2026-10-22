export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  floors: number;
  description: string;
  image?: string;
}

export type RoomType = 'Lecture Hall' | 'Computer Lab' | 'Science Lab' | 'Seminar Room' | 'Standard Classroom';

export interface Classroom {
  id: string;
  roomNumber: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  capacity: number;
  type: RoomType;
  features: string[];
}

export interface TimetableEntry {
  id: string;
  classroomId: string;
  roomNumber: string;
  buildingName: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24-hour format)
  endTime: string; // HH:mm (24-hour format)
}

export interface SearchFilter {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  buildingId?: string;
  floor?: number | 'all';
  minCapacity?: number;
  type?: string | 'all';
}

export interface SearchRecord {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  buildingName?: string;
  floor?: string;
  capacity?: number;
  type?: string;
  availableCount: number;
  timestamp: string;
}

export interface ClassroomAvailability {
  classroom: Classroom;
  isAvailable: boolean;
  conflictingEntries: TimetableEntry[];
  requestedSlot: {
    date: string;
    startTime: string;
    endTime: string;
  };
  nextAvailableTime?: string;
}
