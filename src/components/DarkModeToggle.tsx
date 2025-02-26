import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Show tooltip briefly when toggled
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1500);
  };

  return (
    <div className="dark-toggle-container">
      <button 
        onClick={toggleDarkMode} 
        className="dark-toggle"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setTimeout(() => setShowTooltip(false), 1500)}
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-purple-600" />
        )}
      </button>
      {showTooltip && (
        <div className="dark-mode-tooltip">
          {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        </div>
      )}
    </div>
  );
} 