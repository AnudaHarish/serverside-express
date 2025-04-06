const UserDAO = require("../dao/UserDAO");
const RefreshDAO = require("../dao/RefreshTokenDAO");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
    try{
        const cookies = req.cookies;
        if(!cookies.refreshToken) return res.sendStatus(400);
        const refreshToken = cookies.refreshToken;
        console.log(refreshToken);
        //check refresh token
        const allTokens = await RefreshDAO.getAllTokens();
        console.log(allTokens);
        if(allTokens.length > 0){
            const selectedRefreshToken = allTokens.find(obj => obj.token === refreshToken);
            console.log(selectedRefreshToken);
            if(!selectedRefreshToken) return res.status(400).json({"message": "User not found"});
            //find user by id
            const user =await UserDAO.getUserById(selectedRefreshToken.user_id);
            console.log(user);
            if(!user) return res.status(400).json({"message": "User not found"});
            //jwt verify
            jwt.verify(
                refreshToken,
                process.env["REFRESH_TOKEN_SECRET"],
                (err, decoded) => {
                    if(err || user.username !== decoded.username) return res.sendStatus(403);
                    const accessToken = jwt.sign(
                        {"username" : decoded.username},
                        process.env["ACCESS_TOKEN_SECRET"],
                        {expiresIn: "30s"}
                    );
                    res.status(200).json({accessToken});
                });
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

module.exports = {handleRefreshToken};