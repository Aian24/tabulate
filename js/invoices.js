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

    // Update filter buttons to match status colors
    const filterButtons = document.querySelectorAll('.flex.flex-wrap.justify-center button');
    filterButtons.forEach(button => {
        const buttonText = button.textContent.trim();
        switch(buttonText) {
            case 'All':
                button.className = 'px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors';
                break;
            case 'Unpaid':
                button.className = 'px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors';
                break;
            case 'Paid':
                button.className = 'px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors';
                break;
            case 'Partial Paid':
                button.className = 'px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors';
                break;
        }
    });
}); 