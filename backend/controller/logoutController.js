const RefreshDAO = require("../dao/RefreshTokenDAO");

const handleLogout = async (req, res) => {
    try{
        const cookies = req.cookies;
        console.log(cookies);
        if(!cookies.refreshToken) return res.sendStatus(204);
        // content is empty
        const refreshToken = cookies.refreshToken;
        const deleted = await RefreshDAO.delete(refreshToken);
        console.log(deleted);
        res.clearCookie(
            "refreshToken",
            {httpOnly: true}
        );
        return res.sendStatus(204) //successfully deleted
    }catch (err){
        console.log("Error was occurred: ", err);
        return res.status(500).json({
            "error": "Internal server error",
            "message": err.message
        });
    }
}

module.exports = {handleLogout};