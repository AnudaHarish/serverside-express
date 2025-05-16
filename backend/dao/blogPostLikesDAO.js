const db = require("../config/databaseConfig");

class BlogPostLikesDAO {

    //add reaction for blog post
    like(blog_post_id, user_id, is_like){
        return new Promise((resolve, reject) =>{
            db.run(
                "INSERT INTO blog_post_likes (blog_post_id, user_id, is_like) WHERE VALUES(?,?,?)",
                [blog_post_id, user_id, is_like],
                function(err){
                    if(err) return reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    //retrieve all like for a specific blog
    getLikesForPost(blog_post_id){
        return new Promise((resolve, reject) =>{
            db.all(
                "SELECT * FROM blog_post_likes WHERE blog_post_id = ? AND is_like = 1",
                [blog_post_id],
                (err, rows) => {
                    if(err) return reject(err);
                    else resolve(rows);
                }
            );
        })
    }

    //retrieve all dislike for a specific blog
    getDislikesForPost(blog_post_id){
        return new Promise((resolve, reject) =>{
            db.all(
                "SELECT * FROM blog_post_likes WHERE blog_post_id = ? AND is_like = 0",
                [blog_post_id],
                (err, rows) => {
                    if(err) return reject(err);
                    else resolve(rows);
                }
            );
        })
    }

    //remove a reaction
    removeReaction(blog_post_id,user_id){
        db.run(
            "DELETE FROM blog_post_likes WHERE blog_post_id = ? AND user_id = ?",
            [blog_post_id, user_id],
            function(err){
                if(err) return reject(err);
                else resolve(this.changes);
            }
        )
    }

    //get the reaction by a user for a blog
    getReaction(blog_post_id,user_id){
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM blog_post_likes WHERE blog_post_id = ? AND user_id = ?",
                [blog_post_id, user_id],
                (err, rows) => {
                    if(err) return reject(err);
                    else resolve(rows);
                }
            );
        })
    }
}

module.exports = BlogPostLikesDAO;