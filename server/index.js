require('dotenv').config();
const express = require('express');

// Use global fetch when available (Node 18+). Otherwise fall back to node-fetch if installed.
let fetch = globalThis.fetch;
if (!fetch) {
  try {
    // eslint-disable-next-line global-require
    fetch = require('node-fetch'); // optional dependency for older Node versions
  } catch (err) {
    console.warn('`fetch` is not available globally and `node-fetch` is not installed. API routes that call external services will fail.');
  }
}

// initialize express
const app = express();
app.use(express.json());

// Temporarily skip database setup due to sqlite3 binding issues
// TODO: Fix sqlite3 native bindings or use better-sqlite3

// basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Judge0 proxy route - executes code
app.post('/api/run', async (req, res) => {
  const { language, code, stdin } = req.body || {};

  if (!code || !language) {
    return res.status(400).json({ error: 'Missing code or language' });
  }

  // Map frontend language keys to Judge0 language IDs
  const languageMap = {
    javascript: 63, // JavaScript (Node.js)
    python: 71,     // Python (3.x)
    java: 62,       // Java (OpenJDK)
    cpp: 54,        // C++ (GCC)
  };

  const language_id = languageMap[language];

  if (!language_id) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }

  try {
    const baseUrl = process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com';
    const apiKey = process.env.JUDGE0_API_KEY;

    const response = await fetch(
      `${baseUrl}/submissions?base64_encoded=false&wait=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'X-RapidAPI-Key': apiKey } : {}),
        },
        body: JSON.stringify({
          source_code: code,
          language_id,
          stdin: stdin || '',
        }),
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('Judge0 error:', err);
    return res.status(500).json({ error: 'Failed to execute code' });
  }
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
