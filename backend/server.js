const express = require("express");
const cors = require("cors");
const countriesData = require("./data/countries.json");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/countries", (req, res) => {
    res.json(countriesData);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
