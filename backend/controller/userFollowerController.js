const UserFollowerDAO = require("../dao/userFollowDAO");
const UserDAO = require("../dao/UserDAO");

//get user follower list
const getFollowerList = async (req, res) => {
    try{
        //get following_id
        const following_id = req.user?.id;
        //valid id
        if(!following_id){
            return res.status(401).json({error: "user not authorised"});
        }
        //get followers ids
        const followersArr = await UserFollowerDAO.getFollowers(following_id);
        if(!followersArr || followersArr.length === 0){
            return res.status(200).json({
                message: "No followers found",
                payload: []
            });
        }
        //get userData
        const users = await UserDAO.getAllUsers();
        //creating the map
        const userMap = new Map (users.map((u) => [u.id, u]));
        followersArr.forEach(user => {
            const data = userMap.get(user.follower_id);
            user.followerData = data ? {
                username : data?.username || "Unknown",
                email : data?.email || "Unknown"
            } : null;
        });
        return res.status(200).json({
            message: "followers were found",
            payload: followersArr
        })
    }catch (err){
        console.error("Error getting followers", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//getting user following list
const getFollowingList = async (req,res) => {
    try{
        //get following_id
        const follower_id = req.user?.id;
        //valid id
        if(!follower_id){
            return res.status(401).json({error: "user not authorised"});
        }
        //get followers ids
        const followingArr = await UserFollowerDAO.getFollowings(follower_id);
        if(!followingArr ||followingArr.length === 0){
            return res.status(200).json({
                message: "No followings found",
                payload: []
            });
        }
        //get userData
        const users = await UserDAO.getAllUsers();
        //creating the map
        const userMap = new Map (users.map((u) => [u.id, u]));
        followingArr.forEach(user => {
            const data = userMap.get(user.following_id);
            user.followingData = data ? {
                username : data?.username || "Unknown",
                email : data?.email || "Unknown"
            } : null;
        });
        return res.status(200).json({
            message: "followings were found",
            payload: followingArr
        })
    }catch (err){
        console.error("Error getting followings", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//create user follower relation
const followUser = async (req, res) => {
    try{
        //get user
        const follower_id = req.user?.id;
        const {following_id} = req.body;
        //validate user
        if(!follower_id){
            return res.status(401).json({error: "user not authorised"});
        }
        if(!following_id){
            return res.status(400).json({error: "following id is required"});
        }
        if(follower_id === following_id){
            return res.status(400).json({error: "You can't follow yourself"});
        }
        //create relation
        const row_id = await UserFollowerDAO.follow(follower_id, following_id);

        if(row_id === undefined || row_id === null){
            return res.status(400).json({error : "Error following user "});
        }
        return res.status(200).json({
            message: "User following was successfully created",
            payload: row_id
        });
    }catch (err){
        console.error("Error following user ", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//unfollow user
const unfollowUser = async (req, res) => {
    try{
        //get user
        const follower_id = req.user?.id;
        const following_id = req.params?.id;
        //validate user
        if(!follower_id){
            return res.status(401).json({error: "user not authorised"});
        }
        if(!following_id){
            return res.status(400).json({error: "following id is required"});
        }
        if(follower_id === following_id){
            return res.status(400).json({error: "You can't unfollow yourself"});
        }
        //create relation
        const change = await UserFollowerDAO.unfollow(follower_id, following_id);

        if(!change){
            return res.status(400).json({error : "Error in unfollowing user"});
        }
        return res.status(200).json({
            message: "User was successfully unfollowed",
            payload: following_id
        });
    }catch (err){
        console.error("Error following user ", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

const getFollowersByUsername = async (req, res) => {
    try {
        const {username} = req.query;
        if(!username){
            return res.status(400).json({error: "Username is required"});
        }
        const followerQuery = `
                SELECT u.id, u.username, uf.followed_at
                FROM user_follows uf
                JOIN users u ON uf.follower_id = u.id
                WHERE (? IS NULL OR u.username LIKE ?);
        `;

        const followers = await UserFollowerDAO.queryAll(followerQuery, [`%${username}%`]);
        res.status(200).json({
            message: "Followers were found",
            payload: followers
        });
    }catch(err){
        console.error("Error getting following user", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

const getFollowingsByUsername = async (req, res) => {
    try {
        const {username} = req.query;
        if(!username){
            return res.status(400).json({error: "Username is required"});
        }
        const followerQuery = `
                SELECT u.id, u.username, uf.followed_at
                FROM user_follows uf
                JOIN users u ON uf.following_id = u.id
                WHERE (? IS NULL OR u.username LIKE ?);
        `;

        const followings = await UserFollowerDAO.queryAll(followerQuery, [`%${username}%`]);
        res.status(200).json({
            message: "Followings were found",
            payload: followings
        });
    }catch(err){
        console.error("Error getting following user", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

const getUsersNotFollowed = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "User not authorized" });
        }

        const query = `
            SELECT u.id, u.username
            FROM users u
            LEFT JOIN user_follows uf ON u.id = uf.following_id AND uf.follower_id = ?
            WHERE uf.following_id IS NULL;
        `;

        const usersNotFollowed = await UserFollowerDAO.queryAll(query, [userId]);
        return res.status(200).json({
            message: "Followings were found",
            payload: usersNotFollowed
        });
    } catch (err) {
        console.error("Error fetching users not followed", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
module.exports = {getFollowerList, getFollowingList, followUser, unfollowUser, getFollowingsByUsername, getFollowersByUsername, getUsersNotFollowed}