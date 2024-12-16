import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const alertStyles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className={`p-4 rounded-md ${alertStyles[type]} flex justify-between items-center`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-lg font-bold">
          &times;
        </button>
      )}
    </div>
  );
}; 