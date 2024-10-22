import React, { useState } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';

const UserSettingsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const { colors } = useTheme();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full"
        style={{ color: colors.accent }}
      >
        <Settings size={20} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10" style={{ backgroundColor: colors.background }}>
          <div className="px-4 py-2">
            <p className="text-sm font-medium" style={{ color: colors.primary }}>Theme</p>
            <ThemeSelector />
          </div>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm"
            style={{ color: colors.text, backgroundColor: colors.secondary }}
          >
            <LogOut size={16} className="inline mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSettingsMenu;