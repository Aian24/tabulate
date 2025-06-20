/**
 * Pending Projects Page JavaScript
 * Handles the functionality for the pending projects table and modal
 */

// DOM Elements
const moreDropdown = document.getElementById('moreDropdown');
const moreMenu = document.getElementById('moreMenu');
const dispatchModal = document.getElementById('dispatchModal');
const closeModal = document.getElementById('closeModal');
const cancelButton = document.getElementById('cancelButton');
const dispatchForm = document.getElementById('dispatchForm');
const dispatchRows = document.querySelectorAll('tbody tr');

/**
 * More dropdown menu functionality
 */
// Toggle more menu visibility
moreDropdown.addEventListener('click', () => {
    moreMenu.classList.toggle('hidden');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!moreDropdown.contains(e.target)) {
        moreMenu.classList.add('hidden');
    }
});

/**
 * Modal functionality
 */

/**
 * Closes the dispatch modal and resets the form
 */
function closeDispatchModal() {
    dispatchModal.classList.remove('active');
    // Reset form
    dispatchForm.reset();
    // Remove selected class from all rows
    dispatchRows.forEach(r => r.classList.remove('selected'));
}

// Close modal when clicking close button
closeModal.addEventListener('click', closeDispatchModal);

// Close modal when clicking cancel button
cancelButton.addEventListener('click', closeDispatchModal);

// Close modal when clicking outside
dispatchModal.addEventListener('click', (e) => {
    if (e.target === dispatchModal) {
        closeDispatchModal();
    }
});

/**
 * Opens the dispatch modal and populates it with row data
 * @param {HTMLElement} row - The table row element that was clicked
 */
function openDispatchModal(row) {
    // Get data from the row
    const priority = row.querySelector('td:nth-child(1) .status-badge').textContent.trim();
    const service = row.querySelector('td:nth-child(2)').textContent.trim();
    const customer = row.querySelector('td:nth-child(3)').textContent.trim();
    const address = row.querySelector('td:nth-child(4) p').textContent.trim();
    const startDate = row.querySelector('td:nth-child(5)').textContent.trim();
    const hours = row.querySelector('td:nth-child(6)').textContent.trim();
    const distance = row.querySelector('td:nth-child(7)').textContent.trim();
    const eta = row.querySelector('td:nth-child(8)').textContent.trim();
    const team = row.querySelector('td:nth-child(9)').textContent.trim();
    const status = row.querySelector('td:nth-child(10) span').textContent.trim();

    // Populate form fields
    document.querySelector('select[name="team"]').value = team === 'N/A' ? '' : team;
    document.querySelector('select[name="priority"]').value = priority === 'VIP' ? 'vip' : 'non-vip';
    document.querySelector('input[name="startDate"]').value = startDate === 'N/A' ? '' : startDate;
    document.querySelector('select[name="status"]').value = status.toLowerCase();

    // Populate read-only fields
    document.getElementById('modalCustomer').textContent = customer;
    document.getElementById('modalAddress').textContent = address;
    document.getElementById('modalService').textContent = service;
    document.getElementById('modalStatus').textContent = status;
    document.getElementById('modalTeam').textContent = team;
    document.getElementById('modalStartDate').textContent = startDate;
    document.getElementById('modalPriority').textContent = priority;
    document.getElementById('modalHours').textContent = hours;
    document.getElementById('modalDistance').textContent = distance;
    document.getElementById('modalETA').textContent = eta;

    // Show modal
    dispatchModal.classList.add('active');
}

/**
 * Add click event to each row in the table
 */
dispatchRows.forEach(row => {
    row.addEventListener('click', (e) => {
        // Remove selected class from all rows
        dispatchRows.forEach(r => r.classList.remove('selected'));
        // Add selected class to clicked row
        row.classList.add('selected');
        // Open modal with row data
        openDispatchModal(row);
    });
});

/**
 * Handle form submission
 */
dispatchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(dispatchForm);
    const data = Object.fromEntries(formData.entries());

    // Here you would typically send this data to your backend
    console.log('Form submitted:', data);

    // Show success toast
    const toast = document.querySelector('.toast');
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);

    // Close modal
    closeDispatchModal();

    // Update the table row with new data
    const updatedRow = document.querySelector('tr.selected');
    if (updatedRow) {
        // Update row data here
        updatedRow.querySelector('td:nth-child(1) .status-badge').textContent = data.priority === 'vip' ? 'VIP' : 'Non-VIP';
        updatedRow.querySelector('td:nth-child(9)').textContent = data.team;
        updatedRow.querySelector('td:nth-child(10) span').textContent = data.status;
    }
});

/**
 * Initialize date picker
 */
const startDateInput = document.querySelector('input[name="startDate"]');
if (startDateInput) {
    flatpickr(startDateInput, {
        dateFormat: "m/d/Y",
        allowInput: true
    });
}

// Filter functionality for Pending Projects
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
            priorities.add(row.querySelector('td:nth-child(1) .status-badge')?.textContent.trim() || '');
            teams.add(row.querySelector('td:nth-child(9)')?.textContent.trim() || '');
            statuses.add(row.querySelector('td:nth-child(10) span')?.textContent.trim() || '');
        });

        // Create and show filter modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Filter Pending Projects</h3>
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
        const rowPriority = row.querySelector('td:nth-child(1) .status-badge')?.textContent.trim();
        const rowTeam = row.querySelector('td:nth-child(9)')?.textContent.trim();
        const rowStatus = row.querySelector('td:nth-child(10) span')?.textContent.trim();

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

// Initialize filter on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initializeFilter); 