const db = require("../config/databaseConfig");

class BlogPostDAO {
    //get All blog posts
    getAll(){
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM blog_posts",(err, rows) =>{
                    if(err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    //retrieve blog post by id
    getById(id){
        return new Promise((resolve, reject) =>{
            db.get(
                "SELECT * FROM blog_posts WHERE id = ?", [id], (err, rows) => {
                    if(err) return reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    //retrieve blog posts for a specific user
    getByUserId(user_id){
        return new Promise((resolve, reject) =>{
            db.all(
                "SELECT * FROM blog_posts WHERE user_id = ?", [user_id], (err, rows) => {
                    if(err) return reject(err);
                    else resolve(rows);
                }
            );
        })
    }

    //create new blog post
    createBlog(blogData){
        const {user_id, title, content, country_id, date_of_visit} = blogData;
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO blog_posts (user_id, title, content, country_id, date_of_visit) VALUES (?,?,?,?.?)",
                [user_id, title, content, country_id, date_of_visit],
                function(err){
                    if (err) return reject(err);
                    else resolve(this.lastID);
                }
            );
        })
    }

    //update a blog post
    updateBlog(id, blogData){
        const {title, content} = blogData;
        return new Promise((resolve, reject) => {
            db.run(
                "UPDATE blog_posts SET title = ?, content = ? WHERE id = ?",
                [title, content, id],
                function(err){
                    if (err) return reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    //delete blog
    delete(id){
        return new Promise((resolve, reject) =>{
            db.run(
                "DELETE FROM blog_posts WHERE id = ?",
                [id],
                function (err) {
                    if (err) return reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }
}

module.exports = BlogPostDAO;