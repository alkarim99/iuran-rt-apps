import React from 'react';
import './PageHeader.css';

/**
 * Standardized Page Header.
 * 
 * Props:
 * - title: string
 * - breadcrumb: string[]
 * - actions: ReactNode
 */
const PageHeader = ({ title, breadcrumb = [], actions }) => {
  return (
    <div className="page-header">
      <div className="page-header-info">
        <h1 className="page-title">{title}</h1>
        {breadcrumb.length > 0 && (
          <div className="page-breadcrumb">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                <span className={index === breadcrumb.length - 1 ? 'last' : ''}>
                  {item}
                </span>
                {index < breadcrumb.length - 1 && <span className="sep">›</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
};

export default PageHeader;
