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