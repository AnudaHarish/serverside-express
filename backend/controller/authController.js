const UserDAO = require("../dao/UserDAO");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    try{
        const {name, psw} = req.body;

        //check both name and psw exist
        if(!name || !psw) return res.status(400).json({"message": "Username and Password are required"});

        //check user
        const allUsers = await UserDAO.getAllUsers();
        if(allUsers.length > 0){
            const selectedUser = allUsers.find(user => user.username === name);
            if(!selectedUser) return res.status(400).json({"message": "User not found"});

            //check password
            const isMatch = await bcrypt.compare(psw, selectedUser.password);

            if(!isMatch){
                return res.status(200).json({
                    "message": "Login was successful"
                });
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