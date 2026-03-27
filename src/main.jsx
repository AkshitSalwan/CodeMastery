import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Only use StrictMode in development for debugging, not in production
const root = ReactDOM.createRoot(document.getElementById('root'));
if (import.meta.env.DEV) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  root.render(<App />);
}
