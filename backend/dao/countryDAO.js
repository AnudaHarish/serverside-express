const db = require("../config/databaseConfig");

class CountryDAO {
    //create country records
    create(countryData) {
        console.log(countryData);
        const {name, flag, currency, capital, region, languages} = countryData;
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT OR IGNORE INTO countries (name, flag, currency, capital, region, languages) VALUES (?,?,?,?,?,?)",
                [name, flag, currency, capital, region, languages],
                function(err) {
                    if (err) return reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    //retrieve all countries
    getAll(){
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM countries", (err, rows) => {
                if (err) return reject(err);
                else resolve(rows);
            });
        });
    }

    //getCountry details
    getByName(name){
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM countries WHERE name = ?", [name], (err, rows) => {
                    if(err) return reject(err);
                    else resolve(rows);
                });
        });
    }

    getById(id){
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM countries WHERE id = ?", [id], (err, rows) => {
                    if(err) return reject(err);
                    else resolve(rows);
                }
            );
        });
    }
}

module.exports = new CountryDAO;