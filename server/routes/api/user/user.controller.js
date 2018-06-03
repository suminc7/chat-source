const mongoose = require('mongoose')
const User = require ('../../../models/user')
const Like = require ('../../../models/like')

/*
    GET /api/user/list
*/

exports.list = (req, res) => {
    // refuse if not an admin
    // if(!req.decoded.admin) {
    //     return res.status(403).json({
    //         message: 'you are not an admin'
    //     })
    // }

    User.find({})
        .populate('likes', '-_id -likes -birthday')
        .then(
            users => {
                res.json({users})
            }
        )

}


exports.like = (req, res) => {
    const {
        id
    } = req.body

    User.findOne({'_id': req.user.id, likes: id })
        .select('-__v')
        .then(user => {
            user.likes.pull(id)
            user.save(() => {
                console.log(user)
                res.json({
                    result: user,
                })
            })
        })
        .catch(err => {
            User.findOneAndUpdate({_id: req.user.id}, {$push: {likes: id}}, {new: true, upsert: true}, (err, user) => {
                // console.log(err, user)
                res.json({
                    result: user,
                })
            })
        })
}
exports.deleteLike = (req, res) => {
    const {
        id
    } = req.body

    User.findOneById(req.user.id)
        .then(user => {
            user.likes.pull(id)
            user.save()

            res.json({
                result: user,
            })
        })
}
exports.getLike = (req, res) => {

    User.findOne({ _id: req.user.id }).
        populate('likes', '-_id -likes -birthday').
        then(user => {
            res.json({
                result: user,
            })
        })
}

exports.profile = (req, res) => {
    // console.log(req)
    res.json({
        success: true,
        info: req.decoded
    })
}