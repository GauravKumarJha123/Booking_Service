const {createLogger, transports, format, level } = require('winston');
const { combine, timestamp, errors, colorize, printf } = format;

const customLevels = {
    levels : {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
    },
    colors :{
        error : 'red',
        warn : 'yellow',
        info : 'green',
        http : 'magenta',
        verbose : 'pink',
        debug : 'blue',
        silly : 'violet'
    }
}

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});


const loggerConfig = {
    levels: customLevels.levels,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Include stack trace if available
        myFormat
    ),
    transports: [
    ]
};

if (process.env.NODE_ENV === 'production') {
    loggerConfig.transports.push(
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    );
} else {
    loggerConfig.transports.push(
        new transports.Console({
            format: combine(
                colorize(), // Colorize log output for better readability
                myFormat
            )
        })
    );
}

const logger = createLogger(loggerConfig);

module.exports = logger;