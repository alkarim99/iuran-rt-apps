import React from 'react';
import './MonthPills.css';

/**
 * Month selector pills.
 * 
 * Props:
 * - selectedMonth: number (1-12)
 * - activeMonths: number[] (months with data)
 * - onSelect: func (month: number) => void
 * - year: number
 */
const MonthPills = ({ selectedMonth, activeMonths = [], onSelect, year }) => {
  const months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Agu' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Okt' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Des' },
  ];

  const currentYear = new React.useMemo(() => new Date().getFullYear(), []);
  const currentMonth = new React.useMemo(() => new Date().getMonth() + 1, []);

  return (
    <div className="month-pills-row">
      {months.map((m) => {
        const isActive = selectedMonth === m.value;
        const hasData = activeMonths.includes(m.value);
        const isEmpty = year > currentYear || (year === currentYear && m.value > currentMonth);
        
        let pillClass = '';
        if (isActive) pillClass = 'active';
        else if (hasData) pillClass = 'has-data';
        else if (isEmpty) pillClass = 'empty';

        return (
          <div
            key={m.value}
            className={`month-pill ${pillClass}`}
            onClick={() => !isEmpty && onSelect && onSelect(m.value)}
          >
            {m.label}
          </div>
        );
      })}
    </div>
  );
};

export default MonthPills;
