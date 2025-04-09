const express = require("express");
const router = express.Router();
const countriesController  = require("../controller/countriesController");

router.get("/nameList", countriesController.handleNameList);
router.get("/:name", countriesController.handleCountriesData);

module.exports = router;