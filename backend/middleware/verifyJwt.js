const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(403).send('Unauthorized');
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).send('Unauthorized'); //invalid token
            req.user = decoded.username
            next();
        }
    )
}

module.exports = verifyJwt;