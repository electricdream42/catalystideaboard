import { Home, LightbulbIcon, Trophy, Vote } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'Submit Ideas' },
    { to: '/vote', icon: Vote, label: 'Vote' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t dark:border-gray-800 px-4 py-2 md:top-0 md:bottom-auto">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center">
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm mt-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}