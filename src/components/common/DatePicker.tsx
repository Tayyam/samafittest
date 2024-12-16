import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selected, onChange, className }) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      className={className}
      dateFormat="yyyy/MM/dd"
    />
  );
}; 