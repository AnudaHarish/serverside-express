const UserDAO = require("../dao/UserDAO");
const {ca} = require("date-fns/locale");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    try {
        const {name, psw} = req.body;

        //check both name and psw exist
        if (!name || !psw) return res.status(400).json({message: "Username and Password are required"});

        //check username already exist
        const duplicateUser = await UserDAO.getAllUsers.find(user => user.username === name);
        if (duplicateUser) return res.status(409).json({message: "Username already exists"});

        //create hashed password
        const hashedPsw = await bcrypt.hash(psw, 10);

        //create user
        await UserDAO.createUser(name, hashedPsw);
        return res.status(201).json("message: ", `user ${name} created successfully.`);

    } catch (err) {
        console.log("Error was occurred: ", err);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

const getUsernameList = async (req, res) => {
    try {
        const getUsers = await UserDAO.getAllUsers();
        const userNames = getUsers.map((user) => user.username);
        return res.status(200).json({
            message: "Successfully retrieved username list",
            payload: userNames
        });
    } catch (err) {
        console.log("Error while getting users list: ", err);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {createUser, getUsernameList}