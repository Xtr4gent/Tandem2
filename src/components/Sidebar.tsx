import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, BarChart2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { colors } = useTheme();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
  ];

  return (
    <nav className="w-20 min-h-screen flex flex-col items-center py-8" style={{ backgroundColor: colors.cardBackground }}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`p-3 rounded-full mb-6 transition-colors duration-200 ${
            location.pathname === item.path ? 'bg-blue-500' : ''
          }`}
          style={{
            color: location.pathname === item.path ? colors.cardBackground : colors.text,
            backgroundColor: location.pathname === item.path ? colors.primary : 'transparent',
          }}
        >
          <item.icon size={24} />
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;