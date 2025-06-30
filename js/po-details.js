<<<<<<< HEAD
/**
 * =====================================================================================
 *  PO Details Page Logic
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
=======
/**
 * =====================================================================================
 *  PO Details Page Logic
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
>>>>>>> master
}); 