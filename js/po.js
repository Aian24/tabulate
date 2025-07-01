// =====================================================================================
//  NOTE FOR DEVELOPERS:
//  The logic from po-details.js has been merged into this file (po.js) for consolidation.
//  The original po-details.js file has been deleted. Please add or update PO details logic here.
// =====================================================================================

/**
 * =====================================================================================
 *  PO Details Page Logic (migrated from po-details.js)
 * =====================================================================================
 *
 *  This script manages the state and interactions on the Purchase Order details page.
 *  Key functionalities include:
 *  - Loading PO data from localStorage.
 *  - Populating the form with initial data.
 *  - Toggling between read-only and editable states.
 *  - Handling dynamic table row creation and deletion for PO items.
 *  - Managing visibility and actions for various modals (Send, Acknowledge, Receive).
 *
 * =====================================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // =================================================================================
    //  Initialization & Data Loading
    // =================================================================================

    // Retrieve selected PO data from localStorage, or use an empty object as a fallback.
    const poData = JSON.parse(localStorage.getItem('selectedPO')) || {};
    
    // Cache DOM elements for frequent access.
    const tbody = document.getElementById('poItemsTableBody');

    // Use sample data for the items table if no data is found in localStorage.
    // This ensures the table structure is visible for demonstration purposes.
    const sampleItems = [
        { product: 'Parasitic Acid', quantity: 2, receivedQuantity: 2, unitPrice: '50.00', receivedUnitPrice: '50.00', syncVendorPrice: false, discounts: '0.00', tax: '0.00', total: '100.00' },
        { product: 'Paint Brush Set', quantity: 2, receivedQuantity: 2, unitPrice: '350.00', receivedUnitPrice: '350.00', syncVendorPrice: false, discounts: '0.00', tax: '0.00', total: '700.00' },
        { product: 'Stairs', quantity: 1, receivedQuantity: 1, unitPrice: '800.00', receivedUnitPrice: '800.00', syncVendorPrice: false, discounts: '0.00', tax: '0.00', total: '800.00' },
        { product: 'Industrial Cleaner', quantity: 5, receivedQuantity: 5, unitPrice: '120.00', receivedUnitPrice: '120.00', syncVendorPrice: true, discounts: '10.00', tax: '5.00', total: '590.00' },
        { product: 'Safety Gloves', quantity: 10, receivedQuantity: 10, unitPrice: '15.00', receivedUnitPrice: '15.00', syncVendorPrice: false, discounts: '2.00', tax: '1.00', total: '148.00' }
    ];
    // Store the initial items to allow for resetting the form on "Cancel".
    const initialItems = poData.items && poData.items.length ? poData.items : sampleItems;

    // =================================================================================
    //  DOM Manipulation Functions
    // =================================================================================
    
    /**
     * Creates and returns the subtotal row for the items table.
     * @returns {HTMLTableRowElement} The subtotal table row element.
     */
    function createSubtotalRow() {
        const subtotalRow = document.createElement('tr');
        subtotalRow.innerHTML = `
            <td colspan="8" class="px-4 py-2 text-right font-semibold border-r">Sub Total</td>
            <td class="px-4 py-2 text-right font-semibold border-r">$2,338.00</td>
            <td class="px-4 py-2 border-r actions-col hidden"></td>
        `;
        return subtotalRow;
    }
    
    /**
     * Populates the entire form and items table with the provided data.
     * @param {object} data - The main PO data object.
     * @param {Array<object>} items - An array of item objects.
     */
    function populateFormWithData(data, items) {
         // Populate header and summary fields
        document.getElementById('poNumber').value = data.poNumber || '';
        document.getElementById('poVendor').value = data.vendor || '';
        document.getElementById('poStatus').value = data.status || '';
        
        const paidStatus = data.paidStatus || '';
        document.getElementById('poPaidStatusDisplay').value = paidStatus;
        document.getElementById('poPaidStatus').value = paidStatus;

        document.getElementById('poOrderDate').value = data.orderDate || '';
        document.getElementById('poReceivedDate').value = data.receivedDate || '';
        document.getElementById('poPaidDate').value = data.paidDate || '';
        document.getElementById('poDeliveryDate').value = data.deliveryDate || '';
        document.getElementById('poShippingAddress').value = data.shippingAddress || '';

        document.getElementById('poDeliveryFee').value = data.deliveryFee || '50.00';
        document.getElementById('poTotalTaxAmount').value = data.totalTaxAmount || '6.00';
        document.getElementById('poGrandTotalAmount').value = data.grandTotalAmount || '2394.00';

        // Clear and repopulate the items table
        tbody.innerHTML = '';
        items.forEach(item => tbody.appendChild(createTableRow(item)));
        tbody.appendChild(createSubtotalRow());
    }

    /**
     * Creates a single table row for a PO item, with all fields as inputs.
     * @param {object} item - The item data object.
     * @returns {HTMLTableRowElement} The fully constructed table row element.
     */
    function createTableRow(item) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-4 py-2 border-r"><input type="text" value="${item.product || ''}" class="w-full bg-gray-100 p-1 border rounded" readonly></td>
            <td class="px-4 py-2 border-r"><input type="text" value="${item.quantity || ''}" class="w-full bg-gray-100 p-1 border rounded text-center" readonly></td>
            <td class="px-4 py-2 border-r"><input type="text" value="${item.receivedQuantity || ''}" class="w-full bg-gray-100 p-1 border rounded text-center" readonly></td>
            <td class="px-4 py-2 border-r"><input type="text" value="${item.unitPrice || ''}" class="w-full bg-gray-100 p-1 border rounded text-right" readonly></td>
            <td class="px-4 py-2 border-r"><input type="text" value="${item.receivedUnitPrice || ''}" class="w-full bg-gray-100 p-1 border rounded text-right" readonly></td>
            <td class="px-4 py-2 border-r text-center"><input type="checkbox" ${item.syncVendorPrice ? 'checked' : ''} class="mx-auto" disabled></td>
            <td class="px-4 py-2 border-r">
                <div class="flex items-center">
                    <input type="text" value="${item.discounts || ''}" class="w-full bg-gray-100 p-1 border rounded-l text-right" readonly>
                    <select class="bg-gray-200 border-t border-b border-r p-1 rounded-r" disabled><option>%</option><option>$</option></select>
                </div>
            </td>
            <td class="px-4 py-2 border-r"><input type="text" value="${item.tax || ''}" class="w-full bg-gray-100 p-1 border rounded text-right" readonly></td>
            <td class="px-4 py-2 border-r text-right">${item.total || ''}</td>
            <td class="px-4 py-2 text-center actions-col hidden">
                <button class="remove-item-btn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Remove</button>
            </td>
        `;
        return tr;
    }

    // =================================================================================
    //  Edit Mode Logic & Event Listeners
    // =================================================================================

    // Cache all relevant buttons for toggling state and attaching listeners.
    const editBtn = document.getElementById('editPOBtn');
    const saveBtn = document.getElementById('savePOBtn');
    const cancelBtn = document.getElementById('cancelPOBtn');
    const sendPOBtn = document.getElementById('sendPOBtn');
    const acknowledgePOBtn = document.getElementById('acknowledgePOBtn');
    const receivePOBtn = document.getElementById('receivePOBtn');
    const addAnotherItemBtn = document.getElementById('addAnotherItemBtn');
    const uploadSection = document.getElementById('uploadSection');

    // State variable to track if the form is in edit mode.
    let isEditable = false;

    // "Edit" button enters edit mode.
    editBtn.addEventListener('click', function() {
        isEditable = true;
        toggleEditState();
    });

    // "Save" button exits edit mode and would typically save data.
    saveBtn.addEventListener('click', function() {
        isEditable = false;
        // This is where you would collect form data and send it to a backend.
        // For this example, we just update the UI state.
        const paidStatusValue = document.getElementById('poPaidStatus').value;
        document.getElementById('poPaidStatusDisplay').value = paidStatusValue;
        poData.paidStatus = paidStatusValue; // Update in-memory data for consistency.
        toggleEditState();
    });

    // "Cancel" button reverts all changes and exits edit mode.
    cancelBtn.addEventListener('click', function() {
        isEditable = false;
        populateFormWithData(poData, initialItems); // Reverts all fields to original data.
        toggleEditState();
    });
    
    /**
     * Toggles the entire form's UI between read-only and editable states.
     * This includes input fields, buttons, and table columns.
     */
    function toggleEditState() {
        const formElements = document.querySelectorAll('input, select');
        const excludedIds = ['poGrandTotalAmount', 'poPaidStatusDisplay', 'poPaidStatus'];
        
        // Toggle read-only/disabled state for all form inputs.
        formElements.forEach(el => {
            if (!excludedIds.includes(el.id)) {
                if (el.tagName === 'SELECT') {
                    el.disabled = !isEditable;
                } else {
                    el.readOnly = !isEditable;
                }
                el.classList.toggle('bg-gray-100', !isEditable);
                el.classList.toggle('bg-white', isEditable);
            }
        });
        
        // Special handling for the Paid Status display/select toggle.
        const poPaidStatusDisplay = document.getElementById('poPaidStatusDisplay');
        const poPaidStatusSelect = document.getElementById('poPaidStatus');
        poPaidStatusDisplay.classList.toggle('hidden', isEditable);
        poPaidStatusSelect.classList.toggle('hidden', !isEditable);

        // Toggle visibility of the "Actions" column in the items table.
        document.querySelectorAll('.actions-col').forEach(col => col.classList.toggle('hidden', !isEditable));
        
        // Toggle visibility of all primary and secondary action buttons.
        editBtn.classList.toggle('hidden', isEditable);
        sendPOBtn.classList.toggle('hidden', isEditable);
        acknowledgePOBtn.classList.toggle('hidden', isEditable);
        receivePOBtn.classList.toggle('hidden', isEditable);
        saveBtn.classList.toggle('hidden', !isEditable);
        cancelBtn.classList.toggle('hidden', !isEditable);
        addAnotherItemBtn.classList.toggle('hidden', !isEditable);
        uploadSection.classList.toggle('hidden', !isEditable);
    }

    // =================================================================================
    //  Dynamic Table Row Logic
    // =================================================================================

    // "Add Another Item" button appends a new, empty, and editable row to the table.
    addAnotherItemBtn.addEventListener('click', function() {
        const newItem = { product: '', quantity: '', receivedQuantity: '', unitPrice: '', receivedUnitPrice: '', syncVendorPrice: false, discounts: '', tax: '', total: '' };
        const newRow = createTableRow(newItem);
        tbody.insertBefore(newRow, tbody.querySelector('tr:last-child')); // Insert before subtotal
        
        // Immediately make the new row editable.
        newRow.querySelectorAll('input, select').forEach(el => {
            if (el.tagName === 'SELECT') el.disabled = false;
            else el.readOnly = false;
            el.classList.remove('bg-gray-100');
            el.classList.add('bg-white');
        });
        newRow.querySelector('.actions-col').classList.remove('hidden');
    });

    // Event delegation on the table body to handle "Remove" button clicks.
    tbody.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-item-btn')) {
            e.target.closest('tr').remove();
            // Add logic here to recalculate totals if necessary.
        }
    });

    // =================================================================================
    //  Initial Page Load
    // =================================================================================

    // Populate the form with data when the page first loads.
    populateFormWithData(poData, initialItems);

    // =================================================================================
    //  Modal Management
    // =================================================================================

    // Cache all modal elements.
    const sendPOModal = document.getElementById('sendPOModal');
    const acknowledgePOModal = document.getElementById('acknowledgePOModal');
    const receivePOModal = document.getElementById('receivePOModal');

    /**
     * Shows a modal with a modern pop-in animation.
     * @param {HTMLElement} modal - The modal element to show.
     */
    function showModal(modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.querySelector('.modal-content-modern').classList.add('show');
        }, 10); // Short delay allows for CSS transition to trigger.
    }

    /**
     * Hides a modal with a modern pop-out animation.
     * @param {HTMLElement} modal - The modal element to hide.
     */
    function hideModal(modal) {
        modal.querySelector('.modal-content-modern').classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 250); // Delay matches the CSS transition duration.
    }

    // Attach event listeners to open the respective modals.
    sendPOBtn.addEventListener('click', () => showModal(sendPOModal));
    acknowledgePOBtn.addEventListener('click', () => showModal(acknowledgePOModal));
    receivePOBtn.addEventListener('click', () => showModal(receivePOModal));

    // --- Send Modal Button Listeners ---
    document.getElementById('cancelSendPO').addEventListener('click', () => hideModal(sendPOModal));
    document.getElementById('confirmSendPO').addEventListener('click', () => {
        console.log("Email sending logic would execute here.");
        hideModal(sendPOModal);
    });

    // --- Acknowledge Modal Button Listeners ---
    document.getElementById('cancelAcknowledgePO').addEventListener('click', () => hideModal(acknowledgePOModal));
    document.getElementById('confirmAcknowledgePO').addEventListener('click', () => {
        console.log("Acknowledge-only logic would execute here.");
        hideModal(acknowledgePOModal);
    });
    document.getElementById('acknowledgeAndExpensePO').addEventListener('click', () => {
        console.log("Acknowledge and create expense logic would execute here.");
        hideModal(acknowledgePOModal);
    });
    
    // --- Receive Modal Button Listeners ---
    document.getElementById('cancelReceivePO').addEventListener('click', () => hideModal(receivePOModal));
    document.getElementById('saveReceivePO').addEventListener('click', () => {
        console.log("Receive PO logic would execute here.");
        hideModal(receivePOModal);
    });

    // Add a global click listener to hide modals if the user clicks on the background overlay.
    window.addEventListener('click', function(event) {
        if (event.target == sendPOModal) hideModal(sendPOModal);
        if (event.target == acknowledgePOModal) hideModal(acknowledgePOModal);
        if (event.target == receivePOModal) hideModal(receivePOModal);
    });

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

    // PO Details Navigation (NEW)
    document.querySelectorAll('tbody tr').forEach(row => {
        row.classList.add('cursor-pointer');
        row.addEventListener('click', () => {
            const cells = row.querySelectorAll('td');
            // Defensive: check if enough cells exist
            if (cells.length < 6) return;
            // Map table columns to PO details fields
            const poData = {
                poNumber: cells[2]?.innerText.trim() || '',
                vendor: cells[3]?.innerText.trim() || '',
                status: cells[1]?.innerText.trim() || '',
                orderDate: cells[4]?.innerText.trim() || '',
                totalAmount: cells[5]?.innerText.trim() || '',
                // Add more fields as needed
            };
            // Store data in localStorage for retrieval in details page
            localStorage.setItem('selectedPO', JSON.stringify(poData));
            // Navigate to the details page
            window.location.href = 'po-details.html';
        });
    });
}); 