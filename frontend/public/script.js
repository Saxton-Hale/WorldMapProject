document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("countries-container");
    const searchInput = document.getElementById("search");
    const menuButton = document.getElementById("menu-button");
    const dropdown = document.querySelector(".dropdown");

    let map;
    let lastSearchedCountry = "";
    let countriesData = [];
    const isWorldMapPage = document.body.classList.contains("worldmap-page");

    if (document.getElementById("map")) {
        initMap();
    }

    menuButton.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });

    function initMap() {
        map = L.map('map').setView([20, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }

    function highlightCountry(countryName) {
        if (countryName == lastSearchedCountry) return;
        lastSearchedCountry = countryName;
    
        fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + countryName)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
    
                    if (!map) return;
    
                    map.eachLayer(layer => {
                        if (layer instanceof L.Marker) {
                            map.removeLayer(layer);
                        }
                    });
    
                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${countryName}</b>`)
                        .openPopup();
                } else {
                    alert("Country not found. Try a different name.");
                }
            })
            .catch(error => console.error("Error fetching country data:", error));
    }

    function handleSearch(event) {
        const searchTerm = event.target.value.trim().toLowerCase();
        
        if (searchTerm.length > 2) {
            highlightCountry(searchTerm);
        }
    
        const filteredCountries = countriesData.filter(country => 
            country.name.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);
    }
    
    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    if (container) {
        fetchCountries();
    }

    function fetchCountries() {
        fetch("http://localhost:5000/api/countries")
            .then(response => response.json())
            .then(countries => {
                countriesData = countries;
                console.log("Loaded countries: ", countriesData)
                displayCountries(countriesData)
            })
            .catch(error => console.error("Error fetching country data", error))
    }

    function displayCountries(countries) {
        if (!container) return;

        container.innerHTML = "";

        if (countries.length === 0) {
            container.innerHTML = "<p>No results.</p>";
            return;
        }

        countries.forEach(country => {
            const countryCard = document.createElement("div");
            countryCard.classList.add("country-card");
            countryCard.innerHTML = `
                <h2>${country.name}</h2>
                <p><strong>Stolica:</strong> ${country.capital}</p>
                <p><strong>Kontynent:</strong> ${country.continent}</p>
                <p><strong>Populacja:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Waluta:</strong> ${country.currency}</p>
                <p><strong>Język:</strong> ${country.language}</p>
            `;
            container.appendChild(countryCard);
        });
    }
});
