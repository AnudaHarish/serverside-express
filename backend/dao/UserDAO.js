const db = require("../config/databaseConfig");

class UserDAO {
    getAllUsers(){
        // const [rows] = await db.query("SELECT * FROM users");
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM users", (err, rows) => {
                if (err) return reject(err);
                else resolve(rows);
            });
        });
    }

    getUserById(id){
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM users WHERE id = ?`,
                [id],
                function (err, row) {
                    if (err) {
                        reject(err);
                    }
                    else resolve(row);
                }
            );
        });
    }

    createUser(userData){
        const {username, password, email} = userData;
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO users (username, password, email) VALUES (?,?,?)",[username, password, email],
                function(err) {
                    if (err) return reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    updateUser(id, userData){
        const {username, email} = userData;
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE users SET username = ?, email = ? WHERE id = ?`,
                [username, email, id],
                function (err) {
                    if (err) return  reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    updatePassword(id, password){
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE users SET password = ? WHERE id = ?`,
                [password, id],
                function (err) {
                    if (err) return reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    deleteUser(id){
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM users WHERE id = ?`,
                [id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }
}


module.exports = new UserDAO;