import {
  getWorkoutEntries,
  addWorkoutEntry,
  updateWorkoutEntry,
  deleteWorkoutEntry
} from '../lib/firebase/firestore';
import type { WorkoutEntry } from '../types';

export class WorkoutService {
  static async getEntries(userId: string, startDate?: Date, endDate?: Date): Promise<WorkoutEntry[]> {
    return getWorkoutEntries(userId, startDate, endDate);
  }

  static async addEntry(entry: Omit<WorkoutEntry, 'id'>): Promise<WorkoutEntry> {
    return addWorkoutEntry(entry);
  }

  static async updateEntry(id: string, data: Partial<WorkoutEntry>): Promise<void> {
    return updateWorkoutEntry(id, data);
  }

  static async deleteEntry(id: string): Promise<void> {
    return deleteWorkoutEntry(id);
  }
}