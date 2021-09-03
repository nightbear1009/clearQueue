const bunyan = require('bunyan');
const bunyanLog = bunyan.createLogger({
    name: 'airflow-notifier',
});

const LOG_LEVEL = process.env.Log_LEVEL ? process.env.Log_LEVEL: 2;

if (LOG_LEVEL === 0) {
    bunyanLog.level(bunyan.TRACE);
} else if (LOG_LEVEL === 1) {
    bunyanLog.level(bunyan.DEBUG);
} else if (LOG_LEVEL === 2) {
    bunyanLog.level(bunyan.INFO);
} else if (LOG_LEVEL === 3) {
    bunyanLog.level(bunyan.WARN);
} else if (LOG_LEVEL === 4) {
    bunyanLog.level(bunyan.ERROR);
} else {
    bunyanLog.level(bunyan.FATAL);
}

const formatLogData = (tag, data, error) => {
    return {
        tag,
        data,
        err: error
            ? {
                  message: error.message,
                  name: error.name,
                  stack: IS_ENABLE_ERROR_STACK ? error.stack : null,
              }
            : null,
    };
};

const debug = (tag, msg, data) => {
    bunyanLog.debug({ ...formatLogData(tag, data), type: 'DEBUG' }, msg);
};

const info = (tag, msg, data) => {
    bunyanLog.info({ ...formatLogData(tag, data), type: 'INFO' }, msg);
};

const warn = (tag, msg, data) => {
    bunyanLog.warn({ ...formatLogData(tag, data), type: 'WARN' }, msg);
};

const error = (tag, msg, error, data) => {
    bunyanLog.error({ ...formatLogData(tag, data, error), type: 'ERROR' }, msg);
};

module.exports = {
    debug,
    info,
    warn,
    error
};