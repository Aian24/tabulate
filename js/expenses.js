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

    // Expense Details Navigation (NEW)
    document.querySelectorAll('tbody tr').forEach(row => {
        row.classList.add('cursor-pointer');
        row.addEventListener('click', () => {
            // Collect data from the row's cells
            const cells = row.querySelectorAll('td');
            const expenseData = {
                status: cells[1]?.innerText.trim() || '',
                category: cells[2]?.innerText.trim() || '',
                vendor: cells[3]?.innerText.trim() || '',
                department: cells[4]?.innerText.trim() || '',
                employee: cells[5]?.innerText.trim() || '',
                amount: (cells[6]?.innerText.trim() || '').replace('$',''),
                date: cells[7]?.innerText.trim() || '',
                paymentMethod: 'Cash' // Placeholder, update if you have this data
            };
            // Store data in localStorage for retrieval in details page
            localStorage.setItem('selectedExpense', JSON.stringify(expenseData));
            // Navigate to the details page
            window.location.href = 'expenses-details.html';
        });
    });

    // Create Expense Modal Functionality
    const createExpenseButton = document.getElementById('createExpenseButton');
    const createExpenseModal = document.getElementById('createExpenseModal');
    const closeCreateExpenseModal = document.getElementById('closeCreateExpenseModal');

    if (createExpenseButton && createExpenseModal && closeCreateExpenseModal) {
        createExpenseButton.addEventListener('click', () => {
            createExpenseModal.classList.remove('hidden');
            createExpenseModal.classList.add('flex');
        });

        closeCreateExpenseModal.addEventListener('click', () => {
            createExpenseModal.classList.add('hidden');
            createExpenseModal.classList.remove('flex');
        });

        createExpenseModal.addEventListener('click', (e) => {
            if (e.target === createExpenseModal) {
                createExpenseModal.classList.add('hidden');
                createExpenseModal.classList.remove('flex');
            }
        });
    }

    // Initialize Flatpickr for Expense Date
    flatpickr("#expenseDate", {
        dateFormat: "m/d/Y",
        defaultDate: "06/12/2025"
    });

    // Handle file selection for upload images
    const uploadMultipleFiles = document.getElementById('uploadMultipleFiles');
    const selectedFilesSpan = document.getElementById('selectedFiles');

    if (uploadMultipleFiles && selectedFilesSpan) {
        uploadMultipleFiles.addEventListener('change', (event) => {
            if (event.target.files.length > 0) {
                const fileNames = Array.from(event.target.files).map(file => file.name).join(', ');
                selectedFilesSpan.textContent = fileNames;
            } else {
                selectedFilesSpan.textContent = 'No file chosen';
            }
        });
    }

    // Filter button active state logic (STATUS BUTTONS)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
            const filter = this.dataset.filter;
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                // Status is in td:nth-child(2) span
                const status = row.querySelector('td:nth-child(2) span')?.textContent.trim().toLowerCase();
                if (filter === 'all') {
                    row.style.display = '';
                } else {
                    row.style.display = status === filter ? '' : 'none';
                }
            });
        });
    });

    // --- FILTER MODAL LOGIC FOR EXPENSES ---
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the table
            const rows = document.querySelectorAll('table tbody tr');
            const statuses = new Set();
            const categories = new Set();
            const vendors = new Set();
            const departments = new Set();
            const employees = new Set();
            const prices = new Set();
            const dueDates = new Set();
            rows.forEach(row => {
                statuses.add(row.querySelector('td:nth-child(2) span')?.textContent.trim() || '');
                categories.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                vendors.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                departments.add(row.querySelector('td:nth-child(5)')?.textContent.trim() || '');
                employees.add(row.querySelector('td:nth-child(6)')?.textContent.trim() || '');
                prices.add(row.querySelector('td:nth-child(7)')?.textContent.trim() || '');
                dueDates.add(row.querySelector('td:nth-child(8)')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Filter Expenses</h3>
                        <button class="text-gray-500 hover:text-gray-700" id="closeFilterModal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select id="filterStatus" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(statuses).filter(Boolean).map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select id="filterCategory" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(categories).filter(Boolean).map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                            <select id="filterVendor" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(vendors).filter(Boolean).map(v => `<option value="${v}">${v}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                            <select id="filterDepartment" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(departments).filter(Boolean).map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                            <select id="filterEmployee" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(employees).filter(Boolean).map(e => `<option value="${e}">${e}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
                            <select id="filterPrice" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(prices).filter(Boolean).map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Recurring Due Date</label>
                            <select id="filterDueDate" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(dueDates).filter(Boolean).map(d => `<option value="${d}">${d}</option>`).join('')}
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
            setTimeout(() => { modal.querySelector('#filterStatus').focus(); }, 100);

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
                const status = modal.querySelector('#filterStatus').value;
                const category = modal.querySelector('#filterCategory').value;
                const vendor = modal.querySelector('#filterVendor').value;
                const department = modal.querySelector('#filterDepartment').value;
                const employee = modal.querySelector('#filterEmployee').value;
                const price = modal.querySelector('#filterPrice').value;
                const dueDate = modal.querySelector('#filterDueDate').value;
                rows.forEach(row => {
                    const rowStatus = row.querySelector('td:nth-child(2) span')?.textContent.trim() || '';
                    const rowCategory = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowVendor = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
                    const rowDepartment = row.querySelector('td:nth-child(5)')?.textContent.trim() || '';
                    const rowEmployee = row.querySelector('td:nth-child(6)')?.textContent.trim() || '';
                    const rowPrice = row.querySelector('td:nth-child(7)')?.textContent.trim() || '';
                    const rowDueDate = row.querySelector('td:nth-child(8)')?.textContent.trim() || '';
                    const match =
                        (!status || rowStatus === status) &&
                        (!category || rowCategory === category) &&
                        (!vendor || rowVendor === vendor) &&
                        (!department || rowDepartment === department) &&
                        (!employee || rowEmployee === employee) &&
                        (!price || rowPrice === price) &&
                        (!dueDate || rowDueDate === dueDate);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }
}); 