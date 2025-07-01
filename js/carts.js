document.addEventListener('DOMContentLoaded', function() {
    // Initialize drag and drop for table columns
    const table = document.querySelector('table');
    if (!table) return;
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

    // --- FILTER BUTTON LOGIC FOR CARTS ---
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the table
            const rows = document.querySelectorAll('table tbody tr');
            const fullNames = new Set();
            const quantities = new Set();
            const types = new Set();
            const orderDates = new Set();
            rows.forEach(row => {
                fullNames.add(row.querySelector('td:nth-child(2)')?.textContent.trim() || '');
                quantities.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                types.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                orderDates.add(row.querySelector('td:nth-child(6)')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 w-[350px] max-w-[90vw]">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Filter Carts</h3>
                        <button class="text-gray-500 hover:text-gray-700" id="closeFilterModal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <select id="filterFullName" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Names</option>
                                ${Array.from(fullNames).filter(Boolean).map(n => `<option value="${n}">${n}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <select id="filterQuantity" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Quantities</option>
                                ${Array.from(quantities).filter(Boolean).map(q => `<option value="${q}">${q}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select id="filterType" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Types</option>
                                ${Array.from(types).filter(Boolean).map(t => `<option value="${t}">${t}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Order Date</label>
                            <select id="filterOrderDate" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Dates</option>
                                ${Array.from(orderDates).filter(Boolean).map(d => `<option value="${d}">${d}</option>`).join('')}
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
            setTimeout(() => { modal.querySelector('#filterFullName').focus(); }, 100);

            // Close modal
            modal.querySelector('#closeFilterModal').addEventListener('click', () => modal.remove());
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

            // Reset filter
            modal.querySelector('#resetFilter').addEventListener('click', () => {
                modal.querySelector('#filterFullName').value = '';
                modal.querySelector('#filterQuantity').value = '';
                modal.querySelector('#filterType').value = '';
                modal.querySelector('#filterOrderDate').value = '';
                // Show all rows
                rows.forEach(row => { row.style.display = ''; });
            });

            // Apply filter
            modal.querySelector('#applyFilter').addEventListener('click', () => {
                const fullName = modal.querySelector('#filterFullName').value;
                const quantity = modal.querySelector('#filterQuantity').value;
                const type = modal.querySelector('#filterType').value;
                const orderDate = modal.querySelector('#filterOrderDate').value;
                rows.forEach(row => {
                    const rowFullName = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                    const rowQuantity = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowType = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
                    const rowOrderDate = row.querySelector('td:nth-child(6)')?.textContent.trim() || '';
                    const match = (!fullName || rowFullName === fullName) && (!quantity || rowQuantity === quantity) && (!type || rowType === type) && (!orderDate || rowOrderDate === orderDate);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }

    // Developer: Add row click logic for carts table
    const cartsTableRows = document.querySelectorAll('table tbody tr');
    cartsTableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Prevent navigation if a checkbox or other interactive element is clicked
            if (e.target.closest('input[type="checkbox"]')) {
                return;
            }
            // Get the customer name from the row
            const customerName = row.querySelector('td:nth-child(2)').textContent.trim();
            // Redirect to carts-details.html with customer name as query param
            window.location.href = `carts-details.html?customer=${encodeURIComponent(customerName)}`;
        });
    });
});

// Developer: Logic for populating carts-details.html
(function() {
    // Only run on carts-details.html
    if (!window.location.pathname.endsWith('carts-details.html')) return;

    // Helper to get query param
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Dummy data for demonstration
    const cartsData = {
        'Jamie Dora': {
            customer: {
                fullName: 'Jamie Dora',
                phone: '(032) 415 8877',
                email: 'trixpy890@gmail.com',
                address: 'Pabahay 2000 Muzon, San Jose Del Monte, Bulacan, Philippines 3023',
                orderDate: 'May 6, 2025'
            },
            services: [
                { name: 'Garden Landscaping Package', price: '$200.00' }
            ],
            totalPrice: '$200.00'
        },
        // Add more dummy carts as needed
    };

    // Get customer name from query string
    const customerName = getQueryParam('customer');
    if (!customerName || !cartsData[customerName]) {
        document.getElementById('cartCustomerHeader').textContent = 'Cart Not Found';
        return;
    }
    const data = cartsData[customerName];

    // Populate header
    document.getElementById('cartCustomerHeader').textContent = `Cart for ${data.customer.fullName}`;
    // Populate customer info
    document.getElementById('cartCustomerFullName').textContent = data.customer.fullName;
    document.getElementById('cartCustomerPhone').textContent = data.customer.phone;
    document.getElementById('cartCustomerEmail').textContent = data.customer.email;
    document.getElementById('cartCustomerAddress').textContent = data.customer.address;
    document.getElementById('cartOrderDate').textContent = data.customer.orderDate;
    // Populate services
    const serviceItems = document.getElementById('cartServiceItems');
    serviceItems.innerHTML = '';
    data.services.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${item.name}</td>
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.price}</td>
        `;
        serviceItems.appendChild(row);
    });
    // Populate total price
    document.getElementById('cartTotalPrice').textContent = data.totalPrice;
})(); 