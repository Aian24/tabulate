document.addEventListener('DOMContentLoaded', function() {
    // Load header and navigation only in the main container
    if (typeof loadHTML === 'function') {
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
            loadHTML('../nav/header.html', 'header-container');
            loadHTML('../nav/navigation.html', 'nav-container');
        }
    }

    // FILTER MODAL LOGIC FOR CUSTOMERS
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the desktop table
            const table = document.querySelector('table');
            if (!table) return;
            const rows = table.querySelectorAll('tbody tr');
            const names = new Set();
            const phones = new Set();
            const emails = new Set();
            const verificationStatuses = new Set();
            const accountStatuses = new Set();
            const dates = new Set();
            rows.forEach(row => {
                names.add(row.querySelector('td:nth-child(2)')?.textContent.trim() || '');
                phones.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                emails.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                verificationStatuses.add(row.querySelector('td:nth-child(5) span')?.textContent.trim() || '');
                accountStatuses.add(row.querySelector('td:nth-child(6) span')?.textContent.trim() || '');
                dates.add(row.querySelector('td:nth-child(7)')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Filter Customers</h3>
                        <button class="text-gray-500 hover:text-gray-700" id="closeFilterModal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <select id="filterName" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(names).filter(Boolean).map(n => `<option value="${n}">${n}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <select id="filterPhone" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(phones).filter(Boolean).map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <select id="filterEmail" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(emails).filter(Boolean).map(e => `<option value="${e}">${e}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                            <select id="filterVerification" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(verificationStatuses).filter(Boolean).map(v => `<option value="${v}">${v}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                            <select id="filterAccount" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(accountStatuses).filter(Boolean).map(a => `<option value="${a}">${a}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date Registered</label>
                            <select id="filterDate" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(dates).filter(Boolean).map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" id="resetFilter">Reset</button>
                        <button class="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors" id="applyFilter">Apply</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Focus the first dropdown for accessibility
            setTimeout(() => { modal.querySelector('#filterName').focus(); }, 100);

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
                const name = modal.querySelector('#filterName').value;
                const phone = modal.querySelector('#filterPhone').value;
                const email = modal.querySelector('#filterEmail').value;
                const verification = modal.querySelector('#filterVerification').value;
                const account = modal.querySelector('#filterAccount').value;
                const date = modal.querySelector('#filterDate').value;
                rows.forEach(row => {
                    const rowName = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                    const rowPhone = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowEmail = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
                    const rowVerification = row.querySelector('td:nth-child(5) span')?.textContent.trim() || '';
                    const rowAccount = row.querySelector('td:nth-child(6) span')?.textContent.trim() || '';
                    const rowDate = row.querySelector('td:nth-child(7)')?.textContent.trim() || '';
                    const match =
                        (!name || rowName === name) &&
                        (!phone || rowPhone === phone) &&
                        (!email || rowEmail === email) &&
                        (!verification || rowVerification === verification) &&
                        (!account || rowAccount === account) &&
                        (!date || rowDate === date);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }

    // --- ROW CLICK TO CUSTOMER DETAILS ---
    const customerTableRows = document.querySelectorAll('table tbody tr');
    customerTableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') return;
            // Gather all data from the row
            const fullName = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
            const phone = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
            const email = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
            const verification = row.querySelector('td:nth-child(5) span')?.textContent.trim() || '';
            const accountStatus = row.querySelector('td:nth-child(6) span')?.textContent.trim() || '';
            const dateRegistered = row.querySelector('td:nth-child(7)')?.textContent.trim() || '';
            // Example: You can expand this to include more data as needed
            // For demo, add some fake jobs, invoices, transactions, preferences, billing, notes, custom fields
            const customerData = {
                fullName,
                personalFirstName: fullName.split(' ')[0] || '',
                personalLastName: fullName.split(' ').slice(1).join(' ') || '',
                personalPhone: phone,
                personalEmail: email,
                personalAddress: 'Pinyahan, Diliman, Quezon, Metro Manila, Philippines 1008',
                personalBuildingAddress: 'Amall Building',
                verification,
                accountStatus,
                dateRegistered,
                jobsTotal: '$0',
                jobs: [
                    {
                        project: '1016',
                        dateStarted: 'March 20, 2025',
                        endTarget: 'March 22, 2025',
                        status: 'Dispatched',
                        team: 'Team C'
                    },
                    {
                        project: '1017',
                        dateStarted: 'March 25, 2025',
                        endTarget: 'March 28, 2025',
                        status: 'Dispatched',
                        team: 'Team A'
                    }
                ],
                invoicesTotal: '$0',
                invoices: [
                    {
                        number: '1031-01',
                        total: '$',
                        dateCreated: 'May 8, 2025',
                        status: 'Pending'
                    },
                    {
                        number: '1032-01',
                        total: '$',
                        dateCreated: 'May 8, 2025',
                        status: 'Pending'
                    }
                ],
                transactionsTotal: '$0',
                transactions: [
                    {
                        dateCreated: 'May 8, 2025',
                        type: 'Estimate',
                        details: 'Estimate created.'
                    },
                    {
                        dateCreated: 'May 8, 2025',
                        type: 'Invoice Due Soon',
                        details: 'Invoice 1031-01 is due soon. Total: $0.00'
                    }
                ],
                prefClientSince: 'March 12, 2025',
                prefLeadAcquiredDate: 'March 12, 2025',
                prefMainLanguage: 'en',
                prefPreferredCommunication: 'call',
                prefPaymentTerms: '2025-03-12',
                prefPaymentMethod: 'cash',
                prefTaxable: 'Yes',
                prefTags: 'tagtag',
                prefSalesPerson: 'N/A',
                prefContractor: 'N/A',
                prefInvoiceFrequency: 'monthly',
                billingFirstName: fullName.split(' ')[0] || '',
                billingLastName: fullName.split(' ').slice(1).join(' ') || '',
                billingPhone: phone,
                billingEmail: email,
                billingAddress: 'Pasig Boulevard Extension Maybunga, Pasig City, PC 82434',
                billingCompanyName: 'Amall Building',
                customerNotes: '',
                customFields: [
                    { name: 'Example Field', value: 'Example Value' }
                ]
            };
            localStorage.setItem('selectedCustomer', JSON.stringify(customerData));
            window.location.href = `customer-details.html`;
        });
    });

    // --- CUSTOMER DETAILS PAGE LOGIC ---
    if (document.getElementById('customerNameHeader')) {
        let customerData = null;
        try {
            customerData = JSON.parse(localStorage.getItem('selectedCustomer'));
        } catch (e) {}
        if (!customerData) {
            document.getElementById('customerNameHeader').textContent = 'Not Found';
            return;
        }
        // Top header
        document.getElementById('customerNameHeader').textContent = customerData.fullName || '';
        // Jobs
        document.getElementById('jobsTotal').textContent = customerData.jobsTotal || '';
        const jobsList = document.getElementById('jobsList');
        jobsList.innerHTML = '';
        (customerData.jobs || []).forEach(job => {
            jobsList.innerHTML += `<div class="bg-gray-50 rounded p-3 border mb-1">
                <div><span class="font-bold">Project #:</span> ${job.project}</div>
                <div><span class="font-bold">Date Started:</span> ${job.dateStarted}</div>
                <div><span class="font-bold">End Target:</span> ${job.endTarget}</div>
                <div><span class="font-bold">Status:</span> <span class="text-blue-500 font-semibold">${job.status}</span></div>
                <div><span class="font-bold">Team Assigned:</span><span class="text-blue-700 font-semibold">${job.team}</span></div>
            </div>`;
        });
        // Invoices
        document.getElementById('invoicesTotal').textContent = customerData.invoicesTotal || '';
        const invoicesList = document.getElementById('invoicesList');
        invoicesList.innerHTML = '';
        (customerData.invoices || []).forEach(inv => {
            invoicesList.innerHTML += `<div class="bg-gray-50 rounded p-3 border mb-1">
                <div><span class="font-bold">Invoice #:</span> ${inv.number}</div>
                <div><span class="font-bold">Total Cost:</span> ${inv.total}</div>
                <div><span class="font-bold">Date Created:</span> ${inv.dateCreated}</div>
                <div><span class="font-bold">Status:</span> <span class="text-orange-500 font-semibold">${inv.status}</span></div>
            </div>`;
        });
        // Transactions
        document.getElementById('transactionsTotal').textContent = customerData.transactionsTotal || '';
        const transactionsList = document.getElementById('transactionsList');
        transactionsList.innerHTML = '';
        (customerData.transactions || []).forEach(tran => {
            const color = tran.type === 'Invoice Due Soon' ? 'text-red-500' : 'text-orange-500';
            transactionsList.innerHTML += `<div class="bg-gray-50 rounded p-3 border mb-1">
                <div><span class="font-bold">Date Created:</span> ${tran.dateCreated}</div>
                <div><span class="font-bold">Type:</span> <span class="${color} font-semibold">${tran.type}</span></div>
                <div><span class="font-bold">Details:</span> ${tran.details}</div>
            </div>`;
        });
        // Personal Info
        document.getElementById('personalFirstName').textContent = customerData.personalFirstName || '';
        document.getElementById('personalLastName').textContent = customerData.personalLastName || '';
        document.getElementById('personalPhone').textContent = customerData.personalPhone || '';
        document.getElementById('personalEmail').textContent = customerData.personalEmail || '';
        document.getElementById('personalAddress').textContent = customerData.personalAddress || '';
        document.getElementById('personalBuildingAddress').textContent = customerData.personalBuildingAddress || '';
        // Preferences
        document.getElementById('prefClientSince').textContent = customerData.prefClientSince || '';
        document.getElementById('prefLeadAcquiredDate').textContent = customerData.prefLeadAcquiredDate || '';
        document.getElementById('prefMainLanguage').textContent = customerData.prefMainLanguage || '';
        document.getElementById('prefPreferredCommunication').textContent = customerData.prefPreferredCommunication || '';
        document.getElementById('prefPaymentTerms').textContent = customerData.prefPaymentTerms || '';
        document.getElementById('prefPaymentMethod').textContent = customerData.prefPaymentMethod || '';
        document.getElementById('prefTaxable').textContent = customerData.prefTaxable || '';
        document.getElementById('prefTags').textContent = customerData.prefTags || '';
        document.getElementById('prefSalesPerson').textContent = customerData.prefSalesPerson || '';
        document.getElementById('prefContractor').textContent = customerData.prefContractor || '';
        document.getElementById('prefInvoiceFrequency').textContent = customerData.prefInvoiceFrequency || '';
        // Billing
        document.getElementById('billingFirstName').textContent = customerData.billingFirstName || '';
        document.getElementById('billingLastName').textContent = customerData.billingLastName || '';
        document.getElementById('billingPhone').textContent = customerData.billingPhone || '';
        document.getElementById('billingEmail').textContent = customerData.billingEmail || '';
        document.getElementById('billingAddress').textContent = customerData.billingAddress || '';
        document.getElementById('billingCompanyName').textContent = customerData.billingCompanyName || '';
        // Notes
        document.getElementById('customerNotes').value = customerData.customerNotes || '';
        // Custom Fields
        const customFieldsTbody = document.getElementById('customFields');
        customFieldsTbody.innerHTML = '';
        (customerData.customFields || []).forEach(f => {
            customFieldsTbody.innerHTML += `<tr><td class="px-2 py-1">${f.name}</td><td class="px-2 py-1">${f.value}</td></tr>`;
        });
    }

    // Edit Modal Logic for Customer Details
    const editBtn = document.getElementById('editBtn');
    const editModal = document.getElementById('editCustomerModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const addCustomFieldBtn = document.getElementById('addCustomFieldBtn');
    const editCustomFieldsTbody = document.getElementById('editCustomFields');

    if (editBtn && editModal && closeEditModal && cancelEditBtn && saveEditBtn && addCustomFieldBtn && editCustomFieldsTbody) {
        // Helper to get/set fields
        function setEditFields(data) {
            document.getElementById('editPersonalFirstName').value = data.personalFirstName || '';
            document.getElementById('editPersonalLastName').value = data.personalLastName || '';
            document.getElementById('editPersonalPhone').value = data.personalPhone || '';
            document.getElementById('editPersonalEmail').value = data.personalEmail || '';
            document.getElementById('editPersonalAddress').value = data.personalAddress || '';
            document.getElementById('editPersonalBuildingAddress').value = data.personalBuildingAddress || '';
            document.getElementById('editPrefClientSince').value = data.prefClientSince || '';
            document.getElementById('editPrefLeadAcquiredDate').value = data.prefLeadAcquiredDate || '';
            document.getElementById('editPrefMainLanguage').value = data.prefMainLanguage || '';
            document.getElementById('editPrefPreferredCommunication').value = data.prefPreferredCommunication || '';
            document.getElementById('editPrefPaymentTerms').value = data.prefPaymentTerms || '';
            document.getElementById('editPrefPaymentMethod').value = data.prefPaymentMethod || '';
            document.getElementById('editPrefTaxable').value = data.prefTaxable || '';
            document.getElementById('editPrefTags').value = data.prefTags || '';
            document.getElementById('editPrefSalesPerson').value = data.prefSalesPerson || '';
            document.getElementById('editPrefContractor').value = data.prefContractor || '';
            document.getElementById('editPrefInvoiceFrequency').value = data.prefInvoiceFrequency || '';
            document.getElementById('editBillingFirstName').value = data.billingFirstName || '';
            document.getElementById('editBillingLastName').value = data.billingLastName || '';
            document.getElementById('editBillingPhone').value = data.billingPhone || '';
            document.getElementById('editBillingEmail').value = data.billingEmail || '';
            document.getElementById('editBillingAddress').value = data.billingAddress || '';
            document.getElementById('editBillingCompanyName').value = data.billingCompanyName || '';
            document.getElementById('editCustomerNotes').value = data.customerNotes || '';
            // Custom Fields
            editCustomFieldsTbody.innerHTML = '';
            (data.customFields || []).forEach((f, idx) => {
                editCustomFieldsTbody.innerHTML += `<tr>
                    <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.name}" data-idx="${idx}" data-type="name"></td>
                    <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.value}" data-idx="${idx}" data-type="value"></td>
                    <td><button type="button" class="removeCustomFieldBtn text-red-500" data-idx="${idx}"><i class='fas fa-trash'></i></button></td>
                </tr>`;
            });
        }
        function getEditFields() {
            const customFields = [];
            editCustomFieldsTbody.querySelectorAll('tr').forEach(tr => {
                const name = tr.querySelector('input[data-type="name"]').value;
                const value = tr.querySelector('input[data-type="value"]').value;
                if (name || value) customFields.push({ name, value });
            });
            return {
                personalFirstName: document.getElementById('editPersonalFirstName').value,
                personalLastName: document.getElementById('editPersonalLastName').value,
                personalPhone: document.getElementById('editPersonalPhone').value,
                personalEmail: document.getElementById('editPersonalEmail').value,
                personalAddress: document.getElementById('editPersonalAddress').value,
                personalBuildingAddress: document.getElementById('editPersonalBuildingAddress').value,
                prefClientSince: document.getElementById('editPrefClientSince').value,
                prefLeadAcquiredDate: document.getElementById('editPrefLeadAcquiredDate').value,
                prefMainLanguage: document.getElementById('editPrefMainLanguage').value,
                prefPreferredCommunication: document.getElementById('editPrefPreferredCommunication').value,
                prefPaymentTerms: document.getElementById('editPrefPaymentTerms').value,
                prefPaymentMethod: document.getElementById('editPrefPaymentMethod').value,
                prefTaxable: document.getElementById('editPrefTaxable').value,
                prefTags: document.getElementById('editPrefTags').value,
                prefSalesPerson: document.getElementById('editPrefSalesPerson').value,
                prefContractor: document.getElementById('editPrefContractor').value,
                prefInvoiceFrequency: document.getElementById('editPrefInvoiceFrequency').value,
                billingFirstName: document.getElementById('editBillingFirstName').value,
                billingLastName: document.getElementById('editBillingLastName').value,
                billingPhone: document.getElementById('editBillingPhone').value,
                billingEmail: document.getElementById('editBillingEmail').value,
                billingAddress: document.getElementById('editBillingAddress').value,
                billingCompanyName: document.getElementById('editBillingCompanyName').value,
                customerNotes: document.getElementById('editCustomerNotes').value,
                customFields
            };
        }
        // Show modal
        editBtn.addEventListener('click', function() {
            const data = JSON.parse(localStorage.getItem('selectedCustomer')) || {};
            setEditFields(data);
            editModal.classList.remove('hidden');
        });
        // Close modal
        function closeModal() { editModal.classList.add('hidden'); }
        closeEditModal.addEventListener('click', closeModal);
        cancelEditBtn.addEventListener('click', closeModal);
        // Add custom field
        addCustomFieldBtn.addEventListener('click', function() {
            const idx = editCustomFieldsTbody.querySelectorAll('tr').length;
            editCustomFieldsTbody.innerHTML += `<tr>
                <td><input type="text" class="border rounded px-2 py-1 w-full" data-idx="${idx}" data-type="name"></td>
                <td><input type="text" class="border rounded px-2 py-1 w-full" data-idx="${idx}" data-type="value"></td>
                <td><button type="button" class="removeCustomFieldBtn text-red-500" data-idx="${idx}"><i class='fas fa-trash'></i></button></td>
            </tr>`;
        });
        // Remove custom field (event delegation)
        editCustomFieldsTbody.addEventListener('click', function(e) {
            if (e.target.closest('.removeCustomFieldBtn')) {
                e.target.closest('tr').remove();
            }
        });
        // Save changes
        saveEditBtn.addEventListener('click', function() {
            const updated = getEditFields();
            // Merge with existing (preserve other fields)
            const orig = JSON.parse(localStorage.getItem('selectedCustomer')) || {};
            const merged = { ...orig, ...updated };
            localStorage.setItem('selectedCustomer', JSON.stringify(merged));
            // Update details view
            if (typeof populateCustomerDetails === 'function') {
                populateCustomerDetails(merged);
            } else {
                window.location.reload();
            }
            closeModal();
        });
    }

    // Checkbox logic for Restore Selected button (desktop and mobile)
    function updateRestoreButtonVisibility() {
        const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
        const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
        const checkedBoxes = document.querySelectorAll('.customer-checkbox:checked');
        if (restoreSelectedBtn) {
            restoreSelectedBtn.classList.toggle('hidden', checkedBoxes.length === 0);
        }
        if (restoreSelectedBtnMobile) {
            restoreSelectedBtnMobile.classList.toggle('hidden', checkedBoxes.length === 0);
        }
    }
    function updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAllDeleted');
        const checkboxes = document.querySelectorAll('.customer-checkbox');
        const checkedBoxes = document.querySelectorAll('.customer-checkbox:checked');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length && checkboxes.length > 0;
            selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
        }
    }
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllDeleted');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.customer-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateRestoreButtonVisibility();
        });
    }
    // Individual checkbox handlers
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('customer-checkbox')) {
            updateRestoreButtonVisibility();
            updateSelectAllCheckbox();
        }
    });
    // Initial state
    updateRestoreButtonVisibility();
    updateSelectAllCheckbox();

    // Modal animation helpers (copied from contractors.js)
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
    let restoreCustomerIndex = null;
    function showRestoreCustomerModal(idx) {
        restoreCustomerIndex = idx;
        const modal = document.getElementById('restoreCustomerModal');
        if (!modal) return;
        showModal(modal);
    }
    function hideRestoreCustomerModal() {
        const modal = document.getElementById('restoreCustomerModal');
        if (!modal) return;
        hideModal(modal);
        restoreCustomerIndex = null;
    }
    function showRestoreSelectedCustomerModal() {
        const modal = document.getElementById('restoreSelectedCustomerModal');
        if (!modal) return;
        showModal(modal);
    }
    function hideRestoreSelectedCustomerModal() {
        const modal = document.getElementById('restoreSelectedCustomerModal');
        if (!modal) return;
        hideModal(modal);
    }
    if (!window.location.pathname.includes('deleted-customers.html')) return;
    // Attach restore button handlers for deleted customers (desktop & mobile)
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
                showRestoreCustomerModal(idx);
            }
        }
    });
    // Restore Selected button handlers (desktop & mobile)
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
    if (restoreSelectedBtn) {
        restoreSelectedBtn.onclick = function(e) {
            e.preventDefault();
            showRestoreSelectedCustomerModal();
        };
    }
    if (restoreSelectedBtnMobile) {
        restoreSelectedBtnMobile.onclick = function(e) {
            e.preventDefault();
            showRestoreSelectedCustomerModal();
        };
    }
    // Modal button handlers
    const cancelRestoreBtn = document.getElementById('cancelRestoreCustomer');
    if (cancelRestoreBtn) {
        cancelRestoreBtn.onclick = hideRestoreCustomerModal;
    }
    const confirmRestoreBtn = document.getElementById('confirmRestoreCustomer');
    if (confirmRestoreBtn) {
        confirmRestoreBtn.onclick = function() {
            if (restoreCustomerIndex !== null) {
                // Remove customer from table (mock: just hide row)
                // Desktop table
                const table = document.querySelector('table');
                if (table) {
                    const row = table.querySelectorAll('tbody tr')[restoreCustomerIndex];
                    if (row) row.remove();
                }
                // Mobile card
                const mobileList = document.querySelector('.p-3.space-y-2');
                if (mobileList) {
                    const card = mobileList.children[restoreCustomerIndex];
                    if (card) card.remove();
                }
            }
            hideRestoreCustomerModal();
        };
    }
    const cancelRestoreSelectedBtn = document.getElementById('cancelRestoreSelectedCustomer');
    if (cancelRestoreSelectedBtn) {
        cancelRestoreSelectedBtn.onclick = hideRestoreSelectedCustomerModal;
    }
    const confirmRestoreSelectedBtn = document.getElementById('confirmRestoreSelectedCustomer');
    if (confirmRestoreSelectedBtn) {
        confirmRestoreSelectedBtn.onclick = function() {
            // Remove all checked customers (mock: just hide rows/cards)
            // Desktop table
            const checked = Array.from(document.querySelectorAll('.customer-checkbox:checked'));
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
            hideRestoreSelectedCustomerModal();
        };
    }
    // Remove row click redirection for deleted-customers.html
    if (window.location.pathname.includes('deleted-customers.html')) {
        const customerTableRows = document.querySelectorAll('table tbody tr');
        customerTableRows.forEach(row => {
            row.replaceWith(row.cloneNode(true)); // Remove all event listeners
        });
    }
});

// =========================
// The following code was migrated from js/customer-edit.js
// Original file deleted for consolidation. Please update references accordingly.
// =========================

document.addEventListener('DOMContentLoaded', function() {
    // Load header and navigation if needed
    if (typeof loadHTML === 'function') {
        loadHTML('../nav/header.html', 'header-container');
        loadHTML('../nav/navigation.html', 'nav-container');
    }

    // Get customer data
    let customerData = null;
    try {
        customerData = JSON.parse(localStorage.getItem('selectedCustomer'));
    } catch (e) {}
    if (!customerData) {
        const nameHeader = document.getElementById('customerNameHeader');
        if (nameHeader) nameHeader.textContent = 'Not Found';
        return;
    }
    // Header
    const nameHeader = document.getElementById('customerNameHeader');
    if (nameHeader) nameHeader.textContent = customerData.fullName || '';
    // Personal Info
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('personalFirstName', customerData.personalFirstName);
    setVal('personalLastName', customerData.personalLastName);
    setVal('personalPhone', customerData.personalPhone);
    setVal('personalEmail', customerData.personalEmail);
    setVal('personalAddress', customerData.personalAddress);
    setVal('personalBuildingAddress', customerData.personalBuildingAddress);
    // Preferences
    setVal('prefClientSince', customerData.prefClientSince);
    setVal('prefLeadAcquiredDate', customerData.prefLeadAcquiredDate);
    setVal('prefMainLanguage', customerData.prefMainLanguage);
    setVal('prefPreferredCommunication', customerData.prefPreferredCommunication);
    setVal('prefPaymentTerms', customerData.prefPaymentTerms);
    setVal('prefPaymentMethod', customerData.prefPaymentMethod);
    setVal('prefTaxable', customerData.prefTaxable);
    setVal('prefTags', customerData.prefTags);
    setVal('prefSalesPerson', customerData.prefSalesPerson);
    setVal('prefContractor', customerData.prefContractor);
    setVal('prefInvoiceFrequency', customerData.prefInvoiceFrequency);
    // Billing
    setVal('billingFirstName', customerData.billingFirstName);
    setVal('billingLastName', customerData.billingLastName);
    setVal('billingPhone', customerData.billingPhone);
    setVal('billingEmail', customerData.billingEmail);
    setVal('billingAddress', customerData.billingAddress);
    setVal('billingCompanyName', customerData.billingCompanyName);
    // Notes
    setVal('customerNotes', customerData.customerNotes);
    // Custom Fields
    const customFieldsTbody = document.getElementById('customFields');
    function renderCustomFields(fields) {
        if (!customFieldsTbody) return;
        customFieldsTbody.innerHTML = '';
        (fields || []).forEach((f, idx) => {
            customFieldsTbody.innerHTML += `<tr>
                <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.name}" data-idx="${idx}" data-type="name"></td>
                <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.value}" data-idx="${idx}" data-type="value"></td>
                <td><button type="button" class="removeCustomFieldBtn text-red-500" data-idx="${idx}"><i class='fas fa-trash'></i></button></td>
            </tr>`;
        });
    }
    renderCustomFields(customerData.customFields || []);
    // Add custom field
    const addCustomFieldBtn = document.getElementById('addCustomFieldBtn');
    if (addCustomFieldBtn && customFieldsTbody) {
        addCustomFieldBtn.addEventListener('click', function() {
            const fields = [];
            customFieldsTbody.querySelectorAll('tr').forEach(tr => {
                const name = tr.querySelector('input[data-type="name"]').value;
                const value = tr.querySelector('input[data-type="value"]').value;
                if (name || value) fields.push({ name, value });
            });
            fields.push({ name: '', value: '' });
            renderCustomFields(fields);
        });
    }
    // Remove custom field
    if (customFieldsTbody) {
        customFieldsTbody.addEventListener('click', function(e) {
            if (e.target.closest('.removeCustomFieldBtn')) {
                e.target.closest('tr').remove();
            }
        });
    }
    // Update/save button
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            // Gather all fields
            const customFields = [];
            if (customFieldsTbody) {
                customFieldsTbody.querySelectorAll('tr').forEach(tr => {
                    const name = tr.querySelector('input[data-type="name"]').value;
                    const value = tr.querySelector('input[data-type="value"]').value;
                    if (name || value) customFields.push({ name, value });
                });
            }
            const updated = {
                ...customerData,
                personalFirstName: document.getElementById('personalFirstName')?.value || '',
                personalLastName: document.getElementById('personalLastName')?.value || '',
                personalPhone: document.getElementById('personalPhone')?.value || '',
                personalEmail: document.getElementById('personalEmail')?.value || '',
                personalAddress: document.getElementById('personalAddress')?.value || '',
                personalBuildingAddress: document.getElementById('personalBuildingAddress')?.value || '',
                prefClientSince: document.getElementById('prefClientSince')?.value || '',
                prefLeadAcquiredDate: document.getElementById('prefLeadAcquiredDate')?.value || '',
                prefMainLanguage: document.getElementById('prefMainLanguage')?.value || '',
                prefPreferredCommunication: document.getElementById('prefPreferredCommunication')?.value || '',
                prefPaymentTerms: document.getElementById('prefPaymentTerms')?.value || '',
                prefPaymentMethod: document.getElementById('prefPaymentMethod')?.value || '',
                prefTaxable: document.getElementById('prefTaxable')?.value || '',
                prefTags: document.getElementById('prefTags')?.value || '',
                prefSalesPerson: document.getElementById('prefSalesPerson')?.value || '',
                prefContractor: document.getElementById('prefContractor')?.value || '',
                prefInvoiceFrequency: document.getElementById('prefInvoiceFrequency')?.value || '',
                billingFirstName: document.getElementById('billingFirstName')?.value || '',
                billingLastName: document.getElementById('billingLastName')?.value || '',
                billingPhone: document.getElementById('billingPhone')?.value || '',
                billingEmail: document.getElementById('billingEmail')?.value || '',
                billingAddress: document.getElementById('billingAddress')?.value || '',
                billingCompanyName: document.getElementById('billingCompanyName')?.value || '',
                customerNotes: document.getElementById('customerNotes')?.value || '',
                customFields
            };
            localStorage.setItem('selectedCustomer', JSON.stringify(updated));
            window.location.href = 'customer-details.html';
        });
    }
}); 