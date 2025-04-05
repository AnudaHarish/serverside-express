const fetch = require('node-fetch');
const fetchCountries = async () => {
    try{
        const response = await fetch("https://restcountries.com/v3.1/all", {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            },
            timeout: 30000
        });
        const data = await response.json();
        console.log(text);
        // const data = JSON.parse(text);
        return data?.data.map(country => ({
            name: country?.name?.common,
            currency: Object.keys(country?.currencies)[0],
            capital: country?.capital?.[0],
            languages: Object.values(country?.languages),
            flag: country?.flag?.png
        }));
    }catch(err){
        console.log(err);
        throw err;
    }
}

const fetchWithRetry = async (url, options, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (err) {
            if (err.code === "ECONNRESET" && attempt < retries - 1) {
                console.warn(`Retrying... (${attempt + 1})`);
                await new Promise(r => setTimeout(r, 1000));
            } else {
                throw err;
            }
        }
    }
};

module.exports = fetchCountries;