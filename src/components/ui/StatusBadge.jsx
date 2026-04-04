import React from 'react';
import './StatusBadge.css';

/**
 * Standardized Status Badge component.
 * 
 * Props:
 * - type: 'cash' | 'transfer' | 'expense' | 'opening' | 'lunas' | 'belum' | 'custom'
 * - children: ReactNode (optional, overrides default label)
 */
const StatusBadge = ({ type, children }) => {
  const configs = {
    cash: { label: 'Cash', className: 'badge-cash' },
    transfer: { label: 'Transfer', className: 'badge-transfer' },
    expense: { label: 'Keluar', className: 'badge-expense' },
    opening: { label: 'Saldo Awal', className: 'badge-opening' },
    lunas: { label: '✓ Lunas', className: 'badge-lunas' },
    belum: { label: '⚠ Belum', className: 'badge-belum' },
    custom: { label: children || 'Custom', className: 'badge-custom' },
  };

  const config = configs[type] || configs.custom;

  return (
    <span className={`status-badge ${config.className}`}>
      {children || config.label}
    </span>
  );
};

export default StatusBadge;
