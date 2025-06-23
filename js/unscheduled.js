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

    // --- FILTER BUTTON LOGIC FOR UNSCHEDULED ---
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the table
            const rows = document.querySelectorAll('table tbody tr');
            const jobIds = new Set();
            const serviceTypes = new Set();
            const requestDates = new Set();
            const priorities = new Set();
            const durations = new Set();
            const locations = new Set();
            const clientNames = new Set();
            const statuses = new Set();
            rows.forEach(row => {
                jobIds.add(row.querySelector('td:nth-child(2)')?.textContent.trim() || '');
                serviceTypes.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                requestDates.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                priorities.add(row.querySelector('td:nth-child(5) span')?.textContent.trim() || '');
                durations.add(row.querySelector('td:nth-child(6)')?.textContent.trim() || '');
                locations.add(row.querySelector('td:nth-child(7)')?.textContent.trim() || '');
                clientNames.add(row.querySelector('td:nth-child(8)')?.textContent.trim() || '');
                statuses.add(row.querySelector('td:nth-child(9) span')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Filter Unscheduled</h3>
                        <button class="text-gray-500 hover:text-gray-700" id="closeFilterModal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Job ID</label>
                            <select id="filterJobId" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Job IDs</option>
                                ${Array.from(jobIds).filter(Boolean).map(j => `<option value="${j}">${j}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                            <select id="filterServiceType" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Types</option>
                                ${Array.from(serviceTypes).filter(Boolean).map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Request Date</label>
                            <select id="filterRequestDate" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Dates</option>
                                ${Array.from(requestDates).filter(Boolean).map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select id="filterPriority" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Priorities</option>
                                ${Array.from(priorities).filter(Boolean).map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Est. Duration</label>
                            <select id="filterDuration" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Durations</option>
                                ${Array.from(durations).filter(Boolean).map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <select id="filterLocation" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Locations</option>
                                ${Array.from(locations).filter(Boolean).map(l => `<option value="${l}">${l}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                            <select id="filterClientName" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Clients</option>
                                ${Array.from(clientNames).filter(Boolean).map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select id="filterStatus" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Statuses</option>
                                ${Array.from(statuses).filter(Boolean).map(s => `<option value="${s}">${s}</option>`).join('')}
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
            setTimeout(() => { modal.querySelector('#filterJobId').focus(); }, 100);

            // Close modal
            modal.querySelector('#closeFilterModal').addEventListener('click', () => modal.remove());
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

            // Reset filter
            modal.querySelector('#resetFilter').addEventListener('click', () => {
                modal.querySelector('#filterJobId').value = '';
                modal.querySelector('#filterServiceType').value = '';
                modal.querySelector('#filterRequestDate').value = '';
                modal.querySelector('#filterPriority').value = '';
                modal.querySelector('#filterDuration').value = '';
                modal.querySelector('#filterLocation').value = '';
                modal.querySelector('#filterClientName').value = '';
                modal.querySelector('#filterStatus').value = '';
                // Show all rows
                rows.forEach(row => { row.style.display = ''; });
            });

            // Apply filter
            modal.querySelector('#applyFilter').addEventListener('click', () => {
                const jobId = modal.querySelector('#filterJobId').value;
                const serviceType = modal.querySelector('#filterServiceType').value;
                const requestDate = modal.querySelector('#filterRequestDate').value;
                const priority = modal.querySelector('#filterPriority').value;
                const duration = modal.querySelector('#filterDuration').value;
                const location = modal.querySelector('#filterLocation').value;
                const clientName = modal.querySelector('#filterClientName').value;
                const status = modal.querySelector('#filterStatus').value;
                rows.forEach(row => {
                    const rowJobId = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                    const rowServiceType = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowRequestDate = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
                    const rowPriority = row.querySelector('td:nth-child(5) span')?.textContent.trim() || '';
                    const rowDuration = row.querySelector('td:nth-child(6)')?.textContent.trim() || '';
                    const rowLocation = row.querySelector('td:nth-child(7)')?.textContent.trim() || '';
                    const rowClientName = row.querySelector('td:nth-child(8)')?.textContent.trim() || '';
                    const rowStatus = row.querySelector('td:nth-child(9) span')?.textContent.trim() || '';
                    const match =
                        (!jobId || rowJobId === jobId) &&
                        (!serviceType || rowServiceType === serviceType) &&
                        (!requestDate || rowRequestDate === requestDate) &&
                        (!priority || rowPriority === priority) &&
                        (!duration || rowDuration === duration) &&
                        (!location || rowLocation === location) &&
                        (!clientName || rowClientName === clientName) &&
                        (!status || rowStatus === status);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }
}); 