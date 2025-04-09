const cache = require("../utils/cache")
const fetchCountries = require("../service/fetchCountries");
const handleCountriesData = async (req, res) => {
    const name = req.params.name;
    console.log(name);
    try{
        const countryData = await fetchCountries.fetchCountries(name);
        if(!countryData || !countryData.length) return res.status(404).json({"message": "Country not found"});{}
        res.json(countryData);
    }catch(err){
        console.error("Error in fetchCountries", err);
        res.status(500).send("Internal server error");
    }
}

const handleCountriesName = async (req, res) => {
    const name = req.params.name;
    console.log(name);
    try{
        const countryData = await fetchCountries.fetchCountryName();
        if(!countryData || !countryData.length) return res.status(404).json({"message": "Country not found"});{}
        res.json(countryData);
    }catch(err){
        console.error("Error in fetchCountries", err);
        res.status(500).send("Internal server error");
    }
}

const handleNameList = async (req, res) => {
    try {
        if (cache.isValid()) {
            return res.json(cache.get().data);
        }

        const countryNames = await fetchCountries.getAllCountries();
        res.json(countryNames);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to load country list',
            details: err.message
        });
    }
};



module.exports = {handleCountriesData, handleNameList};