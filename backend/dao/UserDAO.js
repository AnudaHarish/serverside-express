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
                function (err, rows) {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    createUser(userData){
        const {username, password} = userData;
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO users (username, password) VALUES (?,?)",[username, password],
                function(err) {
                    if (err) return reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    updateUser(id, userData){
        const {username, password} = userData;
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE users SET username = ?, password = ? WHERE id = ?`,
                [username, password, id],
                function (err) {
                    if (err) reject(err);
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