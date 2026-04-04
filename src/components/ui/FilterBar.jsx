import React from 'react';
import './FilterBar.css';

/**
 * Standardized Filter Bar.
 * 
 * Props:
 * - children: ReactNode
 */
const FilterBar = ({ children }) => {
  return (
    <div className="filter-bar">
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>
          {child}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FilterBar;
