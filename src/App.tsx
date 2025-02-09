import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Leaderboard from './pages/Leaderboard';
import SubmitIdea from './pages/SubmitIdea';
import VoteIdeas from './pages/VoteIdeas';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-black flex flex-col">
        <div className="pb-20 md:pt-20 md:pb-0">
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 text-black dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-4xl font-serif font-bold">
              Network School Community Ideaboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Share and vote on ideas you wish to see come alive at NS
            </p>
          </div>
          <Routes>
            <Route path="/" element={<SubmitIdea />} />
            <Route path="/vote" element={<VoteIdeas />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
        <footer className="mt-auto text-center py-4 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800">
          Built with ❤️ by Shabbir Haider (NSv1 Cohort)
        </footer>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;