import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme, colors } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as any)}
      className="mt-1 block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      style={{ backgroundColor: colors.secondary, color: colors.text, borderColor: colors.accent }}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="spring">Spring</option>
      <option value="summer">Summer</option>
      <option value="fall">Fall</option>
      <option value="halloween">Halloween</option>
      <option value="winter">Winter</option>
      <option value="christmas">Christmas</option>
    </select>
  );
};

export default ThemeSelector;