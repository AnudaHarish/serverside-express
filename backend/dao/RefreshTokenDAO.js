const db = require("../config/databaseConfig");

class RefreshTokenDAO {
    create(token, userId, expiresAt){
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO refresh_tokens (token, user_Id, expires_at) VALUES (?,?,?)`,
                [token, userId, expiresAt],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    getAllTokens(){
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM refresh_tokens", (err, rows) => {
                if (err) return reject(err);
                else resolve(rows);
            });
        })
    }

    findByToken(token){
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM refresh_tokens WHERE token = ?`,
                [token],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    delete(token){
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM refresh_tokens WHERE token = ?`,
                [token],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                 }
            );
        });
    }

    deleteExpiredTokens(){
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM refresh_tokens 
                WHERE expires_at < dateTime('now') ?`,
                function (err){
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            )
        })
    }
}

module.exports = new RefreshTokenDAO;