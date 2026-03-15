import React from 'react';
import AnimatedBackground from '../animations/AnimatedBackground';

/**
 * Main Layout Component
 * Provides animated background and container structure
 */

const MainLayout = ({ children, showBg = true }) => {
  return (
    <div className="relative w-full min-h-screen bg-slate-950">
      {showBg && <AnimatedBackground />}
      
      {/* Main content with backdrop blur effect for depth */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
