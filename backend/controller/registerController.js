const UserDAO = require("../dao/UserDAO");
const {ca} = require("date-fns/locale");
const bcrypt = require("bcrypt");


const createUser = async (req, res) => {
    try {
        const {username, email, new_password} = req.body;

        //check both name and psw exist
        if (username === '' || email === '' || new_password === '') return res.status(400).json({"message": "Username and Password are required"});

        //check username already exist
        // const rows = await UserDAO.getAllUsers();
        // return res.status(200).json({"data": rows});
        const allUsers = await UserDAO.getAllUsers();
        if(allUsers.length > 0){
            const duplicateUser = allUsers.find(user => user.email === email);
            if (duplicateUser) return res.status(409).json({"message": "email already exists"});
        }

        //create hashed password
        const hashedPsw = await bcrypt.hash(new_password, 10);

        //create user
        const userData = {
            "username": username,
            "password": hashedPsw,
            "email": email
        }
        await UserDAO.createUser(userData);
        return res.status(201).json({"message":`user ${username} created successfully.`});
    } catch (err) {
        console.log("Error was occurred: ", err);
        res.status(500).json({
            "error": "Internal Server Error",
            "message": err.message
        })
    }
}

module.exports = {createUser};
