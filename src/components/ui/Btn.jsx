import React from 'react';
import './Btn.css';

/**
 * Standardized Button component for the redesign.
 * 
 * Props:
 * - variant: 'primary' | 'outline' | 'ghost' | 'danger'
 * - size: 'sm' | 'md' | 'lg'
 * - icon: ReactNode (optional)
 * - loading: boolean
 * - onClick: func
 * - className: string
 * - type: 'button' | 'submit' | 'reset'
 * - disabled: boolean
 */
const Btn = ({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  loading, 
  onClick, 
  children, 
  className = '', 
  type = 'button',
  disabled,
  ...props 
}) => {
  const baseClass = 'btn-rt';
  const variantClass = variant;
  const sizeClass = size;
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className} ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      ) : icon && (
        <span className="btn-rt-icon">{icon}</span>
      )}
      <span className="btn-rt-text">{children}</span>
    </button>
  );
};

export default Btn;
