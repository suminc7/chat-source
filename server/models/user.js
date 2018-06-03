const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const config = require('../config');

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true,
    },
    nickname: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        select: false,
    },
    birthday: String,
    gender: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    date: { type: Date, default: Date.now },

}, {
    versionKey: false
});

// create new User document
userSchema.statics.create = function(email, nickname, password, birthday, gender) {
    const encrypted = crypto.createHmac('sha1', config.app.secret)
        .update(password)
        .digest('base64');

    const user = new this({
        email,
        nickname,
        password: encrypted,
        birthday,
        gender,
    });

    // return the Promise
    return user.save()
};

// find one user by using username
userSchema.statics.findOneByUserInfo = function(email, nickname) {
    return this.findOne({ $or:[ {email}, {nickname} ]}).exec()
};

userSchema.statics.findOneByEmail = function(email) {
    return this.findOne({
        email
    }).select('+password').exec()
};

userSchema.statics.findOneByNickname = function(nickname) {
    return this.findOne({
        nickname
    }).exec()
};

userSchema.statics.findOneById = function(userId) {
    return this.findOne({
        _id: userId
    }).exec()
};


// verify the password of the User documment
userSchema.methods.verify = function(password) {
    const encrypted = crypto.createHmac('sha1', config.app.secret)
        .update(password)
        .digest('base64');

    return this.password === encrypted
};

const populate = function(next){
    this.select('-__v  -date');
    next();
};

userSchema.pre('find', populate);
userSchema.pre('findById', populate);
userSchema.pre('findOne', populate);
userSchema.pre('findOneAndUpdate', populate);




module.exports = mongoose.model('User', userSchema);