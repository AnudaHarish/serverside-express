const {logEvents} = require('./customLogger');
const error = (err, req, res, next) => {
    logEvents(`${err.name}\t${err.message}`, 'errorLog.txt');
    console.error(err.stack);
    res.status(500).send(err.message);
}

module.exports = error;