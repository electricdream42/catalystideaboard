import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkSupabaseConnection } from './lib/supabase';

// Check Supabase connection on app start
checkSupabaseConnection()
  .then(connected => {
    if (connected) {
      console.log('✅ Successfully connected to Supabase');
    } else {
      console.error('❌ Failed to connect to Supabase');
    }
  })
  .catch(err => {
    console.error('❌ Error checking Supabase connection:', err);
  });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
