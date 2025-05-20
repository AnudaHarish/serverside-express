const jwt = require('jsonwebtoken');
const {de} = require("date-fns/locale");
require('dotenv').config();

const verifyJwt = async (req, res, next) => {
    try{
        const authHeader = req.headers['authorization'];
        const cookie = req.cookies;
        if(!authHeader || !cookie || !cookie.refreshToken) return res.status(403).json({error:'Unauthorized'});
        console.log(authHeader);
        //verify refresh token
        const refreshData = await new Promise((resolve, reject) => {
            jwt.verify(
                cookie.refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if(err) {
                        return reject({error: 'Error retrieving data'});
                    }
                    resolve(decoded.user)
                }
            )
        });
        //verify access token
        const token = authHeader.split(' ')[1];
        const decoded = await new Promise((resolve, reject) =>{
            jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET,
                (err, decoded) => {
                    if (err) return reject({error: "Access token expired"});
                    resolve(decoded.user);
                }
            );
        })
        if(decoded.id !== refreshData.id){
            return res.status(403).json({error: 'Error retrieving data'})
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        next();
    }catch(err){
        console.error("Error in verifyJwt", err.error);
        return res.status(500).json(err.error);
    }
}

module.exports = verifyJwt;