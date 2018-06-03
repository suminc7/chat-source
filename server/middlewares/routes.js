const HttpStatus = require('http-status-codes');

exports.contentType = (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
        return res.status(400).send({message: HttpStatus.getStatusText(400)});
    next();
}


exports.notFound = (req, res, next) => {
    res.status(404).send({ message: HttpStatus.getStatusText(404) });
}