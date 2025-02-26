import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DarkModeToggle from './components/DarkModeToggle';
import Navigation from './components/Navigation';
import Leaderboard from './pages/Leaderboard';
import SubmitIdea from './pages/SubmitIdea';
import VoteIdeas from './pages/VoteIdeas';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        <DarkModeToggle />
        <div className="pb-20 md:pt-20 md:pb-0">
          <div className="bg-gradient-to-br from-white via-purple-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-200 mb-8 border-b border-slate-200 dark:border-slate-700 shadow-md relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-teal-500"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-200 dark:bg-purple-900 opacity-30 animate-pulse-custom"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-teal-200 dark:bg-teal-900 opacity-30 animate-pulse-custom" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-800 opacity-20 animate-pulse-custom" style={{ animationDelay: '0.7s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-teal-100 dark:bg-teal-800 opacity-20 animate-pulse-custom" style={{ animationDelay: '2s' }}></div>
            
            {/* Pattern overlay for texture */}
            <div className="absolute inset-0 opacity-5" style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M0 0h10v10H0V0zm10 10h10v10H10V10z\'/%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '20px 20px'
            }}></div>
            
            <div className="max-w-7xl mx-auto px-4 py-16 relative">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-8 animate-fadeIn bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-600 to-teal-600 pb-2">
                  Catalyst Group Ideaboard
                </h1>
                
                <p className="text-lg text-slate-600 max-w-2xl mb-10 animate-fadeIn dark:text-slate-300" style={{ animationDelay: '0.1s' }}>
                  Share, vote, and collaborate on innovative ideas across our organizations
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  {['Swasti', 'Vrutti', 'Fuzhio', 'Green Foundation', 'Catalyst Foundation', 'Solvist Financial Services', 'Impact Catalysts Foundation'].map((org, index) => (
                    <span 
                      key={org}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${index % 2 === 0 ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:hover:bg-purple-800/70' : 'bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900/50 dark:text-teal-200 dark:hover:bg-teal-800/70'} transition-all hover:scale-105 hover:shadow-md`}
                      style={{ animationDelay: `${0.1 * (index + 3)}s` }}
                    >
                      {org}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4">
            <Routes>
              <Route path="/" element={<SubmitIdea />} />
              <Route path="/vote" element={<VoteIdeas />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </div>
        </div>
        <footer className="mt-auto text-center py-6 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800 shadow-inner">
          <div className="max-w-7xl mx-auto px-4">
            <p>Catalyst Group — 30 Years of Social Change & Impact</p>
            <p className="mt-1 text-xs">
              <a href="https://yourstory.com/socialstory/2024/09/catalyst-group-30-years-journey-social-change-impact" 
                 className="text-purple-600 hover:text-teal-500 dark:text-purple-400 dark:hover:text-teal-400 transition-colors" 
                 target="_blank" rel="noopener noreferrer">
                Learn more about our journey
              </a>
            </p>
          </div>
        </footer>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;