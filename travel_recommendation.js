document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-input"); // Adjusted selector
    const searchButton = document.querySelector(".search-btn"); // Adjusted selector
    const clearButton = document.querySelector(".clear-btn");
    const resultsContainer = document.getElementById("results");

    // Fetch JSON data
    fetch("./travel_recommendation_api.json") // Ensure this path is correct
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched Data:", data); // Debugging: Check if data is fetched

            // Search button event listener
            searchButton.addEventListener("click", function () {
                searchDestinations(data);
            });

            // Allow pressing Enter in the input field to trigger search
            searchInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    searchDestinations(data);
                }
            });

            // Clear button functionality
            clearButton.addEventListener("click", function () {
                searchInput.value = "";
                resultsContainer.innerHTML = "";
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            resultsContainer.innerHTML = "<p>Error loading data. Please try again later.</p>";
        });

    // Function to search and display results
    function searchDestinations(data) {
        const query = searchInput.value.trim().toLowerCase(); // Normalize input
        resultsContainer.innerHTML = ""; // Clear previous results

        if (!query) {
            resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
            return;
        }

        let results = [];

        if (query.includes("beach")) {
            results = data.beaches;
            displayResults(results, "Beaches");
        } else if (query.includes("temple")) {
            results = data.temples;
            displayResults(results, "Temples");
        } else {
            // Check for country/city matches
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(query)) {
                    results.push(...country.cities);
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(query)) {
                            results.push(city);
                        }
                    });
                }
            });

            if (results.length > 0) {
                displayResults(results, "Locations");
            } else {
                resultsContainer.innerHTML = "<p>No results found. Try another search.</p>";
            }
        }
    }

    // Function to display results
    function displayResults(results, title) {
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = `Recommended ${title}`;
        resultsContainer.appendChild(sectionTitle);

        results.forEach(place => {
            const placeDiv = document.createElement("div");
            placeDiv.classList.add("place");

            const placeName = document.createElement("h3");
            placeName.textContent = place.name;

            const placeImage = document.createElement("img");
            placeImage.src = place.imageUrl;
            placeImage.alt = place.name;
            placeImage.style.width = "200px"; // Adjust image size

            const placeDescription = document.createElement("p");
            placeDescription.textContent = place.description || "No description available.";

            placeDiv.appendChild(placeName);
            placeDiv.appendChild(placeImage);
            placeDiv.appendChild(placeDescription);
            resultsContainer.appendChild(placeDiv);
        });
    }
});

