const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.host, { useMongoClient: true }, (err) => {
    // if we failed to connect, abort
    if (err) throw err;
    // we connected ok
    // createData();
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

module.exports = db;