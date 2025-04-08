const fetch = require('node-fetch');
// const fetchCountries = async (name) => {
//     try{
//         const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`, {
//             timeout: 30000
//         });
//         const data = await response.json();
//         console.log(data);
//         // const data = JSON.parse(text);
//         return data.map(country => ({
//             name: country?.name?.common,
//             currency: Object.keys(country?.currencies)[0],
//             capital: country?.capital?.[0],
//             languages: Object.values(country?.languages),
//             flag: country?.flags?.png
//         }));
//     }catch(err){
//         console.log(err);
//         throw err;
//     }
// }

const fetchCountries = async (name) => {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`;
    return await fetchWithRetry(url, 3); // Retry 3 times
};

const fetchCountryName = async () => {
    const url = `https://restcountries.com/v3.1/all`;
    return await fetchCountriesWithRetry(url, 3); // Retry 3 times
};

const fetchWithRetry = async (url, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(url, { timeout: 10000 });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            return data.map(country => ({
                name: country?.name?.common,
                currency: Object.keys(country?.currencies || {})[0],
                capital: country?.capital?.[0] || "N/A",
                languages: country?.languages ? Object.values(country.languages) : [],
                flag: country?.flags?.png || country?.flags?.svg
            }));
        } catch (err) {
            console.error(`Fetch attempt ${attempt + 1} failed: ${err.message}`);

            if (err.code === 'ECONNRESET' || err.type === 'system') {
                if (attempt < retries - 1) {
                    await delay(1000); // wait before retry
                    continue;
                }
            }
            throw err;
        }
    }
};

const fetchCountriesWithRetry = async (url, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(url, { timeout: 10000 });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            return data.map(country => ({
                name: country?.name?.common
            }));
        } catch (err) {
            console.error(`Fetch attempt ${attempt + 1} failed: ${err.message}`);

            if (err.code === 'ECONNRESET' || err.type === 'system') {
                if (attempt < retries - 1) {
                    await delay(1000); // wait before retry
                    continue;
                }
            }
            throw err;
        }
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
module.exports = {fetchCountries, fetchCountryName};