import React from 'react';
import { Bell } from 'lucide-react';
import { useTheme, Theme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { theme, setTheme, colors } = useTheme();

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'halloween', label: 'Halloween' },
    { value: 'winter', label: 'Winter' },
    { value: 'christmas', label: 'Christmas' },
  ];

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-opacity-70" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>Tandem</h1>
          <div className="flex items-center space-x-4">
            <button className="ios-btn" style={{ backgroundColor: colors.primary, color: colors.cardBackground }}>
              <Bell size={20} />
            </button>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="ios-btn"
              style={{ backgroundColor: colors.primary, color: colors.cardBackground }}
            >
              {themes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;