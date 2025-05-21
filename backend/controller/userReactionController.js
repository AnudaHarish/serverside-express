const UserReactionDAO = require("../dao/blogPostLikesDAO");
const BlogPostDAO = require("../dao/blog_postDAO");

//like or dislike a blog post
const addingReaction = async (req, res) => {
    try{
        //get user id
        const user_id = req.user?.id;
        const blog_post_id = req.params.id;
        //get blog_post_id, is_like
        let {is_like} = req.body;
        // is_like = JSON.parse(is_like);
        console.log("req",req.body)
        //validate inputs
        if(!user_id){
            return res.status(401).json({error: "User not authorized"});
        }
        if(!blog_post_id || typeof(is_like) !== "number" || (is_like !== 0 && is_like !== 1) ){
            return res.status(400).json({error: "blog_post_id and is_like is required"});
        }
        const postData = await BlogPostDAO.getById(blog_post_id);
        if(!postData){
            return res.status(404).json({error: "Could not find post"});
        }
        // if(postData.user_id !== user_id){
        //     return res.status(403).json({error: "User has not the permission"});
        // }
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
        const blog_post_id = req.params?.id;
        //validate inputs
        if(!user_id){
            return res.status(401).json({error: "User not authorized"});
        }
        if(!blog_post_id){
            return res.status(400).json({error: "blog_post_id is required"});
        }
        const postData = await BlogPostDAO.getById(blog_post_id);
        if(!postData){
            return res.status(404).json({error: "Could not find post"});
        }
        // if(postData.user_id !== user_id){
        //     return res.status(403).json({error: "User has not the permission"});
        // }
        const change = await UserReactionDAO.removeReaction(blog_post_id, user_id);
        if(!change){
            return res.status(404).json({error: "Error in removing the reaction"});
        }
        return res.status(204).json({
            message: "Successfully remove the reaction",
        });
    }catch (err) {
        console.error("Error in removing the reaction", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//get likes for a post
const getTotalLikes = async (req, res) => {
    try{
        const blog_post_id = req.params?.id;
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
        const blog_post_id = req.params?.id;
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
const getReaction = async (req, res) => {
    try{
        const user_id = req.user?.id;
        const blog_post_id = req.params?.id;
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
};

const updateReaction = async (req, res) => {
    try{
        //get user id
        const user_id = req.user?.id;
        //get blog_post_id, is_like
        const blog_post_id = req.params?.id;
        const { is_like } = req.body;
        //validate inputs
        if(!user_id){
            return res.status(401).json({error: "User not authorized"});
        }
        if(!blog_post_id || typeof(is_like) !== "number" || (is_like !== 0 && is_like !== 1)){
            return res.status(400).json({error: "blog_post_id & is_like is required"});
        }
        const postData = await BlogPostDAO.getById(blog_post_id);
        if(!postData){
            return res.status(404).json({error: "Could not find post"});
        }
        // if(postData.user_id !== user_id){
        //     return res.status(403).json({error: "User has not the permission"});
        // }
        const change = await UserReactionDAO.updateReaction(blog_post_id, user_id, is_like);
        if(!change){
            return res.status(404).json({error: "Error in update the reaction"});
        }
        return res.status(200).json({
            message: "Successfully updated the reaction",
        });
    }catch (err) {
        console.error("Error in updating the reaction", err);
        return res.status(500).json({error: "Internal server error"});
    }
}


module.exports = {addingReaction, removeReaction, getTotalDislikes, getTotalLikes, getReaction, updateReaction};