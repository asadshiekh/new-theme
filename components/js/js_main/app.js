// Toggle Sidebar visibility (erstes Menü) mit Animation
function toggleSidebar() {
    const sidebar = document.getElementById('dropdown-menu');
    const sandwich = document.getElementById('sandwich-icon');
    
    if (sidebar.style.display === 'none' || !sidebar.style.display) {
        sidebar.style.display = 'block';
        sandwich.classList.add('open');  // Animation für geöffnetes Menü
    } else {
        sidebar.style.display = 'none';
        sandwich.classList.remove('open');  // Animation zurücksetzen
    }
}

// Apply the correct theme based on saved preference or system setting
function applyTheme(theme) {
    document.body.className = theme;  // Set the theme on body
    const themeToggleButton = document.getElementById('theme-toggle');  // The toggle button
    
    // Ensure the toggle button reflects the current theme
    if (theme === 'dark') {
        themeToggleButton.checked = true;
    } else {
        themeToggleButton.checked = false;
    }
}

// Detect system preferences and apply saved user preferences
function detectAndApplyTheme() {
    const savedTheme = localStorage.getItem('theme');  // Get saved theme from localStorage
    
    if (savedTheme) {
        applyTheme(savedTheme);  // Apply saved theme
    } else {
        // Detect system preference if no user preference is saved
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }
}

// Toggle between dark and light themes
function toggleTheme() {
    const currentTheme = document.body.className;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';  // Switch the theme
    applyTheme(newTheme);  // Apply the new theme
    localStorage.setItem('theme', newTheme);  // Save the new theme in localStorage
}

// Attach event listener to the toggle switch
document.getElementById('theme-toggle').addEventListener('change', toggleTheme);

// Run theme detection and apply the correct theme on page load
window.addEventListener('DOMContentLoaded', detectAndApplyTheme);


// Lazy load images and resources
document.addEventListener("DOMContentLoaded", function() {
    const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
});

// Lazy loading tree data with map bounds
function loadTreesInView() {
    const bounds = map.getBounds(); // Get visible map area
    const bbox = `${bounds.getSouthWest().lng},${bounds.getSouthWest().lat},${bounds.getNorthEast().lng},${bounds.getNorthEast().lat}`;
    fetch(`${apiUrl}&bbox=${bbox}`)
        .then(response => response.json())
        .then(data => addTreeMarkers(data))
        .catch(error => console.error('Fehler beim Abrufen der Baumdaten:', error));
}

// Fetch and cache trees data
function fetchAndCacheTrees() {
    if (cachedHeatmapData) {
        // If data is cached, use it
        addTreeMarkers(cachedHeatmapData);
    } else {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                cachedHeatmapData = data;
                addTreeMarkers(data);
            })
            .catch(error => console.error('Fehler beim Abrufen der Baumdaten:', error));
    }
}


// Free Translation API (LibreTranslate)
const translationApiUrl = "https://libretranslate.de/translate";
let translationCache = {};  // Cache for translations

// Function to batch translate text
async function translateBatch(textArray, targetLang) {
    try {
        const response = await fetch(translationApiUrl, {
            method: "POST",
            body: JSON.stringify({
                q: textArray,
                source: "auto",
                target: targetLang,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        return data.map(item => item.translatedText);
    } catch (error) {
        console.error('Translation Error:', error);
        return textArray; // Fallback to original text
    }
}

// Translate single text
async function translateText(text, targetLang) {
    const cacheKey = `${text}-${targetLang}`;
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];  // Use cached translation
    }
    const translatedText = await translateBatch([text], targetLang);
    translationCache[cacheKey] = translatedText[0];
    return translatedText[0];
}

// Function to change language
async function changeLanguage() {
    const selectedLanguage = document.getElementById('languageSelect').value;
    localStorage.setItem('preferredLanguage', selectedLanguage);

    const elementsToTranslate = [
        { id: 'app-title', text: 'Baumkataster Wien' },
        { id: 'footer-left', text: 'Über uns' },
        { id: 'footer-right', text: 'Kontakt' },
        { id: 'menu-item-1', text: 'Spiele' },
        { id: 'menu-item-2', text: 'Highscores' },
        { id: 'menu-item-3', text: 'Freunde' },
        { id: 'menu-item-4', text: 'Support' },
        { id: 'search-button', text: 'Suchen' },
        { id: 'submit-button', text: 'Einreichen' },
        { id: 'welcome-text', text: 'Willkommen beim Baumkataster Wien' }
    ];

    const textsToTranslate = elementsToTranslate.map(element => element.text);
    
    document.body.classList.add('loading-translation');
    
    try {
        const translatedTexts = await translateBatch(textsToTranslate, selectedLanguage);
        
        translatedTexts.forEach((translatedText, index) => {
            const targetElement = document.getElementById(elementsToTranslate[index].id);
            if (targetElement) {
                targetElement.textContent = translatedText;
            }
        });
    } catch (error) {
        alert('An error occurred while translating the page. Please try again.');
    } finally {
        document.body.classList.remove('loading-translation');
    }
}

// Load and apply saved language preference
function loadPreferredLanguage() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'de';
    document.getElementById('languageSelect').value = savedLanguage;
    changeLanguage();
}

// Add event listener for language change
window.addEventListener('DOMContentLoaded', loadPreferredLanguage);

// Translate page when the user selects a new language
document.getElementById('languageSelect').addEventListener('change', changeLanguage);

// Utility function to show loading spinner (optional)
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.style.position = 'fixed';
    spinner.style.top = '50%';
    spinner.style.left = '50%';
    spinner.style.transform = 'translate(-50%, -50%)';
    spinner.style.border = '6px solid #f3f3f3';
    spinner.style.borderTop = '6px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.animation = 'spin 1s linear infinite';
    document.body.appendChild(spinner);
}

// Utility function to hide loading spinner (optional)
function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Add CSS for the loading spinner (optional)
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }

  .loading-translation #loading-spinner {
      display: block;
  }
`;
document.head.appendChild(style);



// Coordinates for Vienna's center
const viennaCenter = [48.2082, 16.3738];

// Define bounds for 100 km radius around Vienna (approximate)
const bounds = L.latLngBounds(
    L.latLng(47.4097, 15.3738),  // Southwest corner (approximate for 100 km radius)
    L.latLng(49.0082, 17.3738)   // Northeast corner (approximate for 100 km radius)
);

// Initialize the map with maxBounds and zoom settings
const map = L.map('map', {
    center: viennaCenter,    // Centered at Vienna
    zoom: 13,                // Default zoom level
    minZoom: 11,              // Minimum zoom level (allows zooming out more)
    maxZoom: 19.4,             // Maximum zoom level (allows zooming in closer)
    maxBounds: bounds,       // Restrict map bounds to Vienna and surrounding area
    maxBoundsViscosity: 0.1  // Ensures the map can't be panned outside the bounds
});


// Set up the tile layer (e.g., OpenStreetMap or Carto)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Optional: Fit the map to the bounds initially (if you want)
map.fitBounds(bounds);  // Can be removed or adjusted for initial load

// Heatmap aktivieren/deaktivieren
function toggleHeatmap() {
    if (map.hasLayer(heatmapLayer)) {
        map.removeLayer(heatmapLayer);
    } else {
        map.addLayer(heatmapLayer);
    }
}

// API-URL für den Baumkataster (JSON-Format)
const apiUrl = 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BAUMKATOGD&srsName=EPSG:4326&outputFormat=json';

// Farben für Baumarten je nach Alter
const youngColor = '#a8e6cf';  // Helles Grün für junge Bäume (<25 Jahre)
const oldColor = '#37966f';    // Dunkles Grün für alte Bäume (>25 Jahre)

// Hole die Baumdaten von der API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        let youngTreeCount = 0;
        let oldTreeCount = 0;
        let heatmapPoints = [];

        // Verarbeite die Baumdaten und füge Marker hinzu
        data.features.forEach(feature => {
            const tree = feature.properties;
            const lat = feature.geometry.coordinates[1];
            const lon = feature.geometry.coordinates[0];
            const age = calculateTreeAge(tree.PFLANZJAHR);
            let color;

            // Farbe basierend auf Alter setzen
            if (age < 25) {
                color = youngColor;
                youngTreeCount++;
            } else {
                color = oldColor;
                oldTreeCount++;
            }

            // Marker und Popup hinzufügen
            L.circleMarker([lat, lon], {
                radius: 6,
                color: color,
                fillColor: color,
                fillOpacity: 0.8
            }).addTo(map)
            .bindPopup(`
                <b>Baumnummer:</b> ${tree.BAUMNUMMER}<br>
                <b>Baumart:</b> ${tree.GATTUNG_ART}<br>
                <b>Alter:</b> ${age} Jahre<br>
                <b>Pflanzjahr:</b> ${tree.PFLANZJAHR}<br>
                <b>Stammumfang:</b> ${tree.STAMMUMFANG} cm<br>
                <b>Kronendurchmesser:</b> ${tree.KRONENDURCHMESSER_TXT}<br>
                <b>Baumhöhe:</b> ${tree.BAUMHOEHE} m
            `);

            heatmapPoints.push([lat, lon]);
        });

        // Heatmap Points setzen
        heatmapLayer.setLatLngs(heatmapPoints);

        // Zähler aktualisieren
        document.getElementById('young-tree-count').textContent = `Jungbäume (unter 25 Jahre): ${youngTreeCount}`;
        document.getElementById('old-tree-count').textContent = `Altbäume (über 25 Jahre): ${oldTreeCount}`;
    })
    .catch(error => console.error('Fehler beim Abrufen der Baumdaten:', error));

// Funktion zur Berechnung des Alters
function calculateTreeAge(plantYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - plantYear;
}

// Location Toggle
let locationMarker = null;

function toggleLocation() {
    const locationSwitch = document.getElementById('locationSwitch');
    
    if (locationSwitch.checked) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                if (locationMarker) {
                    map.removeLayer(locationMarker);
                }

                locationMarker = L.marker([lat, lon], { zIndexOffset: 1000 }).addTo(map)
                    .bindPopup("Sie sind hier").openPopup();
                map.setView([lat, lon], 13); 
            });
        } else {
            alert("Geolocation wird von diesem Browser nicht unterstützt.");
        }
    } else {
        if (locationMarker) {
            map.removeLayer(locationMarker);
        }
    }
}

/// Tree search function based on Address and optional Baumnummer
function searchBaumNummer(event) {
    if (event && event.key !== 'Enter') return; // Trigger on "Enter" key

    const baumnummer = document.getElementById('baumnummerSearch').value;
    const address = document.getElementById('addressSearch').value;

    // Case 1: Only Address entered
    if (address && !baumnummer) {
        searchTreesByAddress(address, 800); // Show trees within 800 meters
    }
    
    // Case 2: Address and Baumnummer entered
    else if (address && baumnummer) {
        searchTreesByAddressAndBaumNummer(address, baumnummer, 2000); // Show trees with Baumnummer within 500 meters
    } else {
        alert("Bitte geben Sie eine Adresse oder eine Baumnummer ein.");
    }
}

// Function to search trees by address within a radius (default: 800m)
function searchTreesByAddress(address, radius) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                // Zoom to the searched location
                map.setView([lat, lon], 15);

                // Call function to show trees within the given radius
                showTreesWithinRadius(lat, lon, radius);
            } else {
                alert("Adresse nicht gefunden.");
            }
        })
        .catch(error => console.error('Fehler beim Abrufen der Adresse:', error));
}

// Function to search trees by address and Baumnummer within a radius (500m)
function searchTreesByAddressAndBaumNummer(address, baumnummer, radius) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                // Zoom to the searched location
                map.setView([lat, lon], 15);

                // Call function to show trees with Baumnummer within the given radius
                showTreesWithBaumNummerWithinRadius(lat, lon, baumnummer, radius);
            } else {
                alert("Adresse nicht gefunden.");
            }
        })
        .catch(error => console.error('Fehler beim Abrufen der Adresse:', error));
}

// Function to show trees within a given radius (based on address only)
function showTreesWithinRadius(lat, lon, radius) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                const tree = feature.properties;
                const treeLat = feature.geometry.coordinates[1];
                const treeLon = feature.geometry.coordinates[0];
                const treeLocation = L.latLng(treeLat, treeLon);
                const userLocation = L.latLng(lat, lon);

                // Calculate the distance between user location and the tree
                const distance = userLocation.distanceTo(treeLocation);

                // Only show trees within the specified radius
                if (distance <= radius) {
                    L.circleMarker([treeLat, treeLon], {
                        radius: 6,
                        color: '#56c58c',
                        fillColor: '#56c58c',
                        fillOpacity: 0.8
                    }).addTo(map)
                    .bindPopup(`
                        <b>Baumnummer:</b> ${tree.BAUMNUMMER}<br>
                        <b>Baumart:</b> ${tree.GATTUNG_ART}<br>
                        <b>Alter:</b> ${calculateTreeAge(tree.PFLANZJAHR)} Jahre<br>
                        <b>Pflanzjahr:</b> ${tree.PFLANZJAHR}<br>
                        <b>Stammumfang:</b> ${tree.STAMMUMFANG} cm<br>
                        <b>Kronendurchmesser:</b> ${tree.KRONENDURCHMESSER_TXT}<br>
                        <b>Baumhöhe:</b> ${tree.BAUMHOEHE} m
                    `);
                }
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Baumdaten:', error));
}

// Function to show trees with specific Baumnummer within a radius (based on address + Baumnummer)
function showTreesWithBaumNummerWithinRadius(lat, lon, baumnummer, radius) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                const tree = feature.properties;
                const treeLat = feature.geometry.coordinates[1];
                const treeLon = feature.geometry.coordinates[0];
                const treeBaumnummer = tree.BAUMNUMMER;

                const treeLocation = L.latLng(treeLat, treeLon);
                const userLocation = L.latLng(lat, lon);

                // Calculate the distance between user location and tree
                const distance = userLocation.distanceTo(treeLocation);

                // Only show trees with matching Baumnummer within the radius
                if (treeBaumnummer === baumnummer && distance <= radius) {
                    L.circleMarker([treeLat, treeLon], {
                        radius: 6,
                        color: '#56c58c',
                        fillColor: '#56c58c',
                        fillOpacity: 0.8
                    }).addTo(map)
                    .bindPopup(`
                        <b>Baumnummer:</b> ${tree.BAUMNUMMER}<br>
                        <b>Baumart:</b> ${tree.GATTUNG_ART}<br>
                        <b>Alter:</b> ${calculateTreeAge(tree.PFLANZJAHR)} Jahre<br>
                        <b>Pflanzjahr:</b> ${tree.PFLANZJAHR}<br>
                        <b>Stammumfang:</b> ${tree.STAMMUMFANG} cm<br>
                        <b>Kronendurchmesser:</b> ${tree.KRONENDURCHMESSER_TXT}<br>
                        <b>Baumhöhe:</b> ${tree.BAUMHOEHE} m
                    `);
                }
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Baumdaten:', error));
}

// Function to apply the correct theme based on system or user preference
function applyTheme(theme) {
    document.body.className = theme; // Set theme on body
    document.querySelector('header').className = theme; // Set theme on header

    // Set the state of the theme toggle checkbox based on the theme
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = theme === 'dark';
    }
}

// Function to detect the system theme preference or load user preference
function detectSystemTheme() {
    // Check if the user has already set a theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        applyTheme(savedTheme); // Apply the saved theme
    } else {
        // Detect system preference if no user preference is saved
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDarkScheme) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }
}

// Function to toggle between dark and light themes
function toggleTheme() {
    const currentTheme = document.body.className;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save the user-selected theme in LocalStorage
}

// Function to apply the correct theme to the entire page
function applyTheme(theme) {
    document.body.className = theme; // Set theme on body

    // Darken or lighten the map
    const map = document.getElementById('map');
    if (theme === "dark") {
        map.classList.add('dark-map');
        map.classList.remove('light-map');
    } else {
        map.classList.add('light-map');
        map.classList.remove('dark-map');
    }

    // Darken or lighten header
    const header = document.querySelector('header');
    if (theme === "dark") {
        header.classList.add('dark-header');
        header.classList.remove('light-header');
    } else {
        header.classList.add('light-header');
        header.classList.remove('dark-header');
    }

    // Darken or lighten menus
    const menus = document.querySelectorAll('#dropdown-menu, #second-menu');
    menus.forEach(menu => {
        if (theme === "dark") {
            menu.classList.add('dark-menu');
            menu.classList.remove('light-menu');
        } else {
            menu.classList.add('light-menu');
            menu.classList.remove('dark-menu');
        }
    });

    // Darken or lighten footer
    const footer = document.querySelector('footer');
    if (theme === "dark") {
        footer.classList.add('dark-footer');
        footer.classList.remove('light-footer');
    } else {
        footer.classList.add('light-footer');
        footer.classList.remove('dark-footer');
    }
}

// On page load, apply the saved theme preference or default to light
window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});


// On page load, apply the saved theme preference or default to light
window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});


let heatmapLayer = L.heatLayer([], { radius: 25 });
let treeMarkers = L.layerGroup().addTo(map);
let isHeatmapOn = false;
let heatmapToggleCount = 0;
let lastToggleTime = 0;
let maxToggles = 5; // Max number of toggles allowed per minute
let cachedHeatmapData = null; // Cache for heatmap data

// Toggle Heatmap On/Off with usage limit and cache
function toggleHeatmap() {
    const heatmapSwitch = document.getElementById('heatmapSwitch');
    const currentTime = new Date().getTime();

    // Reset the toggle count every minute
    if (currentTime - lastToggleTime > 60000) {
        heatmapToggleCount = 0;
        lastToggleTime = currentTime;
    }

    // Check if the toggle limit has been reached
    if (heatmapToggleCount >= maxToggles) {
        alert('You can only toggle the Heatmap 5 times per minute. Please wait.');
        heatmapSwitch.checked = !heatmapSwitch.checked; // Prevent toggle
        return;
    }

    // Proceed with heatmap toggle if limit is not reached
    heatmapToggleCount++;

    if (heatmapSwitch.checked) {
        // Remove tree markers when heatmap is on
        map.removeLayer(treeMarkers);
        
        // Check if the heatmap data is already cached
        if (cachedHeatmapData) {
            // Use cached data to display the heatmap
            heatmapLayer.setLatLngs(cachedHeatmapData);
            map.addLayer(heatmapLayer);
        } else {
            // Fetch the heatmap data and cache it
            const heatmapPoints = [];
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    data.features.forEach(feature => {
                        const lat = feature.geometry.coordinates[1];
                        const lon = feature.geometry.coordinates[0];
                        heatmapPoints.push([lat, lon]);
                    });
                    
                    // Cache the heatmap points after fetching
                    cachedHeatmapData = heatmapPoints;

                    // Display the heatmap using the cached data
                    heatmapLayer.setLatLngs(heatmapPoints);
                    map.addLayer(heatmapLayer);
                })
                .catch(error => console.error('Error fetching tree data:', error));
        }
    } else {
        // Remove heatmap and show tree markers when heatmap is off
        map.removeLayer(heatmapLayer);
        map.addLayer(treeMarkers); // Re-add tree markers
    }
}

let isYoungTreesOnly = false;
let isOldTreesOnly = false;

// Function to toggle Only Young Trees (under 25 years)
function toggleYoungTrees() {
    const youngTreesSwitch = document.getElementById('youngTreesSwitch');
    const oldTreesSwitch = document.getElementById('oldTreesSwitch');

    if (youngTreesSwitch.checked) {
        isYoungTreesOnly = true;
        isOldTreesOnly = false; // Disable old trees display
        oldTreesSwitch.checked = false; // Turn off old trees switch
    } else {
        isYoungTreesOnly = false; // If unchecked, reset young tree filter
    }

    filterTrees(); // Apply the filter to show/hide trees
}

// Function to toggle Only Old Trees (25 years and older)
function toggleOldTrees() {
    const youngTreesSwitch = document.getElementById('youngTreesSwitch');
    const oldTreesSwitch = document.getElementById('oldTreesSwitch');

    if (oldTreesSwitch.checked) {
        isOldTreesOnly = true;
        isYoungTreesOnly = false; // Disable young trees display
        youngTreesSwitch.checked = false; // Turn off young trees switch
    } else {
        isOldTreesOnly = false; // If unchecked, reset old tree filter
    }

    filterTrees(); // Apply the filter to show/hide trees
}

// Filter the trees based on the switch selection
function filterTrees() {
    treeMarkers.clearLayers(); // Clear all current tree markers from the map

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                const tree = feature.properties;
                const lat = feature.geometry.coordinates[1];
                const lon = feature.geometry.coordinates[0];
                const age = calculateTreeAge(tree.PFLANZJAHR); // Calculate the age of the tree

                let color;
                if (age < 25) {
                    color = '#a8e6cf'; // Young trees color
                } else {
                    color = '#37966f'; // Old trees color
                }

                // Show only young trees if the young trees switch is selected
                if (isYoungTreesOnly && age >= 25) {
                    return; // Skip old trees
                }

                // Show only old trees if the old trees switch is selected
                if (isOldTreesOnly && age < 25) {
                    return; // Skip young trees
                }

                // Add the filtered trees to the map
                const marker = L.circleMarker([lat, lon], {
                    radius: 6,
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.8
                }).bindPopup(`
                    <b>Baumnummer:</b> ${tree.BAUMNUMMER}<br>
                    <b>Baumart:</b> ${tree.GATTUNG_ART}<br>
                    <b>Alter:</b> ${age} Jahre<br>
                    <b>Pflanzjahr:</b> ${tree.PFLANZJAHR}<br>
                    <b>Stammumfang:</b> ${tree.STAMMUMFANG} cm<br>
                    <b>Kronendurchmesser:</b> ${tree.KRONENDURCHMESSER_TXT}<br>
                    <b>Baumhöhe:</b> ${tree.BAUMHOEHE} m
                `);
                treeMarkers.addLayer(marker); // Add marker to the map
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Baumdaten:', error));
}

// API for Nominatim Search restricted to Vienna (with districts included)
const nominatimApiUrl = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&city=Vienna&country=Austria&q=";

// Debounce function to limit API calls
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

function fetchAddressSuggestions(query) {
    if (!query) {
        document.getElementById('addressSuggestions').innerHTML = '';
        return;
    }
    fetch(`${nominatimApiUrl}${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const suggestionList = document.getElementById('addressSuggestions');
            suggestionList.innerHTML = '';  // Clear previous suggestions
            data.forEach(item => {
                const address = item.display_name;
                const district = item.address.city_district || "Unbekannter Bezirk";
                const formattedAddress = `${address} (${district})`;

                const option = document.createElement('div');
                option.classList.add('suggestion-item');
                option.textContent = formattedAddress;
                option.addEventListener('click', () => selectAddress(item));
                suggestionList.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching address suggestions:', error));
}

const debouncedFetchAddressSuggestions = debounce(fetchAddressSuggestions, 300);

document.getElementById('addressSearch').addEventListener('input', (event) => {
    const query = event.target.value;
    if (query === '') {
        showAllTrees();  // Show all trees if the search input is cleared
        document.getElementById('addressSuggestions').innerHTML = ''; // Clear suggestions
    } else {
        debouncedFetchAddressSuggestions(query);
    }
});

function selectAddress(item) {
    document.getElementById('addressSearch').value = item.display_name;
    document.getElementById('addressSuggestions').innerHTML = '';
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    map.setView([lat, lon], 15);
    showTreesWithinRadius(lat, lon, 800);
}

function showTreesWithinRadius(lat, lon, radius) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                const treeLat = feature.geometry.coordinates[1];
                const treeLon = feature.geometry.coordinates[0];
                const userLocation = L.latLng(lat, lon);
                const treeLocation = L.latLng(treeLat, treeLon);
                const distance = userLocation.distanceTo(treeLocation);
                if (distance <= radius) {
                    L.circleMarker([treeLat, treeLon], {
                        radius: 6,
                        color: '#56c58c',
                        fillColor: '#56c58c',
                        fillOpacity: 0.8
                    }).addTo(map);
                }
            });
        })
        .catch(error => console.error('Error loading tree data:', error));
}

function showAllTrees() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                const lat = feature.geometry.coordinates[1];
                const lon = feature.geometry.coordinates[0];
                L.circleMarker([lat, lon], {
                    radius: 6,
                    color: '#56c58c',
                    fillColor: '#56c58c',
                    fillOpacity: 0.8
                }).addTo(map);
            });
        })
        .catch(error => console.error('Error loading tree data:', error));
}


// Toggle Sidebar visibility (erstes Menü) with animation
function toggleSidebar() {
    const sidebar = document.getElementById('dropdown-menu');
    const sandwich = document.getElementById('sandwich-icon');
    
    if (sidebar.style.display === 'none' || !sidebar.style.display) {
        sidebar.style.display = 'block';
        sandwich.classList.add('open');  // Animation for open menu
    } else {
        sidebar.style.display = 'none';
        sandwich.classList.remove('open');  // Reset animation
    }
}

// Secure Cache Clear Function
function clearCache() {
    if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
            cacheNames.forEach(function(cacheName) {
                caches.delete(cacheName).then(function(success) {
                    if (success) {
                        console.log(`Cache "${cacheName}" cleared.`);
                    }
                }).catch(function(error) {
                    console.error(`Error clearing cache "${cacheName}":`, error);
                });
            });
        });
        alert("Cache successfully cleared!");
    } else {
        alert("Cache API is not supported in your browser.");
    }
}

// Attach the clearCache function to the button securely
document.getElementById('clear-cache-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default action
    if (confirm("Are you sure you want to clear the cache? This action cannot be undone.")) {
        clearCache();
    }
});

// Function to process the uploaded work order
function processWorkOrder() {
    const input = document.getElementById('work-order-upload');
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            // Use Tesseract to extract text from the image
            Tesseract.recognize(img.src, 'eng', {
                logger: (m) => console.log(m)
            }).then(({ data: { text } }) => {
                console.log("Extracted Text:", text);
                processWorkOrderText(text); // Call function to process the extracted text
            });
        };

        reader.readAsDataURL(file); // Read the file
    }
}

// Function to process the extracted text and filter trees based on it
function processWorkOrderText(text) {
    // Here, you can apply logic to extract relevant tree information
    // Let's assume the work order contains Baumnummer (Tree Numbers) separated by new lines or spaces

    const treeNumbers = extractTreeNumbersFromText(text); // You need to implement this function
    console.log("Extracted Tree Numbers:", treeNumbers);

    // Now, filter the trees based on the extracted tree numbers
    filterTreesByWorkOrder(treeNumbers);
}

// Function to extract tree numbers from text (you can modify this logic based on your work order format)
function extractTreeNumbersFromText(text) {
    // Assuming tree numbers are digits (you can refine this regex)
    const treeNumbers = text.match(/\d+/g); // Find all numbers in the text
    return treeNumbers ? treeNumbers.map(num => num.trim()) : [];
}

// Function to filter trees based on the work order (tree numbers)
function filterTreesByWorkOrder(treeNumbers) {
    treeMarkers.clearLayers(); // Clear all current markers

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                const tree = feature.properties;
                const lat = feature.geometry.coordinates[1];
                const lon = feature.geometry.coordinates[0];
                const treeBaumnummer = tree.BAUMNUMMER;

                // Check if the tree's Baumnummer is in the work order
                if (treeNumbers.includes(treeBaumnummer.toString())) {
                    // Add marker to the map if the tree is in the work order
                    L.circleMarker([lat, lon], {
                        radius: 6,
                        color: '#37966f', // Customize marker color if needed
                        fillColor: '#37966f',
                        fillOpacity: 0.8
                    }).addTo(map).bindPopup(`
                        <b>Baumnummer:</b> ${tree.BAUMNUMMER}<br>
                        <b>Baumart:</b> ${tree.GATTUNG_ART}<br>
                        <b>Alter:</b> ${calculateTreeAge(tree.PFLANZJAHR)} Jahre<br>
                        <b>Pflanzjahr:</b> ${tree.PFLANZJAHR}<br>
                        <b>Stammumfang:</b> ${tree.STAMMUMFANG} cm<br>
                        <b>Kronendurchmesser:</b> ${tree.KRONENDURCHMESSER_TXT}<br>
                        <b>Baumhöhe:</b> ${tree.BAUMHOEHE} m
                    `);
                }
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Baumdaten:', error));
}

// Function to toggle the visibility of the other options
function toggleOptions() {
    const options = document.getElementById('other-options');
    if (options.style.display === 'none' || options.style.display === '') {
        options.style.display = 'block';  // Show options
    } else {
        options.style.display = 'none';   // Hide options
    }
}


// Run the theme detection function on page load
window.addEventListener('DOMContentLoaded', detectSystemTheme);
