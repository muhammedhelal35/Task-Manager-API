const winston = require('winston');
const { NODE_ENV } = require('../config/env');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;