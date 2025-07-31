// Mobile Dispatch Board JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize week days
    initializeWeekDays();
    
    // Initialize dropdowns
    initializeDropdowns();
    
    // Initialize map functionality
    initializeMap();
    
    // Initialize date range picker
    initializeDateRangePicker();
    
    // Initialize filter buttons
    initializeFilterButtons();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize floating action button
    initializeFAB();
    
    // Initialize toast notifications
    initializeToast();
});

function initializeWeekDays() {
    const weekDays = document.getElementById('weekDays');
    if (weekDays) {
        const days = [
            { name: 'Sun', date: '27' },
            { name: 'Mon', date: '28' },
            { name: 'Tue', date: '29' },
            { name: 'Wed', date: '30' },
            { name: 'Thu', date: '31', active: true },
            { name: 'Fri', date: '1' },
            { name: 'Sat', date: '2' }
        ];
        
        weekDays.innerHTML = days.map(day => `
            <button class="week-day-btn ${day.active ? 'selected' : ''} bg-white border border-gray-200 rounded-lg p-2 text-center hover:bg-gray-50 transition-colors">
                <div class="text-xs text-gray-500 font-medium">${day.name}</div>
                <div class="text-sm font-semibold text-gray-900">${day.date}</div>
            </button>
        `).join('');
        
        // Add click handlers for week day buttons
        const weekDayButtons = weekDays.querySelectorAll('.week-day-btn');
        weekDayButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                weekDayButtons.forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                
                // Update the date range display
                updateDateRangeDisplay();
            });
        });
    }
}

function initializeDropdowns() {
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');

    // Actions dropdown
    if (actionsDropdown && actionsMenu) {
        actionsDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            actionsMenu.classList.toggle('hidden');
            moreMenu.classList.add('hidden');
        });
    }

    // More dropdown
    if (moreDropdown && moreMenu) {
        moreDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            moreMenu.classList.toggle('hidden');
            actionsMenu.classList.add('hidden');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        if (actionsMenu) actionsMenu.classList.add('hidden');
        if (moreMenu) moreMenu.classList.add('hidden');
    });

    // Add click handlers for dropdown menu items
    if (actionsMenu) {
        const viewMapBtn = actionsMenu.querySelector('button:contains("View Map")');
        if (viewMapBtn) {
            viewMapBtn.addEventListener('click', function() {
                showMap();
            });
        }
    }
}

function initializeMap() {
    const mapContainer = document.getElementById('mapContainer');
    const closeMapBtn = document.getElementById('closeMapBtn');

    if (mapContainer && closeMapBtn) {
        // Close map
        closeMapBtn.addEventListener('click', function() {
            mapContainer.classList.add('hidden');
        });
    }
}

function showMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.classList.remove('hidden');
        
        // Initialize map if not already done
        if (typeof initMap === 'function' && !window.mapInitialized) {
            initMap();
            window.mapInitialized = true;
        }
    }
}

function initializeDateRangePicker() {
    const dateRangeBtn = document.getElementById('openDateRangePicker');
    const dateRangeModal = document.getElementById('dateRangeModal');
    const closeDateRangeModal = document.getElementById('closeDateRangeModal');
    const resetDateRange = document.getElementById('resetDateRange');
    const applyDateRange = document.getElementById('applyDateRange');

    if (dateRangeBtn && dateRangeModal) {
        dateRangeBtn.addEventListener('click', function() {
            dateRangeModal.classList.remove('hidden');
            dateRangeModal.classList.add('flex');
        });
    }

    if (closeDateRangeModal && dateRangeModal) {
        closeDateRangeModal.addEventListener('click', function() {
            dateRangeModal.classList.add('hidden');
            dateRangeModal.classList.remove('flex');
        });
    }

    if (resetDateRange) {
        resetDateRange.addEventListener('click', function() {
            const fromDatePicker = document.getElementById('fromDatePicker');
            const toDatePicker = document.getElementById('toDatePicker');
            if (fromDatePicker) fromDatePicker.value = '';
            if (toDatePicker) toDatePicker.value = '';
            updateDateRangeDisplay();
        });
    }

    if (applyDateRange) {
        applyDateRange.addEventListener('click', function() {
            updateDateRangeDisplay();
            dateRangeModal.classList.add('hidden');
            dateRangeModal.classList.remove('flex');
            showToast('Date range updated successfully!', 'success');
        });
    }

    // Initialize date pickers
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#fromDatePicker", {
            dateFormat: "Y-m-d",
            allowInput: true,
            onChange: function(selectedDates, dateStr, instance) {
                updateDateRangeDisplay();
            }
        });
        flatpickr("#toDatePicker", {
            dateFormat: "Y-m-d",
            allowInput: true,
            onChange: function(selectedDates, dateStr, instance) {
                updateDateRangeDisplay();
            }
        });
    }
}

function updateDateRangeDisplay() {
    const fromDate = document.getElementById('fromDatePicker');
    const toDate = document.getElementById('toDatePicker');
    const displayBtn = document.getElementById('openDateRangePicker');
    
    if (fromDate && toDate && displayBtn) {
        const fromValue = fromDate.value;
        const toValue = toDate.value;
        
        if (fromValue && toValue) {
            const fromDateObj = new Date(fromValue);
            const toDateObj = new Date(toValue);
            const fromFormatted = fromDateObj.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
            const toFormatted = toDateObj.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            const span = displayBtn.querySelector('span');
            if (span) {
                span.textContent = `${fromFormatted} - ${toFormatted}`;
            }
        }
    }
}

function initializeFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const dispatchCards = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => {
                b.classList.remove('active-filter', 'bg-blue-500', 'text-white');
                b.classList.add('bg-gray-100', 'text-gray-700');
            });
            this.classList.add('active-filter', 'bg-blue-500', 'text-white');
            this.classList.remove('bg-gray-100', 'text-gray-700');
            
            // Filter cards based on selected filter
            filterCards(this.textContent.trim(), dispatchCards);
        });
    });
}

function filterCards(filterType, cards) {
    cards.forEach(card => {
        const statusBadge = card.querySelector('.status-badge');
        const statusText = card.querySelector('.bg-green-100, .bg-yellow-100, .bg-red-100');
        
        if (filterType === 'All') {
            card.style.display = 'block';
        } else if (filterType === 'VIP' && statusBadge && statusBadge.textContent.includes('VIP')) {
            card.style.display = 'block';
        } else if (filterType === 'Approved' && statusText && statusText.textContent.includes('Approved')) {
            card.style.display = 'block';
        } else if (filterType === 'Pending' && statusText && statusText.textContent.includes('Pending')) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function initializeSearch() {
    const searchInput = document.querySelector('input[type="search"]');
    const dispatchCards = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            dispatchCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

function initializeFAB() {
    const fab = document.querySelector('.fixed.bottom-6.right-6 button');
    if (fab) {
        fab.addEventListener('click', function() {
            showToast('Creating new dispatch...', 'success');
            // Add logic to create new dispatch
            setTimeout(() => {
                // Simulate creating new dispatch
                showToast('New dispatch created successfully!', 'success');
            }, 1000);
        });
    }
}

function initializeToast() {
    // Add click handlers for action buttons
    const dispatchCards = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm');
    
    dispatchCards.forEach(card => {
        const viewBtn = card.querySelector('button:contains("View Details")');
        const callBtn = card.querySelector('button:contains("Call")');
        const approveBtn = card.querySelector('button:contains("Approve")');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showToast('Opening dispatch details...', 'success');
                // Navigate to details page
                setTimeout(() => {
                    window.location.href = 'dispatchboard-details.html';
                }, 500);
            });
        }
        
        if (callBtn) {
            callBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const clientName = card.querySelector('.text-gray-700').textContent;
                showToast(`Calling ${clientName}...`, 'success');
            });
        }
        
        if (approveBtn) {
            approveBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const statusBadge = card.querySelector('.bg-yellow-100');
                if (statusBadge) {
                    statusBadge.className = 'bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full';
                    statusBadge.textContent = 'Approved';
                    approveBtn.className = 'flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium';
                    approveBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Approved';
                    showToast('Dispatch approved successfully!', 'success');
                }
            });
        }
    });
}

function showToast(message, type = 'success') {
    const toast = document.querySelector('.toast');
    if (toast) {
        const icon = toast.querySelector('i');
        const title = toast.querySelector('h4');
        const messageEl = toast.querySelector('p');
        
        if (type === 'success') {
            icon.className = 'fas fa-check-circle text-green-500 text-xl';
            title.textContent = 'Success!';
            toast.classList.remove('border-red-500', 'border-yellow-500');
            toast.classList.add('border-green-500');
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle text-red-500 text-xl';
            title.textContent = 'Error!';
            toast.classList.remove('border-green-500', 'border-yellow-500');
            toast.classList.add('border-red-500');
        } else if (type === 'warning') {
            icon.className = 'fas fa-exclamation-triangle text-yellow-500 text-xl';
            title.textContent = 'Warning!';
            toast.classList.remove('border-green-500', 'border-red-500');
            toast.classList.add('border-yellow-500');
        }
        
        messageEl.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Add pull-to-refresh functionality
let startY = 0;
let currentY = 0;
let pullDistance = 0;
const pullThreshold = 80;

document.addEventListener('touchstart', function(e) {
    if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
    }
});

document.addEventListener('touchmove', function(e) {
    if (window.scrollY === 0 && startY > 0) {
        currentY = e.touches[0].clientY;
        pullDistance = currentY - startY;
        
        if (pullDistance > 0) {
            e.preventDefault();
            document.body.style.transform = `translateY(${Math.min(pullDistance * 0.3, pullThreshold)}px)`;
        }
    }
});

document.addEventListener('touchend', function(e) {
    if (pullDistance > pullThreshold) {
        // Trigger refresh
        showToast('Refreshing dispatch data...', 'success');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
    
    document.body.style.transform = '';
    startY = 0;
    pullDistance = 0;
});

// Initialize map function (called by Google Maps script)
function initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const map = new google.maps.Map(mapElement, {
            center: { lat: 14.6091, lng: 121.0223 }, // Manila coordinates
            zoom: 10,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        // Add sample markers for dispatch locations
        const locations = [
            { lat: 14.6091, lng: 121.0223, title: 'Route 1 - Ryan Lester' },
            { lat: 14.6091, lng: 121.0323, title: 'Route 2 - Jamie Dora' },
            { lat: 14.6191, lng: 121.0223, title: 'Route 3 - Maria Santos' }
        ];

        locations.forEach(location => {
            new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                title: location.title,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
                            <circle cx="12" cy="12" r="4" fill="white"/>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(24, 24)
                }
            });
        });
    }
} 