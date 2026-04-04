import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalendarDays, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import './Topbar.css';

const Topbar = ({ toggleSidebar, title, subtitle }) => {
  const currentMonth = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date());
  const currentYear = new Date().getFullYear();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-toggle" onClick={() => toggleSidebar(true)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="topbar-page-info">
          <h2 className="topbar-title">{title}</h2>
          {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div className="period-badge">
          <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
          <span>{currentMonth} {currentYear}</span>
        </div>
        <div className="topbar-sep" />
        <div className="topbar-user">
          <FontAwesomeIcon icon={faCircleUser} size="lg" className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
