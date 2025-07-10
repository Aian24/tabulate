// Vendors JavaScript functionality

// Navigation function for vendor cards
function navigateToVendorDetails(vendorName, contactPerson, phone, email, status, id) {
    // Store vendor data in localStorage
    const vendorData = {
        vendorName: vendorName,
        contactPerson: contactPerson,
        phone: phone,
        email: email,
        status: status,
        id: id,
        // Add some additional realistic data
        address: `${vendorName} Headquarters`,
        city: 'Business City',
        state: 'BS',
        zip: '12345',
        dateCreated: new Date().toLocaleDateString(),
        lastContact: new Date().toLocaleDateString(),
        totalOrders: Math.floor(Math.random() * 100) + 10,
        totalSpent: '$' + (Math.random() * 10000 + 1000).toFixed(2),
        notes: `Notes for ${vendorName} vendor relationship.`,
        paymentTerms: 'Net 30',
        taxId: 'TAX-' + Math.floor(Math.random() * 1000000),
        website: `https://www.${vendorName.toLowerCase().replace(/\s+/g, '')}.com`
    };
    
    localStorage.setItem('selectedVendor', JSON.stringify(vendorData));
    
    // Navigate to vendor details page
    window.location.href = 'vendor-details.html';
}

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

    // FILTER MODAL LOGIC FOR VENDORS
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the desktop table
            const table = document.querySelector('table');
            if (!table) return;
            const rows = table.querySelectorAll('tbody tr');
            const ids = new Set();
            const names = new Set();
            const contactPersons = new Set();
            const emails = new Set();
            const phones = new Set();
            const statuses = new Set();
            rows.forEach(row => {
                ids.add(row.querySelector('td:nth-child(2)')?.textContent.trim() || '');
                names.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                contactPersons.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                emails.add(row.querySelector('td:nth-child(5)')?.textContent.trim() || '');
                phones.add(row.querySelector('td:nth-child(6)')?.textContent.trim() || '');
                statuses.add(row.querySelector('td:nth-child(7) span')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class=\"bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]\">
                    <div class=\"flex justify-between items-center mb-4\">
                        <h3 class=\"text-lg font-semibold text-gray-800\">Filter Vendors</h3>
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
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Contact Person</label>
                            <select id=\"filterContactPerson\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(contactPersons).filter(Boolean).map(cp => `<option value=\"${cp}\">${cp}</option>`).join('')}
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
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Phone</label>
                            <select id=\"filterPhone\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(phones).filter(Boolean).map(p => `<option value=\"${p}\">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Status</label>
                            <select id=\"filterStatus\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(statuses).filter(Boolean).map(s => `<option value=\"${s}\">${s}</option>`).join('')}
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
                const contactPerson = modal.querySelector('#filterContactPerson').value;
                const email = modal.querySelector('#filterEmail').value;
                const phone = modal.querySelector('#filterPhone').value;
                const status = modal.querySelector('#filterStatus').value;
                rows.forEach(row => {
                    const rowId = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                    const rowName = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowContactPerson = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
                    const rowEmail = row.querySelector('td:nth-child(5)')?.textContent.trim() || '';
                    const rowPhone = row.querySelector('td:nth-child(6)')?.textContent.trim() || '';
                    const rowStatus = row.querySelector('td:nth-child(7) span')?.textContent.trim() || '';
                    const match =
                        (!id || rowId === id) &&
                        (!name || rowName === name) &&
                        (!contactPerson || rowContactPerson === contactPerson) &&
                        (!email || rowEmail === email) &&
                        (!phone || rowPhone === phone) &&
                        (!status || rowStatus === status);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }
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
    // Only add click handlers for vendors.html, not deleted-vendors.html
    if (!window.location.pathname.includes('vendors.html') || window.location.pathname.includes('deleted-vendors.html')) return;
    // Add click handlers to table rows for viewing details
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(event) {
            // Don't trigger if clicking on checkbox
            if (event.target.type === 'checkbox') {
                return;
            }
            // Get vendor ID from the row
            const cells = this.querySelectorAll('td');
            if (cells.length >= 2) {
                const vendorId = cells[1].textContent.trim();
                window.location.href = `vendor-details.html?vendorId=${encodeURIComponent(vendorId)}`;
            }
        });
    });
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
}

// =====================
// Vendor Details Page Script
// =====================
// This script handles tab switching, vendor info, purchase orders, contacts, and expense settings for vendor-details.html
//
// Author: [Your Name/Team]
// Date: [Date]
// =====================

// Load header and navigation
function loadHTML(url, containerId) {
    fetch(url).then(r => r.text()).then(html => {
        document.getElementById(containerId).innerHTML = html;
    });
}
loadHTML('../nav/header.html', 'header-container');
loadHTML('../nav/navigation.html', 'nav-container');

// --- Vendor Data (Mock) ---
// Replace with real data source as needed
const vendorDataList = [
    {
        id: '4',
        name: 'Stanley',
        address: '250 Hartford Avenue',
        contact: 'William Stanley Jr.',
        city: 'Bellingham',
        email: 'senatorstanley@senate.virginia.gov',
        state: 'MA',
        phone: '1 (804) 698-7507',
        zip: '02019'
    },
    {
        id: '6',
        name: 'Ryobi',
        address: '',
        contact: 'Akira Urakami',
        city: '',
        email: 'reviews@ryobitools.com',
        state: '',
        phone: '1-(800)-268-4015',
        zip: ''
    },
    {
        id: '7',
        name: '1',
        address: '',
        contact: 'Joshua Rolluqui',
        city: '',
        email: 'oshwaldo@gmail.ocm',
        state: '',
        phone: '097 5356 5927',
        zip: ''
    },
    {
        id: '9',
        name: 'Oshwald',
        address: '',
        contact: 'Oshwald Briones',
        city: '',
        email: 'Oshwald22203@gmail.com',
        state: '',
        phone: '09123123',
        zip: ''
    },
    {
        id: '10',
        name: 'Global',
        address: '',
        contact: 'Eric Smith',
        city: '',
        email: 'eric.smith@gmail.com',
        state: '',
        phone: '12345678900000000000000000000000000000000000000',
        zip: ''
    },
    {
        id: '5',
        name: 'LIXIL',
        address: '',
        contact: 'Kinya Seto',
        city: '',
        email: 'customer.helpdesk@lixil.com',
        state: '',
        phone: '092352342',
        zip: ''
    },
    {
        id: '2',
        name: 'Citi Hardware',
        address: '',
        contact: 'Citi Dagupan',
        city: '',
        email: 'citi@harware.com',
        state: '',
        phone: '091237652',
        zip: ''
    },
    {
        id: '3',
        name: 'DIYI',
        address: '',
        contact: 'Aljune Mutilaptalib',
        city: '',
        email: 'aljune@diyi.com',
        state: '',
        phone: '09672334565',
        zip: ''
    },
    {
        id: '1',
        name: 'Ace Hardware',
        address: '',
        contact: 'Ace Tilap',
        city: '',
        email: 'ace@hardware.com',
        state: '',
        phone: '69696969',
        zip: ''
    }
];

function getVendorIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('vendorId');
}

function showVendorDetails() {
    const vendorId = getVendorIdFromUrl();
    const vendor = vendorDataList.find(v => v.id === vendorId);
    if (!vendor) return;
    document.getElementById('vendorNameHeader').textContent = vendor.name;
    document.getElementById('vendorName').textContent = vendor.name;
    document.getElementById('vendorAddress').textContent = vendor.address;
    document.getElementById('vendorContact').textContent = vendor.contact;
    document.getElementById('vendorCity').textContent = vendor.city;
    document.getElementById('vendorEmail').textContent = vendor.email;
    document.getElementById('vendorState').textContent = vendor.state;
    document.getElementById('vendorPhone').textContent = vendor.phone;
    document.getElementById('vendorZip').textContent = vendor.zip;
}

// --- Tab Switching with localStorage persistence ---
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.toggle('hidden', panel.getAttribute('data-tab') !== tab);
            });
            // Save active tab to localStorage
            localStorage.setItem('vendorDetailsActiveTab', tab);
        });
    });
    // On load, restore active tab from localStorage
    const savedTab = localStorage.getItem('vendorDetailsActiveTab');
    if (savedTab) {
        const btn = document.querySelector('.tab-btn[data-tab="' + savedTab + '"]');
        if (btn) btn.click();
    }
    // Back button logic
    document.getElementById('backBtn').addEventListener('click', () => {
        window.history.length > 1 ? window.history.back() : window.location.href = 'vendors.html';
    });
    showVendorDetails();

    // --- Purchase Orders Tab Logic ---
    // Mock purchase orders data
    const purchaseOrders = [
        { number: 'PO-001', date: '2024-06-01', status: 'Draft', amount: 1200 },
        // ... other POs ...
        { number: 'PO-010', date: '2024-06-28', status: 'Draft', amount: 600 },
    ];
    const statusColors = {
        'Draft': 'bg-yellow-100 text-yellow-800',
        'Ordered': 'bg-blue-100 text-blue-800',
        'Received': 'bg-blue-100 text-blue-800',
    };
    let poCurrentPage = 1;
    let poRowsPerPage = 5;
    let poCurrentFilter = 'all';
    let poCurrentSearch = '';
    // Render purchase orders table
    function renderPOs(filter, page, search) {
        const tbody = document.getElementById('poTableBody');
        let filtered = purchaseOrders;
        if (filter && filter !== 'all') {
            filtered = filtered.filter(po => po.status.toLowerCase() === filter);
        }
        if (search && search.trim() !== '') {
            const s = search.trim().toLowerCase();
            filtered = filtered.filter(po =>
                po.number.toLowerCase().includes(s) ||
                po.date.toLowerCase().includes(s) ||
                po.status.toLowerCase().includes(s) ||
                po.amount.toString().includes(s)
            );
        }
        const total = filtered.length;
        const totalPages = Math.ceil(total / poRowsPerPage) || 1;
        page = Math.max(1, Math.min(page || 1, totalPages));
        poCurrentPage = page;
        // Pagination slice
        const start = (page - 1) * poRowsPerPage;
        const end = start + poRowsPerPage;
        const pageRows = filtered.slice(start, end);
        tbody.innerHTML = '';
        if (pageRows.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-gray-400">No purchase orders found.</td></tr>`;
        } else {
            pageRows.forEach(po => {
                tbody.innerHTML += `
                    <tr class="hover:bg-gray-50 transition-colors cursor-pointer">
                        <td class="px-6 py-4 text-sm text-gray-900 font-medium">${po.number}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">${po.date}</td>
                        <td class="px-6 py-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[po.status] || 'bg-gray-100 text-gray-800'}">
                                ${po.status}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">$${po.amount.toLocaleString()}</td>
                    </tr>
                `;
            });
        }
        // Showing text
        const showingText = document.getElementById('poShowingText');
        if (showingText) {
            const from = total === 0 ? 0 : start + 1;
            const to = Math.min(end, total);
            showingText.innerHTML = `Showing <span class="font-medium">${from}</span> to <span class="font-medium">${to}</span> of <span class="font-medium">${total}</span> entries`;
        }
        // Pagination
        const pag = document.getElementById('poPagination');
        if (pag) {
            pag.innerHTML = '';
            pag.appendChild(createPageBtn('Previous', page > 1 ? page - 1 : null, page === 1));
            for (let i = 1; i <= totalPages; i++) {
                pag.appendChild(createPageBtn(i, i, i === page));
            }
            pag.appendChild(createPageBtn('Next', page < totalPages ? page + 1 : null, page === totalPages));
        }
    }
    // Create pagination button
    function createPageBtn(label, page, disabled) {
        const btn = document.createElement('button');
        btn.className = `px-3 py-2 md:px-4 md:py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${disabled ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`;
        btn.innerHTML =
            label === 'Previous' ? `<i class="fas fa-chevron-left mr-1"></i><span class="hidden sm:inline">Previous</span>` :
            label === 'Next' ? `<span class="hidden sm:inline">Next</span><i class="fas fa-chevron-right ml-1"></i>` :
            label;
        if (!disabled && page) {
            btn.addEventListener('click', () => {
                renderPOs(poCurrentFilter, page, poCurrentSearch);
            });
        }
        return btn;
    }
    // Filter buttons
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
            poCurrentFilter = this.getAttribute('data-filter');
            renderPOs(poCurrentFilter, 1, poCurrentSearch);
        });
    });
    // Search input
    document.getElementById('poSearch').addEventListener('input', function() {
        poCurrentSearch = this.value;
        renderPOs(poCurrentFilter, 1, poCurrentSearch);
    });
    renderPOs(poCurrentFilter, poCurrentPage, poCurrentSearch);

    // --- Vendor Contacts Tab Logic ---
    // Mock contacts data
    let contacts = [
        { id: 1, name: 'William Stanley Jr.', email: 'william.stanley@example.com', number: '1 (804) 698-7507' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', number: '1 (555) 123-4567' },
    ];
    let editingContactId = null;
    // Render contacts table
    function renderContacts() {
        const tbody = document.getElementById('contactsTableBody');
        tbody.innerHTML = '';
        if (!contacts.length) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-gray-400">No contacts found.</td></tr>`;
            return;
        }
        contacts.forEach(contact => {
            tbody.innerHTML += `
                <tr class="even:bg-blue-50">
                    <td class="px-6 py-4 text-gray-900 font-medium">${contact.name}</td>
                    <td class="px-6 py-4 text-blue-700 underline">${contact.email}</td>
                    <td class="px-6 py-4 text-gray-900">${contact.number}</td>
                    <td class="px-6 py-4">
                        <button class="editContactBtn text-blue-500 hover:text-blue-700 mr-2" data-id="${contact.id}"><i class="fas fa-edit"></i></button>
                        <button class="deleteContactBtn text-red-500 hover:text-red-700" data-id="${contact.id}"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    // Open/close modals
    function openContactModal(edit = false, contact = null) {
        // Hide header and nav for modal focus
        const header = document.getElementById('header-container');
        const nav = document.getElementById('nav-container');
        if (header) header.style.display = 'none';
        if (nav) nav.style.display = 'none';
        // Remove any existing modal
        const oldModal = document.getElementById('modernContactModal');
        if (oldModal) oldModal.remove();
        // Modal HTML
        const modal = document.createElement('div');
        modal.id = 'modernContactModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class=\"absolute inset-0 bg-gray-900/60 backdrop-blur-sm\"></div>
            <div class=\"relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-0 overflow-hidden animate-fadeIn\">
                <div class=\"sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-500/90 to-sky-400/90 text-white rounded-t-3xl shadow\">
                    <h3 class=\"text-xl font-bold flex items-center gap-2\"><i class='fas fa-address-book'></i> ${edit ? 'Edit' : 'Create'} Contact</h3>
                    <button id=\"closeModernContactModal\" class=\"text-2xl font-bold hover:text-blue-200 transition\">&times;</button>
                </div>
                <form id=\"modernContactForm\" class=\"px-8 py-6 space-y-6\">
                    <input type=\"hidden\" id=\"contactId\" value=\"${contact ? contact.id : ''}\" />
                    <div class=\"grid grid-cols-1 gap-6\">
                        <div>
                            <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Name</label>
                            <input type=\"text\" id=\"contactName\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${contact ? contact.name : ''}\" required />
                        </div>
                        <div>
                            <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Email</label>
                            <input type=\"email\" id=\"contactEmail\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${contact ? contact.email : ''}\" required />
                        </div>
                        <div>
                            <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Contact Number</label>
                            <input type=\"text\" id=\"contactNumber\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${contact ? contact.number : ''}\" required />
                        </div>
                    </div>
                    <div class=\"flex justify-end gap-3 mt-6\">
                        <button type=\"button\" id=\"cancelModernContactBtn\" class=\"px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition\">Cancel</button>
                        <button type=\"submit\" class=\"px-6 py-2 bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-xl shadow hover:from-blue-600 hover:to-sky-500 font-semibold transition flex items-center gap-2\"><i class='fas fa-save'></i> Save</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        modal.classList.add('animate-fadeIn');
        // Close modal handlers
        modal.querySelector('#closeModernContactModal').onclick = closeModernContactModal;
        modal.querySelector('#cancelModernContactBtn').onclick = closeModernContactModal;
        // Save handler
        modal.querySelector('#modernContactForm').onsubmit = function(e) {
            e.preventDefault();
            const id = document.getElementById('contactId').value;
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const number = document.getElementById('contactNumber').value;
            if (id) {
                // Edit
                contacts = contacts.map(c => c.id == id ? { id: c.id, name, email, number } : c);
            } else {
                // Create
                const newId = contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
                contacts.push({ id: newId, name, email, number });
            }
            renderContacts();
            closeModernContactModal();
            showToast(edit ? 'Contact updated!' : 'Contact created!');
        };
        function closeModernContactModal() {
            modal.remove();
            if (header) header.style.display = '';
            if (nav) nav.style.display = '';
        }
    }
    // Replace all calls to openContactModal with this new function
    document.getElementById('createContactBtn').addEventListener('click', () => openContactModal(false));
    document.getElementById('contactsTableBody').addEventListener('click', function(e) {
        if (e.target.closest('.editContactBtn')) {
            const id = e.target.closest('.editContactBtn').dataset.id;
            const contact = contacts.find(c => c.id == id);
            openContactModal(true, contact);
        } else if (e.target.closest('.deleteContactBtn')) {
            const id = e.target.closest('.deleteContactBtn').dataset.id;
            openDeleteContactModal(id);
        }
    });
    document.getElementById('closeDeleteContactModal').addEventListener('click', closeDeleteContactModal);
    document.getElementById('cancelDeleteContactBtn').addEventListener('click', closeDeleteContactModal);
    document.getElementById('confirmDeleteContactBtn').addEventListener('click', function() {
        if (editingContactId) {
            contacts = contacts.filter(c => c.id != editingContactId);
            renderContacts();
        }
        closeDeleteContactModal();
    });
    renderContacts();

    // --- Expense Settings Tab Logic ---
    // Expense settings state
    let expenseSettings = {
        department: '',
        category: '',
        paymentType: '',
        since: '',
        commPref: [],
        taxExempt: '',
        taxPercent: ''
    };
    // Render expense settings
    function renderExpenseSettings() {
        document.getElementById('expDepartment').textContent = expenseSettings.department;
        document.getElementById('expCategory').textContent = expenseSettings.category;
        document.getElementById('expPaymentType').textContent = expenseSettings.paymentType;
        document.getElementById('expSince').textContent = expenseSettings.since;
        document.getElementById('expCommPref').textContent = expenseSettings.commPref.join(', ');
        document.getElementById('expTaxExempt').textContent = expenseSettings.taxExempt;
        document.getElementById('expTaxPercent').textContent = expenseSettings.taxPercent;
    }
    // Edit expense settings
    document.getElementById('editExpenseBtn').addEventListener('click', function() {
        // Hide header and nav for modal focus
        const header = document.getElementById('header-container');
        const nav = document.getElementById('nav-container');
        if (header) header.style.display = 'none';
        if (nav) nav.style.display = 'none';
        // Remove any existing modal
        const oldModal = document.getElementById('modernExpenseModal');
        if (oldModal) oldModal.remove();
        // Modal HTML
        const modal = document.createElement('div');
        modal.id = 'modernExpenseModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class=\"absolute inset-0 bg-gray-900/60 backdrop-blur-sm\"></div>
            <div class=\"relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-0 overflow-hidden animate-fadeIn\">
                <div class=\"sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-500/90 to-sky-400/90 text-white rounded-t-3xl shadow\">
                    <h3 class=\"text-xl font-bold flex items-center gap-2\"><i class='fas fa-cogs'></i> Edit Expense Settings</h3>
                    <button id=\"closeModernExpenseModal\" class=\"text-2xl font-bold hover:text-blue-200 transition\">&times;</button>
                </div>
                <form id=\"modernExpenseForm\" class=\"px-8 py-6 space-y-6\">
                    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                        <div>
                            <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Department</label>
                            <input type=\"text\" id=\"formDepartment\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${expenseSettings.department}\" />
                        </div>
                        <div>
                            <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Category</label>
                            <input type=\"text\" id=\"formCategory\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${expenseSettings.category}\" />
                        </div>
                        <div>
                            <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Payment Type</label>
                            <input type=\"text\" id=\"formPaymentType\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${expenseSettings.paymentType}\" />
                        </div>
                        <div>
                            <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Since</label>
                            <input type=\"date\" id=\"formSince\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${expenseSettings.since}\" />
                        </div>
                    </div>
                    <div>
                        <label class=\"block text-md font-bold text-gray-700 mb-2 flex items-center gap-2\"><i class='fas fa-comments text-black'></i> Communication Preferences</label>
                        <div class=\"flex flex-col md:flex-row gap-4\">
                            <label class=\"inline-flex items-center gap-2\">
                                <input type=\"checkbox\" id=\"commPhone\" class=\"rounded border-gray-300\" ${expenseSettings.commPref.includes('Phone Call') ? 'checked' : ''} /> Phone Call
                            </label>
                            <label class=\"inline-flex items-center gap-2\">
                                <input type=\"checkbox\" id=\"commEmail\" class=\"rounded border-gray-300\" ${expenseSettings.commPref.includes('Email') ? 'checked' : ''} /> Email
                            </label>
                            <label class=\"inline-flex items-center gap-2\">
                                <input type=\"checkbox\" id=\"commText\" class=\"rounded border-gray-300\" ${expenseSettings.commPref.includes('Text Message') ? 'checked' : ''} /> Text Message
                            </label>
                        </div>
                    </div>
                    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                        <div>
                            <label class=\"block text-sm font-semibold text-gray-700 mb-1\">This Vendor is Tax Exempt?</label>
                            <select id=\"formTaxExempt\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\">
                                <option value=\"\">Select</option>
                                <option value=\"Yes\" ${expenseSettings.taxExempt === 'Yes' ? 'selected' : ''}>Yes</option>
                                <option value=\"No\" ${expenseSettings.taxExempt === 'No' ? 'selected' : ''}>No</option>
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Vendor Tax Percentage (%)</label>
                            <input type=\"number\" id=\"formTaxPercent\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" min=\"0\" max=\"100\" value=\"${expenseSettings.taxPercent}\" />
                        </div>
                    </div>
                    <div class=\"flex justify-end gap-3 mt-6\">
                        <button type=\"button\" id=\"cancelModernExpenseBtn\" class=\"px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition\">Cancel</button>
                        <button type=\"submit\" class=\"px-6 py-2 bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-xl shadow hover:from-blue-600 hover:to-sky-500 font-semibold transition flex items-center gap-2\"><i class='fas fa-save'></i> Save</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        modal.classList.add('animate-fadeIn');
        // Close modal handlers
        modal.querySelector('#closeModernExpenseModal').onclick = closeModernExpenseModal;
        modal.querySelector('#cancelModernExpenseBtn').onclick = closeModernExpenseModal;
        // Save handler
        modal.querySelector('#modernExpenseForm').onsubmit = function(e) {
            e.preventDefault();
            expenseSettings.department = document.getElementById('formDepartment').value;
            expenseSettings.category = document.getElementById('formCategory').value;
            expenseSettings.paymentType = document.getElementById('formPaymentType').value;
            expenseSettings.since = document.getElementById('formSince').value;
            expenseSettings.taxExempt = document.getElementById('formTaxExempt').value;
            expenseSettings.taxPercent = document.getElementById('formTaxPercent').value;
            let commPref = [];
            if (document.getElementById('commPhone').checked) commPref.push('Phone Call');
            if (document.getElementById('commEmail').checked) commPref.push('Email');
            if (document.getElementById('commText').checked) commPref.push('Text Message');
            expenseSettings.commPref = commPref;
            renderExpenseSettings();
            closeModernExpenseModal();
            showToast('Expense settings updated!');
        };
        function closeModernExpenseModal() {
            modal.remove();
            if (header) header.style.display = '';
            if (nav) nav.style.display = '';
        }
    });
    renderExpenseSettings();
});

// === Vendor Information Edit Modal ===
document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('editVendorInfoBtn');
    if (editBtn) {
        editBtn.addEventListener('click', openEditVendorInfoModal);
    }
});

function openEditVendorInfoModal() {
    const vendorId = getVendorIdFromUrl();
    const vendor = vendorDataList.find(v => v.id === vendorId);
    if (!vendor) return;
    // Hide header and nav for modal focus
    const header = document.getElementById('header-container');
    const nav = document.getElementById('nav-container');
    if (header) header.style.display = 'none';
    if (nav) nav.style.display = 'none';
    // Create modal HTML with modern UI and gray overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class=\"absolute inset-0 bg-gray-900/60 backdrop-blur-sm\"></div>
        <div class=\"relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden animate-fadeIn\">
            <div class=\"sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-500/90 to-sky-400/90 text-white rounded-t-3xl shadow\">
                <h3 class=\"text-xl font-bold flex items-center gap-2\"><i class='fas fa-pen-to-square'></i> Edit Vendor Information</h3>
                <button id=\"closeEditVendorModal\" class=\"text-2xl font-bold hover:text-blue-200 transition\">&times;</button>
            </div>
            <form id=\"editVendorForm\" class=\"px-8 py-6 space-y-6\">
                <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                    <div>
                        <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Vendor Name</label>
                        <input type=\"text\" id=\"editVendorName\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${vendor.name}\" required />
                    </div>
                    <div>
                        <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Address</label>
                        <input type=\"text\" id=\"editVendorAddress\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${vendor.address}\" />
                    </div>
                    <div>
                        <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Contact Person</label>
                        <input type=\"text\" id=\"editVendorContact\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${vendor.contact}\" />
                    </div>
                    <div>
                        <label class=\"block text-sm font-semibold text-gray-700 mb-1\">City</label>
                        <input type=\"text\" id=\"editVendorCity\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${vendor.city}\" />
                    </div>
                    <div>
                        <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Email</label>
                        <input type=\"email\" id=\"editVendorEmail\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${vendor.email}\" />
                    </div>
                    <div>
                        <label class=\"block text-sm font-semibold text-gray-700 mb-1\">State</label>
                        <input type=\"text\" id=\"editVendorState\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${vendor.state}\" />
                    </div>
                    <div>
                        <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Phone</label>
                        <input type=\"text\" id=\"editVendorPhone\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${vendor.phone}\" />
                    </div>
                    <div>
                        <label class=\"block text-sm font-semibold text-gray-700 mb-1\">Zip</label>
                        <input type=\"text\" id=\"editVendorZip\" class=\"w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition\" value=\"${vendor.zip}\" />
                    </div>
                </div>
                <div class=\"flex justify-end gap-3 mt-6\">
                    <button type=\"button\" id=\"cancelEditVendorBtn\" class=\"px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition\">Cancel</button>
                    <button type=\"submit\" class=\"px-6 py-2 bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-xl shadow hover:from-blue-600 hover:to-sky-500 font-semibold transition flex items-center gap-2\"><i class='fas fa-save'></i> Save</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.add('animate-fadeIn');
    // Close modal handlers
    modal.querySelector('#closeEditVendorModal').onclick = closeEditVendorModal;
    modal.querySelector('#cancelEditVendorBtn').onclick = closeEditVendorModal;
    // Save handler
    modal.querySelector('#editVendorForm').onsubmit = function(e) {
        e.preventDefault();
        vendor.name = document.getElementById('editVendorName').value;
        vendor.address = document.getElementById('editVendorAddress').value;
        vendor.contact = document.getElementById('editVendorContact').value;
        vendor.city = document.getElementById('editVendorCity').value;
        vendor.email = document.getElementById('editVendorEmail').value;
        vendor.state = document.getElementById('editVendorState').value;
        vendor.phone = document.getElementById('editVendorPhone').value;
        vendor.zip = document.getElementById('editVendorZip').value;
        showVendorDetails();
        closeEditVendorModal();
        showToast('Vendor information updated!');
    };
    function closeEditVendorModal() {
        modal.remove();
        if (header) header.style.display = '';
        if (nav) nav.style.display = '';
    }
}

// Modern toast for feedback
function showToast(message) {
    let toast = document.getElementById('modernToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'modernToast';
        toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-sky-400 text-white px-6 py-3 rounded-xl shadow-lg z-[9999] text-lg font-semibold opacity-0 pointer-events-none transition-all duration-500';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
    }, 1800);
}

// Modal animation helpers (copied from products.js)
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

let restoreVendorIndex = null;

function showRestoreVendorModal(idx) {
    restoreVendorIndex = idx;
    const modal = document.getElementById('restoreVendorModal');
    if (!modal) return;
    showModal(modal);
}

function hideRestoreVendorModal() {
    const modal = document.getElementById('restoreVendorModal');
    if (!modal) return;
    hideModal(modal);
    restoreVendorIndex = null;
}

function showRestoreSelectedVendorModal() {
    const modal = document.getElementById('restoreSelectedVendorModal');
    if (!modal) return;
    showModal(modal);
}

function hideRestoreSelectedVendorModal() {
    const modal = document.getElementById('restoreSelectedVendorModal');
    if (!modal) return;
    hideModal(modal);
}

document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    // Attach restore button handlers for deleted vendors (desktop & mobile)
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
                showRestoreVendorModal(idx);
            }
        }
    });
    // Restore Selected button handlers (desktop & mobile)
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
    if (restoreSelectedBtn) {
        restoreSelectedBtn.onclick = function(e) {
            e.preventDefault();
            showRestoreSelectedVendorModal();
        };
    }
    if (restoreSelectedBtnMobile) {
        restoreSelectedBtnMobile.onclick = function(e) {
            e.preventDefault();
            showRestoreSelectedVendorModal();
        };
    }
    // Modal button handlers
    const cancelRestoreBtn = document.getElementById('cancelRestoreVendor');
    if (cancelRestoreBtn) {
        cancelRestoreBtn.onclick = hideRestoreVendorModal;
    }
    const confirmRestoreBtn = document.getElementById('confirmRestoreVendor');
    if (confirmRestoreBtn) {
        confirmRestoreBtn.onclick = function() {
            if (restoreVendorIndex !== null) {
                // Remove vendor from table (mock: just hide row)
                // Desktop table
                const table = document.querySelector('table');
                if (table) {
                    const row = table.querySelectorAll('tbody tr')[restoreVendorIndex];
                    if (row) row.remove();
                }
                // Mobile card
                const mobileList = document.querySelector('.p-3.space-y-2');
                if (mobileList) {
                    const card = mobileList.children[restoreVendorIndex];
                    if (card) card.remove();
                }
            }
            hideRestoreVendorModal();
        };
    }
    const cancelRestoreSelectedBtn = document.getElementById('cancelRestoreSelectedVendor');
    if (cancelRestoreSelectedBtn) {
        cancelRestoreSelectedBtn.onclick = hideRestoreSelectedVendorModal;
    }
    const confirmRestoreSelectedBtn = document.getElementById('confirmRestoreSelectedVendor');
    if (confirmRestoreSelectedBtn) {
        confirmRestoreSelectedBtn.onclick = function() {
            // Remove all checked vendors (mock: just hide rows/cards)
            // Desktop table
            const checked = Array.from(document.querySelectorAll('.vendor-checkbox:checked'));
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
            hideRestoreSelectedVendorModal();
        };
    }
}); 