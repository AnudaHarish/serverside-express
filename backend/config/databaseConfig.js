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
            created_at DateTime DEFAULT CURRENT_TIMESTAMP
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