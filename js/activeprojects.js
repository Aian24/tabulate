document.addEventListener('DOMContentLoaded', function() {
    // Show entries functionality
    const entriesSelect = document.querySelector('.pagination-entries-select');
    if (entriesSelect) {
        entriesSelect.addEventListener('change', function(e) {
            const entriesPerPage = parseInt(e.target.value);
            // Here you would typically:
            // 1. Update the table to show the selected number of entries
            // 2. Update the pagination
            // 3. Update the "Showing X to Y of Z entries" text
            
            // For now, we'll just log the change
            console.log(`Changed entries per page to: ${entriesPerPage}`);
            
            // You would implement the actual pagination logic here
            // This would typically involve:
            // - Fetching new data if using server-side pagination
            // - Or slicing the existing data if using client-side pagination
            // - Updating the table contents
            // - Updating the pagination controls
        });
    }

    // Filter functions moved from main.js
    function initializeFilter() {
        const filterBtn = document.getElementById('openFilter');
        if (!filterBtn) return;

        filterBtn.addEventListener('click', () => {
            // Gather unique values from the table
            const rows = document.querySelectorAll('table tbody tr');
            const priorities = new Set();
            const teams = new Set();
            const jobTypes = new Set();
            rows.forEach(row => {
                priorities.add(row.querySelector('td:nth-child(1) .status-badge')?.textContent.trim() || '');
                teams.add(row.querySelector('td:nth-child(8) span')?.textContent.trim() || '');
                jobTypes.add(row.querySelector('td:nth-child(9) span')?.textContent.trim() || '');
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
                            <label class="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                            <select id="filterJobType" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All Types</option>
                                ${Array.from(jobTypes).filter(Boolean).map(j => `<option value="${j}">${j}</option>`).join('')}
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
                const jobType = modal.querySelector('#filterJobType').value;

                filterTable(priority, team, jobType);
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

    function filterTable(priority, team, jobType) {
        const tableBody = document.querySelector('tbody');
        const rows = tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const rowPriority = row.querySelector('td:nth-child(1) .status-badge')?.textContent.trim();
            const rowTeam = row.querySelector('td:nth-child(8) span')?.textContent.trim();
            const rowJobType = row.querySelector('td:nth-child(9) span')?.textContent.trim();

            const priorityMatch = !priority || rowPriority === priority;
            const teamMatch = !team || rowTeam === team;
            const jobTypeMatch = !jobType || rowJobType === jobType;

            if (priorityMatch && teamMatch && jobTypeMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        // Update mobile cards view
        if (typeof createMobileCards === 'function') createMobileCards();
    }

    function filterTableByDateRange(startDate, endDate) {
        const tableBody = document.querySelector('tbody');
        const rows = tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const dateCell = row.querySelector('td:nth-child(4)'); // Start Date column
            if (dateCell) {
                const dateText = dateCell.textContent.trim();
                if (dateText === 'N/A') {
                    // Show rows with N/A dates by default
                    row.style.display = '';
                    return;
                }

                const rowDate = new Date(dateText);
                if (rowDate >= startDate && rowDate <= endDate) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });

        // Update mobile cards view
        if (typeof createMobileCards === 'function') createMobileCards();
    }

    // Optionally, initialize the filter on DOMContentLoaded
    initializeFilter();
});

// Utility: Check which page we're on
const isActiveProjectsPage = window.location.pathname.includes('activeprojects.html');
const isActiveDetailsPage = window.location.pathname.includes('active-details.html');

// --- 1. On activeprojects.html: Row click to details page ---
if (isActiveProjectsPage) {
    // Wait for DOM to load
    document.addEventListener('DOMContentLoaded', function() {
        // Attach click event to each dispatch row
        document.querySelectorAll('.dispatch-card').forEach(row => {
            row.addEventListener('click', function() {
                // Gather data from the row's cells
                const data = {
                    team: row.cells[7]?.innerText.trim() || '',
                    vip: row.cells[0]?.innerText.trim() || '',
                    startDate: row.cells[3]?.innerText.trim() || '',
                    status: 'Pending', // Default or update as needed
                    billingType: row.cells[8]?.innerText.trim() || '',
                    customer: row.cells[4]?.innerText.trim() || '',
                    address: row.cells[2]?.innerText.trim() || '',
                    service: row.cells[1]?.innerText.trim() || '',
                    jobStatus: '', // Not available in table, can be set later
                    jobTeam: row.cells[7]?.innerText.trim() || '',
                    jobStartDate: '', // Not available in table, can be set later
                    priorityType: row.cells[2]?.innerText.trim() || '',
                    budgetHours: row.cells[7]?.innerText.trim() || '',
                    distance: row.cells[5]?.innerText.trim() || '',
                    eta: row.cells[6]?.innerText.trim() || ''
                };
                // Store in localStorage
                localStorage.setItem('activeJobDetails', JSON.stringify(data));
                // Redirect to details page
                window.location.href = 'active-details.html';
            });
        });
    });
}

// --- 2. On active-details.html: Populate form from localStorage ---
if (isActiveDetailsPage) {
    document.addEventListener('DOMContentLoaded', function() {
        // Get data from localStorage
        const data = JSON.parse(localStorage.getItem('activeJobDetails') || '{}');
        // Populate fields if data exists
        if (data) {
            document.getElementById('teamField').value = data.team || '';
            document.getElementById('vipField').value = data.vip || '';
            document.getElementById('startDateField').value = data.startDate || '';
            document.getElementById('statusField').value = data.status || '';
            document.getElementById('billingTypeField').value = data.billingType || '';
            document.getElementById('customerField').value = data.customer || '';
            document.getElementById('addressField').value = data.address || '';
            document.getElementById('serviceField').value = data.service || '';
            document.getElementById('jobStatusField').value = data.jobStatus || '';
            document.getElementById('jobTeamField').value = data.jobTeam || '';
            document.getElementById('jobStartDateField').value = data.jobStartDate || '';
            document.getElementById('priorityTypeField').value = data.priorityType || '';
            document.getElementById('budgetHoursField').value = data.budgetHours || '';
            document.getElementById('distanceField').value = data.distance || '';
            document.getElementById('etaField').value = data.eta || '';
        }
    });
}

// --- End of activeprojects.js ---
// All logic for both pages is contained here for maintainability. 