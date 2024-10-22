import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Analytics: React.FC = () => {
  console.log('Rendering Analytics component');
  const { colors } = useTheme();

  return (
    <div className="p-6" style={{ backgroundColor: colors.background, color: colors.text }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>Analytics</h1>
      {/* Add your analytics content here */}
    </div>
  );
};

export default Analytics;