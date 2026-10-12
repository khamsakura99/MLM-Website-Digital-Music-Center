/**
 * OMC MLM Enterprise System - Production Node.js Server
 * Run with: node server.js
 */
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', system: 'OMC MLM System', timestamp: new Date() });
});

// SPA fallback for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`OMC MLM Server running at http://localhost:${PORT}`);
});
