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

    // Create Purchase Order Modal Functionality
    const createExpenseButton = document.getElementById('createExpenseButton');
    const createPOModal = document.getElementById('createPOModal');
    const closeCreatePOModal = document.getElementById('closeCreatePOModal');

    createExpenseButton.addEventListener('click', () => {
        createPOModal.classList.remove('hidden');
        createPOModal.classList.add('flex');
    });

    closeCreatePOModal.addEventListener('click', () => {
        createPOModal.classList.add('hidden');
        createPOModal.classList.remove('flex');
    });

    createPOModal.addEventListener('click', (e) => {
        if (e.target === createPOModal) {
            createPOModal.classList.add('hidden');
            createPOModal.classList.remove('flex');
        }
    });

    // Initialize Flatpickr for Order Date
    flatpickr("#orderDate", {
        dateFormat: "m/d/Y",
        defaultDate: new Date() // Set default to current date
    });

    // Initialize Flatpickr for Received Date
    flatpickr("#receivedDate", {
        dateFormat: "m/d/Y",
        defaultDate: new Date()
    });

    // Initialize Flatpickr for Paid Date
    flatpickr("#paidDate", {
        dateFormat: "m/d/Y",
        defaultDate: new Date()
    });

    // Initialize Flatpickr for Delivery Date
    flatpickr("#deliveryDate", {
        dateFormat: "m/d/Y",
        defaultDate: new Date()
    });

    // Handle file selection for upload documents
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

    // Function to calculate individual item total
    function calculateItemTotal(row) {
        const quantity = parseFloat(row.querySelector('td:nth-child(2) input').value) || 0;
        const unitPrice = parseFloat(row.querySelector('td:nth-child(4) input').value) || 0;
        const discountValue = parseFloat(row.querySelector('td:nth-child(7) input').value) || 0;
        const discountType = row.querySelector('td:nth-child(7) select').value;
        const tax = parseFloat(row.querySelector('td:nth-child(8) input').value) || 0;

        let itemTotal = quantity * unitPrice;

        if (discountType === '%') {
            itemTotal -= itemTotal * (discountValue / 100);
        } else { // $
            itemTotal -= discountValue;
        }

        itemTotal += tax;

        row.querySelector('td:nth-child(9)').textContent = itemTotal.toFixed(2);
        updateOverallTotals();
    }

    // Function to update overall totals (Sub Total, Total Tax Amount, Grand Total Amount)
    function updateOverallTotals() {
        let itemsSubTotal = 0;
        let itemsTaxTotal = 0;

        itemsTableBody.querySelectorAll('tr').forEach(row => {
            const quantity = parseFloat(row.querySelector('td:nth-child(2) input').value) || 0;
            const unitPrice = parseFloat(row.querySelector('td:nth-child(4) input').value) || 0;
            const discountValue = parseFloat(row.querySelector('td:nth-child(7) input').value) || 0;
            const discountType = row.querySelector('td:nth-child(7) select').value;
            const itemTax = parseFloat(row.querySelector('td:nth-child(8) input').value) || 0;

            let currentItemSubTotal = quantity * unitPrice;

            if (discountType === '%') {
                currentItemSubTotal -= currentItemSubTotal * (discountValue / 100);
            } else { // $
                currentItemSubTotal -= discountValue;
            }

            itemsSubTotal += currentItemSubTotal;
            itemsTaxTotal += itemTax;
        });

        const itemsGrandTotal = itemsSubTotal + itemsTaxTotal;

        document.getElementById('itemsTableSubTotal').textContent = `$${itemsSubTotal.toFixed(2)}`;
        document.getElementById('itemsTableTaxTotal').textContent = `$${itemsTaxTotal.toFixed(2)}`;
        document.getElementById('itemsTableGrandTotal').textContent = `$${itemsGrandTotal.toFixed(2)}`;

        const deliveryFee = parseFloat(document.getElementById('deliveryFee').value) || 0;
        const totalTaxAmountInput = parseFloat(document.getElementById('totalTaxAmount').value) || 0; // This is the separate input

        const overallGrandTotal = itemsGrandTotal + deliveryFee + totalTaxAmountInput;
        document.getElementById('grandTotalAmount').value = overallGrandTotal.toFixed(2);
    }

    // Add event listeners to existing and new item rows
    function addItemEventListeners(row) {
        const inputs = row.querySelectorAll('td:nth-child(2) input, td:nth-child(4) input, td:nth-child(7) input, td:nth-child(8) input');
        const discountSelect = row.querySelector('td:nth-child(7) select');
        const removeButton = row.querySelector('td:nth-child(10) button');

        inputs.forEach(input => {
            input.addEventListener('input', () => calculateItemTotal(row));
        });

        if (discountSelect) {
            discountSelect.addEventListener('change', () => calculateItemTotal(row));
        }

        if (removeButton) {
            removeButton.addEventListener('click', (e) => {
                e.preventDefault();
                row.remove();
                updateOverallTotals();
            });
        }
    }

    // Initialize event listeners for existing rows
    const itemsTableBody = document.querySelector('#createPOModal .min-w-full tbody');
    itemsTableBody.querySelectorAll('tr').forEach(addItemEventListeners);

    // Add Another Item functionality
    const addAnotherItemButton = document.querySelector('#createPOModal button.mt-4');

    addAnotherItemButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        const firstRow = itemsTableBody.querySelector('tr');
        if (firstRow) {
            const newRow = firstRow.cloneNode(true);
            // Clear input values in the new row
            newRow.querySelectorAll('input').forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else if (input.type === 'number') {
                    input.value = '0';
                } else {
                    input.value = '';
                }
            });
            newRow.querySelector('td:nth-child(9)').textContent = '0.00'; // Reset total column
            itemsTableBody.appendChild(newRow);
            addItemEventListeners(newRow); // Add listeners to the new row
            updateOverallTotals(); // Update totals after adding a new row
        }
    });

    // Initial calculation on page load
    updateOverallTotals();

    // Event listeners for Delivery Fee and Total Tax Amount
    document.getElementById('deliveryFee').addEventListener('input', updateOverallTotals);
    document.getElementById('totalTaxAmount').addEventListener('input', updateOverallTotals);
}); 