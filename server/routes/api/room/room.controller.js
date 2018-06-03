const Room = require('../../../models/room');
const HttpStatus = require('http-status-codes');

exports.list = (req, res) => {
    // let page = 1;
    const page = req.query.page || 1;



    Room.list(page)
        .then(rooms => {
            res.json({rooms})
        })
};

exports.create = (req, res) => {

    const {
        title,
        maxUser,
        tags,
    } = req.body;

    console.log('req', req.user);
    // respond to the client
    const respond = (id) => {
        res.json({
            id
        })
    };

    // run when there is an error (username exists)
    // TODO: change status code
    const onError = (error) => {
        res.status(401).json({
            message: error.message
        })
    };

    // check username duplication
    Room.create({ creator: req.user.id.toString(), title, maxUser, tags: tags.toString() })
        .then(respond)
        .catch(onError)

};

/*
    GET /api/room/:id
*/
exports.info = (req, res) => {

    const {
        id
    } = req.params;

    console.log('id', id)

    const respond = (value) => {
        if(value) res.json(value)
    };

    const onError = (error) => {
        res.status(error).json({
            message: HttpStatus.getStatusText(error)
        })
    };

    Room.info(id)
        .then(respond)
        .catch(onError)


};

/*
    PUT /api/room/:id
*/
exports.update = (req, res) => {


    const {
        id
    } = req.params;

    // const {
    //     title,
    //     maxUser,
    //     tags,
    // } = req.body;

    const respond = (value) => {
        if(value) res.json(value)
    };

    const onError = (error) => {
        res.status(error).json({
            message: HttpStatus.getStatusText(error)
        })
    };

    Room.update(id, req.body)
        .then(respond)
        .catch(onError)


}


/*
    GET /api/room/search
*/
exports.search = (req, res) => {
    const {
        page,
        q
    } = req.query;


    const respond = (value) => {
        if(value) res.json(value)
    };

    const onError = (error) => {
        res.status(error).json({
            message: HttpStatus.getStatusText(error)
        })
    };

    Room.search(page, q)
        .then(respond)
        .catch(onError)

}

/*
    GET /api/room/:id/users
*/
exports.users = (req, res) => {
    const {
        id
    } = req.params;


    const respond = (value) => {
        if(value) res.json(value)
    };

    const onError = (error) => {
        res.status(error).json({
            message: HttpStatus.getStatusText(error)
        })
    };


    Room.userlist(1, 'users:'+id)
        .then(respond)
        .catch(onError)

}