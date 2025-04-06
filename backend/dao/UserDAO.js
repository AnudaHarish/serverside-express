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

    // async getUserById(id){
    //     const [rows] = await db.query("SELECT * FROM users WHERE id = ?", id);
    //     return rows;
    // }
    //
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
    //
    // async updateUser(id, userData){
    //     const {username, password} = userData;
    //     const [result] = await db.query("UPDATE users SET username = ?, password = ? WHERE id = ?",[username, password, id]);
    // }
    //
    // async deleteUser(id){
    //     const [result] = await db.query("DELETE FROM users WHERE id = ?", id);
    // }
}


module.exports = new UserDAO;