// Contractors JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Actions dropdown functionality
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');

    // Toggle actions menu
    if (actionsDropdown && actionsMenu) {
        actionsDropdown.addEventListener('click', () => {
            actionsMenu.classList.toggle('hidden');
            if (moreMenu) moreMenu.classList.add('hidden');
        });
    }

    // Toggle more menu
    if (moreDropdown && moreMenu) {
        moreDropdown.addEventListener('click', () => {
            moreMenu.classList.toggle('hidden');
            if (actionsMenu) actionsMenu.classList.add('hidden');
        });
    }

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (actionsDropdown && moreDropdown) {
            if (!actionsDropdown.contains(e.target) && !moreDropdown.contains(e.target)) {
                if (actionsMenu) actionsMenu.classList.add('hidden');
                if (moreMenu) moreMenu.classList.add('hidden');
            }
        }
    });

    // Initialize contractors functionality
    initializeContractors();

    // FILTER MODAL LOGIC FOR CONTRACTORS
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the desktop table
            const table = document.querySelector('table');
            if (!table) return;
            const rows = table.querySelectorAll('tbody tr');
            const ids = new Set();
            const names = new Set();
            const addresses = new Set();
            const phones = new Set();
            const emails = new Set();
            const accountStatuses = new Set();
            const deletedStatuses = new Set();
            rows.forEach(row => {
                ids.add(row.querySelector('td:nth-child(2)')?.textContent.trim() || '');
                names.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                addresses.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                phones.add(row.querySelector('td:nth-child(5)')?.textContent.trim() || '');
                emails.add(row.querySelector('td:nth-child(6)')?.textContent.trim() || '');
                accountStatuses.add(row.querySelector('td:nth-child(7) span')?.textContent.trim() || '');
                deletedStatuses.add(row.querySelector('td:nth-child(8)')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class=\"bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]\">
                    <div class=\"flex justify-between items-center mb-4\">
                        <h3 class=\"text-lg font-semibold text-gray-800\">Filter Contractors</h3>
                        <button class=\"text-gray-500 hover:text-gray-700\" id=\"closeFilterModal\"><i class=\"fas fa-times\"></i></button>
                    </div>
                    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">ID</label>
                            <select id=\"filterId\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(ids).filter(Boolean).map(id => `<option value=\"${id}\">${id}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Name</label>
                            <select id=\"filterName\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(names).filter(Boolean).map(n => `<option value=\"${n}\">${n}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Address</label>
                            <select id=\"filterAddress\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(addresses).filter(Boolean).map(a => `<option value=\"${a}\">${a}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Phone</label>
                            <select id=\"filterPhone\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(phones).filter(Boolean).map(p => `<option value=\"${p}\">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Email</label>
                            <select id=\"filterEmail\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(emails).filter(Boolean).map(e => `<option value=\"${e}\">${e}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Account Status</label>
                            <select id=\"filterAccountStatus\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(accountStatuses).filter(Boolean).map(s => `<option value=\"${s}\">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Deleted Status</label>
                            <select id=\"filterDeletedStatus\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(deletedStatuses).filter(Boolean).map(s => `<option value=\"${s}\">${s}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class=\"flex justify-end gap-2 mt-6\">
                        <button class=\"px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors\" id=\"resetFilter\">Reset</button>
                        <button class=\"px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors\" id=\"applyFilter\">Apply</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Focus the first dropdown for accessibility
            setTimeout(() => { modal.querySelector('#filterId').focus(); }, 100);

            // Close modal
            modal.querySelector('#closeFilterModal').addEventListener('click', () => modal.remove());
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

            // Reset filter
            modal.querySelector('#resetFilter').addEventListener('click', () => {
                modal.querySelectorAll('select').forEach(select => {
                    select.value = '';
                });
                // Show all rows
                rows.forEach(row => { row.style.display = ''; });
            });

            // Apply filter
            modal.querySelector('#applyFilter').addEventListener('click', () => {
                const id = modal.querySelector('#filterId').value;
                const name = modal.querySelector('#filterName').value;
                const address = modal.querySelector('#filterAddress').value;
                const phone = modal.querySelector('#filterPhone').value;
                const email = modal.querySelector('#filterEmail').value;
                const accountStatus = modal.querySelector('#filterAccountStatus').value;
                const deletedStatus = modal.querySelector('#filterDeletedStatus').value;
                rows.forEach(row => {
                    const rowId = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                    const rowName = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowAddress = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
                    const rowPhone = row.querySelector('td:nth-child(5)')?.textContent.trim() || '';
                    const rowEmail = row.querySelector('td:nth-child(6)')?.textContent.trim() || '';
                    const rowAccountStatus = row.querySelector('td:nth-child(7) span')?.textContent.trim() || '';
                    const rowDeletedStatus = row.querySelector('td:nth-child(8)')?.textContent.trim() || '';
                    const match =
                        (!id || rowId === id) &&
                        (!name || rowName === name) &&
                        (!address || rowAddress === address) &&
                        (!phone || rowPhone === phone) &&
                        (!email || rowEmail === email) &&
                        (!accountStatus || rowAccountStatus === accountStatus) &&
                        (!deletedStatus || rowDeletedStatus === deletedStatus);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }
});

function initializeContractors() {
    // Initialize form handlers
    initializeCreateContractorForm();
    
    // Initialize password toggle
    initializePasswordToggle();
    
    // Initialize modals
    initializeModals();
    
    // Initialize table functionality
    initializeContractorsTable();
}

// Create Contractor Form Functionality
function initializeCreateContractorForm() {
    const form = document.getElementById('createContractorForm');
    if (form) {
        form.addEventListener('submit', handleCreateContractor);
    }
}

function handleCreateContractor(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const contractorData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        password: formData.get('password')
    };
    
    // Validate form data
    if (!validateContractorData(contractorData)) {
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating...';
    submitButton.disabled = true;
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        // Simulate success
        showSuccessModal();
        
        // Reset form
        event.target.reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 1500);
}

function validateContractorData(data) {
    const errors = [];
    
    // Required field validation
    if (!data.firstName || data.firstName.trim() === '') {
        errors.push('First name is required');
    }
    
    if (!data.lastName || data.lastName.trim() === '') {
        errors.push('Last name is required');
    }
    
    if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || data.phone.trim() === '') {
        errors.push('Phone number is required');
    }
    
    if (!data.address || data.address.trim() === '') {
        errors.push('Address is required');
    }
    
    if (!data.city || data.city.trim() === '') {
        errors.push('City is required');
    }
    
    if (!data.state || data.state.trim() === '') {
        errors.push('State is required');
    }
    
    if (!data.zip || data.zip.trim() === '') {
        errors.push('Zip code is required');
    }
    
    if (!data.password || data.password.trim() === '') {
        errors.push('Password is required');
    } else if (data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    if (errors.length > 0) {
        showErrorModal(errors.join('<br>'));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password Toggle Functionality
function initializePasswordToggle() {
    const toggleButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (toggleButton && passwordInput) {
        toggleButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = toggleButton.querySelector('i');
            if (type === 'password') {
                icon.className = 'fas fa-eye';
            } else {
                icon.className = 'fas fa-eye-slash';
            }
        });
    }
}

// Modal Functionality
function initializeModals() {
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        const successModal = document.getElementById('successModal');
        const errorModal = document.getElementById('errorModal');
        
        if (event.target === successModal) {
            closeSuccessModal();
        }
        
        if (event.target === errorModal) {
            closeErrorModal();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeSuccessModal();
            closeErrorModal();
        }
    });
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('hidden');
        // Redirect to contractors list after a short delay
        setTimeout(() => {
            window.location.href = 'contractors.html';
        }, 500);
    }
}

function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const messageElement = document.getElementById('errorMessage');
    
    if (modal && messageElement) {
        messageElement.innerHTML = message;
        modal.classList.remove('hidden');
    }
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Contractors Table Functionality
function initializeContractorsTable() {
    // Initialize DataTable if on contractors list page
    const contractorsTable = document.querySelector('table');
    if (contractorsTable && window.location.pathname.includes('contractors.html')) {
        initializeDataTable();
    }
    
    // Initialize row click handlers
    initializeRowClickHandlers();
    
    // Initialize checkbox handlers
    initializeCheckboxHandlers();
}

function initializeDataTable() {
    // Only basic table, no DataTable controls
    // If you want to keep sorting, you can use a lightweight library or implement manually
    // $('table').DataTable({ ... }) is removed
}

function initializeRowClickHandlers() {
    // Only add click handlers for contractors.html, not deleted-contractors.html
    if (!window.location.pathname.includes('contractors.html') || window.location.pathname.includes('deleted-contractors.html')) return;
    // Add click handlers to table rows for viewing details
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(event) {
            // Don't trigger if clicking on checkbox
            if (event.target.type === 'checkbox') {
                return;
            }
            // Get contractor data from row
            const cells = this.querySelectorAll('td');
            if (cells.length >= 7) {
                const contractorId = cells[1].textContent.trim();
                // Redirect to details page with contractor ID as query param
                window.location.href = `contractor-details.html?id=${encodeURIComponent(contractorId)}`;
            }
        });
    });
}

function showContractorDetails(contractor) {
    const modal = document.getElementById('contractorModal');
    const content = document.getElementById('modalContent');
    
    if (modal && content) {
        content.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <strong>ID:</strong> ${contractor.id}
                </div>
                <div>
                    <strong>Name:</strong> ${contractor.name}
                </div>
                <div class="col-span-2">
                    <strong>Address:</strong> ${contractor.address}
                </div>
                <div>
                    <strong>Phone:</strong> ${contractor.phone}
                </div>
                <div>
                    <strong>Email:</strong> ${contractor.email}
                </div>
                <div class="col-span-2">
                    <strong>Status:</strong> 
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contractor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }">
                        ${contractor.status}
                    </span>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }
}

function initializeCheckboxHandlers() {
    // Select all checkbox functionality
    const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    // Individual checkbox handlers
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllCheckbox();
            updateBulkActions();
        });
    });
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const checkedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    
    if (selectAllCheckbox) {
        if (checkedCheckboxes.length === 0) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        } else if (checkedCheckboxes.length === rowCheckboxes.length) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.indeterminate = true;
        }
    }
}

function updateBulkActions() {
    const checkedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    const bulkActionButtons = document.querySelectorAll('[data-bulk-action]');
    
    bulkActionButtons.forEach(button => {
        if (checkedCheckboxes.length > 0) {
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            button.disabled = false;
        } else {
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.disabled = true;
        }
    });
}

// Utility Functions
function formatPhoneNumber(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Export functions for global access
window.showContractorDetails = showContractorDetails;
window.closeSuccessModal = closeSuccessModal;
window.closeErrorModal = closeErrorModal;

// Deleted Contractors Checkbox Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the deleted contractors page
    if (window.location.pathname.includes('deleted-contractors.html')) {
        initializeDeletedContractorsCheckboxes();
    }
});

function initializeDeletedContractorsCheckboxes() {
    // Helper functions for deleted contractors
    function updateRestoreButtonVisibility() {
        const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
        const checkedBoxes = document.querySelectorAll('.contractor-checkbox:checked');
        if (restoreSelectedBtn) {
            restoreSelectedBtn.classList.toggle('hidden', checkedBoxes.length === 0);
        }
    }

    function updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAllDeleted');
        const checkboxes = document.querySelectorAll('.contractor-checkbox');
        const checkedBoxes = document.querySelectorAll('.contractor-checkbox:checked');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length;
            selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
        }
    }

    function getSelectedContractors() {
        const selectedContractors = [];
        document.querySelectorAll('.contractor-checkbox:checked').forEach(checkbox => {
            const row = checkbox.closest('tr');
            selectedContractors.push(getContractorDataFromRow(row));
        });
        return selectedContractors;
    }

    function getContractorDataFromRow(row) {
        const cells = row.querySelectorAll('td');
        return {
            id: cells[1].textContent.trim(),
            fullName: cells[2].textContent.trim(),
            phone: cells[3].textContent.trim(),
            email: cells[4].textContent.trim(),
            accountStatus: cells[5].querySelector('span') ? cells[5].querySelector('span').textContent.trim() : cells[5].textContent.trim(),
            dateDeleted: cells[6].textContent.trim()
        };
    }

    // Select all and restore logic for deleted contractors
    const selectAllCheckbox = document.getElementById('selectAllDeleted');
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.contractor-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateRestoreButtonVisibility();
        });
    }
    
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('contractor-checkbox')) {
            updateRestoreButtonVisibility();
            updateSelectAllCheckbox();
        }
    });
    
    if (restoreSelectedBtn) {
        restoreSelectedBtn.addEventListener('click', function() {
            const selectedContractors = getSelectedContractors();
            if (selectedContractors.length > 0) {
                // Placeholder for restore logic
                console.log('Restoring contractors:', selectedContractors);
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.restore-btn')) {
            const row = e.target.closest('tr');
            const contractorData = getContractorDataFromRow(row);
            // Placeholder for restore logic
            // console.log('Restoring contractor:', contractorData);
        }
    });
}

// =====================
// Contractor Details Page Logic
// =====================
// The following code is used exclusively for the contractor-details.html page.
// It handles rendering contractor details, modal editing, and navigation.
//
// Author: [Your Name or Team]
// Date: [Date of Move]
//
// ---------------------
// Static contractor data for demo purposes. In production, replace with API calls.
const contractorDetailsData = {
    '34': {
        initials: 'JR',
        name: 'Joshua Rolluqui',
        id: '34',
        memberSince: 'March 13, 2025',
        email: 'joshrolluqui5@gmail.com',
        phone: '09753565927',
        address1: 'Taga Etivac',
        address2: 'Carcona, Mississippi 38833',
        position: 'Contractor',
        department: 'Not Assigned',
        contractorSince: 'June 21, 2025',
        employmentStatus: 'Inactive',
    },
    '18': {
        initials: 'KM',
        name: 'Kerry Madi',
        id: '18',
        memberSince: 'February 10, 2024',
        email: 'contractorfour@gmail.com',
        phone: '09653481235',
        address1: '420 Buckland Hills Dr',
        address2: '',
        position: 'Contractor',
        department: 'Not Assigned',
        contractorSince: 'April 2, 2024',
        employmentStatus: 'Active',
    },
    '17': {
        initials: 'AM',
        name: 'Aspyn Merla',
        id: '17',
        memberSince: 'January 5, 2024',
        email: 'contractorthree@gmail.com',
        phone: '09345678245',
        address1: '11 Jungle Road',
        address2: '',
        position: 'Contractor',
        department: 'Not Assigned',
        contractorSince: 'March 15, 2024',
        employmentStatus: 'Active',
    },
    '15': {
        initials: 'AT',
        name: 'Anona Tammy',
        id: '15',
        memberSince: 'December 1, 2023',
        email: 'contractorone@gmail.com',
        phone: '09123123123',
        address1: '10040 County Road 48',
        address2: '',
        position: 'Contractor',
        department: 'Not Assigned',
        contractorSince: 'December 10, 2023',
        employmentStatus: 'Active',
    },
    '16': {
        initials: 'LJ',
        name: 'Lake Jacqueline',
        id: '16',
        memberSince: 'November 20, 2023',
        email: 'contractortwo@gmail.com',
        phone: '08945671231',
        address1: '315 Foxon Blvd',
        address2: '',
        position: 'Contractor',
        department: 'Not Assigned',
        contractorSince: 'November 25, 2023',
        employmentStatus: 'Active',
    },
};

/**
 * Utility to get a query parameter from the URL
 * @param {string} param - The parameter name
 * @returns {string|null}
 */
function getContractorQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Render the contractor details card
 * @param {object} contractor - Contractor data object
 * @returns {string} - HTML string
 */
function renderContractorDetails(contractor) {
    return `
        <div class="bg-white rounded-xl shadow-lg p-6 md:p-10 w-full">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">${contractor.initials}</div>
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">${contractor.name}</h1>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Contractor ID: ${contractor.id}</span>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">Member since ${contractor.memberSince}</div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button id="editProfileBtn" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2">
                        <i class="fas fa-pen"></i> Edit Profile
                    </button>
                    <button id="cancelBtn" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center gap-2">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-100 rounded-lg p-4">
                    <h2 class="text-md font-semibold text-gray-700 mb-3">CONTACT</h2>
                    <div class="flex items-center gap-2 mb-2 text-sm">
                        <i class="fas fa-envelope text-blue-500"></i>
                        <span class="font-semibold">Email:</span> ${contractor.email}
                    </div>
                    <div class="flex items-center gap-2 mb-2 text-sm">
                        <i class="fas fa-phone text-green-500"></i>
                        <span class="font-semibold">Phone:</span> ${contractor.phone}
                    </div>
                    <div class="flex items-start gap-2 text-sm">
                        <i class="fas fa-location-arrow text-purple-500 mt-1"></i>
                        <div>
                            <span class="font-semibold">Address:</span><br/>
                            ${contractor.address1}<br/>
                            ${contractor.address2 ? contractor.address2 + '<br/>' : ''}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-6">
                    <div class="bg-gray-100 rounded-lg p-4">
                        <h2 class="text-md font-semibold text-gray-700 mb-3">CONTRACTOR ABOUT</h2>
                        <div class="flex justify-between text-sm">
                            <div>
                                <span class="font-semibold">Position</span><br/>
                                ${contractor.position}
                            </div>
                            <div>
                                <span class="font-semibold">Department</span><br/>
                                <span class="text-gray-500">${contractor.department}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-100 rounded-lg p-4">
                        <h2 class="text-md font-semibold text-gray-700 mb-3">PERSONAL INFORMATION</h2>
                        <div class="flex justify-between text-sm">
                            <div>
                                <span class="font-semibold">Contractor Since</span><br/>
                                ${contractor.contractorSince}
                            </div>
                            <div>
                                <span class="font-semibold">Employment Status</span><br/>
                                <span class="${contractor.employmentStatus === 'Active' ? 'text-green-500' : 'text-blue-400'}">${contractor.employmentStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render a not found message if contractor does not exist
 * @returns {string}
 */
function renderContractorNotFound() {
    return `<div class="bg-white rounded-xl shadow-lg p-10 w-full text-center text-gray-600">
        <h2 class="text-2xl font-bold mb-4">Contractor Not Found</h2>
        <p>The contractor you are looking for does not exist.</p>
    </div>`;
}

/**
 * Main logic for contractor-details page
 * This should only run if the #contractor-details-container exists (i.e., on contractor-details.html)
 */
(function initContractorDetailsPage() {
    const container = document.getElementById('contractor-details-container');
    if (!container) return; // Only run on contractor-details.html

    // Get contractor ID from URL
    const id = getContractorQueryParam('id');
    const contractor = contractorDetailsData[id];
    if (contractor) {
        container.innerHTML = renderContractorDetails(contractor);
    } else {
        container.innerHTML = renderContractorNotFound();
    }

    // Add button event listeners after rendering
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() { // Wait for render
            const editBtn = document.getElementById('editProfileBtn');
            const cancelBtn = document.getElementById('cancelBtn');
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    // Show modal and prefill fields
                    const modal = document.getElementById('editProfileModal');
                    if (modal) {
                        // Prefill fields from contractor data
                        document.getElementById('editFirstName').value = contractor.name.split(' ')[0] || '';
                        document.getElementById('editLastName').value = contractor.name.split(' ')[1] || '';
                        document.getElementById('editEmail').value = contractor.email;
                        document.getElementById('editPhone').value = contractor.phone;
                        document.getElementById('editAddress').value = contractor.address1;
                        document.getElementById('editCity').value = contractor.address2.split(',')[0] || '';
                        document.getElementById('editState').value = contractor.address2.split(',')[1]?.trim().split(' ')[0] || '';
                        document.getElementById('editZip').value = contractor.address2.split(' ')[1] || '';
                        modal.classList.remove('hidden');
                    }
                });
            }
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    window.location.href = 'contractors.html';
                });
            }
            // Modal close/cancel
            const closeEditModal = document.getElementById('closeEditModal');
            const cancelEditBtn = document.getElementById('cancelEditBtn');
            [closeEditModal, cancelEditBtn].forEach(btn => {
                if (btn) btn.addEventListener('click', function() {
                    document.getElementById('editProfileModal').classList.add('hidden');
                });
            });
            // Form submit (placeholder)
            const editProfileForm = document.getElementById('editProfileForm');
            if (editProfileForm) {
                editProfileForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    // You can add save logic here
                    alert('Changes saved (not really, this is a placeholder).');
                    document.getElementById('editProfileModal').classList.add('hidden');
                });
            }
        }, 0);
    });
})();

// Modal animation helpers (copied from vendors.js)
function showModal(modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.querySelector('.modal-content-modern').classList.add('show');
    }, 10);
}
function hideModal(modal) {
    modal.querySelector('.modal-content-modern').classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 250);
}
let restoreContractorIndex = null;
function showRestoreContractorModal(idx) {
    restoreContractorIndex = idx;
    const modal = document.getElementById('restoreContractorModal');
    if (!modal) return;
    showModal(modal);
}
function hideRestoreContractorModal() {
    const modal = document.getElementById('restoreContractorModal');
    if (!modal) return;
    hideModal(modal);
    restoreContractorIndex = null;
}
function showRestoreSelectedContractorModal() {
    const modal = document.getElementById('restoreSelectedContractorModal');
    if (!modal) return;
    showModal(modal);
}
function hideRestoreSelectedContractorModal() {
    const modal = document.getElementById('restoreSelectedContractorModal');
    if (!modal) return;
    hideModal(modal);
}
document.addEventListener('DOMContentLoaded', function() {
    // Attach restore button handlers for deleted contractors (desktop & mobile)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.restore-btn')) {
            // Find index from table row or card
            let idx = null;
            // Desktop table
            const tr = e.target.closest('tr');
            if (tr) {
                // Find index by row order in tbody
                const tbody = tr.parentElement;
                idx = Array.from(tbody.children).indexOf(tr);
            }
            // Mobile card
            const card = e.target.closest('.mobile-table-row');
            if (card) {
                // Find index by card order in container
                const container = card.parentElement;
                idx = Array.from(container.children).indexOf(card);
            }
            if (idx !== null && idx !== -1) {
                showRestoreContractorModal(idx);
            }
        }
    });
    // Restore Selected button handlers (desktop & mobile)
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
    if (restoreSelectedBtn) {
        restoreSelectedBtn.onclick = function(e) {
            e.preventDefault();
            showRestoreSelectedContractorModal();
        };
    }
    if (restoreSelectedBtnMobile) {
        restoreSelectedBtnMobile.onclick = function(e) {
            e.preventDefault();
            showRestoreSelectedContractorModal();
        };
    }
    // Modal button handlers
    const cancelRestoreBtn = document.getElementById('cancelRestoreContractor');
    if (cancelRestoreBtn) {
        cancelRestoreBtn.onclick = hideRestoreContractorModal;
    }
    const confirmRestoreBtn = document.getElementById('confirmRestoreContractor');
    if (confirmRestoreBtn) {
        confirmRestoreBtn.onclick = function() {
            if (restoreContractorIndex !== null) {
                // Remove contractor from table (mock: just hide row)
                // Desktop table
                const table = document.querySelector('table');
                if (table) {
                    const row = table.querySelectorAll('tbody tr')[restoreContractorIndex];
                    if (row) row.remove();
                }
                // Mobile card
                const mobileList = document.querySelector('.p-3.space-y-2');
                if (mobileList) {
                    const card = mobileList.children[restoreContractorIndex];
                    if (card) card.remove();
                }
            }
            hideRestoreContractorModal();
        };
    }
    const cancelRestoreSelectedBtn = document.getElementById('cancelRestoreSelectedContractor');
    if (cancelRestoreSelectedBtn) {
        cancelRestoreSelectedBtn.onclick = hideRestoreSelectedContractorModal;
    }
    const confirmRestoreSelectedBtn = document.getElementById('confirmRestoreSelectedContractor');
    if (confirmRestoreSelectedBtn) {
        confirmRestoreSelectedBtn.onclick = function() {
            // Remove all checked contractors (mock: just hide rows/cards)
            // Desktop table
            const checked = Array.from(document.querySelectorAll('.contractor-checkbox:checked'));
            const table = document.querySelector('table');
            if (table) {
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.children);
                checked.forEach(cb => {
                    const tr = cb.closest('tr');
                    if (tr) tr.remove();
                });
            }
            // Mobile cards
            const mobileList = document.querySelector('.p-3.space-y-2');
            if (mobileList) {
                checked.forEach(cb => {
                    const card = cb.closest('.mobile-table-row');
                    if (card) card.remove();
                });
            }
            hideRestoreSelectedContractorModal();
        };
    }
}); 