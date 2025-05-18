const cache = require('../utils/cache');
const CountryDAO = require("../dao/countryDAO")
const fetch = require('node-fetch');

//get country details
const fetchCountries = async (name) => {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`;
    return await fetchWithRetry(url, 3); // Retry 3 times
};

//get country name list
const fetchCountriesByRegion = async (region) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    } catch (err) {
        console.error(`Failed to fetch ${region} countries:`, err.message);
        return [];
    }
};

// Cache for API results
let countryCache = null;
const CACHE_TTL = 3600000; // 1 hour

const getAllCountries = async () => {
    try {
        const regions = ['africa', 'americas', 'asia', 'europe', 'oceania'];
        const results = await Promise.allSettled(regions.map(fetchCountriesByRegion));
        //if result is fulfilled it return a flatten array
        const countries = results.flatMap(r =>
            r.status === 'fulfilled' ? r.value : []
        ).map(country => ({
            name: country.name.common,
            region: country.region
        }));

        //removing duplicate values
        const uniqueCountries = [...new Map(countries.map(item => [item.name, item])).values()]
            .sort((a, b) => a.name.localeCompare(b.name));

        //caching the data
        cache.set(uniqueCountries.map(c => c.name));
        return cache.get().data;

    } catch (apiError) {
        // const dbCountries = await CountryDAO.getAll();
        return [];
    }
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
                flag: country?.flags?.png || country?.flags?.svg,
                region: country?.region
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
module.exports = {fetchCountries, getAllCountries};