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

    // --- DROPDOWN LOGIC FOR ACTIONS AND MORE BUTTONS ---
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');

    // Toggle actions menu
    if (actionsDropdown && actionsMenu && moreMenu) {
        actionsDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            actionsMenu.classList.toggle('hidden');
            moreMenu.classList.add('hidden');
        });
    }

    // Toggle more menu
    if (moreDropdown && moreMenu && actionsMenu) {
        moreDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            moreMenu.classList.toggle('hidden');
            actionsMenu.classList.add('hidden');
        });
    }

    // Close menus when clicking outside
    if (actionsDropdown && moreDropdown && actionsMenu && moreMenu) {
        document.addEventListener('click', (e) => {
            if (!actionsDropdown.contains(e.target) && !moreDropdown.contains(e.target)) {
                actionsMenu.classList.add('hidden');
                moreMenu.classList.add('hidden');
            }
        });
    }

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
        function renderCustomFields(fields) {
            if (!customFieldsTbody) return;
            customFieldsTbody.innerHTML = '';
            (fields || []).forEach((f, idx) => {
                customFieldsTbody.innerHTML += `<tr>
                    <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.name}" data-idx="${idx}" data-type="name"></td>
                    <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.value}" data-idx="${idx}" data-type="value"></td>
                    <td><button type="button" class="removeCustomFieldBtn text-red-500" data-idx="${idx}"><i class='fas fa-trash text-2xl'></i></button></td>
                </tr>`;
            });
        }
        renderCustomFields(customerData.customFields || []);
        // Remove custom field with confirmation modal
        let customFieldToDeleteIdx = null;
        const deleteCustomFieldModal = document.getElementById('deleteCustomFieldModal');
        const confirmDeleteCustomFieldBtn = document.getElementById('confirmDeleteCustomField');
        const cancelDeleteCustomFieldBtn = document.getElementById('cancelDeleteCustomField');
        if (customFieldsTbody) {
            customFieldsTbody.addEventListener('click', function(e) {
                const btn = e.target.closest('.removeCustomFieldBtn');
                if (btn) {
                    customFieldToDeleteIdx = parseInt(btn.getAttribute('data-idx'));
                    if (deleteCustomFieldModal) {
                        deleteCustomFieldModal.classList.remove('hidden');
                        setTimeout(() => {
                            deleteCustomFieldModal.querySelector('.modal-content-modern').classList.add('show');
                        }, 10);
                    }
                }
            });
        }
        if (cancelDeleteCustomFieldBtn) {
            cancelDeleteCustomFieldBtn.onclick = function() {
                if (deleteCustomFieldModal) {
                    deleteCustomFieldModal.querySelector('.modal-content-modern').classList.remove('show');
                    setTimeout(() => {
                        deleteCustomFieldModal.classList.add('hidden');
                    }, 200);
                }
                customFieldToDeleteIdx = null;
            };
        }
        if (confirmDeleteCustomFieldBtn) {
            confirmDeleteCustomFieldBtn.onclick = function() {
                if (customFieldToDeleteIdx !== null) {
                    const fields = [];
                    customFieldsTbody.querySelectorAll('tr').forEach((tr, idx) => {
                        if (idx !== customFieldToDeleteIdx) {
                            const name = tr.querySelector('input[data-type="name"]').value;
                            const value = tr.querySelector('input[data-type="value"]').value;
                            if (name || value) fields.push({ name, value });
                        }
                    });
                    renderCustomFields(fields);
                }
                if (deleteCustomFieldModal) {
                    deleteCustomFieldModal.querySelector('.modal-content-modern').classList.remove('show');
                    setTimeout(() => {
                        deleteCustomFieldModal.classList.add('hidden');
                    }, 200);
                }
                customFieldToDeleteIdx = null;
            };
        }
        // Hide modal when clicking outside
        if (deleteCustomFieldModal) {
            deleteCustomFieldModal.onclick = function(event) {
                if (event.target === deleteCustomFieldModal) {
                    deleteCustomFieldModal.querySelector('.modal-content-modern').classList.remove('show');
                    setTimeout(() => {
                        deleteCustomFieldModal.classList.add('hidden');
                    }, 200);
                }
            };
        }
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

// --- MOBILE CARD RENDERING ---
function renderMobileCards() {
  const mobileCardView = document.querySelector('.mobile-card-view');
  if (!mobileCardView) return;
  // Gather data from the desktop table (if present)
  const rows = document.querySelectorAll('table tbody tr');
  mobileCardView.innerHTML = '';
  rows.forEach(row => {
    const fullName = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
    const phone = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
    const email = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
    const accountStatus = row.querySelector('td:nth-child(6) span')?.textContent.trim() || '';
    const statusColor = accountStatus === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
    // Card
    const card = document.createElement('a');
    card.href = 'customer-details.html';
    card.className = 'block bg-white rounded-lg shadow p-3 border border-blue-200';
    card.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <div class="text-blue-700 font-semibold text-lg">${fullName}</div>
          <div class="text-xs text-gray-600">${email}</div>
          <div class="text-xs text-gray-600">${phone}</div>
        </div>
        <div class="flex flex-col items-end">
          <div class="${statusColor} text-xs px-2 py-1 rounded">${accountStatus?.toUpperCase() || ''}</div>
        </div>
      </div>
    `;
    card.addEventListener('click', function(e) {
      // Set localStorage as in desktop logic
      const verification = row.querySelector('td:nth-child(5) span')?.textContent.trim() || '';
      const dateRegistered = row.querySelector('td:nth-child(7)')?.textContent.trim() || '';
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
        dateRegistered
      };
      localStorage.setItem('selectedCustomer', JSON.stringify(customerData));
      // No need to set window.location.href, let the anchor do the redirect
    });
    mobileCardView.appendChild(card);
  });
}

// Render on load and on resize
window.addEventListener('DOMContentLoaded', renderMobileCards);
window.addEventListener('resize', () => {
  if (window.innerWidth < 768) renderMobileCards();
});

// --- MOBILE BUTTONS LOGIC ---
document.getElementById('mobileCreateBtn')?.addEventListener('click', () => {
  window.location.href = 'create-customer.html';
});
document.getElementById('mobileDeletedBtn')?.addEventListener('click', () => {
  window.location.href = 'deleted-customers.html';
});
document.getElementById('mobileActionsBtn')?.addEventListener('click', () => {
  // Implement actions dropdown/modal as needed
  alert('Actions menu (mobile)');
});
document.getElementById('mobileMoreBtn')?.addEventListener('click', () => {
  // Implement more dropdown/modal as needed
  alert('More menu (mobile)');
});
document.getElementById('mobileFilterBtn')?.addEventListener('click', () => {
  document.getElementById('openFilter')?.click();
}); 

// --- MOBILE PROFILE UI INJECTION FOR CUSTOMER DETAILS ---
function renderMobileProfile() {
  const container = document.getElementById('mobileProfileContainer');
  if (!container) return;
  let customer = null;
  try {
    customer = JSON.parse(localStorage.getItem('selectedCustomer'));
  } catch (e) {}
  if (!customer) return;

  // Mobile profile HTML (from customer-mobile/profile.html, simplified for injection)
  container.innerHTML = `
    <div class="rounded-t-2xl flex flex-col items-center pt-0 pb-4 -mx-4" style="background-color: #41B6FF; position: relative;">
      <button id="mobileBackBtn" class="absolute top-2 left-2 bg-blue-500 text-white rounded-full px-3 py-1 flex items-center gap-2 shadow hover:bg-blue-600 transition text-sm w-fit" style="margin-left: 8px;">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <div class="bg-white rounded-full border-4 flex items-center justify-center mt-8" style="border-color: #41B6FF; width: 80px; height: 80px;" >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="white"/>
          <circle cx="32" cy="24" r="12" fill="#d1d5db"/>
          <ellipse cx="32" cy="48" rx="20" ry="12" fill="#d1d5db"/>
        </svg>
      </div>
      <div class="text-2xl font-bold text-gray-800" id="mobileProfileName"></div>
      <div class="text-gray-600 text-sm mb-2" id="mobileProfileEmail"></div>
    </div>
    <div class="flex flex-col items-center py-4">
      <div class="text-3xl font-bold" style="color: #41B6FF;">$0</div>
      <div class="w-full border-t border-gray-200 my-3"></div>
      <div class="grid grid-cols-4 gap-2 w-full text-center">
        <button class="flex flex-col items-center card-action-btn" data-action="jobs" type="button" style="background:none;border:none;outline:none;cursor:pointer;">
          <i class="fa fa-file-invoice-dollar text-2xl mb-1" style="color: #41B6FF;"></i>
          <span class="text-xs font-semibold text-gray-700">Jobs</span>
        </button>
        <button class="flex flex-col items-center card-action-btn" data-action="estimates" type="button" style="background:none;border:none;outline:none;cursor:pointer;">
          <i class="fa fa-file-signature text-2xl mb-1" style="color: #41B6FF;"></i>
          <span class="text-xs font-semibold text-gray-700">Estimates</span>
        </button>
        <button class="flex flex-col items-center card-action-btn" data-action="invoices" type="button" style="background:none;border:none;outline:none;cursor:pointer;">
          <i class="fa fa-file-invoice text-2xl mb-1" style="color: #41B6FF;"></i>
          <span class="text-xs font-semibold text-gray-700">Invoices</span>
        </button>
        <button class="flex flex-col items-center card-action-btn" data-action="transactions" type="button" style="background:none;border:none;outline:none;cursor:pointer;">
          <i class="fa fa-exchange-alt text-2xl mb-1" style="color: #41B6FF;"></i>
          <span class="text-xs font-semibold text-gray-700">Transactions</span>
        </button>
      </div>
    </div>
    <div class="mt-2">
      <div class="font-bold text-gray-700 mb-1">Customer Information</div>
      <div class="divide-y divide-blue-100 rounded overflow-hidden flex flex-col">
        <div class="bg-blue-50 py-2 px-3 font-medium flex justify-between items-center">Personal Information <span>&gt;</span></div>
        <div class="bg-blue-50 py-2 px-3 font-medium flex justify-between items-center">Billing Information <span>&gt;</span></div>
        <div class="bg-blue-50 py-2 px-3 font-medium flex justify-between items-center">Preferences <span>&gt;</span></div>
        <div class="bg-blue-50 py-2 px-3 font-medium flex justify-between items-center">Custom Fields <span>&gt;</span></div>
        <div class="bg-blue-50 py-2 px-3 font-medium flex justify-between items-center">Customer Notes <span>&gt;</span></div>
      </div>
    </div>
  `;
  // Add back button handler
  const backBtn = document.getElementById('mobileBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 'customerlist.html';
    });
  }
  // Fill in customer data
  document.getElementById('mobileProfileName').textContent = customer.fullName || '';
  document.getElementById('mobileProfileEmail').textContent = customer.personalEmail || '';

  // Add Jobs button handler
  const jobsBtn = container.querySelector('.card-action-btn[data-action="jobs"]');
  if (jobsBtn) {
    jobsBtn.addEventListener('click', function() {
      renderMobileJobs(container, customer);
    });
  }
  // Add Estimates button handler in renderMobileProfile
  const estimatesBtn = container.querySelector('.card-action-btn[data-action="estimates"]');
  if (estimatesBtn) {
    estimatesBtn.addEventListener('click', function() {
      renderMobileEstimates(container, customer);
    });
  }
  // Add Invoices button handler in renderMobileProfile
  const invoicesBtn = container.querySelector('.card-action-btn[data-action="invoices"]');
  if (invoicesBtn) {
    invoicesBtn.addEventListener('click', function() {
      renderMobileInvoices(container, customer);
    });
  }
  // Add Transactions button handler in renderMobileProfile
  const transactionsBtn = container.querySelector('.card-action-btn[data-action="transactions"]');
  if (transactionsBtn) {
    transactionsBtn.addEventListener('click', function() {
      renderMobileTransactions(container, customer);
    });
  }
  // Add Personal Information section handler in renderMobileProfile
  const personalInfoSection = container.querySelector('.divide-y > div:nth-child(1)');
  if (personalInfoSection) {
    personalInfoSection.addEventListener('click', function() {
      renderMobilePersonalInfo(container, customer);
    });
  }
  // Add Billing Information section handler in renderMobileProfile
  const billingInfoSection = container.querySelector('.divide-y > div:nth-child(2)');
  if (billingInfoSection) {
    billingInfoSection.addEventListener('click', function() {
      renderMobileBillingInfo(container, customer);
    });
  }
  // Add Preferences section handler in renderMobileProfile
  const preferencesSection = container.querySelector('.divide-y > div:nth-child(3)');
  if (preferencesSection) {
    preferencesSection.addEventListener('click', function() {
      renderMobilePreferences(container, customer);
    });
  }
  // Add Custom Fields section handler in renderMobileProfile
  const customFieldsSection = container.querySelector('.divide-y > div:nth-child(4)');
  if (customFieldsSection) {
    customFieldsSection.addEventListener('click', function() {
      renderMobileCustomFields(container, customer);
    });
  }
  // Add Customer Notes section handler in renderMobileProfile
  const customerNotesSection = container.querySelector('.divide-y > div:nth-child(5)');
  if (customerNotesSection) {
    customerNotesSection.addEventListener('click', function() {
      renderMobileCustomerNotes(container, customer);
    });
  }
}

// --- MOBILE JOBS UI INJECTION ---
function renderMobileJobs(container, customer) {
  // If no jobs, add an example job
  let jobs = (customer.jobs && customer.jobs.length > 0) ? customer.jobs : [
    {
      project: 'EX-1001',
      dateStarted: 'April 1, 2025',
      endTarget: 'April 10, 2025',
      status: 'Undispatched',
      team: 'Team Example'
    }
  ];
  // Full-height modal overlay
  let jobsHtml = `
    <div id="jobsModalOverlay" class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black bg-opacity-50 overflow-y-auto max-h-screen">
      <div class="relative w-full max-w-md mx-auto">
        <!-- Modern Back Button -->
        <button id="jobsBackBtn" class="absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-blue-100 transition z-10">
          <i class="fas fa-arrow-left text-xl text-blue-500"></i>
        </button>
        <div class="mt-12 mb-4 rounded-[2rem] overflow-hidden shadow-lg bg-white flex-1 flex flex-col">
          <div class="bg-[#4CB6E8] flex flex-col items-center pt-8 pb-4 relative">
            <div class="relative">
              <span class="inline-block w-28 h-28 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center">
                <svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.25a8.38 8.38 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              </span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <h2 class="text-3xl font-extrabold text-center text-black">${customer.fullName || ''}</h2>
            </div>
            <p class="text-center text-black/80 text-base font-medium">${customer.personalEmail || ''}</p>
          </div>
          <div class="px-4 py-6 bg-[#F3F8FC] flex-1 flex flex-col gap-4 overflow-y-auto" style="min-height:200px;">
            ${jobs.map(job => `
              <div class="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-black text-base">Project Number</span>
                  <span class="text-blue-500 font-bold">${job.project}</span>
                </div>
                <div class="text-black/80 text-sm">Date Started: ${job.dateStarted}</div>
                <div class="text-black/80 text-sm">EndTarget: ${job.endTarget}</div>
                <div class="text-black/80 text-sm">Status: <span class="text-blue-500 font-bold">${job.status}</span></div>
                <div class="text-black/80 text-sm">Assigned Team: <span class="text-blue-500 font-bold">${job.team}</span></div>
              </div>
            `).join('')}
            <div class="pt-4 pb-2">
              <button class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  // Render modal overlay
  document.body.insertAdjacentHTML('beforeend', jobsHtml);
  // Back button closes modal and restores profile
  const backBtn = document.getElementById('jobsBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const modal = document.getElementById('jobsModalOverlay');
      if (modal) modal.remove();
    });
  }
}

// --- MOBILE ESTIMATES UI INJECTION ---
function renderMobileEstimates(container, customer) {
  // If no estimates, add example estimates
  let estimates = (customer.estimates && customer.estimates.length > 0) ? customer.estimates : [
    {
      dateCreated: 'April 2, 2025',
      type: 'Invoice Due Soon',
      details: 'Invoice 1038-01 is due soon',
      total: '$ 0.00'
    },
    {
      dateCreated: 'April 3, 2025',
      type: 'Estimate',
      details: 'Estimate created.',
      total: '$ 0.00'
    }
  ];
  let estimatesHtml = `
    <div id="estimatesModalOverlay" class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black bg-opacity-50 overflow-y-auto max-h-screen">
      <div class="relative w-full max-w-md mx-auto">
        <!-- Modern Back Button -->
        <button id="estimatesBackBtn" class="absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-blue-100 transition z-10">
          <i class="fas fa-arrow-left text-xl text-blue-500"></i>
        </button>
        <div class="mt-12 mb-4 rounded-[2rem] overflow-hidden shadow-lg bg-white flex-1 flex flex-col">
          <div class="bg-[#4CB6E8] flex flex-col items-center pt-8 pb-4 relative">
            <div class="relative">
              <span class="inline-block w-28 h-28 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center">
                <svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.25a8.38 8.38 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              </span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <h2 class="text-3xl font-extrabold text-center text-black">${customer.fullName || ''}</h2>
            </div>
            <p class="text-center text-black/80 text-base font-medium">${customer.personalEmail || ''}</p>
          </div>
          <div class="px-4 py-6 bg-[#F3F8FC] flex-1 flex flex-col gap-4 overflow-y-auto" style="min-height:200px;">
            ${estimates.map(est => `
              <div class="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <div class="text-black/80 text-sm">Date Created: <span class="text-black/60">${est.dateCreated}</span></div>
                <div class="text-black/80 text-sm">Type : ${est.type}</div>
                <div class="text-black/80 text-sm">Details: ${est.details}</div>
                <div class="text-black/80 text-sm">Total: <a href="#" class="text-blue-500 underline font-bold">${est.total}</a></div>
              </div>
            `).join('')}
            <div class="pt-4 pb-2">
              <button class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', estimatesHtml);
  // Back button closes modal
  const backBtn = document.getElementById('estimatesBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const modal = document.getElementById('estimatesModalOverlay');
      if (modal) modal.remove();
    });
  }
}

// --- MOBILE INVOICES UI INJECTION ---
function renderMobileInvoices(container, customer) {
  // If no invoices, add example invoices
  let invoices = (customer.invoices && customer.invoices.length > 0) ? customer.invoices : [
    {
      number: '218046737',
      total: '$0.0',
      dateCreated: 'April 4, 2025',
      status: 'Pending'
    },
    {
      number: '218046738',
      total: '$0.0',
      dateCreated: 'April 5, 2025',
      status: 'Paid'
    }
  ];
  let invoicesHtml = `
    <div id="invoicesModalOverlay" class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black bg-opacity-50 overflow-y-auto max-h-screen">
      <div class="relative w-full max-w-md mx-auto">
        <!-- Modern Back Button -->
        <button id="invoicesBackBtn" class="absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-blue-100 transition z-10">
          <i class="fas fa-arrow-left text-xl text-blue-500"></i>
        </button>
        <div class="mt-12 mb-4 rounded-[2rem] overflow-hidden shadow-lg bg-white flex-1 flex flex-col">
          <div class="bg-[#4CB6E8] flex flex-col items-center pt-8 pb-4 relative">
            <div class="relative">
              <span class="inline-block w-28 h-28 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center">
                <svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.25a8.38 8.38 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              </span>
              <span class="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow text-purple-600 border border-purple-300">
                <i class="fas fa-pen fa-sm"></i>
              </span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <h2 class="text-3xl font-extrabold text-center text-black">${customer.fullName || ''}</h2>
            </div>
            <p class="text-center text-black/80 text-base font-medium">${customer.personalEmail || ''}</p>
          </div>
          <div class="px-4 py-6 bg-[#F3F8FC] flex-1 flex flex-col gap-4 overflow-y-auto" style="min-height:200px;">
            ${invoices.map(inv => `
              <div class="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <span class="text-black/80 text-sm font-medium">Invoice No. ${inv.number}</span>
                  <a href="#" class="text-[#4CB6E8] font-bold text-sm">Value</a>
                </div>
                <div class="text-black/80 text-sm">Total Cost : ${inv.total}</div>
                <div class="text-black/80 text-sm">Date Created : ${inv.dateCreated}</div>
                <div class="text-black/80 text-sm">Status : ${inv.status}</div>
              </div>
            `).join('')}
            <div class="pt-4 pb-2">
              <button class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', invoicesHtml);
  // Back button closes modal
  const backBtn = document.getElementById('invoicesBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const modal = document.getElementById('invoicesModalOverlay');
      if (modal) modal.remove();
    });
  }
}

// --- MOBILE TRANSACTIONS UI INJECTION ---
function renderMobileTransactions(container, customer) {
  // If no transactions, add example transactions
  let transactions = (customer.transactions && customer.transactions.length > 0) ? customer.transactions : [
    {
      dateCreated: 'April 6, 2025',
      type: 'Invoice Due Soon',
      details: 'Invoice 1038-01 is due soon',
      total: '$ 0.00'
    },
    {
      dateCreated: 'April 7, 2025',
      type: 'Estimate',
      details: 'Estimate created.',
      total: '$ 0.00'
    }
  ];
  let transactionsHtml = `
    <div id="transactionsModalOverlay" class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black bg-opacity-50 overflow-y-auto max-h-screen">
      <div class="relative w-full max-w-md mx-auto">
        <!-- Modern Back Button -->
        <button id="transactionsBackBtn" class="absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-blue-100 transition z-10">
          <i class="fas fa-arrow-left text-xl text-blue-500"></i>
        </button>
        <div class="mt-12 mb-4 rounded-[2rem] overflow-hidden shadow-lg bg-white flex-1 flex flex-col">
          <div class="bg-[#4CB6E8] flex flex-col items-center pt-8 pb-4 relative">
            <div class="relative">
              <span class="inline-block w-28 h-28 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center">
                <svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.25a8.38 8.38 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              </span>
              <span class="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow text-purple-600 border border-purple-300">
                <i class="fas fa-pen fa-sm"></i>
              </span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <h2 class="text-3xl font-extrabold text-center text-black">${customer.fullName || ''}</h2>
            </div>
            <p class="text-center text-black/80 text-base font-medium">${customer.personalEmail || ''}</p>
          </div>
          <div class="px-4 py-6 bg-[#F3F8FC] flex-1 flex flex-col gap-4 overflow-y-auto" style="min-height:200px;">
            ${transactions.map(tran => `
              <div class="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <div class="text-black/80 text-sm font-medium">Date Created: <span class="text-[#4CB6E8]">${tran.dateCreated}</span></div>
                <div class="text-black/80 text-sm">Type : ${tran.type}</div>
                <div class="text-black/80 text-sm">Details: ${tran.details}</div>
                <div class="text-black/80 text-sm">Total: <span class="text-[#4CB6E8] font-bold">${tran.total}</span></div>
              </div>
            `).join('')}
            <div class="pt-4 pb-2">
              <button class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', transactionsHtml);
  // Back button closes modal
  const backBtn = document.getElementById('transactionsBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const modal = document.getElementById('transactionsModalOverlay');
      if (modal) modal.remove();
    });
  }
}

// --- MOBILE PERSONAL INFORMATION UI INJECTION ---
function renderMobilePersonalInfo(container, customer) {
  let personalInfoHtml = `
    <div id="personalInfoModalOverlay" class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black bg-opacity-50 overflow-y-auto max-h-screen">
      <div class="relative w-full max-w-md mx-auto">
        <!-- Modern Back Button -->
        <button id="personalInfoBackBtn" class="absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-blue-100 transition z-10">
          <i class="fas fa-arrow-left text-xl text-blue-500"></i>
        </button>
        <div class="mt-12 mb-4 rounded-[2rem] overflow-hidden shadow-lg bg-white flex-1 flex flex-col">
          <div class="bg-[#4CB6E8] flex flex-col items-center pt-8 pb-4 relative">
            <div class="relative">
              <span class="inline-block w-28 h-28 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center">
                <svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.25a8.38 8.38 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              </span>
              <span class="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow text-purple-600 border border-purple-300">
                <i class="fas fa-pen fa-sm"></i>
              </span>
            </div>
            <h2 class="text-3xl font-extrabold text-center text-black mt-2">${customer.fullName || ''}</h2>
            <p class="text-center text-black/80 text-base font-medium">${customer.personalEmail || ''}</p>
          </div>
          <form class="px-6 py-6 flex flex-col gap-1 bg-[#F3F8FC]">
            <label class="text-sm font-bold text-black mt-2" for="first-name">First Name</label>
            <input type="text" id="first-name" value="${customer.personalFirstName || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="last-name">Last Name</label>
            <input type="text" id="last-name" value="${customer.personalLastName || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="phone-number">Phone Number</label>
            <input type="text" id="phone-number" value="${customer.personalPhone || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="email-address">Email Address</label>
            <input type="email" id="email-address" value="${customer.personalEmail || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="current-address">Current Address</label>
            <input type="text" id="current-address" value="${customer.personalAddress || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="billing-address">Billing Address</label>
            <input type="text" id="billing-address" value="${customer.personalBuildingAddress || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <div class="pt-4 pb-2">
              <button type="submit" class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', personalInfoHtml);
  // Back button closes modal
  const backBtn = document.getElementById('personalInfoBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const modal = document.getElementById('personalInfoModalOverlay');
      if (modal) modal.remove();
    });
  }
}

// --- MOBILE BILLING INFORMATION UI INJECTION ---
function renderMobileBillingInfo(container, customer) {
  let billingInfoHtml = `
    <div id="billingInfoModalOverlay" class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black bg-opacity-50 overflow-y-auto max-h-screen">
      <div class="relative w-full max-w-md mx-auto">
        <!-- Modern Back Button -->
        <button id="billingInfoBackBtn" class="absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-blue-100 transition z-10">
          <i class="fas fa-arrow-left text-xl text-blue-500"></i>
        </button>
        <div class="mt-12 mb-4 rounded-[2rem] overflow-hidden shadow-lg bg-white flex-1 flex flex-col">
          <div class="bg-[#4CB6E8] flex flex-col items-center pt-8 pb-4 relative">
            <div class="relative">
              <span class="inline-block w-28 h-28 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center">
                <svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.25a8.38 8.38 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              </span>
              <span class="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow text-purple-600 border border-purple-300">
                <i class="fas fa-pen fa-sm"></i>
              </span>
            </div>
            <h2 class="text-3xl font-extrabold text-center text-black mt-2">${customer.fullName || ''}</h2>
            <p class="text-center text-black/80 text-base font-medium">${customer.billingEmail || ''}</p>
          </div>
          <form class="px-6 py-6 flex flex-col gap-1 bg-[#F3F8FC]">
            <label class="text-sm font-bold text-black mt-2" for="billing-first-name">First Name</label>
            <input type="text" id="billing-first-name" value="${customer.billingFirstName || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="billing-last-name">Last Name</label>
            <input type="text" id="billing-last-name" value="${customer.billingLastName || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="billing-phone-number">Phone Number</label>
            <input type="text" id="billing-phone-number" value="${customer.billingPhone || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="billing-email-address">Email Address</label>
            <input type="email" id="billing-email-address" value="${customer.billingEmail || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="billing-current-address">Current Address</label>
            <input type="text" id="billing-current-address" value="${customer.billingAddress || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <label class="text-sm font-bold text-black mt-2" for="billing-company-name">Company Name</label>
            <input type="text" id="billing-company-name" value="${customer.billingCompanyName || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"/>
            <div class="pt-4 pb-2">
              <button type="submit" class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', billingInfoHtml);
  // Back button closes modal
  const backBtn = document.getElementById('billingInfoBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const modal = document.getElementById('billingInfoModalOverlay');
      if (modal) modal.remove();
    });
  }
}

// --- MOBILE PREFERENCES UI INJECTION ---
function renderMobilePreferences(container, customer) {
  let preferencesHtml = `
    <div id="preferencesModalOverlay" class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black bg-opacity-50 overflow-y-auto max-h-screen">
      <div class="relative w-full max-w-md mx-auto">
        <!-- Modern Back Button -->
        <button id="preferencesBackBtn" class="absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-blue-100 transition z-10">
          <i class="fas fa-arrow-left text-xl text-blue-500"></i>
        </button>
        <div class="mt-12 mb-4 overflow-hidden flex flex-col">
          <div class="bg-[#4CB6E8] flex flex-col items-center pt-8 pb-4 relative">
            <div class="relative">
              <span class="inline-block w-28 h-28 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center">
                <svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.25a8.38 8.38 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              </span>
              <span class="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow text-purple-600 border border-purple-300">
                <i class="fas fa-pen fa-sm"></i>
              </span>
            </div>
            <h2 class="text-3xl font-extrabold text-center text-black mt-2">${customer.fullName || ''}</h2>
            <p class="text-center text-black/80 text-base font-medium">${customer.personalEmail || ''}</p>
          </div>
          <form class="px-6 py-6 flex flex-col gap-1 bg-[#F3F8FC]">
            <label class="text-sm font-bold text-black mt-2" for="client-since">Client Since</label>
            <input type="text" id="client-since" value="${customer.prefClientSince || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
            <label class="text-sm font-bold text-black mt-2" for="lead-acquired-date">Lead Acquired Date</label>
            <input type="text" id="lead-acquired-date" value="${customer.prefLeadAcquiredDate || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
            <div class="grid grid-cols-2 gap-2 mt-2">
                <div>
                    <label class="text-sm font-bold text-black" for="main-language">Main Language</label>
                    <input type="text" id="main-language" value="${customer.prefMainLanguage || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
                </div>
                <div>
                    <label class="text-sm font-bold text-black" for="preferred-communication">Preferred Comms</label>
                    <input type="text" id="preferred-communication" value="${customer.prefPreferredCommunication || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
                <div>
                    <label class="text-sm font-bold text-black" for="payment-terms">Payment Terms</label>
                    <input type="text" id="payment-terms" value="${customer.prefPaymentTerms || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
                </div>
                <div>
                    <label class="text-sm font-bold text-black" for="payment-method">Payment Method</label>
                    <input type="text" id="payment-method" value="${customer.prefPaymentMethod || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
                <div>
                    <label class="text-sm font-bold text-black" for="invoice-frequency">Invoice Frequency</label>
                    <input type="text" id="invoice-frequency" value="${customer.prefInvoiceFrequency || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
                </div>
                <div>
                    <label class="text-sm font-bold text-black" for="taxable">Taxable</label>
                    <input type="text" id="taxable" value="${customer.prefTaxable || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
                </div>
            </div>
            <label class="text-sm font-bold text-black mt-2" for="tags">Tags</label>
            <input type="text" id="tags" value="${customer.prefTags || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
            <label class="text-sm font-bold text-black mt-2" for="sales-person">Sales Person</label>
            <input type="text" id="sales-person" value="${customer.prefSalesPerson || ''}" class="rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium w-full"/>
            <div class="pt-4 pb-2">
                <button type="submit" class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', preferencesHtml);
  // Back button closes modal
  const backBtn = document.getElementById('preferencesBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const modal = document.getElementById('preferencesModalOverlay');
      if (modal) modal.remove();
    });
  }
}

// --- MOBILE CUSTOM FIELDS UI INJECTION ---
function renderMobileCustomFields(container, customer) {
  let customFields = Array.isArray(customer.customFields) && customer.customFields.length > 0 ? customer.customFields : [
    { name: 'Example Field', value: 'Example Value', description: 'Description' }
  ];
  let customFieldsHtml = `
    <div id="customFieldsModalOverlay" class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black bg-opacity-50 overflow-y-auto max-h-screen">
      <div class="relative w-full max-w-md mx-auto">
        <!-- Modern Back Button -->
        <button id="customFieldsBackBtn" class="absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-blue-100 transition z-10">
          <i class="fas fa-arrow-left text-xl text-blue-500"></i>
        </button>
        <div class="mt-12 mb-4 rounded-[2rem] overflow-hidden shadow-lg bg-white flex-1 flex flex-col">
          <div class="bg-[#4CB6E8] flex flex-col items-center pt-8 pb-4 relative">
            <div class="relative">
              <span class="inline-block w-28 h-28 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center">
                <svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.25a8.38 8.38 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              </span>
              <span class="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow text-purple-600 border border-purple-300">
                <i class="fas fa-pen fa-sm"></i>
              </span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <h2 class="text-3xl font-extrabold text-center text-black">${customer.fullName || ''}</h2>
            </div>
            <p class="text-center text-black/80 text-base font-medium">${customer.personalEmail || ''}</p>
          </div>
          <div class="px-4 py-6 bg-[#F3F8FC] flex flex-col gap-4">
            ${customFields.map(field => `
              <div class="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-black text-base">${field.name}</span>
                  <span class="text-blue-500 font-bold">${field.value}</span>
                </div>
                <div class="text-black/80 text-sm">${field.description || ''}</div>
                <div class="flex justify-end mt-2">
                  <button class="px-4 py-1 bg-blue-200 text-blue-700 rounded-lg font-bold text-sm">Action</button>
                </div>
              </div>
            `).join('')}
            <div class="pt-4 pb-2">
              <button class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', customFieldsHtml);
  // Back button closes modal
  const backBtn = document.getElementById('customFieldsBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const modal = document.getElementById('customFieldsModalOverlay');
      if (modal) modal.remove();
    });
  }
}

// --- MOBILE CUSTOMER NOTES UI INJECTION ---
function renderMobileCustomerNotes(container, customer) {
  let notes = customer.customerNotes ? [customer.customerNotes] : [
    'Example note 1',
    'Example note 2',
    'Example note 3'
  ];
  let customerNotesHtml = `
    <div id="customerNotesModalOverlay" class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black bg-opacity-50 overflow-y-auto max-h-screen">
      <div class="relative w-full max-w-md mx-auto">
        <!-- Modern Back Button -->
        <button id="customerNotesBackBtn" class="absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 flex items-center justify-center hover:bg-blue-100 transition z-10">
          <i class="fas fa-arrow-left text-xl text-blue-500"></i>
        </button>
        <div class="mt-12 mb-4 rounded-[2rem] overflow-hidden shadow-lg bg-white flex-1 flex flex-col">
          <div class="bg-[#4CB6E8] flex flex-col items-center pt-8 pb-4 relative">
            <div class="relative">
              <span class="inline-block w-28 h-28 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center">
                <svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.25a8.38 8.38 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              </span>
              <span class="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow text-purple-600 border border-purple-300">
                <i class="fas fa-pen fa-sm"></i>
              </span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <h2 class="text-3xl font-extrabold text-center text-black">${customer.fullName || ''}</h2>
            </div>
            <p class="text-center text-black/80 text-base font-medium">${customer.personalEmail || ''}</p>
          </div>
          <div class="px-4 py-6 bg-[#F3F8FC] flex flex-col gap-4">
            ${notes.map((note, idx) => `
              <div class="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-black text-base">Note ${idx + 1}</span>
                  <span class="text-blue-500 font-bold">Value</span>
                </div>
                <div class="text-black/80 text-sm">${note}</div>
                <div class="flex justify-end mt-2">
                  <button class="px-4 py-1 bg-blue-200 text-blue-700 rounded-lg font-bold text-sm">Action</button>
                </div>
              </div>
            `).join('')}
            <div class="pt-4 pb-2">
              <button class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', customerNotesHtml);
  // Back button closes modal
  const backBtn = document.getElementById('customerNotesBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const modal = document.getElementById('customerNotesModalOverlay');
      if (modal) modal.remove();
    });
  }
}

// --- AUTO-INJECT MOBILE PROFILE ON CUSTOMER DETAILS PAGE (MOBILE ONLY) ---
if (window.location.pathname.includes('customer-details.html') && window.innerWidth < 768) {
  document.addEventListener('DOMContentLoaded', renderMobileProfile);
} 