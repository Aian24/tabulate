let map;
let mobileMap;
let markers = [];
let mobileMarkers = [];
let teamMarkers = {}; // Global markers object for team access
let teamPolylines = {}; // Global polylines object for team routes
let polylines = {};
let directionsService, directionsRenderer;
const locations = [
    { lat: 14.5995, lng: 120.9842, title: "Manila" }, // Example location
];

// Initialize the maps
function initMap() {
    console.log('initMap called'); // Debug log
    
    // Get team job data from the table to center the map properly
    const teamJobs = document.querySelectorAll('.job-item');
    console.log('Found team jobs:', teamJobs.length); // Debug log
    
    let centerLat = 39.8283; // Default center of USA
    let centerLng = -98.5795;
    
    if (teamJobs.length > 0) {
        // Calculate center based on actual team job data
        let totalLat = 0;
        let totalLng = 0;
        let validCoordinates = 0;
        
        teamJobs.forEach(job => {
            const lat = parseFloat(job.getAttribute('data-lat'));
            const lng = parseFloat(job.getAttribute('data-lng'));
            if (lat && lng) {
                totalLat += lat;
                totalLng += lng;
                validCoordinates++;
            }
        });
        
        if (validCoordinates > 0) {
            centerLat = totalLat / validCoordinates;
            centerLng = totalLng / validCoordinates;
        }
    }

    // Check if map container exists
    const mapElement = document.getElementById('map');
    console.log('Map element found:', !!mapElement); // Debug log
    
    if (!mapElement) {
        console.error('Map container not found!');
        return;
    }

    // Main map initialization (for desktop)
    map = new google.maps.Map(mapElement, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 4, // Start with a wider view to show all teams
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    console.log('Map initialized'); // Debug log

    // Initialize directions service
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // We'll use our custom markers
        polylineOptions: {
            strokeColor: '#3B82F6',
            strokeOpacity: 0.8,
            strokeWeight: 4
        }
    });

    // Create team-based map
    setTimeout(() => {
        console.log('Creating team map...'); // Debug log
        createTeamMap();
    }, 100);
}

// Create team-based map with numbered pins
function createTeamMap() {
    // Clear existing markers
    if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
    }
    markers = [];
    
    // Team color mapping
    const teamColors = {
        'Team Alpha': { bg: '#3B82F6', border: '#1E40AF' },
        'Team Beta': { bg: '#10B981', border: '#059669' },
        'Team Gamma': { bg: '#8B5CF6', border: '#7C3AED' }
    };
    
    // Process all team jobs (including hidden ones)
    const teamJobs = document.querySelectorAll('.job-item');
    const teamCoordinates = {};
    
    console.log('Found team jobs:', teamJobs.length); // Debug log
    
    teamJobs.forEach(job => {
        const teamJobsRow = job.closest('.team-jobs-row');
        if (teamJobsRow) {
            const teamName = teamJobsRow.getAttribute('data-team');
            const jobNumber = job.getAttribute('data-job-number');
            const route = job.getAttribute('data-route');
            const address = job.getAttribute('data-address');
            const lat = parseFloat(job.getAttribute('data-lat'));
            const lng = parseFloat(job.getAttribute('data-lng'));
            
            console.log(`Processing job ${jobNumber} for ${teamName}:`, { lat, lng }); // Debug log
            
            if (lat && lng) {
                if (!teamCoordinates[teamName]) {
                    teamCoordinates[teamName] = [];
                }
                
                teamCoordinates[teamName].push({
                    jobNumber,
                    route,
                    address,
                    position: { lat, lng }
                });
            }
        }
    });
    
    // Create markers for each team
    Object.keys(teamCoordinates).forEach(teamName => {
        const jobs = teamCoordinates[teamName];
        const teamColor = teamColors[teamName] || { bg: '#6B7280', border: '#374151' };
        
        jobs.forEach(job => {
            const marker = new google.maps.Marker({
                position: job.position,
                map: map,
                title: `${teamName} - Job ${job.jobNumber}: ${job.address}`,
                label: job.jobNumber.toString(),
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="18" fill="${teamColor.bg}" stroke="${teamColor.border}" stroke-width="2"/>
                            <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${job.jobNumber}</text>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 20)
                }
            });
            
            markers.push(marker);
            
            // Store marker by team and job number
            if (!teamMarkers[teamName]) {
                teamMarkers[teamName] = {};
            }
            teamMarkers[teamName][job.jobNumber] = marker;
            
            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="p-3">
                        <h3 class="font-semibold text-gray-800">${teamName} - Job ${job.jobNumber}</h3>
                        <p class="text-sm text-gray-600">${job.address}</p>
                        <p class="text-xs text-gray-500">Route: ${job.route}</p>
                    </div>
                `
            });
            
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
        });
        
        // Draw route path for team
        if (jobs.length > 1) {
            drawTeamRoute(teamName, jobs, teamColor);
        }
    });
    
    // Center map on all markers
    if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
    }
    
    // Add team info overlay
    addTeamInfoOverlay(teamCoordinates);
}

// Draw route path for a specific team
function drawTeamRoute(teamName, jobs, teamColor) {
    // Sort jobs by job number
    jobs.sort((a, b) => parseInt(a.jobNumber) - parseInt(b.jobNumber));
    
    const path = jobs.map(job => job.position);
    
    const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: teamColor.bg,
        strokeOpacity: 0.8,
        strokeWeight: 4,
        icons: [{
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
            },
            offset: '50%',
            repeat: '100px'
        }]
    });
    
    polyline.setMap(map);
    
    // Store polyline by team
    teamPolylines[teamName] = polyline;
}

// Add team info overlay to map controls
function addTeamInfoOverlay(teamCoordinates) {
    const mapControls = document.querySelector('.view-controls');
    if (!mapControls) return;
    
    // Create team buttons container
    const teamButtonsContainer = document.createElement('div');
    teamButtonsContainer.className = 'flex gap-2 ml-2';
    
    // Create a compact team button
    const teamButton = document.createElement('button');
    teamButton.className = 'view-control-btn bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors';
    teamButton.innerHTML = `
        <i class="fas fa-users"></i>
        <span class="ml-1 text-xs">Teams (${Object.keys(teamCoordinates).length})</span>
    `;
    teamButton.title = `Team Info (${Object.keys(teamCoordinates).length} teams)`;
    teamButton.id = 'teamInfoBtn';
    
    // Add team toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'view-control-btn';
    toggleButton.innerHTML = `
        <i class="fas fa-eye"></i>
        <span class="ml-1 text-xs">Hide</span>
    `;
    toggleButton.title = 'Hide Teams';
    toggleButton.id = 'toggleTeams';
    
    // Add buttons to container
    teamButtonsContainer.appendChild(teamButton);
    teamButtonsContainer.appendChild(toggleButton);
    
    // Insert after map controls
    mapControls.parentNode.insertBefore(teamButtonsContainer, mapControls.nextSibling);
    
    // Toggle team visibility
    toggleButton.addEventListener('click', function() {
        const isVisible = markers.length > 0 && markers[0].getMap() !== null;
        if (isVisible) {
            markers.forEach(marker => marker.setMap(null));
            Object.values(teamPolylines).forEach(polyline => polyline.setMap(null));
            this.innerHTML = '<i class="fas fa-eye-slash"></i><span class="ml-1 text-xs">Show</span>';
            this.title = 'Show Teams';
        } else {
            markers.forEach(marker => marker.setMap(map));
            Object.values(teamPolylines).forEach(polyline => polyline.setMap(map));
            this.innerHTML = '<i class="fas fa-eye"></i><span class="ml-1 text-xs">Hide</span>';
            this.title = 'Hide Teams';
        }
    });
    
    // Team info button click handler
    teamButton.addEventListener('click', function() {
        showTeamModal(teamCoordinates);
    });
}

// Show team modal
function showTeamModal(teamCoordinates) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('teamModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'teamModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        document.body.appendChild(modal);
    }
    
    // Team color mapping
    const teamColors = {
        'Team Alpha': { bg: '#3B82F6', border: '#1E40AF' },
        'Team Beta': { bg: '#10B981', border: '#059669' },
        'Team Gamma': { bg: '#8B5CF6', border: '#7C3AED' }
    };
    
    // Generate team info content
    let teamContent = '';
    Object.keys(teamCoordinates).forEach(teamName => {
        const jobs = teamCoordinates[teamName];
        const teamColor = teamColors[teamName] || { bg: '#6B7280', border: '#374151' };
        
        teamContent += `
            <div class="mb-6 p-4 border rounded-lg" style="border-left-color: ${teamColor.bg}; border-left-width: 4px;">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">${teamName}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        `;
        
        jobs.forEach(job => {
            teamContent += `
                <div class="bg-gray-50 p-3 rounded-lg">
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold" style="background-color: ${teamColor.bg};">${job.jobNumber}</span>
                        <span class="text-sm font-medium text-gray-800">Job ${job.jobNumber}</span>
                    </div>
                    <p class="text-sm text-gray-600">${job.address}</p>
                    <p class="text-xs text-gray-500">Route: ${job.route}</p>
                </div>
            `;
        });
        
        teamContent += `
                </div>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div class="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 class="text-xl font-semibold">Team Overview</h2>
                <button onclick="this.closest('#teamModal').remove()" class="text-white hover:text-gray-200 text-2xl font-bold">&times;</button>
            </div>
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                ${teamContent}
            </div>
        </div>
    `;
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Show team jobs on map
function showTeamJobsOnMap(teamName) {
    if (teamMarkers && teamMarkers[teamName]) {
        Object.values(teamMarkers[teamName]).forEach(marker => {
            marker.setMap(map);
        });
        
        if (teamPolylines && teamPolylines[teamName]) {
            teamPolylines[teamName].setMap(map);
        }
    }
}

// Hide team jobs from map
function hideTeamJobsFromMap(teamName) {
    if (teamMarkers && teamMarkers[teamName]) {
        Object.values(teamMarkers[teamName]).forEach(marker => {
            marker.setMap(null);
        });
        
        if (teamPolylines && teamPolylines[teamName]) {
            teamPolylines[teamName].setMap(null);
        }
    }
}

// Initialize address hover functionality
function initializeAddressHover() {
    const addressCells = document.querySelectorAll('.address-cell');
    
    addressCells.forEach(cell => {
        // Show tooltip on hover
        cell.addEventListener('mouseenter', function() {
            const address = this.getAttribute('data-address');
            const route = this.getAttribute('data-route');
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none';
            tooltip.innerHTML = `
                <div class="font-semibold">Route ${route}</div>
                <div>${address}</div>
                <div class="text-xs text-gray-300 mt-1">Click to highlight on map</div>
            `;
            tooltip.id = 'address-tooltip';
            document.body.appendChild(tooltip);
            
            // Position tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            
            // Highlight marker on map
            if (markersByRoute[route]) {
                markersByRoute[route].setAnimation(google.maps.Animation.BOUNCE);
                map.panTo(markersByRoute[route].getPosition());
                map.setZoom(15);
            }
        });
        
        cell.addEventListener('mouseleave', function() {
            const route = this.getAttribute('data-route');
            
            // Remove tooltip
            const tooltip = document.getElementById('address-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
            
            // Stop marker animation
            if (markersByRoute[route]) {
                markersByRoute[route].setAnimation(null);
            }
        });
        
        // Click to center map on location
        cell.addEventListener('click', function() {
            const route = this.getAttribute('data-route');
            if (markersByRoute[route]) {
                map.panTo(markersByRoute[route].getPosition());
                map.setZoom(16);
                
                // Show info window
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div class="p-3">
                            <h3 class="font-semibold text-gray-800">Route ${route}</h3>
                            <p class="text-sm text-gray-600">${this.getAttribute('data-address')}</p>
                            <div class="mt-2 text-xs text-gray-500">
                                <div>Team: ${this.closest('tr').querySelector('td:nth-child(11)').textContent}</div>
                                <div>Status: ${this.closest('tr').querySelector('td:nth-child(12) span').textContent}</div>
                            </div>
                        </div>
                    `
                });
                infoWindow.open(map, markersByRoute[route]);
            }
        });
    });
}

// Function to initialize mobile map
function initializeMobileMap() {
    if (!mobileMap) {
        // Get team job data for mobile map centering
        const teamJobs = document.querySelectorAll('.job-item');
        let centerLat = 39.8283; // Default center of USA
        let centerLng = -98.5795;
        
        if (teamJobs.length > 0) {
            let totalLat = 0;
            let totalLng = 0;
            let validCoordinates = 0;
            
            teamJobs.forEach(job => {
                const lat = parseFloat(job.getAttribute('data-lat'));
                const lng = parseFloat(job.getAttribute('data-lng'));
                if (lat && lng) {
                    totalLat += lat;
                    totalLng += lng;
                    validCoordinates++;
                }
            });
            
            if (validCoordinates > 0) {
                centerLat = totalLat / validCoordinates;
                centerLng = totalLng / validCoordinates;
            }
        }

        mobileMap = new google.maps.Map(document.getElementById('mobileMapContainer'), {
            center: { lat: centerLat, lng: centerLng },
            zoom: 4,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });

        // Team color mapping
        const teamColors = {
            'Team Alpha': { bg: '#3B82F6', border: '#1E40AF' },
            'Team Beta': { bg: '#10B981', border: '#059669' },
            'Team Gamma': { bg: '#8B5CF6', border: '#7C3AED' }
        };

        // Add markers for mobile map based on team job data
        teamJobs.forEach(job => {
            const teamName = job.closest('.team-jobs-row').getAttribute('data-team');
            const jobNumber = job.getAttribute('data-job-number');
            const route = job.getAttribute('data-route');
            const address = job.getAttribute('data-address');
            const lat = parseFloat(job.getAttribute('data-lat'));
            const lng = parseFloat(job.getAttribute('data-lng'));
            
            if (lat && lng) {
                const teamColor = teamColors[teamName] || { bg: '#6B7280', border: '#374151' };
                
                const mobileMarker = new google.maps.Marker({
                    position: { lat, lng },
                    map: mobileMap,
                    title: `${teamName} - Job ${jobNumber}: ${address}`,
                    label: jobNumber.toString(),
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" fill="${teamColor.bg}" stroke="${teamColor.border}" stroke-width="2"/>
                                <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${jobNumber}</text>
                            </svg>
                        `),
                        scaledSize: new google.maps.Size(40, 40),
                        anchor: new google.maps.Point(20, 20)
                    }
                });
                mobileMarkers.push(mobileMarker);
                
                // Add info window
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div class="p-2">
                            <h3 class="font-semibold text-gray-800">${teamName} - Job ${jobNumber}</h3>
                            <p class="text-sm text-gray-600">${address}</p>
                            <p class="text-xs text-gray-500">Route: ${route}</p>
                        </div>
                    `
                });
                
                mobileMarker.addListener('click', () => {
                    infoWindow.open(mobileMap, mobileMarker);
                });
            }
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

    let currentView = 'hidden'; // Start with hidden view

    // Mobile Map Modal Controls
    mobileMapBtn.addEventListener('click', () => {
        mobileMapModal.style.display = 'flex';
        // Initialize mobile map if not already done
        initializeMobileMap();
        // Trigger resize to ensure mobile map renders correctly
        setTimeout(() => {
            google.maps.event.trigger(mobileMap, 'resize');
            // Center on actual team job data
            const teamJobs = document.querySelectorAll('.job-item');
            if (teamJobs.length > 0) {
                let totalLat = 0;
                let totalLng = 0;
                let validCoordinates = 0;
                
                teamJobs.forEach(job => {
                    const lat = parseFloat(job.getAttribute('data-lat'));
                    const lng = parseFloat(job.getAttribute('data-lng'));
                    if (lat && lng) {
                        totalLat += lat;
                        totalLng += lng;
                        validCoordinates++;
                    }
                });
                
                if (validCoordinates > 0) {
                    mobileMap.setCenter({ 
                        lat: totalLat / validCoordinates, 
                        lng: totalLng / validCoordinates 
                    });
                }
            }
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
            // Center on actual route data
            const dispatchRows = document.querySelectorAll('.dispatch-row');
            if (dispatchRows.length > 0) {
                let totalLat = 0;
                let totalLng = 0;
                let validCoordinates = 0;
                
                dispatchRows.forEach(row => {
                    const lat = parseFloat(row.getAttribute('data-lat'));
                    const lng = parseFloat(row.getAttribute('data-lng'));
                    if (lat && lng) {
                        totalLat += lat;
                        totalLng += lng;
                        validCoordinates++;
                    }
                });
                
                if (validCoordinates > 0) {
                    map.setCenter({ 
                        lat: totalLat / validCoordinates, 
                        lng: totalLng / validCoordinates 
                    });
                }
            }
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

    // Initialize with hidden view on desktop (map hidden by default)
    if (window.innerWidth >= 768) {
        hideMapBtn.click();
    }
}); 