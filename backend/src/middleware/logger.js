const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log')
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Morgan middleware for HTTP logging
const morgan = require('morgan');
const morganStream = {
  write: (message) => logger.info(message.trim())
};

const httpLogger = morgan('combined', { stream: morganStream });

module.exports = logger;
module.exports.httpLogger = httpLogger;
