const express = require("express");
const cors = require("cors");
const countriesData = require("./data/countries.json");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/countries", countryRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
