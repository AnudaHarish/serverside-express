const db = require("../config/databaseConfig");

class CommentsDAO {
    //get comments per blog
    getComments(blog_post_id){
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM blog_post_comments WHERE blog_post_id = ?",
                [blog_post_id],
                (err, rows) =>{
                    if(err) return reject(err);
                    else resolve(rows);
                }
            );
        })
    }

    //insert comment
    insertComment(blog_post_id, user_id, comment){
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO blog_post_comments (blog_post_id, user_id, comment) VALUES (?,?,?)",
                [blog_post_id, user_id, comment],
                function(err){
                    if(err) return reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    //update comments
    updateComment(comment_id, comment){
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE blog_post_comments SET comment = ? WHERE id = ?",
                [ comment, comment_id],
                function(err){
                    if(err) return reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    //delete a comment
    deleteComment(comment_id){
        return new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM blog_post_comments WHERE id = ? ",
                [comment_id],
                function(err){
                    if(err) return reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }
}

module.exports = new CommentsDAO();