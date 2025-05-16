const path = require('path');
//connecting sqlite3
const sql = require("sqlite3");
const db = new sql.Database(path.join(__dirname, "..", "db", "userAuth.db"), (err) =>{
    if(err){
        console.error(err);
    }else{
        console.log("Database Connected!");
        initialise()
    }
});

function initialise() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password  TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            created_at DateTime DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS countries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            flag TEXT,
            currency TEXT,
            capital TEXT,
            region TEXT
        );
        CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            country_id INTEGER NOT NULL,
            date_of_visit DATE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(country_id) REFERENCES countries(id)
        );
        CREATE TABLE IF NOT EXISTS user_follows (
            follower_id  INTEGER NOT NULL,
            following_id INTEGER NOT NULL,
            followed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(follower_id, following_id),
            FOREIGN KEY(follower_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(following_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS blog_post_likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blog_post_id  INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            is_like BOOLEAN NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(blog_post_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE (blog_post_id, user_id)
        );
    `,(err) =>{
        if(err){
            console.error("Error creating Table ", err);
        }else{
            console.log("Table was created successfully.");
        }
    });
}

module.exports = db;