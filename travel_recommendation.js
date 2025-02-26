document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-input");
    const searchButton = document.querySelector(".search-btn");
    const clearButton = document.querySelector(".clear-btn");
    const resultsContainer = document.querySelector(".results-container");
    const featuredGrid = document.getElementById("featured-grid");
const searchContainer = document.querySelector(".search-container");
let dropdown = null;

    fetch("./travel_recommendation_api.json")
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            displayFeaturedDestinations(data.destinations.slice(0, 3));
            
            searchButton.addEventListener("click", () => searchDestinations(data));
            searchInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") searchDestinations(data);
            });
            clearButton.addEventListener("click", () => {
                searchInput.value = "";
                resultsContainer.innerHTML = "";
                hideDropdown();
            });
            searchInput.addEventListener("input", () => {
                const query = searchInput.value.trim().toLowerCase();
                if (query) {
                    showAutocompleteDropdown(data, query);
                } else {
                    hideDropdown();
                }
            });
        })
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            resultsContainer.innerHTML = "<p>Error loading data. Please try again later.</p>";
        });

 function searchDestinations(data) {
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = "";
    hideDropdown();

    if (!query) {
        resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }

    let results = [];

    // Handle "beach" or "beaches" keyword
    if (query.includes("beach") || query.includes("beaches")) {
        results = data.destinations.filter(dest => dest.type === "beach");
    } else {
        // Regular search across all fields
        results = data.destinations.filter(dest => 
            dest.name.toLowerCase().includes(query) ||
            dest.topDestinations.some(d => d.name.toLowerCase().includes(query)) ||
            dest.thingsToDo.some(t => t.name.toLowerCase().includes(query)) ||
            dest.hotels.some(h => h.name.toLowerCase().includes(query))
        );
    }

    if (results.length > 0) {
        results.forEach(displayDestination);
    } else {
        resultsContainer.innerHTML = "<p>No results found. Try another search.</p>";
    }
}

    function displayFeaturedDestinations(destinations) {
        destinations.forEach(dest => {
            const card = createDestinationCard(dest);
            featuredGrid.appendChild(card);
        });
    }

    function displayDestination(dest) {
        const card = createDestinationCard(dest, true);
        resultsContainer.appendChild(card);
    }

    function createDestinationCard(dest, expanded = false) {
        const card = document.createElement("div");
        card.classList.add("destination-card");

        card.innerHTML = `
            <img src="${dest.imageUrl}" alt="${dest.name}">
            <h3>${dest.name}</h3>
            <p>${dest.description}</p>
        `;

        if (expanded) {
            const details = document.createElement("div");
            details.classList.add("destination-details");
            details.innerHTML = `
                <h4>Top Destinations</h4>
                ${dest.topDestinations.map(d => `<p>${d.name}: ${d.description}</p>`).join("")}
                <h4>Things to Do</h4>
                ${dest.thingsToDo.map(t => `<p><a href="${t.link}" target="_blank">${t.name}</a>: ${t.description}</p>`).join("")}
                <h4>Hotels</h4>
                ${dest.hotels.map(h => `<p><a href="${h.link}" target="_blank">${h.name}</a>: ${h.description}</p>`).join("")}
            `;
            card.appendChild(details);
        }

        return card;
    }
function showAutocompleteDropdown(data, query) {
    if (dropdown) dropdown.remove();

    dropdown = document.createElement("div");
    dropdown.classList.add("autocomplete-dropdown");
    searchContainer.appendChild(dropdown);

    const suggestions = data.destinations.filter(dest => 
        dest.name.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 suggestions

    if (suggestions.length > 0) {
        suggestions.forEach(dest => {
            const item = document.createElement("div");
            item.classList.add("autocomplete-item");
            item.textContent = dest.name;
            item.addEventListener("click", () => {
                searchInput.value = dest.name;
                searchDestinations(data);
            });
            dropdown.appendChild(item);
        });
        dropdown.style.display = "block";
    } else {
        hideDropdown();
    }
}

function hideDropdown() {
    if (dropdown) {
        dropdown.remove();
        dropdown = null;
    }
}
});
