// This file contains JavaScript for the invoices, invoice-details, create-invoice, and create-refund pages.
// The code is namespaced by checking for the existence of elements specific to each page.

document.addEventListener('DOMContentLoaded', function() {

    // -----------------------------------------------------------------------------
    // --- COMMON FUNCTIONALITY ----------------------------------------------------
    // -----------------------------------------------------------------------------

    // The header and navigation are now loaded by the main.js file.
    // This ensures that navigation initialization scripts are run correctly.

    // -----------------------------------------------------------------------------
    // --- INVOICES LIST PAGE (invoices.html) --------------------------------------
    // -----------------------------------------------------------------------------

    const invoicesTable = document.querySelector('table.min-w-\\[800px\\]');
    if (invoicesTable) {

        // Initialize drag and drop for table columns
        const headers = invoicesTable.querySelectorAll('th.draggable-header');
        let draggedHeader = null;

        headers.forEach(header => {
            header.addEventListener('dragstart', (e) => {
                draggedHeader = header;
                header.classList.add('dragging');
                if(e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', header.dataset.column);
                }
            });

            header.addEventListener('dragend', () => {
                header.classList.remove('dragging');
                headers.forEach(h => h.classList.remove('column-drop-target'));
            });

            header.addEventListener('dragover', (e) => {
                e.preventDefault();
                if(e.dataTransfer) {
                    e.dataTransfer.dropEffect = 'move';
                }
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
                const sourceColumn = e.dataTransfer?.getData('text/plain');
                const targetColumn = header.dataset.column;

                if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
                    const sourceIndex = Array.from(headers).findIndex(h => h.dataset.column === sourceColumn);
                    const targetIndex = Array.from(headers).findIndex(h => h.dataset.column === targetColumn);

                    const headerRow = invoicesTable.querySelector('thead tr');
                    const sourceHeader = headerRow.children[sourceIndex + 1]; // +1 for checkbox column
                    const targetHeader = headerRow.children[targetIndex + 1]; // +1 for checkbox column

                    if (sourceIndex < targetIndex) {
                        targetHeader.parentNode.insertBefore(sourceHeader, targetHeader.nextSibling);
                    } else {
                        targetHeader.parentNode.insertBefore(sourceHeader, targetHeader);
                    }

                    const rows = invoicesTable.querySelectorAll('tbody tr');
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

        const style = document.createElement('style');
        style.textContent = `
            .dragging { opacity: 0.5; }
            .column-drop-target { border-left: 2px solid #3b82f6; }
            .draggable-header { cursor: move; }
        `;
        document.head.appendChild(style);

        const actionsDropdown = document.getElementById('actionsDropdown');
        const actionsMenu = document.getElementById('actionsMenu');
        const moreDropdown = document.getElementById('moreDropdown');
        const moreMenu = document.getElementById('moreMenu');

        if (actionsDropdown) {
            actionsDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                actionsMenu.classList.toggle('hidden');
                moreMenu.classList.add('hidden');
            });
        }

        if (moreDropdown) {
            moreDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                moreMenu.classList.toggle('hidden');
                actionsMenu.classList.add('hidden');
            });
        }

        document.addEventListener('click', () => {
            if(actionsMenu) actionsMenu.classList.add('hidden');
            if(moreMenu) moreMenu.classList.add('hidden');
        });

        invoicesTable.querySelectorAll('tbody tr').forEach(row => {
            row.classList.add('cursor-pointer');
            row.addEventListener('click', () => {
                const cells = row.querySelectorAll('td');
                const invoiceData = {
                    invoiceNumber: cells[1].textContent.trim(),
                    address: cells[2].textContent.trim(),
                    dateSent: cells[3].textContent.trim(),
                    total: cells[4].textContent.trim(),
                    overdue: cells[5].textContent.trim(),
                    dateCreated: cells[6].textContent.trim(),
                    balance: cells[7].textContent.trim(),
                    lastPayment: cells[8].textContent.trim(),
                    status: cells[9].querySelector('span').textContent.trim(),
                    customerName: 'Paget Zowie', // Demo data
                    customerPhone: '09234234234', // Demo data
                    customerEmail: 'dabidbell5656@gmail.com', // Demo data
                    customerAddress: cells[2].textContent.trim(),
                    lastPaymentAmount: cells[4].textContent.trim(),
                    paymentMethod: 'Cash', // Demo data
                };
                localStorage.setItem('invoiceDetails', JSON.stringify(invoiceData));
                window.location.href = 'invoice-details.html';
            });
        });

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active-filter'));
                this.classList.add('active-filter');
                const filter = this.dataset.filter;
                const rows = document.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const status = row.querySelector('td:last-child span')?.textContent.trim().toLowerCase();
                    if (filter === 'all') {
                        row.style.display = '';
                    } else if (filter === 'partial') {
                        row.style.display = status === 'partial paid' ? '' : 'none';
                    } else {
                        row.style.display = status === filter ? '' : 'none';
                    }
                });
            });
        });

        const filterBtn = document.getElementById('openFilter');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                const rows = document.querySelectorAll('table tbody tr');
                const uniqueValues = {
                    invoiceNumbers: new Set(), addresses: new Set(), dateSents: new Set(),
                    totals: new Set(), overdues: new Set(), dateCreateds: new Set(),
                    balances: new Set(), lastPayments: new Set(), statuses: new Set()
                };

                rows.forEach(row => {
                    uniqueValues.invoiceNumbers.add(row.querySelector('td:nth-child(2)')?.textContent.trim() || '');
                    uniqueValues.addresses.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                    uniqueValues.dateSents.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                    uniqueValues.totals.add(row.querySelector('td:nth-child(5)')?.textContent.trim() || '');
                    uniqueValues.overdues.add(row.querySelector('td:nth-child(6)')?.textContent.trim() || '');
                    uniqueValues.dateCreateds.add(row.querySelector('td:nth-child(7)')?.textContent.trim() || '');
                    uniqueValues.balances.add(row.querySelector('td:nth-child(8)')?.textContent.trim() || '');
                    uniqueValues.lastPayments.add(row.querySelector('td:nth-child(9)')?.textContent.trim() || '');
                    uniqueValues.statuses.add(row.querySelector('td:nth-child(10) span')?.textContent.trim() || '');
                });

                const modal = createFilterModal(uniqueValues);
                document.body.appendChild(modal);

                modal.querySelector('#closeFilterModal').addEventListener('click', () => modal.remove());
                modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
                modal.querySelector('#resetFilter').addEventListener('click', () => {
                    modal.querySelectorAll('select').forEach(select => select.value = '');
                    rows.forEach(row => row.style.display = '');
                });
                modal.querySelector('#applyFilter').addEventListener('click', () => {
                    applyFilters(modal, rows);
                    modal.remove();
                });
            });
        }
    }

    /**
     * Creates and returns the filter modal element.
     * @param {object} uniqueValues - An object containing sets of unique values for each column.
     * @returns {HTMLElement} The filter modal element.
     */
    function createFilterModal(uniqueValues) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Filter Invoices</h3>
                    <button class="text-gray-500 hover:text-gray-700" id="closeFilterModal"><i class="fas fa-times"></i></button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${createSelect("Invoice #", "filterInvoiceNumber", uniqueValues.invoiceNumbers)}
                    ${createSelect("Address", "filterAddress", uniqueValues.addresses)}
                    ${createSelect("Date Sent", "filterDateSent", uniqueValues.dateSents)}
                    ${createSelect("Total Price", "filterTotal", uniqueValues.totals)}
                    ${createSelect("Overdue", "filterOverdue", uniqueValues.overdues)}
                    ${createSelect("Date Created", "filterDateCreated", uniqueValues.dateCreateds)}
                    ${createSelect("Balance", "filterBalance", uniqueValues.balances)}
                    ${createSelect("Last Payment", "filterLastPayment", uniqueValues.lastPayments)}
                    ${createSelect("Status", "filterStatus", uniqueValues.statuses)}
                </div>
                <div class="flex justify-end gap-2 mt-6">
                    <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" id="resetFilter">Reset</button>
                    <button class="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors" id="applyFilter">Apply</button>
                </div>
            </div>`;
        return modal;
    }

    /**
     * Creates a select dropdown HTML string.
     * @param {string} label - The label for the select dropdown.
     * @param {string} id - The ID for the select element.
     * @param {Set<string>} options - A set of strings for the options.
     * @returns {string} The HTML string for the select dropdown.
     */
    function createSelect(label, id, options) {
        return `
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">${label}</label>
                <select id="${id}" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All</option>
                    ${Array.from(options).filter(Boolean).map(o => `<option value="${o}">${o}</option>`).join('')}
                </select>
            </div>`;
    }

    /**
     * Applies the selected filters to the table rows.
     * @param {HTMLElement} modal - The filter modal element.
     * @param {NodeListOf<Element>} rows - The table rows to filter.
     */
    function applyFilters(modal, rows) {
        const filters = {
            invoiceNumber: modal.querySelector('#filterInvoiceNumber').value,
            address: modal.querySelector('#filterAddress').value,
            dateSent: modal.querySelector('#filterDateSent').value,
            total: modal.querySelector('#filterTotal').value,
            overdue: modal.querySelector('#filterOverdue').value,
            dateCreated: modal.querySelector('#filterDateCreated').value,
            balance: modal.querySelector('#filterBalance').value,
            lastPayment: modal.querySelector('#filterLastPayment').value,
            status: modal.querySelector('#filterStatus').value,
        };

        rows.forEach(row => {
            const rowData = {
                invoiceNumber: row.querySelector('td:nth-child(2)')?.textContent.trim() || '',
                address: row.querySelector('td:nth-child(3)')?.textContent.trim() || '',
                dateSent: row.querySelector('td:nth-child(4)')?.textContent.trim() || '',
                total: row.querySelector('td:nth-child(5)')?.textContent.trim() || '',
                overdue: row.querySelector('td:nth-child(6)')?.textContent.trim() || '',
                dateCreated: row.querySelector('td:nth-child(7)')?.textContent.trim() || '',
                balance: row.querySelector('td:nth-child(8)')?.textContent.trim() || '',
                lastPayment: row.querySelector('td:nth-child(9)')?.textContent.trim() || '',
                status: row.querySelector('td:nth-child(10) span')?.textContent.trim() || '',
            };

            const match = Object.keys(filters).every(key => !filters[key] || rowData[key] === filters[key]);
            row.style.display = match ? '' : 'none';
        });
    }


    // -----------------------------------------------------------------------------
    // --- CREATE INVOICE PAGE (create-invoice.html) -------------------------------
    // -----------------------------------------------------------------------------
    const unpaidInvoiceLink = document.querySelector('.unpaid-invoice-link');
    if (unpaidInvoiceLink) {
        unpaidInvoiceLink.addEventListener('click', function(e) {
            e.preventDefault();
            generateUnpaidInvoicePDF();
        });

        function generateUnpaidInvoicePDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const logoImg = new Image();
            logoImg.src = '../images/logo.png';

            logoImg.onload = function() {
                doc.addImage(logoImg, 'PNG', 15, 10, 50, 22);
                doc.setFontSize(24);
                doc.setFont('helvetica', 'bold');
                doc.text('INVOICE', 170, 22, { align: 'right' });
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                doc.text('BILL TO', 15, 45);
                doc.setFont('helvetica', 'bold');
                doc.text('HOME OWNER:', 15, 53);
                doc.text('ADDRESS:', 15, 60);
                doc.text('EMAIL:', 15, 67);
                doc.text('PHONE:', 15, 74);
                doc.setFont('helvetica', 'normal');
                doc.text('Paget Zowie', 50, 53);
                doc.text('SM Mall of Asia, Seaside Blvd', 50, 60);
                doc.text('dabidbell5656@gmail.com', 50, 67);
                doc.text('09234234234', 50, 74);
                doc.setFont('helvetica', 'bold');
                doc.text('INVOICE NO.', 120, 53);
                doc.text('INVOICE DATE:', 120, 60);
                doc.text('DUE DATE:', 120, 67);
                doc.setFont('helvetica', 'normal');
                doc.text('1000-01', 150, 53);
                doc.text('March 12, 2025', 150, 60);
                doc.text('March 19, 2025', 150, 67);
                doc.autoTable({
                    startY: 85,
                    head: [[
                        { content: 'Service', styles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold' } },
                        { content: 'Qty', styles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold' } },
                        { content: 'Price', styles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold' } },
                        { content: 'Discount', styles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold' } },
                        { content: 'Tax', styles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold' } },
                        { content: 'Total Amount', styles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold' } },
                        { content: 'Currently Due', styles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold' } },
                        { content: 'Paid Amount', styles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold' } },
                        { content: 'Balance', styles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold' } }
                    ]],
                    body: [
                        ['Office Cleaning Package', '1', '$300.00', '$0.00', '$0.00', '$300.00', '299.96', '$390.00', '$-90.00'],
                        [{ content: 'TOTAL', styles: { fontStyle: 'bold' } }, '1', '$300.00', '$0.00', '$0.00', '$300.00', '299.96', '$390.00', '$-90.00']
                    ],
                    theme: 'grid',
                    styles: { font: 'helvetica', fontSize: 10, cellPadding: 2 },
                    headStyles: { halign: 'center', valign: 'middle' },
                    bodyStyles: { halign: 'center', valign: 'middle' },
                    columnStyles: { 0: { halign: 'left' } }
                });
                let y = doc.lastAutoTable.finalY + 10;
                doc.setFont('helvetica', 'bold');
                doc.text('Subtotal', 140, y);
                doc.text('$300.00', 200, y, { align: 'right' });
                doc.setFont('helvetica', 'normal');
                doc.text('Discount:', 140, y + 7);
                doc.text('$0.00', 200, y + 7, { align: 'right' });
                doc.text('Sales Tax:', 140, y + 14);
                doc.text('$0.00', 200, y + 14, { align: 'right' });
                doc.setFont('helvetica', 'bold');
                doc.text('Total:', 140, y + 21);
                doc.text('$300.00', 200, y + 21, { align: 'right' });
                doc.text('Total Current Due:', 140, y + 32);
                doc.text('299.96', 200, y + 32, { align: 'right' });
                doc.text('Total Paid:', 140, y + 39);
                doc.text('390.00', 200, y + 39, { align: 'right' });
                doc.setFont('helvetica', 'bold');
                doc.text('Remainder Balance:', 140, y + 46);
                doc.text('$-90.00', 200, y + 46, { align: 'right' });
                window.open(doc.output('bloburl'), '_blank');
            };
        }
    }

    // -----------------------------------------------------------------------------
    // --- CREATE REFUND PAGE (create-refund.html) ---------------------------------
    // -----------------------------------------------------------------------------
    const refundDatePicker = document.getElementById('refundDate');
    if (refundDatePicker) {
        flatpickr(refundDatePicker, {
            dateFormat: "m/d/Y",
        });

        const data = JSON.parse(localStorage.getItem('invoiceDetails') || '{}');
        const invoiceNumberEl = document.getElementById('invoiceNumber');
        if (invoiceNumberEl && data && data.invoiceNumber) {
            invoiceNumberEl.textContent = data.invoiceNumber;
        }
    }


    // -----------------------------------------------------------------------------
    // --- INVOICE DETAILS PAGE (invoice-details.html) -----------------------------
    // -----------------------------------------------------------------------------
    const invoiceDetailsContainer = document.querySelector('.tab-link');
    if (invoiceDetailsContainer) {
        // --- TABS ---
        document.querySelectorAll('.tab-link').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
                const content = document.getElementById('tab-' + tabId)
                if(content) content.classList.remove('hidden');
                setActiveTab(this);
                localStorage.setItem('activeInvoiceTab', tabId);
            });
        });

        // Restore active tab from localStorage
        const savedTabId = localStorage.getItem('activeInvoiceTab') || 'customer';
        const tabToActivate = document.querySelector(`.tab-link[data-tab="${savedTabId}"]`);
        if (tabToActivate) {
            tabToActivate.click();
        } else {
            const customerTab = document.querySelector('.tab-link[data-tab="customer"]');
            if(customerTab) customerTab.click();
        }

        // --- DATA POPULATION ---
        const data = JSON.parse(localStorage.getItem('invoiceDetails') || '{}');
        if (data) {
            populateInvoiceDetails(data);
            const unpaidLink = document.querySelector('.invoice-pdf-link');
            if (unpaidLink) {
                unpaidLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    generateInvoiceDetailsPDF(data);
                });
            }
        }
    }
    
    /**
     * Sets the active tab style.
     * @param {HTMLElement} tabBtn - The button element of the tab to activate.
     */
    function setActiveTab(tabBtn) {
        if (!tabBtn) return;
        document.querySelectorAll('.tab-link').forEach(b => {
            b.classList.remove('text-sky-500', 'bg-blue-50', 'border-sky-400', 'shadow', 'font-bold');
            b.classList.add('text-black', 'border-transparent');
        });
        tabBtn.classList.remove('text-black', 'border-transparent');
        tabBtn.classList.add('text-sky-500', 'bg-blue-50', 'border-sky-400', 'shadow', 'font-bold');
    }

    /**
     * Populates the invoice details page with data from localStorage.
     * @param {object} data - The invoice data object.
     */
    function populateInvoiceDetails(data) {
        document.getElementById('invoiceNumber').textContent = 'Invoice # ' + (data.invoiceNumber || '');
        document.getElementById('customerName').textContent = data.customerName || '';
        document.getElementById('customerPhone').textContent = data.customerPhone || '';
        document.getElementById('customerEmail').textContent = data.customerEmail || '';
        document.getElementById('customerAddress').textContent = data.customerAddress || '';

        // Populate Invoices Tab
        const tableInvoiceNumber = document.getElementById('tableInvoiceNumber');
        if (tableInvoiceNumber) tableInvoiceNumber.textContent = data.invoiceNumber || '';

        const tableCurrentlyDue = document.getElementById('tableCurrentlyDue');
        if (tableCurrentlyDue) tableCurrentlyDue.textContent = data.currentlyDue || '';
        
        const tablePaidAmount = document.getElementById('tablePaidAmount');
        if (tablePaidAmount) tablePaidAmount.textContent = data.paidAmount || '';
        
        const tableDateCreated = document.getElementById('tableDateCreated');
        if (tableDateCreated) tableDateCreated.textContent = data.dateCreated || '';
        
        const tableDateSent = document.getElementById('tableDateSent');
        if (tableDateSent) tableDateSent.textContent = data.dateSent || '';
        
        const statusEl = document.getElementById('tableStatus');
        if (statusEl) {
            statusEl.textContent = data.status || 'N/A';
            if (data.status === 'Fully Paid' || data.status === 'Paid') {
                statusEl.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800';
            } else if (data.status === 'Unpaid') {
                statusEl.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
            } else {
                statusEl.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
            }
        }
    }
    
    /**
     * Generates a PDF for the invoice details.
     * @param {object} invoiceData - The invoice data object.
     */
    function generateInvoiceDetailsPDF(invoiceData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const logoImg = new Image();
        logoImg.src = '../images/logo.png';
        logoImg.onload = function() {
            doc.addImage(logoImg, 'PNG', 15, 10, 50, 22);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('INVOICE', 170, 22, { align: 'right' });
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text('BILL TO', 15, 45);
            doc.setFont('helvetica', 'bold');
            doc.text('HOME OWNER:', 15, 53);
            doc.text('ADDRESS:', 15, 60);
            doc.text('EMAIL:', 15, 67);
            doc.text('PHONE:', 15, 74);
            doc.setFont('helvetica', 'normal');
            doc.text(invoiceData.customerName || 'N/A', 50, 53);
            const addressLines = doc.splitTextToSize(invoiceData.customerAddress || 'N/A', 65);
            doc.text(addressLines, 50, 60);
            const addressHeight = (addressLines.length > 1) ? 7 : 0;
            doc.text(invoiceData.customerEmail || 'N/A', 50, 67 + addressHeight);
            doc.text(invoiceData.customerPhone || 'N/A', 50, 74 + addressHeight);
            doc.setFont('helvetica', 'bold');
            doc.text('INVOICE NO.', 120, 53);
            doc.text('INVOICE DATE:', 120, 60);
            doc.text('DUE DATE:', 120, 67);
            doc.setFont('helvetica', 'normal');
            doc.text(invoiceData.invoiceNumber || 'N/A', 150, 53);
            doc.text(invoiceData.dateCreated || 'March 13, 2025', 150, 60);
            doc.text(invoiceData.dateDue || 'June 12, 2025', 150, 67);
            doc.autoTable({
                startY: 85,
                head: [[
                    { content: 'Service', styles: { fillColor: [0, 128, 0] } }, { content: 'Qty', styles: { fillColor: [0, 128, 0] } },
                    { content: 'Price', styles: { fillColor: [0, 128, 0] } }, { content: 'Discount', styles: { fillColor: [0, 128, 0] } },
                    { content: 'Tax', styles: { fillColor: [0, 128, 0] } }, { content: 'Total Amount', styles: { fillColor: [0, 128, 0] } },
                    { content: 'Currently Due', styles: { fillColor: [0, 128, 0] } }, { content: 'Paid Amount', styles: { fillColor: [0, 128, 0] } },
                    { content: 'Balance', styles: { fillColor: [0, 128, 0] } }
                ]],
                body: [
                    [
                        invoiceData.item || 'Office Cleaning Package', invoiceData.qty || '1', invoiceData.unitCost || '$300.00',
                        invoiceData.discount || '$0.00', invoiceData.tax || '$0.00', invoiceData.totalAmount || '$300.00',
                        invoiceData.currentlyDue || 'N/A', invoiceData.paidAmount || 'N/A', invoiceData.balance || 'N/A'
                    ],
                    [{ content: 'TOTAL', styles: { fontStyle: 'bold' } }, '', '', '', '',
                        invoiceData.totalAmount || '$300.00', invoiceData.currentlyDue || 'N/A',
                        invoiceData.paidAmount || 'N/A', invoiceData.balance || 'N/A'
                    ]
                ],
                theme: 'grid',
                headStyles: { textColor: 255, fontStyle: 'bold', halign: 'center' },
                bodyStyles: { halign: 'center' },
                columnStyles: { 0: { halign: 'left' } }
            });
            let y = doc.lastAutoTable.finalY + 10;
            doc.setFont('helvetica', 'bold');
            doc.text('Subtotal', 140, y);
            doc.text(invoiceData.totalAmount || '$300.00', 200, y, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            doc.text('Discount:', 140, y + 7);
            doc.text(invoiceData.discount || '$0.00', 200, y + 7, { align: 'right' });
            doc.text('Sales Tax:', 140, y + 14);
            doc.text(invoiceData.tax || '$0.00', 200, y + 14, { align: 'right' });
            doc.setFont('helvetica', 'bold');
            doc.text('Total:', 140, y + 21);
            doc.text(invoiceData.totalAmount || '$300.00', 200, y + 21, { align: 'right' });
            doc.text('Total Current Due:', 140, y + 32);
            doc.text(invoiceData.currentlyDue || 'N/A', 200, y + 32, { align: 'right' });
            doc.text('Total Paid:', 140, y + 39);
            doc.text(invoiceData.paidAmount || 'N/A', 200, y + 39, { align: 'right' });
            doc.setFont('helvetica', 'bold');
            doc.text('Remainder Balance:', 140, y + 46);
            doc.text(invoiceData.balance || 'N/A', 200, y + 46, { align: 'right' });
            window.open(doc.output('bloburl'), '_blank');
        };
    }
}); 