const UserDAO = require("../dao/UserDAO");
const RefreshDAO = require("../dao/RefreshTokenDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
    try{
        const {email, psw} = req.body;

        //check both name and psw exist
        if(!email || !psw) return res.status(400).json({"message": "Email and Password are required"});

        //check user
        const allUsers = await UserDAO.getAllUsers();
        if(allUsers.length > 0){
            const selectedUser = allUsers.find(user => user.email === email);
            console.log(selectedUser);
            if(!selectedUser) return res.status(400).json({"message": "User not found"});
            //check password
            const isMatch = await bcrypt.compare(psw, selectedUser.password);
            if(isMatch){
                //delete previously created refresh tokens
                await RefreshDAO.deleteByUser(selectedUser.id);
                //create jwt token
                const accessToken = jwt.sign(
                    {"user" : {id: selectedUser.id, username: selectedUser.username}},
                    process.env["ACCESS_TOKEN_SECRET"],
                    {expiresIn: "10m"}
                );
                const refreshToken = jwt.sign(
                    {"user": {id: selectedUser.id, username: selectedUser.username}},
                    process.env["REFRESH_TOKEN_SECRET"],
                    {expiresIn: "1d"}
                );
                //store refresh token
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                await RefreshDAO.create(refreshToken, selectedUser.id, expiresAt);
                res.cookie("refreshToken", refreshToken, { httpOnly: true , maxAge: 24 * 60 * 60 * 1000});
                return res.status(200).json({accessToken});
            }else{
                return res.status(401).json({"message": "Email or Password is incorrect"});
            }
        }else{
            return res.status(401).json({"message": "User not found"});
        }
    }catch (err){
        console.log("Error was occurred: ", err);
        return res.status(500).json({
            "error": "Internal server error",
            "message": err.message
        });
    }
}

const checkAuthentication = async (req, res) => {
    try{
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(404).json({message: "Logout required"});
        console.log("authheader",authHeader);
        const token = authHeader.split(' ')[1].trim();
        console.log("token",token);
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET,
                (err, decoded) => {
                    if(err) {
                        return reject(err);
                    }
                    resolve(decoded);
                }
            )
        })
        req.user = {
            id: decoded.user.id,
            username: decoded.user.username
        }
        return res.status(200).json({message: "Authentication successful"});
    }catch(err){
        console.log("Error in verifyJwt", err);
        if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Refresh required" });
        }
        return res.status(500).json({ message: "Logout required" });
    }
}
// const jwt.verify(
//     token,
//     process.env.ACCESS_TOKEN_SECRET,
//     (err, decoded) => {
//         if (err) {
//             //invalid token
//             return res.status(401).json({message: "Refresh required"});
//         }
//         req.user = {
//             id: decoded.user.id,
//             username: decoded.user.username
//         }
//         return res.status(200).json({message: "Authentication successful"});
//     }
// )
module.exports = {login, checkAuthentication};