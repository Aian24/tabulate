// Path: js/estimates.js 

document.addEventListener('DOMContentLoaded', function() {
    // Remove modal-related code
    // Add click event to each row in the estimates table to navigate to estimate-details.html
    const estimatesTableRows = document.querySelectorAll('table tbody tr');
    estimatesTableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Prevent navigation if a checkbox or other interactive element is clicked
            if (e.target.closest('input[type="checkbox"]')) {
                return;
            }
            // Get the estimate number from the row (remove # if present)
            const estimateNumber = row.querySelector('td:nth-child(2)').textContent.trim().replace('#', '');
            // Redirect to estimate-details.html with estimate number as query param
            window.location.href = `estimate-details.html?estimate=${encodeURIComponent(estimateNumber)}`;
        });
    });

    // Initialize drag and drop for table columns
    const table = document.querySelector('table');
    const headers = table.querySelectorAll('th.draggable-header');
    let draggedHeader = null;

    headers.forEach(header => {
        header.addEventListener('dragstart', (e) => {
            draggedHeader = header;
            header.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', header.dataset.column);
        });

        header.addEventListener('dragend', () => {
            header.classList.remove('dragging');
            headers.forEach(h => h.classList.remove('column-drop-target'));
        });

        header.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            headers.forEach(h => h.classList.remove('column-drop-target'));
            if (header !== draggedHeader) {
                header.classList.add('column-drop-target');
            }
        });

        header.addEventListener('dragleave', () => {
            header.classList.remove('column-drop-target');
        });

        header.addEventListener('drop', (e) => {
            e.preventDefault();
            const sourceColumn = e.dataTransfer.getData('text/plain');
            const targetColumn = header.dataset.column;
            
            if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
                const sourceIndex = Array.from(headers).findIndex(h => h.dataset.column === sourceColumn);
                const targetIndex = Array.from(headers).findIndex(h => h.dataset.column === targetColumn);
                
                // Reorder headers
                const headerRow = table.querySelector('thead tr');
                const sourceHeader = headerRow.children[sourceIndex + 1]; // +1 for checkbox column
                const targetHeader = headerRow.children[targetIndex + 1]; // +1 for checkbox column
                
                if (sourceIndex < targetIndex) {
                    targetHeader.parentNode.insertBefore(sourceHeader, targetHeader.nextSibling);
                } else {
                    targetHeader.parentNode.insertBefore(sourceHeader, targetHeader);
                }
                
                // Reorder data cells in each row
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const sourceCell = row.children[sourceIndex + 1]; // +1 for checkbox column
                    const targetCell = row.children[targetIndex + 1]; // +1 for checkbox column
                    
                    if (sourceIndex < targetIndex) {
                        targetCell.parentNode.insertBefore(sourceCell, targetCell.nextSibling);
                    } else {
                        targetCell.parentNode.insertBefore(sourceCell, targetCell);
                    }
                });
            }
            
            headers.forEach(h => h.classList.remove('column-drop-target'));
        });
    });

    // Add CSS for drag and drop visual feedback
    const style = document.createElement('style');
    style.textContent = `
        .dragging {
            opacity: 0.5;
        }
        .column-drop-target {
            border-left: 2px solid #3b82f6;
        }
        .draggable-header {
            cursor: move;
        }
    `;
    document.head.appendChild(style);

    // Actions dropdown functionality
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');
    const estimateModal = document.getElementById('estimateModal');
    const createEstimateBtn = document.getElementById('createEstimate');
    const closeEstimateModal = document.getElementById('closeEstimateModal');
    const cancelEstimateBtn = document.getElementById('cancelEstimateBtn');

    // Toggle actions menu
    if (actionsDropdown && actionsMenu && moreMenu) {
        actionsDropdown.addEventListener('click', () => {
            actionsMenu.classList.toggle('hidden');
            moreMenu.classList.add('hidden');
        });
    }

    // Toggle more menu
    if (moreDropdown && moreMenu && actionsMenu) {
        moreDropdown.addEventListener('click', () => {
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

    // Open estimate modal
    if (createEstimateBtn && estimateModal && actionsMenu) {
        createEstimateBtn.addEventListener('click', () => {
            estimateModal.classList.remove('hidden');
            estimateModal.classList.add('flex');
            actionsMenu.classList.add('hidden');
        });
    }

    // Close estimate modal
    const closeModal = () => {
        if (estimateModal) {
            estimateModal.classList.add('hidden');
            estimateModal.classList.remove('flex');
        }
    };

    if (closeEstimateModal) {
        closeEstimateModal.addEventListener('click', closeModal);
    }
    if (cancelEstimateBtn) {
        cancelEstimateBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (estimateModal) {
        estimateModal.addEventListener('click', (e) => {
            if (e.target === estimateModal) {
                closeModal();
            }
        });
    }

    // Add estimate item functionality
    const addItemBtn = document.getElementById('addItem');
    const estimateItems = document.getElementById('estimateItems');
    let itemCount = 0;

    if (addItemBtn && estimateItems) {
        addItemBtn.addEventListener('click', () => {
            itemCount++;
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="px-4 py-2">${itemCount}</td>
                <td class="px-4 py-2">
                    <select class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="">Select service</option>
                    </select>
                </td>
                <td class="px-4 py-2">
                    <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
                </td>
                <td class="px-4 py-2">
                    <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                </td>
                <td class="px-4 py-2">
                    <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
                </td>
                <td class="px-4 py-2">
                    <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
                </td>
                <td class="px-4 py-2">
                    <input type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                </td>
                <td class="px-4 py-2">
                    <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
                </td>
                <td class="px-4 py-2">
                    <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
                </td>
                <td class="px-4 py-2">
                    <span class="font-medium">$0.00</span>
                </td>
                <td class="px-4 py-2">
                    <input type="file" class="w-full" accept="image/*">
                </td>
                <td class="px-4 py-2">
                    <button type="button" class="text-red-500 hover:text-red-700" onclick="this.closest('tr').remove();">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            estimateItems.appendChild(newRow);
        });
    }

    // Add click event to table rows to show estimate details
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', (e) => {
            // Don't trigger if clicking on checkbox or action buttons
            if (e.target.type === 'checkbox' || e.target.closest('button')) {
                return;
            }
            // Show estimate details modal
            const estimateDetailsModal = document.getElementById('estimateDetailsModal');
            estimateDetailsModal.classList.remove('hidden');
            estimateDetailsModal.classList.add('flex');
        });
    });

    // --- FILTER BUTTON LOGIC FOR ESTIMATES ---
    // This block creates a filter modal and filters table rows based on selected criteria.
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the table
            const rows = document.querySelectorAll('table tbody tr');
            const customers = new Set();
            const statuses = new Set();
            const categories = new Set();
            rows.forEach(row => {
                customers.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                statuses.add(row.querySelector('td:nth-child(9) span')?.textContent.trim() || '');
                categories.add(row.querySelector('td:nth-child(8)')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 w-[350px] max-w-[90vw]">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Filter Estimates</h3>
                        <button class="text-gray-500 hover:text-gray-700" id="closeFilterModal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                            <select id="filterCustomer" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Customers</option>
                                ${Array.from(customers).filter(Boolean).map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select id="filterStatus" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Statuses</option>
                                ${Array.from(statuses).filter(Boolean).map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select id="filterCategory" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Categories</option>
                                ${Array.from(categories).filter(Boolean).map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" id="resetFilter">Reset</button>
                        <button class="px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600 rounded transition-colors" id="applyFilter">Apply</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Focus the first dropdown for accessibility
            setTimeout(() => { modal.querySelector('#filterCustomer').focus(); }, 100);

            // Close modal
            modal.querySelector('#closeFilterModal').addEventListener('click', () => modal.remove());
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

            // Reset filter
            modal.querySelector('#resetFilter').addEventListener('click', () => {
                modal.querySelector('#filterCustomer').value = '';
                modal.querySelector('#filterStatus').value = '';
                modal.querySelector('#filterCategory').value = '';
                // Show all rows
                rows.forEach(row => { row.style.display = ''; });
            });

            // Apply filter
            modal.querySelector('#applyFilter').addEventListener('click', () => {
                const customer = modal.querySelector('#filterCustomer').value;
                const status = modal.querySelector('#filterStatus').value;
                const category = modal.querySelector('#filterCategory').value;
                rows.forEach(row => {
                    const rowCustomer = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowStatus = row.querySelector('td:nth-child(9) span')?.textContent.trim() || '';
                    const rowCategory = row.querySelector('td:nth-child(8)')?.textContent.trim() || '';
                    const match = (!customer || rowCustomer === customer) && (!status || rowStatus === status) && (!category || rowCategory === category);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }
});

// Developer: Logic for populating estimate-details.html
(function() {
    // Only run on estimate-details.html
    if (!window.location.pathname.endsWith('estimate-details.html')) return;

    // Helper to get query param
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Dummy data for demonstration
    const estimatesData = {
        '1013': {
            estimateNumber: '1013',
            customer: {
                fullName: 'Jamie Dora',
                phone: '(032) 415 8877',
                email: 'trixpy890@gmail.com',
                address: 'Pabahay 2000 Muzon'
            },
            quotation: {
                items: [
                    { name: 'Plumbing Repair', price: '$ 932.40', quantity: '1', discount: '$ 0.00', tax: '$ 9.23', depositPercentage: '10 %', depositAmount: '$93.24', totalPrice: '$ 932.40' },
                    { name: 'Electrical Installation Package', price: '$ 6,230.00', quantity: '1', discount: '$ 0.00', tax: '$ 61.68', depositPercentage: '10 %', depositAmount: '$623.00', totalPrice: '$ 6,230.00' }
                ],
                grandTotal: '$ 7,162.40'
            },
            termsAndConditions: [
                'Plumbing Repair: Emergency repairs may incur extra charges.',
                'Electrical Installation: Materials charged separately; permits by client.',
                'Roofing Installation: Includes labor; material price subject to change.'
            ]
        },
        '1014': {
            estimateNumber: '1014',
            customer: {
                fullName: 'Alex Cruz',
                phone: '(032) 123 4567',
                email: 'alex.cruz@email.com',
                address: 'Greenfields Subd.'
            },
            quotation: {
                items: [
                    { name: 'Wiring Service', price: '$ 1,500.00', quantity: '1', discount: '$ 0.00', tax: '$ 15.00', depositPercentage: '20 %', depositAmount: '$300.00', totalPrice: '$ 1,500.00' },
                    { name: 'Panel Upgrade', price: '$ 1,000.00', quantity: '1', discount: '$ 0.00', tax: '$ 10.00', depositPercentage: '20 %', depositAmount: '$200.00', totalPrice: '$ 1,000.00' }
                ],
                grandTotal: '$ 2,500.00'
            },
            termsAndConditions: [
                'Wiring Service: Includes basic wiring only.',
                'Panel Upgrade: Does not include permit fees.'
            ]
        },
        '1015': {
            estimateNumber: '1015',
            customer: {
                fullName: 'Maria Lopez',
                phone: '(032) 765 4321',
                email: 'maria.lopez@email.com',
                address: 'Sunrise Villas'
            },
            quotation: {
                items: [
                    { name: 'Pipe Replacement', price: '$ 2,800.00', quantity: '1', discount: '$ 0.00', tax: '$ 28.00', depositPercentage: '15 %', depositAmount: '$420.00', totalPrice: '$ 2,800.00' },
                    { name: 'Leak Fix', price: '$ 2,000.00', quantity: '1', discount: '$ 0.00', tax: '$ 20.00', depositPercentage: '15 %', depositAmount: '$300.00', totalPrice: '$ 2,000.00' }
                ],
                grandTotal: '$ 4,800.00'
            },
            termsAndConditions: [
                'Pipe Replacement: Warranty for 1 year.',
                'Leak Fix: Emergency service surcharge applies.'
            ]
        }
        // Add more dummy estimates as needed
    };

    // Get estimate number from query string
    const estimateNumber = getQueryParam('estimate');
    if (!estimateNumber || !estimatesData[estimateNumber]) {
        document.getElementById('estimateNumberHeader').textContent = 'Estimate Not Found';
        return;
    }
    const data = estimatesData[estimateNumber];

    // Populate header
    document.getElementById('estimateNumberHeader').textContent = `Estimate #${data.estimateNumber}`;
    // Populate customer info
    document.getElementById('customerFullName').textContent = data.customer.fullName;
    document.getElementById('customerPhone').textContent = data.customer.phone;
    document.getElementById('customerEmail').textContent = data.customer.email;
    document.getElementById('customerAddress').textContent = data.customer.address;
    // Populate quotation items
    const quotationItems = document.getElementById('quotationItems');
    quotationItems.innerHTML = '';
    data.quotation.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${item.name}</td>
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.price}</td>
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.quantity}</td>
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.discount}</td>
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.tax}</td>
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.depositPercentage}</td>
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.depositAmount}</td>
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.totalPrice}</td>
        `;
        quotationItems.appendChild(row);
    });
    // Populate grand total
    document.getElementById('grandTotal').textContent = data.quotation.grandTotal;
    // Populate terms and conditions
    const termsDiv = document.getElementById('termsAndConditions');
    termsDiv.innerHTML = '';
    data.termsAndConditions.forEach(term => {
        const p = document.createElement('p');
        p.textContent = term;
        termsDiv.appendChild(p);
    });
})();

// =============================
// Deleted Estimates Logic
// =============================
if (window.location.pathname.includes('deleted-estimates.html')) {
    // Sample deleted estimates data (based on estimates.html)
    let deletedEstimates = [
        { number: '#1013', customer: 'Jamie Dora', created: 'March 19, 2025', sent: 'N/A', price: '$ 7,162.40', address: 'Pabahay 2000 Muzon', category: 'No category available', status: 'Pending' },
        { number: '#1014', customer: 'Alex Cruz', created: 'March 20, 2025', sent: 'March 21, 2025', price: '$ 2,500.00', address: 'Greenfields Subd.', category: 'Electrical', status: 'Approved' },
        { number: '#1015', customer: 'Maria Lopez', created: 'March 22, 2025', sent: 'N/A', price: '$ 4,800.00', address: 'Sunrise Villas', category: 'Plumbing', status: 'Rejected' },
    ];
    let selectedEstimates = new Set();
    let restoreIdx = null;

    // Render desktop table
    function renderDeletedEstimatesTable() {
        const tbody = document.getElementById('deleted-estimates-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        deletedEstimates.forEach((est, idx) => {
            let statusColor = est.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : est.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4"><input type="checkbox" class="estimate-checkbox w-4 h-4 text-purple-600 rounded focus:ring-purple-500" data-idx="${idx}"></td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">${est.number}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${est.customer}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${est.created}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${est.sent}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${est.price}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${est.address}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${est.category}</td>
                <td class="px-6 py-4"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}">${est.status}</span></td>
                <td class="px-6 py-4"><button class="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors restore-btn" data-idx="${idx}"><i class="fas fa-undo-alt mr-1"></i> Restore</button></td>
            `;
            tbody.appendChild(tr);
        });
        // Attach checkbox listeners
        tbody.querySelectorAll('.estimate-checkbox').forEach(cb => {
            cb.addEventListener('change', function(e) {
                const idx = parseInt(this.getAttribute('data-idx'));
                if (this.checked) selectedEstimates.add(idx);
                else selectedEstimates.delete(idx);
                updateRestoreButtonVisibility();
                updateSelectAllCheckbox();
            });
        });
        // Attach restore button listeners
        tbody.querySelectorAll('.restore-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                restoreIdx = parseInt(this.getAttribute('data-idx'));
                showRestoreEstimateModal();
            });
        });
    }

    // Render mobile cards
    function renderDeletedEstimatesMobileCards() {
        const container = document.getElementById('deleted-estimates-mobile-cards');
        if (!container) return;
        container.innerHTML = '';
        deletedEstimates.forEach((est, idx) => {
            let statusColor = est.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : est.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
            const card = document.createElement('div');
            card.className = 'mobile-table-row bg-white rounded-lg border border-gray-100';
            card.innerHTML = `
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" class="estimate-checkbox w-4 h-4 text-purple-600 rounded focus:ring-purple-500" data-idx="${idx}">
                        <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">${est.number.replace('#','')}</div>
                        <div>
                            <h3 class="font-semibold text-gray-900 text-sm">${est.customer}</h3>
                            <p class="text-xs text-gray-500">${est.price}</p>
                        </div>
                    </div>
                    <span class="mobile-status ${statusColor} text-xs">${est.status}</span>
                </div>
                <div class="space-y-1 text-xs">
                    <div><span class="text-gray-500">Estimate #:</span><span class="text-gray-900">${est.number}</span></div>
                    <div><span class="text-gray-500">Created:</span><span class="text-gray-900">${est.created}</span></div>
                    <div><span class="text-gray-500">Sent:</span><span class="text-gray-900">${est.sent}</span></div>
                    <div><span class="text-gray-500">Address:</span><span class="text-gray-900">${est.address}</span></div>
                    <div><span class="text-gray-500">Category:</span><span class="text-gray-900">${est.category}</span></div>
                </div>
                <div class="mt-1 flex justify-between items-center">
                    <div><span class="text-gray-500 text-xs">Status:</span><span class="text-gray-900 text-xs">${est.status}</span></div>
                    <button class="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors restore-btn" data-idx="${idx}"><i class="fas fa-undo-alt mr-1"></i> Restore</button>
                </div>
            `;
            container.appendChild(card);
        });
        // Attach checkbox listeners
        container.querySelectorAll('.estimate-checkbox').forEach(cb => {
            cb.addEventListener('change', function(e) {
                const idx = parseInt(this.getAttribute('data-idx'));
                if (this.checked) selectedEstimates.add(idx);
                else selectedEstimates.delete(idx);
                updateRestoreButtonVisibility();
                updateSelectAllCheckbox();
            });
        });
        // Attach restore button listeners
        container.querySelectorAll('.restore-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                restoreIdx = parseInt(this.getAttribute('data-idx'));
                showRestoreEstimateModal();
            });
        });
    }

    // Update restore selected button visibility
    function updateRestoreButtonVisibility() {
        const btn = document.getElementById('restoreSelectedEstimatesBtn');
        const btnMobile = document.getElementById('restoreSelectedEstimatesBtnMobile');
        if (btn) btn.classList.toggle('hidden', selectedEstimates.size === 0);
        if (btnMobile) btnMobile.disabled = selectedEstimates.size === 0;
        if (btnMobile) btnMobile.classList.toggle('opacity-50', selectedEstimates.size === 0);
    }

    // Update select all checkbox
    function updateSelectAllCheckbox() {
        const selectAll = document.getElementById('selectAllDeletedEstimates');
        const checkboxes = document.querySelectorAll('.estimate-checkbox');
        if (!selectAll) return;
        selectAll.checked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
        selectAll.indeterminate = !selectAll.checked && Array.from(checkboxes).some(cb => cb.checked);
    }

    // Select all logic
    const selectAll = document.getElementById('selectAllDeletedEstimates');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.estimate-checkbox');
            checkboxes.forEach((cb, idx) => {
                cb.checked = this.checked;
                if (this.checked) selectedEstimates.add(idx);
                else selectedEstimates.delete(idx);
            });
            updateRestoreButtonVisibility();
            updateSelectAllCheckbox();
        });
    }

    // Restore modals logic
    function showRestoreEstimateModal() {
        const modal = document.getElementById('restoreEstimateModal');
        if (!modal) return;
        modal.classList.remove('hidden');
        setTimeout(() => modal.querySelector('.modal-content-modern').classList.add('show'), 10);
    }
    function hideRestoreEstimateModal() {
        const modal = document.getElementById('restoreEstimateModal');
        if (!modal) return;
        modal.querySelector('.modal-content-modern').classList.remove('show');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
    function showRestoreSelectedEstimatesModal() {
        const modal = document.getElementById('restoreSelectedEstimatesModal');
        if (!modal) return;
        modal.classList.remove('hidden');
        setTimeout(() => modal.querySelector('.modal-content-modern').classList.add('show'), 10);
    }
    function hideRestoreSelectedEstimatesModal() {
        const modal = document.getElementById('restoreSelectedEstimatesModal');
        if (!modal) return;
        modal.querySelector('.modal-content-modern').classList.remove('show');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    // Restore single estimate
    document.getElementById('cancelRestoreEstimate')?.addEventListener('click', hideRestoreEstimateModal);
    document.getElementById('confirmRestoreEstimate')?.addEventListener('click', function() {
        if (restoreIdx !== null) {
            deletedEstimates.splice(restoreIdx, 1);
            selectedEstimates.delete(restoreIdx);
            restoreIdx = null;
            renderDeletedEstimatesTable();
            renderDeletedEstimatesMobileCards();
            updateRestoreButtonVisibility();
            updateSelectAllCheckbox();
        }
        hideRestoreEstimateModal();
    });

    // Restore selected estimates
    document.getElementById('restoreSelectedEstimatesBtn')?.addEventListener('click', function() {
        if (selectedEstimates.size > 0) showRestoreSelectedEstimatesModal();
    });
    document.getElementById('restoreSelectedEstimatesBtnMobile')?.addEventListener('click', function() {
        if (selectedEstimates.size > 0) showRestoreSelectedEstimatesModal();
    });
    document.getElementById('cancelRestoreSelectedEstimates')?.addEventListener('click', hideRestoreSelectedEstimatesModal);
    document.getElementById('confirmRestoreSelectedEstimates')?.addEventListener('click', function() {
        deletedEstimates = deletedEstimates.filter((est, idx) => !selectedEstimates.has(idx));
        selectedEstimates.clear();
        renderDeletedEstimatesTable();
        renderDeletedEstimatesMobileCards();
        updateRestoreButtonVisibility();
        updateSelectAllCheckbox();
        hideRestoreSelectedEstimatesModal();
    });

    // Initial render
    renderDeletedEstimatesTable();
    renderDeletedEstimatesMobileCards();
    updateRestoreButtonVisibility();
    updateSelectAllCheckbox();
} 