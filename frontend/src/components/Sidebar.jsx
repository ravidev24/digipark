import React from 'react';
import { LayoutDashboard, CalendarDays, MapPin, User, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'parking', icon: <MapPin size={20} />, label: 'Find Parking' },
    { id: 'bookings', icon: <CalendarDays size={20} />, label: 'My Bookings' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className="sidebar-container glass">
      <div className="sidebar-header">
        <div className="logo-icon glass">
          <MapPin size={24} color="#6366f1" />
        </div>
        <h3>ParkPro</h3>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="menu-item logout">
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
