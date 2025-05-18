const cache = require("../utils/cache")
const fetchCountries = require("../service/fetchCountries");
const CountriesDAO = require("../dao/countryDAO");
const CountryDAO = require("../utils/cache");

const handleCountriesData = async (req, res) => {
    const name = req.params.name;
    console.log(name);
    try{
        const countryData = await fetchCountries.fetchCountries(name);
        if(!countryData || !countryData.length) return res.status(404).json({"message": "Country not found"});
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
        return res.json(countryData);
    }catch(err){
        console.error("Error in fetchCountries", err);
        return res.status(500).send("Internal server error");
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
        return res.status(500).json({
            error: 'Failed to load country list',
            details: err.message
        });
    }
};

//save country details
const saveCountry = async (req, res) => {
    try{
        //get country Details
        const {name, flag, currency, capital, region} = req.body;
        //check the existence
        if(!name || !flag || !currency || !capital || !region){
            return res.status(400).json({error: "Missing required fields"});
        }
        //saving data
        const country_id = await CountriesDAO.create({
            name,
            flag,
            currency,
            capital,
            region,
        });
        return res.status(201).json({
            message: "Country saved successfully",
            country_id: country_id,
        });
    }catch (err){
        console.error("Error in saveCountry", err);
        return res.status(500).send("Internal server error");
    }
};

//get country details
const getCountryInfo = async (req, res) => {
    try{
        //retrieve country id
        const name = req.params.name;
        //check the existence of the id
        if(!name){
            return res.status(400).json({error: "Missing required fields"});
        }
        //get country data
        const countryData = await CountriesDAO.getByName(name);
        if(!countryData || !countryData.length){
            return res.status(404).json({error: "country not found"});
        }
        return res.status(200).json({
            message: "Retrieval of country data successful",
            payload: countryData
        });
    }catch (err){
        console.error("Error in getCountryInfo", err);
        return res.status(500).send("Internal server error");
    }
}

module.exports = {handleCountriesData, handleNameList, saveCountry, getCountryInfo};