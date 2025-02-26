import { Home, Trophy, Vote } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNav, setShowNav] = useState(true);
  
  // Handle scroll behavior for mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only apply scroll hiding on mobile
      if (window.innerWidth <= 768) {
        // If scrolled down more than 20px, hide nav
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowNav(false);
        } else {
          setShowNav(true);
        }
      } else {
        setShowNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Add haptic feedback for mobile devices
  const handleNavClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5); // Very subtle vibration
    }
  };

  return (
    <nav className={`fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-white dark:bg-slate-900 border-t md:border-b border-slate-200 dark:border-slate-700 shadow-md z-10 transition-transform duration-300 ${!showNav && window.innerWidth <= 768 ? 'translate-y-full md:translate-y-0' : 'translate-y-0'}`}>
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-teal-500 hidden md:block"></div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-end items-center h-16">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex flex-col md:flex-row items-center px-3 md:px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/50 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm hover:translate-y-[-2px]'
              }`
            }
            onClick={handleNavClick}
          >
            <Home className="w-6 h-6 md:w-5 md:h-5 md:mr-2" />
            <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">Submit</span>
          </NavLink>
          
          <NavLink 
            to="/vote" 
            className={({ isActive }) => 
              `flex flex-col md:flex-row items-center px-3 md:px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/50 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm hover:translate-y-[-2px]'
              }`
            }
            onClick={handleNavClick}
          >
            <Vote className="w-6 h-6 md:w-5 md:h-5 md:mr-2" />
            <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">Vote</span>
          </NavLink>
          
          <NavLink 
            to="/leaderboard" 
            className={({ isActive }) => 
              `flex flex-col md:flex-row items-center px-3 md:px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/50 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm hover:translate-y-[-2px]'
              }`
            }
            onClick={handleNavClick}
          >
            <Trophy className="w-6 h-6 md:w-5 md:h-5 md:mr-2" />
            <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">Leaderboard</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}