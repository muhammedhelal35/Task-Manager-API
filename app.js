const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { NODE_ENV } = require('./config/env');
const logger = require('./utils/logger');

const app = express();


app.use(cors());
app.use(helmet());
app.use(express.json());

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}


app.use('/api/users', require('./routes/user.routes'));
app.use('/api/tasks', require('./routes/task.routes'));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found'
  });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;