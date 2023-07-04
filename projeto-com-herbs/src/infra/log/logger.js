const winston = require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.Console()
    ]
}

const { info, warn, error, log } = winston.createLogger(logConfiguration);

module.exports = { info, warn, error, log }