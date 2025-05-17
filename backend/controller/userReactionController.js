const UserReactionDAO = require("../dao/blogPostLikesDAO");

//like or dislike a blog post
const addingReaction = async (req, res) => {
    try{
        //get user id
        const user_id = req.user?.id;
        //get blog_post_id, is_like
        const {blog_post_id, is_like} = req.body;

        //validate inputs
        if(!user_id){
            return res.status(401).json({error: "User not authorized"});
        }
        if(!blog_post_id || typeof(is_like) !== "number" || (is_like !== 0 && is_like !== 1) ){
            return res.status(400).json({error: "blog_post_id and is_like is required"});
        }
        //add the user reaction
        const index = await UserReactionDAO.like(blog_post_id, user_id, is_like);

        if(index === undefined || index === null){
            return res.status(404).json({error: "Error in reacting the post"});
        }
        return res.status(200).json({
            message: "Successfully liked the post",
            payload: index,
        });

    }catch (err){
        console.error("Error in reacting the post ", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//removing a reaction for a blog post
const removeReaction = async (req, res) => {
    try{
        //get user id
        const user_id = req.user?.id;
        //get blog_post_id, is_like
        const {blog_post_id} = req.body;
        //validate inputs
        if(!user_id){
            return res.status(401).json({error: "User not authorized"});
        }
        if(!blog_post_id){
            return res.status(400).json({error: "blog_post_id is required"});
        }
        const change = await UserReactionDAO.removeReaction(blog_post_id, user_id);
        if(!change){
            return res.status(404).json({error: "Error in removing the reaction"});
        }
    }catch (err) {
        console.error("Error in removing the reaction", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//get likes for a post
const getTotalLikes = async (req, res) => {
    try{
        const {blog_post_id} = req.body;
        if(blog_post_id === null || blog_post_id === undefined){
            return res.status(400).json({error: "blog post id required"});
        }
        const likesArr = await UserReactionDAO.getLikesForPost(blog_post_id) || [];
        return res.status(200).json({
            message: "Successfully retrieved total likes for the post",
            payload: likesArr.length
        })
    }catch(err){
        console.error("Error in getting likes post", err);
        return res.status(500).json({error: "Internal server error"});
    }
}

//get dislikes for a post
const getTotalDislikes = async (req, res) => {
    try{
        const {blog_post_id} = req.body;
        if(!blog_post_id){
            return res.status(400).json({error: "blog post id required"});
        }
        const dislikesArr = await UserReactionDAO.getDislikesForPost(blog_post_id) || [];
        return res.status(200).json({
            message: "Successfully retrieved total dislikes for the post",
            payload: dislikesArr.length
        })
    }catch(err){
        console.error("Error in getting dislikes post", err);
        return res.status(500).json({error: "Internal server error"});
    }
}

//get reaction of user for a blog post
const getaReaction = async (req, res) => {
    try{
        const user_id = req.user?.id;
        const {blog_post_id} = req.body;
        if(!user_id){
            return res.status(401).json({error: "User not authorized"});
        }
        if(blog_post_id === null || blog_post_id === undefined){
            return res.status(400).json({error: "blog_post_id is required"});
        }
        const reaction = await UserReactionDAO.getReaction(blog_post_id, user_id);
        return res.status(200).json({
            message: "Successfully retrieved the reaction for the post",
            payload: reaction ? reaction.is_like : null
        });
    }catch (err) {
        console.error("Error in getaReaction", err);
        return res.status(500).json({error: "Internal server error"});
    }
}

module.exports = {addingReaction, removeReaction, getTotalDislikes, getTotalLikes, getaReaction};