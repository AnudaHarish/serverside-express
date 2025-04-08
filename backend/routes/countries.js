const express = require("express");
const router = express.Router();
const countriesController  = require("../controller/countriesController");

router.get("/nameList", countriesController.handleCountriesName);
router.get("/:name", countriesController.handleCountriesData);

module.exports = router;