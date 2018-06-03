var mongoose = require('mongoose');
require('./connect')

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var schema = new Schema({
    name: {
        type: String,
        // Will trigger a MongoError with code 11000 when
        // you save a duplicate
        unique: true
    }
});

var Person = mongoose.model('Person', schema);

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
schema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next(error);
    }
});

// Will trigger the `post('save')` error handler
Person.create([{ name: 'Axl Rose' }, { name: 'Axl Rose' }]);