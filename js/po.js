document.addEventListener('DOMContentLoaded', function() {
    // Drag and drop for table columns
    const table = document.querySelector('table');
    if (table) {
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
                    const headerRow = table.querySelector('thead tr');
                    const sourceHeader = headerRow.children[sourceIndex + 1];
                    const targetHeader = headerRow.children[targetIndex + 1];
                    if (sourceIndex < targetIndex) {
                        targetHeader.parentNode.insertBefore(sourceHeader, targetHeader.nextSibling);
                    } else {
                        targetHeader.parentNode.insertBefore(sourceHeader, targetHeader);
                    }
                    const rows = table.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        const sourceCell = row.children[sourceIndex + 1];
                        const targetCell = row.children[targetIndex + 1];
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
            .dragging { opacity: 0.5; }
            .column-drop-target { border-left: 2px solid #3b82f6; }
            .draggable-header { cursor: move; }
        `;
        document.head.appendChild(style);
    }

    // Actions dropdown functionality
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');
    if (actionsDropdown && actionsMenu && moreDropdown && moreMenu) {
        actionsDropdown.addEventListener('click', () => {
            actionsMenu.classList.toggle('hidden');
            moreMenu.classList.add('hidden');
        });
        moreDropdown.addEventListener('click', () => {
            moreMenu.classList.toggle('hidden');
            actionsMenu.classList.add('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!actionsDropdown.contains(e.target) && !moreDropdown.contains(e.target)) {
                actionsMenu.classList.add('hidden');
                moreMenu.classList.add('hidden');
            }
        });
    }

    // Invoice Details Modal Functionality
    const invoiceDetailsModal = document.getElementById('invoiceDetailsModal');
    const closeInvoiceModal = document.getElementById('closeInvoiceModal');
    if (invoiceDetailsModal && closeInvoiceModal) {
        document.querySelectorAll('tbody tr').forEach(row => {
            row.classList.add('cursor-pointer');
            row.addEventListener('click', () => {
                const cells = row.querySelectorAll('td');
                // Defensive: check if enough cells exist
                if (cells.length < 6) return;
                const invoiceNumber = cells[1].textContent;
                const address = cells[2].textContent;
                const dateSent = cells[3].textContent;
                const total = cells[4].textContent;
                // The rest are not present in po.html, so skip them
                // Set the invoice details (defensive)
                const invoiceNumberEl = document.getElementById('invoiceNumber');
                if (invoiceNumberEl) invoiceNumberEl.textContent = `Invoice # ${invoiceNumber}`;
                // ... add more defensive assignments as needed ...
                invoiceDetailsModal.classList.remove('hidden');
                invoiceDetailsModal.classList.add('flex');
            });
        });
        closeInvoiceModal.addEventListener('click', () => {
            invoiceDetailsModal.classList.add('hidden');
            invoiceDetailsModal.classList.remove('flex');
        });
        invoiceDetailsModal.addEventListener('click', (e) => {
            if (e.target === invoiceDetailsModal) {
                invoiceDetailsModal.classList.add('hidden');
                invoiceDetailsModal.classList.remove('flex');
            }
        });
    }

    // Flatpickr initializations
    if (document.getElementById('orderDate')) {
        flatpickr("#orderDate", { dateFormat: "m/d/Y", defaultDate: new Date() });
    }
    if (document.getElementById('receivedDate')) {
        flatpickr("#receivedDate", { dateFormat: "m/d/Y", defaultDate: new Date() });
    }
    if (document.getElementById('paidDate')) {
        flatpickr("#paidDate", { dateFormat: "m/d/Y", defaultDate: new Date() });
    }
    if (document.getElementById('deliveryDate')) {
        flatpickr("#deliveryDate", { dateFormat: "m/d/Y", defaultDate: new Date() });
    }

    // File upload
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

    // Only run this block if #createPOModal exists
    const createPOModal = document.getElementById('createPOModal');
    if (createPOModal) {
        const itemsTableBody = createPOModal.querySelector('.min-w-full tbody');
        if (itemsTableBody) {
            itemsTableBody.querySelectorAll('tr').forEach(addItemEventListeners);
        }
        const addAnotherItemButton = createPOModal.querySelector('button.mt-4');
        if (addAnotherItemButton && itemsTableBody) {
            addAnotherItemButton.addEventListener('click', (e) => {
                e.preventDefault();
                const firstRow = itemsTableBody.querySelector('tr');
                if (firstRow) {
                    const newRow = firstRow.cloneNode(true);
                    newRow.querySelectorAll('input').forEach(input => {
                        if (input.type === 'checkbox') {
                            input.checked = false;
                        } else if (input.type === 'number') {
                            input.value = '0';
                        } else {
                            input.value = '';
                        }
                    });
                    newRow.querySelector('td:nth-child(9)').textContent = '0.00';
                    itemsTableBody.appendChild(newRow);
                    addItemEventListeners(newRow);
                    updateOverallTotals();
                }
            });
        }
        if (typeof updateOverallTotals === 'function') updateOverallTotals();
        const deliveryFeeInput = document.getElementById('deliveryFee');
        if (deliveryFeeInput) {
            deliveryFeeInput.addEventListener('input', updateOverallTotals);
        }
        const totalTaxAmountInput = document.getElementById('totalTaxAmount');
        if (totalTaxAmountInput) {
            totalTaxAmountInput.addEventListener('input', updateOverallTotals);
        }
    }

    // Filter Button Active State Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            this.classList.add('active-filter');
        });
    });
}); 