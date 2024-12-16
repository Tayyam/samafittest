import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { exportToPDF } from './pdf';
import { exportToExcel } from './excel';
import type { ExportOptions, ExportData } from './types';
import type { NutritionEntry, WorkoutEntry, InBodyData } from '../../types';

export const exportNutritionData = async (
  entries: NutritionEntry[],
  options: ExportOptions
) => {
  const data: ExportData = {
    title: 'تقرير التغذية',
    headers: ['التاريخ', 'الوقت', 'الطعام', 'السعرات', 'البروتين', 'الكربوهيدرات', 'الدهون'],
    rows: entries.map(entry => [
      format(entry.date, 'yyyy/MM/dd', { locale: ar }),
      format(entry.date, 'HH:mm', { locale: ar }),
      entry.food,
      entry.calories,
      `${entry.protein}g`,
      `${entry.carbs}g`,
      `${entry.fats}g`,
    ])
  };

  if (options.format === 'pdf') {
    await exportToPDF(data);
  } else {
    await exportToExcel(data);
  }
};

export const exportWorkoutData = async (
  entries: WorkoutEntry[],
  options: ExportOptions
) => {
  const data: ExportData = {
    title: 'تقرير التمارين',
    headers: ['التاريخ', 'الوقت', 'التمرين', 'المدة (دقيقة)', 'السعرات المحروقة'],
    rows: entries.map(entry => [
      format(entry.date, 'yyyy/MM/dd', { locale: ar }),
      format(entry.date, 'HH:mm', { locale: ar }),
      entry.exercise,
      entry.duration,
      entry.caloriesBurned,
    ])
  };

  if (options.format === 'pdf') {
    await exportToPDF(data);
  } else {
    await exportToExcel(data);
  }
};

export const exportInBodyData = async (
  entries: InBodyData[],
  options: ExportOptions
) => {
  const data: ExportData = {
    title: 'تقرير InBody',
    headers: ['التاريخ', 'الوزن (كجم)', 'كتلة العضلات (كجم)', 'نسبة الدهون (%)', 'النتيجة'],
    rows: entries.map(entry => [
      format(entry.date, 'PPP', { locale: ar }),
      entry.weight,
      entry.muscleMass,
      entry.fatPercentage,
      entry.score,
    ])
  };

  if (options.format === 'pdf') {
    await exportToPDF(data);
  } else {
    await exportToExcel(data);
  }
};