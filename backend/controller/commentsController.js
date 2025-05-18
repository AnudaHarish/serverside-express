const CommentsDAO = require("../dao/commentsDAO");

//get comments per blog
const getComments = async (req, res) => {
    try{
        const bolg_post_id = req.params.id;
        if(!bolg_post_id){
            return res.status(404).send({error: "Blog post id is required"});
        }
        const rows = await CommentsDAO.getComments(bolg_post_id) || [];
        return res.status(200).json({
            message: "Successfully retrieved comments",
            payload: rows
        });
    }catch (err){
        console.error("Error in getting comments", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//create Comments
const createComment = async (req, res) => {
    try{
        const blog_post_id = req.params.id;
        const user_id = req.user?.id;
        const { comment } = req.body;

        if(!user_id){
            return res.status(401).json({error: "User not authorized"});
        }
        if(!blog_post_id || !comment){
            return res.status(404).json({error: "Blog post id and comments are required"});
        }
        const rowId = await CommentsDAO.insertComment(blog_post_id, user_id, comment);
        if(!rowId){
            return res.status(400).json({error: "Error creating the comments"});
        }
        return res.status(200).json({
            message: "Successfully created the comment",
            payload: rowId
        });
    }catch (err) {
        console.error("Error in creating comment", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//update a comment
const updateComment = async (req, res) => {
    try{
        const comment_id = req.params.id;
        const { comment } = req.body;

        if(!comment_id || !comment){
            return res.status(404).json({error: "Blog post id and comments are required"});
        }
        const change = await CommentsDAO.updateComment(comment_id, comment);
        if(!change){
            return res.status(400).json({error: "Error updating the comments"});
        }
        return res.status(200).json({
            message: "Successfully  the updating comment",
            payload: change
        });
    }catch(err){
        console.error("Error in updating comment", err);
        return res.status(500).json({error: "Internal server error"});
    }
};

//delete a comment
const deleteComment = async (req, res) => {
    try {
        const comment_id = req.params.id;
        const {comment} = req.body;

        if (!comment_id || !comment) {
            return res.status(404).json({error: "Blog post id and comments are required"});
        }
        const change = await CommentsDAO.deleteComment(comment_id, comment);
        if (!change) {
            return res.status(400).json({error: "Error updating the comments"});
        }
        return res.status(200).json({
            message: "Successfully  the updating comment",
            payload: change
        });
    } catch (err) {
        console.error("Error in updating comment", err);
        return res.status(500).json({error: "Internal server error"});
    }
}

module.exports = {createComment, updateComment, getComments, deleteComment};