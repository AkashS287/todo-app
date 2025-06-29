import React from 'react';               // 👈 Ensure this is here
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';                    // 👈 Replace with App.css if you're not using index.css
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
