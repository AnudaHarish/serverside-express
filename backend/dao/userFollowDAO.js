const db = require("../config/databaseConfig");

class UserFollowDAO {

    //create a new follow request
    follow(follow_id, following_id){
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO user_follows (follower_id, following_id) VALUES (?,?)",
                [follow_id, following_id],
                function(err){
                    if(err) return reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    //remove a follow relationship
    unfollow(follower_id, following_id){
        return new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?",
                [follower_id, following_id],
                function (err) {
                    if (err) return reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    //retrieve all followers for a user
    getFollowers(following_id){
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM user_follows WHERE following_id = ? ",
                [following_id],
                (err, rows) => {
                    if (err) return reject(err);
                    else resolve(rows)
                }
            );
        });
    }

    //retrieve all the users that user is following
    getFollowings(follower_id){
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM user_follows WHERE follower_id = ? ",
                [follower_id],
                (err, rows) => {
                    if (err) return reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    //dynamic filter
    queryOne(query, params){
        return new Promise((resolve, reject) => {
            db.get(
                query,
                params,
                (err, row) => {
                    if (err) return reject(err);
                    else resolve(row);
                }
            );
        });
    }

    queryAll(query, params){
        return new Promise((resolve, reject) => {
            db.all(
                query,
                params,
                (err, rows) => {
                    if (err) return reject(err);
                    else resolve(rows);
                }
            );
        });
    }
}

module.exports = new UserFollowDAO;