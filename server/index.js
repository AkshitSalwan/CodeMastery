const express = require('express');

// initialize express
const app = express();
app.use(express.json());

// Temporarily skip database setup due to sqlite3 binding issues
// TODO: Fix sqlite3 native bindings or use better-sqlite3

// basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// serve static frontend built files when in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
