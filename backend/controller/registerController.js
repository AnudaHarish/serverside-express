const UserDAO = require("../dao/UserDAO");
const {ca} = require("date-fns/locale");
const bcrypt = require("bcrypt");


const createUser = async (req, res) => {
    try {
        const {name, psw} = req.body;

        //check both name and psw exist
        if (!name || !psw) return res.status(400).json({"message": "Username and Password are required"});

        //check username already exist
        // const rows = await UserDAO.getAllUsers();
        // return res.status(200).json({"data": rows});
        const allUsers = await UserDAO.getAllUsers();
        if(allUsers.length > 0){
            const duplicateUser = allUsers.find(user => user.username === name);
            if (duplicateUser) return res.status(409).json({"message": "Username already exists"});
        }


        //create hashed password
        const hashedPsw = await bcrypt.hash(psw, 10);

        //create user
        const userData = {
            "username": name,
            "password": psw,
        }
        await UserDAO.createUser(userData);
        return res.status(201).json({"message":`user ${name} created successfully.`});
    } catch (err) {
        console.log("Error was occurred: ", err);
        res.status(500).json({
            "error": "Internal Server Error",
            "message": err.message
        })
    }
}

module.exports = {createUser};
