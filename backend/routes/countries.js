const express = require("express");
const router = express.Router();
const countriesController  = require("../controller/countriesController");
//get country name list
router.get("/nameList", countriesController.handleNameList);
//get country data
router.get("/:name", countriesController.handleCountriesData);
//save country details
router.post("/save", countriesController.saveCountry);

module.exports = router;