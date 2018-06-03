
/**
 * database config
 * @type {Object}
 */
exports.db = {
    //database
    host : process.env.MONGO_HOST ? `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}` : `mongodb://localhost/chat`,
    user : 'root',
    debug : false
};

exports.redis = {
    host : process.env.REDIS_SERVICE_HOST || process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost',
    port : process.env.REDIS_SERVICE_PORT || 6379,
};

/**
 * websocket config
 * @type {Object}
 */
exports.ws = {
    interval : 5000,
    minDistance : 500
};

/**
 * app config
 * @type {Object}
 */
exports.app = {
    port : process.env.PORT || 8080,
    mode : 'dev',
};