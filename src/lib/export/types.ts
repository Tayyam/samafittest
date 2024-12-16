export interface ExportOptions {
  format: 'pdf' | 'excel';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeCharts?: boolean;
}

export interface ExportData {
  title: string;
  headers: string[];
  rows: any[][];
  charts?: {
    title: string;
    data: any[];
    type: 'line' | 'bar' | 'pie';
  }[];
}