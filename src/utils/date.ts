import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatDate = (date: Date, formatStr: string = 'PPP'): string => {
  return format(date, formatStr, { locale: ar });
};

export const getDayRange = (date: Date) => {
  return {
    start: startOfDay(date),
    end: endOfDay(date)
  };
};

export const getLastNDays = (n: number) => {
  const end = new Date();
  const start = subDays(end, n);
  return { start, end };
};