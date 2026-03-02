const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

const db = {
  sequelize,
  Sequelize,
  DataTypes,
  models: {},
};

// import models here, e.g.:
// db.models.User = require('./user')(sequelize, DataTypes);

module.exports = db;
