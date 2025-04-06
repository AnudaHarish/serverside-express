const UserDAO = require("../dao/UserDAO");
const RefreshDAO = require("../dao/RefreshTokenDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
    try{
        const {name, psw} = req.body;

        //check both name and psw exist
        if(!name || !psw) return res.status(400).json({"message": "Username and Password are required"});

        //check user
        const allUsers = await UserDAO.getAllUsers();
        if(allUsers.length > 0){
            const selectedUser = allUsers.find(user => user.username === name);
            console.log(selectedUser?.id);
            if(!selectedUser) return res.status(400).json({"message": "User not found"});

            //check password
            const isMatch = await bcrypt.compare(psw, selectedUser.password);

            if(!isMatch){
                //create jwt token
                const accessToken = jwt.sign(
                    {"username" : selectedUser.username},
                    process.env["ACCESS_TOKEN_SECRET"],
                    {expiresIn: "30s"}
                );
                const refreshToken = jwt.sign(
                    {"username": selectedUser.username},
                    process.env["REFRESH_TOKEN_SECRET"],
                    {expiresIn: "1d"}
                );
                //store refresh token
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                await RefreshDAO.create(refreshToken, selectedUser.id, expiresAt);
                res.cookie("refreshToken", refreshToken, { httpOnly: true , maxAge: 24 * 60 * 60 * 1000});
                return res.status(200).json({accessToken});
            }else{
                return res.status(401).json({"message": "Username or Password is incorrect"});
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

module.exports = {login}