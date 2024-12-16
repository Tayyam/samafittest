import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '../ui/Button';

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel') => Promise<void>;
  className?: string;
}

export const ExportButton = ({ onExport, className }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      setIsExporting(true);
      await onExport(format);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        variant="secondary"
        className={className}
        onClick={() => handleExport('pdf')}
        disabled={isExporting}
      >
        <FileDown className="w-4 h-4 ml-2" />
        {isExporting ? 'جاري التصدير...' : 'تصدير البيانات'}
      </Button>
      
      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden group-hover:block">
        <div className="py-1">
          <button
            onClick={() => handleExport('pdf')}
            className="block w-full px-4 py-2 text-sm text-right text-gray-700 hover:bg-gray-100"
          >
            تصدير كـ PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="block w-full px-4 py-2 text-sm text-right text-gray-700 hover:bg-gray-100"
          >
            تصدير كـ Excel
          </button>
        </div>
      </div>
    </div>
  );
};