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

const getUserDetails  = async (req, res) => {
    try{
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({error: "User not authorized"});
        }
        const details = await UserDAO.getUserById(userId);
        if(!details) return res.status(404).json({error: "Unable retrieve user details"});
        return res.status(200).json({
            message: "Successfully retrieved user details",
            payload: {
                id: details.id,
                username: details.username,
                created_at: details.created_at,
                email: details.email
            }
        })
    }catch(err){
        console.log("Error while getting user details list: ", err);
        return res.status(500).json({error: "Internal Server Error"});
    }
};

const updateUser = async (req, res) => {
    try{
        const user_id = req.user?.id;
        const {username, email, pre_password, new_password, con_password} = req.body;
        if (!user_id) {
            return res.status(401).json({error: "User not authorized"});
        }
        if(!username || !email){
            return res.status(400).json({error: "Username and Email are required"});
        }
        let isPasswordChanged = false;
        if(pre_password || new_password || con_password){
            if(pre_password === '' || new_password === '' || con_password === ''){
                return res.status(400).json({error: "Required fields are missing"});
            }else if(new_password !== con_password){
                return res.status(400).json({error: "Confirm Passwords do not match"});
            }
            const userData = await UserDAO.getUserById(user_id);
            const isMatch = await bcrypt.compare(pre_password, userData.password);
            if(!isMatch){
                return res.status(401).json({error: "Incorrect Passwords do not match"});
            }
            const hashedPsw = await bcrypt.hash(new_password, 10);
            const change = await UserDAO.updatePassword(user_id, hashedPsw);
            if(!change || change === 0){
                return res.status(404).json({error: "Update password unsuccessful"});
            }
            isPasswordChanged = true;
        }
        const userData = {
            username: username,
            email: email,
        }
        const change = await UserDAO.updateUser(user_id, userData);
        if(!change || change === 0){
            return res.status(404).json({error: "User update failed"});
        }
        if(isPasswordChanged || change > 0){
            return res.status(200).json({message: "User update successful"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {createUser, getUsernameList, getUserDetails, updateUser}