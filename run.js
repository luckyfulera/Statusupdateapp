// Production server script for the Teacher & Student Portal application
// Serves the built React application using Express.js in production mode
// Handles SPA routing and serves static files from the dist directory

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file and directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express application
const app = express();
const port = 3000;

// Serve static files from the 'dist' directory (built React app)
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - return the main index.html for all routes
// This ensures React Router can handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Press Ctrl+C to stop the server');
});
