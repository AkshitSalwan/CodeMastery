const express = require('express');
const { Sequelize } = require('sequelize');

// initialize express
const app = express();
app.use(express.json());

// setup sequelize using sqlite for simplicity; you can switch dialect to postgres/mysql later
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false,
});

// import models and sync
const db = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection established successfully.');

    // load models (example user model already in place)
    db.models.User = require('./models/user')(sequelize, require('sequelize').DataTypes);

    await sequelize.sync({ alter: true });
    console.log('Database synced');
  } catch (err) {
    console.error('Database error:', err);
  }
})();

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
