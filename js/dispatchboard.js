// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips for all elements with data-tippy-content
    tippy('[data-tippy-content]', {
        theme: 'light',
        animation: 'scale',
        duration: [200, 200],
        arrow: true,
        placement: 'top'
    });

    // Initialize date pickers
    const fromDatePicker = flatpickr("#fromDatePicker", {
        dateFormat: "Y-m-d",
        allowInput: true,
        onChange: function(selectedDates, dateStr) {
            // Update the "to" date picker's min date
            toDatePicker.set('minDate', dateStr);
        }
    });

    const toDatePicker = flatpickr("#toDatePicker", {
        dateFormat: "Y-m-d",
        allowInput: true,
        onChange: function(selectedDates, dateStr) {
            // Update the "from" date picker's max date
            fromDatePicker.set('maxDate', dateStr);
        }
    });

    // Initialize week days
    initializeWeekDays();

    // Initialize table interactions
    initializeTableInteractions();

    // Initialize modals
    initializeModals();

    // Initialize map controls
    initializeMapControls();

    // More dropdown functionality (moved from dispatchboard.html)
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');
    if (moreDropdown && moreMenu) {
        // Toggle more menu
        moreDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            moreMenu.classList.toggle('hidden');
        });
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!moreDropdown.contains(e.target)) {
                moreMenu.classList.add('hidden');
            }
        });
    }

    // Initialize filter
    initializeFilter();
});

// Initialize week days
function initializeWeekDays() {
    const weekDays = document.getElementById('weekDays');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    days.forEach((day, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + index);
        
        const isToday = date.toDateString() === today.toDateString();
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${isToday ? 'active' : ''} cursor-pointer`;
        dayElement.innerHTML = `
            <div class="text-center">
                <div class="text-sm font-medium text-gray-600">${day}</div>
                <div class="text-lg font-semibold ${isToday ? 'text-white' : 'text-gray-900'}">${date.getDate()}</div>
            </div>
        `;
        weekDays.appendChild(dayElement);
    });
}

// Initialize table interactions
function initializeTableInteractions() {
    const table = document.querySelector('table');
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tbody tr');
    const modal = document.getElementById('dispatchModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');

    // Add click event to rows
    rows.forEach(row => {
        row.addEventListener('click', (e) => {
            if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) {
                const data = {
                    route: row.querySelector('td:nth-child(2)').textContent,
                    priority: row.querySelector('td:nth-child(3)').textContent,
                    category: row.querySelector('td:nth-child(4)').textContent,
                    client: row.querySelector('td:nth-child(5)').textContent,
                    address: row.querySelector('td:nth-child(6)').textContent,
                    startDate: row.querySelector('td:nth-child(7)').textContent,
                    hours: row.querySelector('td:nth-child(8)').textContent,
                    distance: row.querySelector('td:nth-child(9)').textContent,
                    eta: row.querySelector('td:nth-child(10)').textContent,
                    team: row.querySelector('td:nth-child(11)').textContent,
                    status: row.querySelector('td:nth-child(12)').textContent
                };

                showDispatchDetails(data);
            }
        });
    });

    // Add click event to headers for sorting
    headers.forEach(header => {
        if (header.classList.contains('draggable-header')) {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                sortTable(column);
            });
        }
    });

    // Close modal when clicking close button
    closeModal.addEventListener('click', () => {
        closeDispatchModal();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDispatchModal();
        }
    });
}

// Show dispatch details in modal
function showDispatchDetails(data) {
    const modal = document.getElementById('dispatchModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold text-gray-800">Update Dispatch</h2>
                <button id="closeModal" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Select Team *</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="Team A">Team A</option>
                            <option value="Team B">Team B</option>
                            <option value="Team C">Team C</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">VIP *</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                        <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="2025-05-09">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Billing Type</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">-- Select Billing Type --</option>
                            <option value="Hourly">Hourly</option>
                            <option value="Fixed">Fixed</option>
                            <option value="Project">Project</option>
                        </select>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500">Customer</p>
                            <p class="font-medium">${data.client}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Address</p>
                            <p class="font-medium">${data.address}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Service</p>
                            <p class="font-medium">${data.category}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Status</p>
                            <p class="font-medium">${data.status}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Team</p>
                            <p class="font-medium">${data.team}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Start Date</p>
                            <p class="font-medium">${data.startDate}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Priority Type</p>
                            <p class="font-medium">${data.priority}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Budget Hours</p>
                            <p class="font-medium">${data.hours}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Distance</p>
                            <p class="font-medium">${data.distance}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">ETA</p>
                            <p class="font-medium">${data.eta}</p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 pt-4 border-t border-gray-200">
                    <button type="button" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors">
                        Update
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Ensure modal is properly centered
    modal.classList.add('active');
    modal.classList.remove('hidden');
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    // Add event listener for the new close button
    const newCloseButton = modalContent.querySelector('#closeModal');
    if (newCloseButton) {
        newCloseButton.addEventListener('click', closeDispatchModal);
    }

    // Add event listener for the cancel button
    const cancelButton = modalContent.querySelector('button[type="button"]');
    if (cancelButton) {
        cancelButton.addEventListener('click', closeDispatchModal);
    }

    // Add event listener for form submission
    const form = modalContent.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle form submission here
            closeDispatchModal();
        });
    }
}

// Function to close dispatch modal
function closeDispatchModal() {
    const modal = document.getElementById('dispatchModal');
    modal.classList.remove('active');
    modal.classList.add('hidden');
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Sort table function
function sortTable(column) {
    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const header = table.querySelector(`th[data-column="${column}"]`);
    const isAscending = header.classList.contains('asc');

    // Remove all sort classes
    table.querySelectorAll('th').forEach(th => {
        th.classList.remove('asc', 'desc');
    });

    // Add sort class to clicked header
    header.classList.add(isAscending ? 'desc' : 'asc');

    // Sort rows
    rows.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent;
        const bValue = b.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent;
        
        if (isAscending) {
            return bValue.localeCompare(aValue);
        } else {
            return aValue.localeCompare(bValue);
        }
    });

    // Reorder rows
    rows.forEach(row => tbody.appendChild(row));
}

// Get column index
function getColumnIndex(column) {
    const columnMap = {
        'route': 2,
        'priority': 3,
        'category': 4,
        'client': 5,
        'address': 6,
        'start-date': 7,
        'hours': 8,
        'distance': 9,
        'eta': 10,
        'team': 11,
        'status': 12
    };
    return columnMap[column] || 1;
}

// Initialize modals
function initializeModals() {
    // Date Range Modal
    const dateRangeModal = document.getElementById('dateRangeModal');
    const openDateRangePicker = document.getElementById('openDateRangePicker');
    const closeDateRangeModal = document.getElementById('closeDateRangeModal');
    const resetDateRange = document.getElementById('resetDateRange');
    const applyDateRange = document.getElementById('applyDateRange');

    openDateRangePicker.addEventListener('click', () => {
        dateRangeModal.classList.remove('hidden');
    });

    closeDateRangeModal.addEventListener('click', () => {
        dateRangeModal.classList.add('hidden');
    });

    resetDateRange.addEventListener('click', () => {
        document.getElementById('fromDatePicker').value = '';
        document.getElementById('toDatePicker').value = '';
    });

    applyDateRange.addEventListener('click', () => {
        // Apply date range filter logic here
        dateRangeModal.classList.add('hidden');
    });

    // Mobile Map Modal
    const mobileMapModal = document.getElementById('mobileMapModal');
    const mobileMapBtn = document.getElementById('mobileMapBtn');
    const closeMobileMapModal = document.getElementById('closeMobileMapModal');

    mobileMapBtn.addEventListener('click', () => {
        mobileMapModal.classList.remove('hidden');
    });

    closeMobileMapModal.addEventListener('click', () => {
        mobileMapModal.classList.add('hidden');
    });
}

// Initialize map controls
function initializeMapControls() {
    const hideMapBtn = document.getElementById('hideMapBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const splitViewBtn = document.getElementById('splitViewBtn');
    const fullMapBtn = document.getElementById('fullMapBtn');
    const mapContainer = document.getElementById('mapContainer');
    const tableContainer = document.getElementById('tableContainer');
    const contentContainer = document.getElementById('contentContainer');
    const splitMapContainer = document.getElementById('splitMapContainer');

    hideMapBtn.addEventListener('click', () => {
        mapContainer.classList.add('hidden');
        tableContainer.classList.remove('md:w-1/2');
        tableContainer.classList.add('w-full');
    });

    listViewBtn.addEventListener('click', () => {
        mapContainer.classList.add('hidden');
        splitMapContainer.classList.add('hidden');
        tableContainer.classList.remove('md:w-1/2');
        tableContainer.classList.add('w-full');
    });

    splitViewBtn.addEventListener('click', () => {
        mapContainer.classList.add('hidden');
        splitMapContainer.classList.remove('hidden');
        tableContainer.classList.remove('w-full');
        tableContainer.classList.add('md:w-1/2');
        // Move map to split container
        const map = document.getElementById('map');
        splitMapContainer.appendChild(map);
    });

    fullMapBtn.addEventListener('click', () => {
        mapContainer.classList.remove('hidden');
        splitMapContainer.classList.add('hidden');
        tableContainer.classList.remove('md:w-1/2');
        tableContainer.classList.add('w-full');
        // Move map back to original container
        const map = document.getElementById('map');
        mapContainer.appendChild(map);
    });
}

// Move filter initialization to its own listener to avoid conflicts
document.addEventListener('DOMContentLoaded', function() {
    function initializeFilter() {
        const filterBtn = document.getElementById('openFilter');
        if (!filterBtn) return;

        filterBtn.addEventListener('click', () => {
            // Gather unique values from the table
            const rows = document.querySelectorAll('table tbody tr');
            const priorities = new Set();
            const teams = new Set();
            const statuses = new Set();
            rows.forEach(row => {
                priorities.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                teams.add(row.querySelector('td:nth-child(11)')?.textContent.trim() || '');
                statuses.add(row.querySelector('td:nth-child(12)')?.textContent.trim() || '');
            });

            // Create and show filter modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Filter Dispatches</h3>
                        <button class="text-gray-500 hover:text-gray-700" id="closeFilterModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select id="filterPriority" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All Priorities</option>
                                ${Array.from(priorities).filter(Boolean).map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Team</label>
                            <select id="filterTeam" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All Teams</option>
                                ${Array.from(teams).filter(Boolean).map(t => `<option value="${t}">${t}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select id="filterStatus" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All Statuses</option>
                                ${Array.from(statuses).filter(Boolean).map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" id="resetFilter">
                            <i class="fas fa-undo"></i> Reset
                        </button>
                        <button class="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors" id="applyFilter">
                            <i class="fas fa-check"></i> Apply
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Close modal
            const closeBtn = modal.querySelector('#closeFilterModal');
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });

            // Reset filter
            const resetBtn = modal.querySelector('#resetFilter');
            resetBtn.addEventListener('click', () => {
                modal.querySelectorAll('select').forEach(select => {
                    select.value = '';
                });
                // Show all rows
                rows.forEach(row => { row.style.display = ''; });
            });

            // Apply filter
            const applyBtn = modal.querySelector('#applyFilter');
            applyBtn.addEventListener('click', () => {
                const priority = modal.querySelector('#filterPriority').value;
                const team = modal.querySelector('#filterTeam').value;
                const status = modal.querySelector('#filterStatus').value;

                filterTable(priority, team, status);
                modal.remove();
            });

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    }

    function filterTable(priority, team, status) {
        const tableBody = document.querySelector('tbody');
        const rows = tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const rowPriority = row.querySelector('td:nth-child(3)')?.textContent.trim();
            const rowTeam = row.querySelector('td:nth-child(11)')?.textContent.trim();
            const rowStatus = row.querySelector('td:nth-child(12)')?.textContent.trim();

            const priorityMatch = !priority || rowPriority === priority;
            const teamMatch = !team || rowTeam === team;
            const statusMatch = !status || rowStatus === status;

            if (priorityMatch && teamMatch && statusMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    initializeFilter();
}); 