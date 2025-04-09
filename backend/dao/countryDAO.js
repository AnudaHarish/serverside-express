const db = require("../config/databaseConfig");

const CountryDAO = {
    create: async (country) => {
        await db.run(
            'INSERT OR IGNORE INTO countries (name, region) VALUES (?, ?)',
            [country.name, country.region]
        );
    },
    getAll: async () => {
        return db.all('SELECT name FROM countries ORDER BY name');
    }
};


module.exports = CountryDAO;