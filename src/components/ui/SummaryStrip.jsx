
import React from 'react';
import './SummaryStrip.css';

/**
 * Summary Strip with multiple info cards.
 * 
 * Props:
 * - items: [{ label, value, icon, iconBg, iconColor, valueColor }]
 */
const SummaryStrip = ({ items = [] }) => {
  return (
    <div className="summary-strip">
      {items.map((item, index) => (
        <div key={index} className="summary-card">
          <div 
            className="summary-card-icon" 
            style={{ 
              backgroundColor: item.iconBg || 'var(--gray-100)', 
              color: item.iconColor || 'var(--gray-600)' 
            }}
          >
            {item.icon}
          </div>
          <div className="summary-card-content">
            <div className="summary-card-label">{item.label}</div>
            <div 
              className="summary-card-value amount" 
              style={{ color: item.valueColor || 'var(--gray-900)' }}
            >
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryStrip;
