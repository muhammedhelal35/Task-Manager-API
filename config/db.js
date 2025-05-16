const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(MONGODB_URI)
      .then(() => {
        logger.info('Database connection successful');
      })
      .catch(err => {
        logger.error('Database connection error:', err);
      });
  }
}

module.exports = new Database();