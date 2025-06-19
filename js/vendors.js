// Vendors JavaScript functionality

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

    // Initialize vendors functionality
    initializeVendors();
});

function initializeVendors() {
    // Initialize form handlers
    initializeCreateVendorForm();
    // Initialize modals
    initializeModals();
    // Initialize table functionality
    initializeVendorsTable();
}

// Create Vendor Form Functionality
function initializeCreateVendorForm() {
    const form = document.getElementById('vendorCreateForm');
    if (form) {
        form.addEventListener('submit', handleCreateVendor);
    }
}

function handleCreateVendor(event) {
    event.preventDefault();
    // Get form data
    const formData = new FormData(event.target);
    const vendorData = {
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
    if (!validateVendorData(vendorData)) {
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

function validateVendorData(data) {
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
        // Redirect to vendors list after a short delay
        setTimeout(() => {
            window.location.href = 'vendors.html';
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

// Vendors Table Functionality
function initializeVendorsTable() {
    // Initialize DataTable if on vendors list page
    const vendorsTable = document.querySelector('table');
    if (vendorsTable && window.location.pathname.includes('vendors.html')) {
        initializeDataTable();
    }
    // Initialize row click handlers
    initializeRowClickHandlers();
    // Initialize checkbox handlers
    initializeCheckboxHandlers();
}

function initializeDataTable() {
    // Placeholder for DataTable logic if needed
}

function initializeRowClickHandlers() {
    // Add click handlers to table rows for viewing details
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(event) {
            // Don't trigger if clicking on checkbox
            if (event.target.type === 'checkbox') {
                return;
            }
            // Get vendor data from row
            const cells = this.querySelectorAll('td');
            if (cells.length >= 7) {
                const vendorData = {
                    id: cells[1].textContent.trim(),
                    name: cells[2].textContent.trim(),
                    contactPerson: cells[3].textContent.trim(),
                    email: cells[4].textContent.trim(),
                    phone: cells[5].textContent.trim(),
                    status: cells[6].textContent.trim()
                };
                showVendorDetails(vendorData);
            }
        });
    });
}

function showVendorDetails(vendor) {
    const modal = document.getElementById('vendorModal');
    const content = document.getElementById('modalContent');
    if (modal && content) {
        content.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div><strong>ID:</strong> ${vendor.id}</div>
                <div><strong>Name:</strong> ${vendor.name}</div>
                <div class="col-span-2"><strong>Contact Person:</strong> ${vendor.contactPerson}</div>
                <div><strong>Email:</strong> ${vendor.email}</div>
                <div><strong>Phone:</strong> ${vendor.phone}</div>
                <div class="col-span-2"><strong>Status:</strong> 
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }">${vendor.status}</span>
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
    const cleaned = phone.replace(/\D/g, '');
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
window.showVendorDetails = showVendorDetails;
window.closeSuccessModal = closeSuccessModal;
window.closeErrorModal = closeErrorModal;

// Deleted Vendors Checkbox Functionality

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('deleted-vendors.html')) {
        initializeDeletedVendorsCheckboxes();
    }
});

function initializeDeletedVendorsCheckboxes() {
    function updateRestoreButtonVisibility() {
        const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
        const checkedBoxes = document.querySelectorAll('.vendor-checkbox:checked');
        if (restoreSelectedBtn) {
            restoreSelectedBtn.classList.toggle('hidden', checkedBoxes.length === 0);
        }
    }
    function updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAllDeleted');
        const checkboxes = document.querySelectorAll('.vendor-checkbox');
        const checkedBoxes = document.querySelectorAll('.vendor-checkbox:checked');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length;
            selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
        }
    }
    function getSelectedVendors() {
        const selectedVendors = [];
        document.querySelectorAll('.vendor-checkbox:checked').forEach(checkbox => {
            const row = checkbox.closest('tr');
            selectedVendors.push(getVendorDataFromRow(row));
        });
        return selectedVendors;
    }
    function getVendorDataFromRow(row) {
        const cells = row.querySelectorAll('td');
        return {
            id: cells[1].textContent.trim(),
            name: cells[2].textContent.trim(),
            address: cells[3] ? cells[3].textContent.trim() : '',
            phone: cells[4] ? cells[4].textContent.trim() : '',
            email: cells[5] ? cells[5].textContent.trim() : ''
        };
    }
    const selectAllCheckbox = document.getElementById('selectAllDeleted');
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.vendor-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateRestoreButtonVisibility();
        });
    }
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('vendor-checkbox')) {
            updateRestoreButtonVisibility();
            updateSelectAllCheckbox();
        }
    });
    if (restoreSelectedBtn) {
        restoreSelectedBtn.addEventListener('click', function() {
            const selectedVendors = getSelectedVendors();
            if (selectedVendors.length > 0) {
                // Placeholder for restore logic
                console.log('Restoring vendors:', selectedVendors);
                alert(`Restoring ${selectedVendors.length} vendor(s): ${selectedVendors.map(v => v.name).join(', ')}`);
            }
        });
    }
    document.addEventListener('click', function(e) {
        if (e.target.closest('.restore-btn')) {
            const row = e.target.closest('tr');
            const vendorData = getVendorDataFromRow(row);
            // Placeholder for restore logic
            console.log('Restoring vendor:', vendorData);
            alert(`Restoring vendor: ${vendorData.name}`);
        }
    });
} 