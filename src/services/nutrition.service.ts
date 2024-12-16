import {
  getNutritionEntries,
  addNutritionEntry,
  updateNutritionEntry,
  deleteNutritionEntry
} from '../lib/firebase/firestore';
import type { NutritionEntry } from '../types';

export class NutritionService {
  static async getEntries(userId: string, startDate?: Date, endDate?: Date): Promise<NutritionEntry[]> {
    return getNutritionEntries(userId, startDate, endDate);
  }

  static async addEntry(entry: Omit<NutritionEntry, 'id'>): Promise<NutritionEntry> {
    return addNutritionEntry(entry);
  }

  static async updateEntry(id: string, data: Partial<NutritionEntry>): Promise<void> {
    return updateNutritionEntry(id, data);
  }

  static async deleteEntry(id: string): Promise<void> {
    return deleteNutritionEntry(id);
  }
}