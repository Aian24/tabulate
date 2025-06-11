let map;
let mobileMap;
let markers = [];
let mobileMarkers = [];
const locations = [
    { lat: 14.5995, lng: 120.9842, title: "Manila" }, // Example location
];

// Initialize the maps
function initMap() {
    // Main map initialization (for desktop)
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 14.5995, lng: 120.9842 }, // Manila coordinates
        zoom: 12,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Add markers for desktop map
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title
        });
        markers.push(marker);
    });

    // Initialize mobile map only when modal is first opened
    initializeMobileMap();
}

// Function to initialize mobile map
function initializeMobileMap() {
    if (!mobileMap) {
        mobileMap = new google.maps.Map(document.getElementById('mobileMapContainer'), {
            center: { lat: 14.5995, lng: 120.9842 }, // Manila coordinates
            zoom: 12,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });

        // Add markers for mobile map
        locations.forEach(location => {
            const mobileMarker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: mobileMap,
                title: location.title
            });
            mobileMarkers.push(mobileMarker);
        });
    }
}

// View Control Handlers
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('mapContainer');
    const splitMapContainer = document.getElementById('splitMapContainer');
    const contentContainer = document.getElementById('contentContainer');
    const tableContainer = document.getElementById('tableContainer');
    const mapElement = document.getElementById('map');
    const mobileMapModal = document.getElementById('mobileMapModal');
    const mobileMapBtn = document.getElementById('mobileMapBtn');
    const closeMobileMapModal = document.getElementById('closeMobileMapModal');

    const hideMapBtn = document.getElementById('hideMapBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const splitViewBtn = document.getElementById('splitViewBtn');
    const fullMapBtn = document.getElementById('fullMapBtn');

    let currentView = 'list';

    // Mobile Map Modal Controls
    mobileMapBtn.addEventListener('click', () => {
        mobileMapModal.style.display = 'flex';
        // Initialize mobile map if not already done
        initializeMobileMap();
        // Trigger resize to ensure mobile map renders correctly
        setTimeout(() => {
            google.maps.event.trigger(mobileMap, 'resize');
            mobileMap.setCenter({ lat: 14.5995, lng: 120.9842 });
        }, 100);
    });

    closeMobileMapModal.addEventListener('click', () => {
        mobileMapModal.style.display = 'none';
    });

    // Close modal when clicking outside
    mobileMapModal.addEventListener('click', (e) => {
        if (e.target === mobileMapModal) {
            mobileMapModal.style.display = 'none';
        }
    });

    // Helper function to reset all buttons
    function resetButtons() {
        [hideMapBtn, listViewBtn, splitViewBtn, fullMapBtn].forEach(btn => {
            btn.classList.remove('active');
        });
    }

    // Helper function to reset containers
    function resetContainers() {
        mapContainer.classList.remove('hidden', 'full');
        contentContainer.classList.remove('split-view');
        splitMapContainer.classList.add('hidden');
        tableContainer.classList.remove('w-1/2');
        tableContainer.classList.add('w-full');
        mapElement.style.display = 'block'; // Ensure map is visible by default
    }

    // Desktop view handlers
    hideMapBtn.addEventListener('click', () => {
        if (window.innerWidth < 768) return; // Ignore on mobile
        resetButtons();
        resetContainers();
        hideMapBtn.classList.add('active');
        mapContainer.classList.add('hidden');
        mapElement.style.display = 'none'; // Hide the map element
        if (currentView === 'split') {
            mapContainer.appendChild(mapElement);
        }
        currentView = 'hidden';
    });

    listViewBtn.addEventListener('click', () => {
        if (window.innerWidth < 768) return; // Ignore on mobile
        resetButtons();
        resetContainers();
        listViewBtn.classList.add('active');
        mapContainer.classList.remove('hidden');
        mapElement.style.display = 'block'; // Show the map element
        if (currentView === 'split') {
            mapContainer.appendChild(mapElement);
        }
        currentView = 'list';
        // Trigger resize after a small delay to ensure the map is visible
        setTimeout(() => {
            google.maps.event.trigger(map, 'resize');
            map.setCenter({ lat: 14.5995, lng: 120.9842 }); // Re-center the map
        }, 100);
    });

    splitViewBtn.addEventListener('click', () => {
        if (window.innerWidth < 768) return; // Ignore on mobile
        resetButtons();
        resetContainers();
        splitViewBtn.classList.add('active');
        mapContainer.classList.add('hidden');
        splitMapContainer.classList.remove('hidden');
        contentContainer.classList.add('split-view');
        splitMapContainer.appendChild(mapElement);
        currentView = 'split';
        google.maps.event.trigger(map, 'resize');
    });

    fullMapBtn.addEventListener('click', () => {
        if (window.innerWidth < 768) return; // Ignore on mobile
        resetButtons();
        resetContainers();
        fullMapBtn.classList.add('active');
        mapContainer.classList.add('full');
        if (currentView === 'split') {
            mapContainer.appendChild(mapElement);
        }
        currentView = 'full';
        google.maps.event.trigger(map, 'resize');
    });

    // Initialize with list view on desktop
    if (window.innerWidth >= 768) {
        listViewBtn.click();
    }
}); 