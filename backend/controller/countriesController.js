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





module.exports = {handleCountriesData, handleCountriesName};