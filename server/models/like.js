const mongoose = require('mongoose')
const Schema = mongoose.Schema

var likeSchema = Schema({
    // _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
});
//
// const populate = function(next){
//     this.select('myid userid');
//     next();
// };
//
// likeSchema.pre('find', populate);
// likeSchema.pre('findById', populate);
// likeSchema.pre('findOne', populate);


module.exports = mongoose.model('Like', likeSchema);
