document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("countries-container");
    const searchInput = document.getElementById("search");
    const menuButton = document.getElementById("menu-button");
    const dropdown = document.querySelector(".dropdown");

    let map;
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
        fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + countryName)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = data[0].lat;
                    const lon = data[0].lon;

                    if (!map) return;

                    map.eachLayer(layer => {
                        if (layer instanceof L.Marker) {
                            map.removeLayer(layer);
                        }
                    });

                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${countryName}</b>`)
                        .openPopup();

                    // Get rid of this shit
                    map.setView([lat, lon], 5);
                } else {
                    alert("Country not found. Try a different name.");
                }
            })
            .catch(error => console.error("Error fetching country data:", error));
    }

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            const searchValue = event.target.value.trim();
            if (searchValue.length > 2) {
                highlightCountry(searchValue);
            }
        });
    }

    if (container) {
        fetch("./countries.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(countries => {
                if (!isWorldMapPage) {
                    displayCountries(countries);
                }

                searchInput.addEventListener("input", () => {
                    const searchTerm = searchInput.value.toLowerCase();
                    const filteredCountries = countries.filter(country =>
                        country.name.toLowerCase().includes(searchTerm)
                    );

                    if (isWorldMapPage) {
                        if (searchTerm.length > 2 && filteredCountries.length > 0) {
                            container.style.display = "block";
                        } else {
                            container.style.display = "none";
                        }
                    }

                    displayCountries(filteredCountries);
                });
            })
            .catch(error => console.error("Error loading countries:", error));
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
