const os = require('os');

const morgan = require('morgan');
const config = require('./config');
const bodyParser = require('body-parser');
const app = require('express')();
const auth = require('./src/passport');
// const statusMonitor = require('express-status-monitor')();
const socketMW = require('./middlewares/socket');

const env = require('node-env-file')(__dirname + '/.env');
const redis = require('./src/redis');
const db = require('./src/mongodb');

//socket
const server = require('http').createServer(app);
global.io = io = require('socket.io')(server, {pingTimeout: 30000});
io.use(socketMW.authentication());
require('./src/io')(io);
require('./socket')(io);
// console.log('io', io)


// Redis Adapter.
const adapter = require('socket.io-redis')(config.redis);
adapter.pubClient.on('error', redisError);
adapter.subClient.on('error', redisError);
io.adapter(adapter);



// app.use(statusMonitor);
// app.use(socketMW.socket(io));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(auth.initialize());
app.use('/api', require('./middlewares/routes').contentType);
app.use('/api', require('./routes/api'));
app.get('/', (req, res) => res.send('chat in ' + os.hostname()));
app.use(require('./middlewares/routes').notFound);


/**
 * redis error
 * @param err
 */
function redisError(err) {
    throw new Error('Redis error ' + err);
}

server.listen(config.app.port, () => {
    console.log(`Express is running on port ${config.app.port}, running on node ${process.version} Chat in ${os.hostname()}`)
});


module.exports = server;