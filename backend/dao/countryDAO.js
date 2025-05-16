const db = require("../config/databaseConfig");

class CountryDAO {
    //create country records
    create(countryData) {
        const {name, flag, currency, capital, region} = countryData;
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT ON IGNORE countries (name, flag, currency, capital, region) VALUES (?,?,?,?,?)",
                [name, flag, currency, capital, region],
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
}

module.exports = CountryDAO;