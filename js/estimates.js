// Path: js/estimates.js 

document.addEventListener('DOMContentLoaded', function() {
    const estimateDetailsModal = document.getElementById('estimateDetailsModal');
    const closeEstimateModalBtn = document.getElementById('closeEstimateModal');
    const modalEstimateNumber = document.getElementById('modalEstimateNumber');
    const modalCustomerFullName = document.getElementById('modalCustomerFullName');
    const modalCustomerPhone = document.getElementById('modalCustomerPhone');
    const modalCustomerEmail = document.getElementById('modalCustomerEmail');
    const modalCustomerAddress = document.getElementById('modalCustomerAddress');
    const modalQuotationItems = document.getElementById('modalQuotationItems');
    const modalGrandTotal = document.getElementById('modalGrandTotal');
    const modalTermsAndConditions = document.getElementById('modalTermsAndConditions');

    // Function to open the modal
    function openEstimateDetailsModal(data) {
        modalEstimateNumber.textContent = `Estimate #${data.estimateNumber}`;
        modalCustomerFullName.textContent = data.customer.fullName;
        modalCustomerPhone.textContent = data.customer.phone;
        modalCustomerEmail.textContent = data.customer.email;
        modalCustomerAddress.textContent = data.customer.address;

        modalQuotationItems.innerHTML = ''; // Clear previous items
        data.quotation.items.forEach(item => {
            const row = `
                <tr>
                    <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${item.name}</td>
                    <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.price}</td>
                    <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.quantity}</td>
                    <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.discount}</td>
                    <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.tax}</td>
                    <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.depositPercentage}</td>
                    <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.depositAmount}</td>
                    <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${item.totalPrice}</td>
                </tr>
            `;
            modalQuotationItems.insertAdjacentHTML('beforeend', row);
        });

        modalGrandTotal.textContent = data.quotation.grandTotal;

        modalTermsAndConditions.innerHTML = ''; // Clear previous terms
        data.termsAndConditions.forEach(term => {
            const p = `<p>${term}</p>`;
            modalTermsAndConditions.insertAdjacentHTML('beforeend', p);
        });

        estimateDetailsModal.classList.remove('hidden');
        estimateDetailsModal.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close the modal
    function closeEstimateDetailsModal() {
        estimateDetailsModal.classList.add('hidden');
        estimateDetailsModal.classList.remove('flex');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Event listener for the close button
    closeEstimateModalBtn.addEventListener('click', closeEstimateDetailsModal);

    // Event listener to close modal when clicking outside
    estimateDetailsModal.addEventListener('click', function(event) {
        if (event.target === estimateDetailsModal) {
            closeEstimateDetailsModal();
        }
    });

    // Add click event to each row in the estimates table
    const estimatesTableRows = document.querySelectorAll('table tbody tr');
    estimatesTableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Prevent modal from opening if a checkbox or other interactive element is clicked
            if (e.target.closest('input[type="checkbox"]')) {
                return;
            }

            // Extract data from the clicked row
            const estimateNumber = row.querySelector('td:nth-child(2)').textContent.trim();
            const customerName = row.querySelector('td:nth-child(3)').textContent.trim();
            const dateCreated = row.querySelector('td:nth-child(4)').textContent.trim();
            const dateSent = row.querySelector('td:nth-child(5)').textContent.trim();
            const price = row.querySelector('td:nth-child(6)').textContent.trim();
            const address = row.querySelector('td:nth-child(7)').textContent.trim();
            const category = row.querySelector('td:nth-child(8)').textContent.trim();
            const status = row.querySelector('td:nth-child(9) span').textContent.trim();

            // For demonstration, using dummy data for quotation and terms.
            // In a real application, you would fetch this from a backend using the estimateNumber.
            const dummyData = {
                estimateNumber: estimateNumber,
                customer: {
                    fullName: customerName,
                    phone: '(032) 415 8877', // Dummy data
                    email: 'trixpy890@gmail.com', // Dummy data
                    address: address
                },
                quotation: {
                    items: [
                        { name: 'Plumbing Repair', price: '$ 932.40', quantity: '1', discount: '$ 0.00', tax: '$ 9.23', depositPercentage: '10 %', depositAmount: '$93.24', totalPrice: '$ 932.40' },
                        { name: 'Electrical Installation Package', price: '$ 6,230.00', quantity: '1', discount: '$ 0.00', tax: '$ 61.68', depositPercentage: '10 %', depositAmount: '$623.00', totalPrice: '$ 6,230.00' }
                    ],
                    grandTotal: price
                },
                termsAndConditions: [
                    'Plumbing Repair: Emergency repairs may incur extra charges.',
                    'Package: Electrical Installation Package Electrical Wiring Installation: Materials charged separately; permits by client.',
                    'Roofing Installation: Includes labor; material price subject to change.'
                ]
            };

            openEstimateDetailsModal(dummyData);
        });
    });

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
    const estimateModal = document.getElementById('estimateModal');
    const createEstimateBtn = document.getElementById('createEstimate');
    const closeEstimateModal = document.getElementById('closeEstimateModal');
    const cancelEstimateBtn = document.getElementById('cancelEstimate');

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

    // Open estimate modal
    createEstimateBtn.addEventListener('click', () => {
        estimateModal.classList.remove('hidden');
        estimateModal.classList.add('flex');
        actionsMenu.classList.add('hidden');
    });

    // Close estimate modal
    const closeModal = () => {
        estimateModal.classList.add('hidden');
        estimateModal.classList.remove('flex');
    };

    closeEstimateModal.addEventListener('click', closeModal);
    cancelEstimateBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    estimateModal.addEventListener('click', (e) => {
        if (e.target === estimateModal) {
            closeModal();
        }
    });

    // Add estimate item functionality
    const addItemBtn = document.getElementById('addItem');
    const estimateItems = document.getElementById('estimateItems');
    let itemCount = 0;

    addItemBtn.addEventListener('click', () => {
        itemCount++;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="px-4 py-2">${itemCount}</td>
            <td class="px-4 py-2">
                <select class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">Select service</option>
                </select>
            </td>
            <td class="px-4 py-2">
                <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
            </td>
            <td class="px-4 py-2">
                <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
            </td>
            <td class="px-4 py-2">
                <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
            </td>
            <td class="px-4 py-2">
                <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
            </td>
            <td class="px-4 py-2">
                <input type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
            </td>
            <td class="px-4 py-2">
                <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
            </td>
            <td class="px-4 py-2">
                <input type="number" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01">
            </td>
            <td class="px-4 py-2">
                <span class="font-medium">$0.00</span>
            </td>
            <td class="px-4 py-2">
                <input type="file" class="w-full" accept="image/*">
            </td>
            <td class="px-4 py-2">
                <button type="button" class="text-red-500 hover:text-red-700" onclick="this.closest('tr').remove();">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        estimateItems.appendChild(newRow);
    });

    // Add click event to table rows to show estimate details
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', (e) => {
            // Don't trigger if clicking on checkbox or action buttons
            if (e.target.type === 'checkbox' || e.target.closest('button')) {
                return;
            }
            // Show estimate details modal
            const estimateDetailsModal = document.getElementById('estimateDetailsModal');
            estimateDetailsModal.classList.remove('hidden');
            estimateDetailsModal.classList.add('flex');
        });
    });
}); 