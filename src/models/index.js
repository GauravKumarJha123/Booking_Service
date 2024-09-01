'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const basename = path.basename(__filename);
const db = {};

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Sequelize with environment variables
const sequelize = new Sequelize(
  process.env.DEV_DATABASE,
  process.env.DEV_USERNAME,
  process.env.DEV_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DEV_PORT || 3306,
    dialect: 'mysql',
    logging: false,  // You can enable this for debugging purposes
  }
);

// Read through the models directory and import all models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&  // Ignore hidden files
      file !== basename &&  // Ignore this file (index.js)
      file.slice(-3) === '.js' &&  // Only consider .js files
      file.indexOf('.test.js') === -1  // Ignore test files
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up associations if any models have defined them
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the sequelize connection and Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
