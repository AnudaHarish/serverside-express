const express = require("express");
const router = express.Router();
const fetchCountries = require("../service/fetchCountries");

router.route("/")
    .get( async (req, res) => {
        try{
            const countryData = await fetchCountries();
            res.json(countryData);
        }catch(err){
            console.error("Error in fetchCountries", err);
            res.status(500).send("Internal server error");
        }
    });



module.exports = router;