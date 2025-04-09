let countryCache = null;
const CACHE_TTL = 3600000; // 1 hour

module.exports = {
    get: () => countryCache,
    set: (data) => {
        countryCache = {
            data,
            timestamp: Date.now()
        };
    },
    isValid: () => countryCache && (Date.now() - countryCache.timestamp) < CACHE_TTL
};