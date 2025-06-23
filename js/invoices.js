document.addEventListener('DOMContentLoaded', function() {
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

    // Toggle actions menu
    actionsDropdown.addEventListener('click', () => {
        actionsMenu.classList.toggle('hidden');
        moreMenu.classList.add('hidden');
    });

    // Toggle more menu
    moreDropdown.addEventListener('click', () => {
        moreMenu.classList.toggle('hidden');
        actionsMenu.classList.add('hidden');
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!actionsDropdown.contains(e.target) && !moreDropdown.contains(e.target)) {
            actionsMenu.classList.add('hidden');
            moreMenu.classList.add('hidden');
        }
    });

    // Invoice Details Modal Functionality
    const invoiceDetailsModal = document.getElementById('invoiceDetailsModal');
    const closeInvoiceModal = document.getElementById('closeInvoiceModal');

    // Make all rows clickable
    document.querySelectorAll('tbody tr').forEach(row => {
        row.classList.add('cursor-pointer');
        row.addEventListener('click', () => {
            const cells = row.querySelectorAll('td');
            const invoiceNumber = cells[1].textContent;
            const address = cells[2].textContent;
            const dateSent = cells[3].textContent;
            const total = cells[4].textContent;
            const dateCreated = cells[6].textContent;
            const balance = cells[7].textContent;
            const lastPayment = cells[8].textContent;
            const status = cells[9].querySelector('span').textContent;

            // Format address to show in two lines
            const addressParts = address.split(',');
            const formattedAddress = addressParts.length > 1 
                ? `${addressParts[0]},\n${addressParts.slice(1).join(',').trim()}`
                : address;

            // Set the invoice details
            document.getElementById('invoiceNumber').textContent = `Invoice # ${invoiceNumber}`;
            document.getElementById('customerName').textContent = 'Paget Zowie'; // This should come from your data
            document.getElementById('customerPhone').textContent = '09234234234'; // This should come from your data
            document.getElementById('customerEmail').textContent = 'dabidbell5656@gmail.com'; // This should come from your data
            document.getElementById('customerAddress').textContent = formattedAddress;
            document.getElementById('invoiceDateCreated').textContent = dateCreated;
            document.getElementById('invoiceDateSent').textContent = dateSent;
            document.getElementById('invoiceTotal').textContent = total;
            document.getElementById('invoiceStatus').textContent = status;
            document.getElementById('invoiceStatus').className = `mt-1 text-sm inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'Paid' ? 'bg-blue-100 text-blue-800' : status === 'Unpaid' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`;
            
            // Set payment history details
            document.getElementById('lastPaymentDate').textContent = lastPayment;
            document.getElementById('lastPaymentAmount').textContent = total;
            document.getElementById('paymentMethod').textContent = 'Cash'; // This should come from your data
            document.getElementById('remainingBalance').textContent = balance;

            // Show the modal
            invoiceDetailsModal.classList.remove('hidden');
            invoiceDetailsModal.classList.add('flex');
        });
    });

    // Close modal
    closeInvoiceModal.addEventListener('click', () => {
        invoiceDetailsModal.classList.add('hidden');
        invoiceDetailsModal.classList.remove('flex');
    });

    // Close modal when clicking outside
    invoiceDetailsModal.addEventListener('click', (e) => {
        if (e.target === invoiceDetailsModal) {
            invoiceDetailsModal.classList.add('hidden');
            invoiceDetailsModal.classList.remove('flex');
        }
    });

    // Filter button active state logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
            const filter = this.dataset.filter;
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const status = row.querySelector('td:last-child span')?.textContent.trim().toLowerCase();
                if (filter === 'all') {
                    row.style.display = '';
                } else if (filter === 'partial') {
                    row.style.display = status === 'partial paid' ? '' : 'none';
                } else {
                    row.style.display = status === filter ? '' : 'none';
                }
            });
        });
    });

    // --- FILTER MODAL LOGIC FOR INVOICES ---
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the table
            const rows = document.querySelectorAll('table tbody tr');
            const invoiceNumbers = new Set();
            const addresses = new Set();
            const dateSents = new Set();
            const totals = new Set();
            const overdues = new Set();
            const dateCreateds = new Set();
            const balances = new Set();
            const lastPayments = new Set();
            const statuses = new Set();
            rows.forEach(row => {
                invoiceNumbers.add(row.querySelector('td:nth-child(2)')?.textContent.trim() || '');
                addresses.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                dateSents.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                totals.add(row.querySelector('td:nth-child(5)')?.textContent.trim() || '');
                overdues.add(row.querySelector('td:nth-child(6)')?.textContent.trim() || '');
                dateCreateds.add(row.querySelector('td:nth-child(7)')?.textContent.trim() || '');
                balances.add(row.querySelector('td:nth-child(8)')?.textContent.trim() || '');
                lastPayments.add(row.querySelector('td:nth-child(9)')?.textContent.trim() || '');
                statuses.add(row.querySelector('td:nth-child(10) span')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Filter Invoices</h3>
                        <button class="text-gray-500 hover:text-gray-700" id="closeFilterModal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Invoice #</label>
                            <select id="filterInvoiceNumber" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(invoiceNumbers).filter(Boolean).map(n => `<option value="${n}">${n}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <select id="filterAddress" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(addresses).filter(Boolean).map(a => `<option value="${a}">${a}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date Sent</label>
                            <select id="filterDateSent" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(dateSents).filter(Boolean).map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
                            <select id="filterTotal" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(totals).filter(Boolean).map(t => `<option value="${t}">${t}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Overdue</label>
                            <select id="filterOverdue" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(overdues).filter(Boolean).map(o => `<option value="${o}">${o}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date Created</label>
                            <select id="filterDateCreated" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(dateCreateds).filter(Boolean).map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Balance</label>
                            <select id="filterBalance" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(balances).filter(Boolean).map(b => `<option value="${b}">${b}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Last Payment</label>
                            <select id="filterLastPayment" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(lastPayments).filter(Boolean).map(l => `<option value="${l}">${l}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select id="filterStatus" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(statuses).filter(Boolean).map(s => `<option value="${s}">${s}</option>`).join('')}
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
            setTimeout(() => { modal.querySelector('#filterInvoiceNumber').focus(); }, 100);

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
                const invoiceNumber = modal.querySelector('#filterInvoiceNumber').value;
                const address = modal.querySelector('#filterAddress').value;
                const dateSent = modal.querySelector('#filterDateSent').value;
                const total = modal.querySelector('#filterTotal').value;
                const overdue = modal.querySelector('#filterOverdue').value;
                const dateCreated = modal.querySelector('#filterDateCreated').value;
                const balance = modal.querySelector('#filterBalance').value;
                const lastPayment = modal.querySelector('#filterLastPayment').value;
                const status = modal.querySelector('#filterStatus').value;
                rows.forEach(row => {
                    const rowInvoiceNumber = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                    const rowAddress = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowDateSent = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
                    const rowTotal = row.querySelector('td:nth-child(5)')?.textContent.trim() || '';
                    const rowOverdue = row.querySelector('td:nth-child(6)')?.textContent.trim() || '';
                    const rowDateCreated = row.querySelector('td:nth-child(7)')?.textContent.trim() || '';
                    const rowBalance = row.querySelector('td:nth-child(8)')?.textContent.trim() || '';
                    const rowLastPayment = row.querySelector('td:nth-child(9)')?.textContent.trim() || '';
                    const rowStatus = row.querySelector('td:nth-child(10) span')?.textContent.trim() || '';
                    const match =
                        (!invoiceNumber || rowInvoiceNumber === invoiceNumber) &&
                        (!address || rowAddress === address) &&
                        (!dateSent || rowDateSent === dateSent) &&
                        (!total || rowTotal === total) &&
                        (!overdue || rowOverdue === overdue) &&
                        (!dateCreated || rowDateCreated === dateCreated) &&
                        (!balance || rowBalance === balance) &&
                        (!lastPayment || rowLastPayment === lastPayment) &&
                        (!status || rowStatus === status);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }
}); 