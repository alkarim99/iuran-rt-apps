import React from 'react';
import MonthPills from './MonthPills';
import './TableCard.css';

/**
 * Standardized Table Card wrapper for all tables.
 * 
 * Props:
 * - title: string
 * - subtitle: string
 * - monthPills: boolean (show month selector)
 * - selectedMonth: number
 * - onMonthChange: func
 * - selectedYear: number
 * - activeMonths: number[]
 * - actions: ReactNode (slot for additional buttons in header)
 * - children: ReactNode (the table element)
 */
const TableCard = ({ 
  title, 
  subtitle, 
  monthPills, 
  selectedMonth, 
  onMonthChange, 
  selectedYear, 
  activeMonths,
  actions, 
  children 
}) => {
  return (
    <div className="table-card">
      {(title || subtitle || actions) && (
        <div className="table-card-header">
          <div className="table-card-header-info">
            {title && <h2 className="table-card-title">{title}</h2>}
            {subtitle && <p className="table-card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="table-card-header-actions">{actions}</div>}
        </div>
      )}
      
      {monthPills && (
        <MonthPills 
          selectedMonth={selectedMonth} 
          onSelect={onMonthChange} 
          year={selectedYear}
          activeMonths={activeMonths}
        />
      )}
      
      <div className="table-card-body">
        {children}
      </div>
    </div>
  );
};

export default TableCard;
