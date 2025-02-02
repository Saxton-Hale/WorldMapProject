const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");

router.get("/", countryController.getAllCountries);

router.get("/:name", countryController.getCountryByName);

module.exports = router;
