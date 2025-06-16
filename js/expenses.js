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

    // Expense Details Modal Functionality (NEW)
    const expenseDetailsModal = document.getElementById('expenseDetailsModal');
    const closeExpenseDetailsModal = document.getElementById('closeExpenseDetailsModal');

    document.querySelectorAll('tbody tr').forEach(row => {
        row.classList.add('cursor-pointer');
        row.addEventListener('click', () => {
            const cells = row.querySelectorAll('td');
            // Map table columns to modal fields
            document.getElementById('expStatus').value = cells[1]?.innerText.trim() || '';
            document.getElementById('expCategory').value = cells[2]?.innerText.trim() || '';
            document.getElementById('expVendor').value = cells[3]?.innerText.trim() || '';
            document.getElementById('expDepartment').value = cells[4]?.innerText.trim() || '';
            document.getElementById('expEmployee').value = cells[5]?.innerText.trim() || '';
            document.getElementById('expAmount').value = (cells[6]?.innerText.trim() || '').replace('$','');
            document.getElementById('expDate').value = cells[7]?.innerText.trim() || '';
            document.getElementById('expPaymentMethod').value = 'Cash'; // Placeholder, update if you have this data

            // Dummy data for Tools & Parts Purchase Form (replace with real data if available)
            document.getElementById('tpVendor').value = 'Sari-sari store';
            document.getElementById('tpPartType').value = 'left';
            document.getElementById('tpQuantity').value = '1';
            document.getElementById('tpPurpose').value = 'for delivery';
            // Image
            document.getElementById('tpImagePreview').style.display = 'none';
            document.getElementById('tpImagePlaceholder').style.display = 'block';

            // Show modal
            expenseDetailsModal.classList.remove('hidden');
            expenseDetailsModal.classList.add('flex');
        });
    });
    closeExpenseDetailsModal.addEventListener('click', () => {
        expenseDetailsModal.classList.add('hidden');
        expenseDetailsModal.classList.remove('flex');
    });
    expenseDetailsModal.addEventListener('click', (e) => {
        if (e.target === expenseDetailsModal) {
            expenseDetailsModal.classList.add('hidden');
            expenseDetailsModal.classList.remove('flex');
        }
    });

    // Create Expense Modal Functionality
    const createExpenseButton = document.getElementById('createExpenseButton');
    const createExpenseModal = document.getElementById('createExpenseModal');
    const closeCreateExpenseModal = document.getElementById('closeCreateExpenseModal');

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

    // Initialize Flatpickr for Expense Date
    flatpickr("#expenseDate", {
        dateFormat: "m/d/Y",
        defaultDate: "06/12/2025"
    });

    // Handle file selection for upload images
    const uploadMultipleFiles = document.getElementById('uploadMultipleFiles');
    const selectedFilesSpan = document.getElementById('selectedFiles');

    uploadMultipleFiles.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            const fileNames = Array.from(event.target.files).map(file => file.name).join(', ');
            selectedFilesSpan.textContent = fileNames;
        } else {
            selectedFilesSpan.textContent = 'No file chosen';
        }
    });
}); 