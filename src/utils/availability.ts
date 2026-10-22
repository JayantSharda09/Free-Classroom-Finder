import type { Classroom, TimetableEntry, SearchFilter, ClassroomAvailability } from '../types';

/**
 * Convert time string "HH:mm" to total minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format minutes since midnight to "HH:mm"
 */
export function minutesToTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Check if two time intervals overlap.
 * Interval 1: [start1, end1]
 * Interval 2: [start2, end2]
 * Overlap exists iff max(start1, start2) < min(end1, end2)
 */
export function doIntervalsOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  return Math.max(s1, s2) < Math.min(e1, e2);
}

/**
 * Evaluate availability for a list of classrooms based on timetable data and filters
 */
export function checkClassroomsAvailability(
  classrooms: Classroom[],
  timetable: TimetableEntry[],
  filter: SearchFilter
): ClassroomAvailability[] {
  const { date, startTime, endTime, buildingId, floor, minCapacity, type } = filter;

  return classrooms
    .filter((room) => {
      // Filter by building
      if (buildingId && buildingId !== 'all' && room.buildingId !== buildingId) {
        return false;
      }
      // Filter by floor
      if (floor !== undefined && floor !== 'all' && room.floor !== Number(floor)) {
        return false;
      }
      // Filter by min capacity
      if (minCapacity !== undefined && minCapacity > 0 && room.capacity < minCapacity) {
        return false;
      }
      // Filter by room type
      if (type && type !== 'all' && room.type !== type) {
        return false;
      }
      return true;
    })
    .map((room) => {
      // Find timetable entries for this classroom on the requested date
      const roomEntriesOnDate = timetable.filter(
        (entry) => entry.classroomId === room.id && entry.date === date
      );

      // Find conflicting entries that overlap with requested period [startTime, endTime]
      const conflictingEntries = roomEntriesOnDate.filter((entry) =>
        doIntervalsOverlap(startTime, endTime, entry.startTime, entry.endTime)
      );

      const isAvailable = conflictingEntries.length === 0;

      return {
        classroom: room,
        isAvailable,
        conflictingEntries,
        requestedSlot: { date, startTime, endTime },
      };
    });
}

/**
 * Validates whether a new or updated timetable entry conflicts with existing entries for the same room.
 */
export function validateTimetableConflict(
  newEntry: Omit<TimetableEntry, 'id'> & { id?: string },
  existingEntries: TimetableEntry[]
): { hasConflict: boolean; conflictingEntry?: TimetableEntry } {
  const conflict = existingEntries.find((entry) => {
    // Skip checking against itself when updating
    if (newEntry.id && entry.id === newEntry.id) return false;

    // Check same classroom and same date
    if (entry.classroomId === newEntry.classroomId && entry.date === newEntry.date) {
      // Check time overlap
      return doIntervalsOverlap(
        newEntry.startTime,
        newEntry.endTime,
        entry.startTime,
        entry.endTime
      );
    }
    return false;
  });

  return {
    hasConflict: !!conflict,
    conflictingEntry: conflict,
  };
}

export interface ScheduleSlot {
  timeLabel: string;
  startTime: string;
  endTime: string;
  isOccupied: boolean;
  isRequested: boolean;
  entry?: TimetableEntry;
}

/**
 * Generate 1-hour schedule slots between 08:00 and 20:00 for classroom timeline view
 */
export function generateRoomTimeline(
  classroomId: string,
  timetable: TimetableEntry[],
  date: string,
  requestedStart?: string,
  requestedEnd?: string
): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];
  const roomEntriesOnDate = timetable.filter(
    (e) => e.classroomId === classroomId && e.date === date
  );

  const startHour = 8; // 08:00
  const endHour = 20;  // 20:00

  for (let hour = startHour; hour < endHour; hour++) {
    const slotStart = `${hour.toString().padStart(2, '0')}:00`;
    const slotEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;
    const timeLabel = `${slotStart} - ${slotEnd}`;

    // Check if any scheduled entry overlaps this hour
    const matchingEntry = roomEntriesOnDate.find((e) =>
      doIntervalsOverlap(slotStart, slotEnd, e.startTime, e.endTime)
    );

    // Check if requested time overlaps this hour
    const isRequested = requestedStart && requestedEnd
      ? doIntervalsOverlap(slotStart, slotEnd, requestedStart, requestedEnd)
      : false;

    slots.push({
      timeLabel,
      startTime: slotStart,
      endTime: slotEnd,
      isOccupied: !!matchingEntry,
      isRequested,
      entry: matchingEntry,
    });
  }

  return slots;
}
