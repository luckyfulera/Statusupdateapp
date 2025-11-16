// Entry point for the React application
// This file renders the main App component into the DOM root element
// It serves as the bridge between React and the HTML document

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// Create React root and render the application
// StrictMode enables additional development checks and warnings
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
