import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { ExportData } from './types';

export const exportToExcel = async (data: ExportData) => {
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([
    data.headers,
    ...data.rows
  ]);

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  // Set column widths
  const colWidths = data.headers.map(header => ({ wch: Math.max(header.length, 15) }));
  ws['!cols'] = colWidths;

  // Save the file
  XLSX.writeFile(wb, `${data.title}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};