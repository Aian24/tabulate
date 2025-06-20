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
                alert(`Restoring ${selectedContractors.length} contractor(s): ${selectedContractors.map(c => c.fullName).join(', ')}`);
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.restore-btn')) {
            const row = e.target.closest('tr');
            const contractorData = getContractorDataFromRow(row);
            // Placeholder for restore logic
            console.log('Restoring contractor:', contractorData);
            alert(`Restoring contractor: ${contractorData.fullName}`);
        }
    });
} 