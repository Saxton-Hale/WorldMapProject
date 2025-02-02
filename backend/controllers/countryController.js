const countriesData = require("../data/countries.json");

exports.getAllCountries = (req, res) => {
    res.json(countriesData);
};

exports.getCountryByName = (req, res) => {
    const countryName = req.params.name.toLowerCase();
    const country = countriesData.find(c => c.name.toLowerCase() == countryName);

    if (!country) {
        return res.status(404).json({ message: "Country not found" });
    }

    res.json(country);
};
