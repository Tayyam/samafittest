import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { ExportData } from './types';

export const exportToPDF = async (data: ExportData) => {
  const doc = new jsPDF();
  
  // Add RTL support
  doc.setR2L(true);

  // Add title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(data.title, doc.internal.pageSize.width / 2, 20, { align: 'center' });

  // Add date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `تاريخ التصدير: ${format(new Date(), 'PPP', { locale: ar })}`,
    doc.internal.pageSize.width - 20,
    30,
    { align: 'right' }
  );

  // Add table
  autoTable(doc, {
    head: [data.headers],
    body: data.rows,
    startY: 40,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5,
      halign: 'right',
      valign: 'middle',
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [26, 16, 95], // sama-dark
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  // Save the PDF
  doc.save(`${data.title}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};