const RefreshDAO = require("../dao/RefreshTokenDAO");

const handleLogout = async (req, res) => {
    try{
        const cookies = req.cookies;
        if(!cookies.refreshToken) return res.sendStatus(204);
        // content is empty
        const refreshToken = cookies.refreshToken;
        const deleted = await RefreshDAO.delete(refreshToken);
        res.clearCookie(
            "refreshToken",
            {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}
        );
        return deleted > 0 ?
            res.sendStatus(204) //successfully deleted
            : res.sendStatus(204); // Token didn't exist but cookie was cleared
    }catch (err){
        console.log("Error was occurred: ", err);
        return res.status(500).json({
            "error": "Internal server error",
            "message": err.message
        });
    }
}

module.exports = {handleLogout};