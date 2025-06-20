document.addEventListener('DOMContentLoaded', function() {
    // Actions dropdown functionality
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');

    // Toggle actions menu
    if (actionsDropdown && actionsMenu) {
        actionsDropdown.addEventListener('click', () => {
            actionsMenu.classList.toggle('hidden');
            if (moreMenu) moreMenu.classList.add('hidden');
        });
    }

    // Toggle more menu
    if (moreDropdown && moreMenu) {
        moreDropdown.addEventListener('click', () => {
            moreMenu.classList.toggle('hidden');
            if (actionsMenu) actionsMenu.classList.add('hidden');
        });
    }

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (actionsDropdown && moreDropdown) {
            if (!actionsDropdown.contains(e.target) && !moreDropdown.contains(e.target)) {
                if (actionsMenu) actionsMenu.classList.add('hidden');
                if (moreMenu) moreMenu.classList.add('hidden');
            }
        }
    });

    // Modal and button elements
    const createBtn = document.getElementById('createEmployeeBtn');
    const modal = document.getElementById('employeeCreateModal');
    const closeModal = document.getElementById('closeEmployeeCreateModal');
    const form = document.getElementById('employeeCreateForm');
    const deletedBtn = document.getElementById('deletedEmployeesBtn');
    const deletedModal = document.getElementById('deletedEmployeesModal');
    const closeDeletedModal = document.getElementById('closeDeletedEmployeesModal');

    // Set default values for the create employee form
    function setDefaultValues() {
        if (!form) return;
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else if (input.type === 'select-one') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });
        // Set default dates if needed
        const today = new Date().toISOString().split('T')[0];
        form.querySelectorAll('input[type="date"]').forEach(dateInput => {
            dateInput.value = today;
        });
    }

    // Open Create Employee Modal
    if (createBtn && modal && closeModal) {
        createBtn.addEventListener('click', function() {
            setDefaultValues();
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
        closeModal.addEventListener('click', function() {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }

    // Open Deleted Employees Modal
    if (deletedBtn && deletedModal && closeDeletedModal) {
        deletedBtn.addEventListener('click', function() {
            deletedModal.classList.remove('hidden');
            deletedModal.classList.add('flex');
            // Initialize DataTable if not already initialized
            if (window.jQuery && !$.fn.DataTable.isDataTable('#deletedEmployeesTable')) {
                $('#deletedEmployeesTable').DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
                    language: {
                        search: "",
                        searchPlaceholder: "Search...",
                        lengthMenu: "Show _MENU_ entries",
                        info: "Showing _START_ to _END_ of _TOTAL_ entries",
                        infoEmpty: "Showing 0 to 0 of 0 entries",
                        infoFiltered: "(filtered from _MAX_ total entries)",
                        paginate: {
                            first: '<i class="fas fa-angle-double-left"></i>',
                            previous: '<i class="fas fa-angle-left"></i>',
                            next: '<i class="fas fa-angle-right"></i>',
                            last: '<i class="fas fa-angle-double-right"></i>'
                        }
                    }
                });
            }
        });
        closeDeletedModal.addEventListener('click', function() {
            deletedModal.classList.add('hidden');
            deletedModal.classList.remove('flex');
        });
    }

    // Helper functions for deleted employees modal
    function updateRestoreButtonVisibility() {
        const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
        const checkedBoxes = document.querySelectorAll('.employee-checkbox:checked');
        if (restoreSelectedBtn) {
            restoreSelectedBtn.classList.toggle('hidden', checkedBoxes.length === 0);
        }
    }

    function updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAllDeleted');
        const checkboxes = document.querySelectorAll('.employee-checkbox');
        const checkedBoxes = document.querySelectorAll('.employee-checkbox:checked');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length;
            selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
        }
    }

    function getSelectedEmployees() {
        const selectedEmployees = [];
        document.querySelectorAll('.employee-checkbox:checked').forEach(checkbox => {
            const row = checkbox.closest('tr');
            selectedEmployees.push(getEmployeeDataFromRow(row));
        });
        return selectedEmployees;
    }

    function getEmployeeDataFromRow(row) {
        const cells = row.querySelectorAll('td');
        return {
            name: cells[1].textContent,
            phone: cells[2].textContent,
            email: cells[3].textContent,
            verificationStatus: cells[4].querySelector('span').textContent,
            accountStatus: cells[5].querySelector('span').textContent,
            dateRegistered: cells[6].textContent,
            dateDeleted: cells[7].textContent
        };
    }

    // Select all and restore logic for deleted employees
    const selectAllCheckbox = document.getElementById('selectAllDeleted');
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.employee-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateRestoreButtonVisibility();
        });
    }
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('employee-checkbox')) {
            updateRestoreButtonVisibility();
            updateSelectAllCheckbox();
        }
    });
    if (restoreSelectedBtn) {
        restoreSelectedBtn.addEventListener('click', function() {
            const selectedEmployees = getSelectedEmployees();
            if (selectedEmployees.length > 0) {
                // Placeholder for restore logic
                console.log('Restoring employees:', selectedEmployees);
            }
        });
    }
    document.addEventListener('click', function(e) {
        if (e.target.closest('.restore-btn')) {
            const row = e.target.closest('tr');
            const employeeData = getEmployeeDataFromRow(row);
            // Placeholder for restore logic
            console.log('Restoring employee:', employeeData);
        }
    });

    // --- FILTER MODAL LOGIC FOR EMPLOYEES ---
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the table
            const rows = document.querySelectorAll('table tbody tr');
            const ids = new Set();
            const firstNames = new Set();
            const lastNames = new Set();
            const emails = new Set();
            const phones = new Set();
            const hireDates = new Set();
            const statuses = new Set();
            rows.forEach(row => {
                ids.add(row.querySelector('td:nth-child(2)')?.textContent.trim() || '');
                firstNames.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                lastNames.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                emails.add(row.querySelector('td:nth-child(5)')?.textContent.trim() || '');
                phones.add(row.querySelector('td:nth-child(6)')?.textContent.trim() || '');
                hireDates.add(row.querySelector('td:nth-child(7)')?.textContent.trim() || '');
                statuses.add(row.querySelector('td:nth-child(8) span')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class=\"bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]\">
                    <div class=\"flex justify-between items-center mb-4\">
                        <h3 class=\"text-lg font-semibold text-gray-800\">Filter Employees</h3>
                        <button class=\"text-gray-500 hover:text-gray-700\" id=\"closeFilterModal\"><i class=\"fas fa-times\"></i></button>
                    </div>
                    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">ID</label>
                            <select id=\"filterId\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(ids).filter(Boolean).map(id => `<option value=\"${id}\">${id}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">First Name</label>
                            <select id=\"filterFirstName\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(firstNames).filter(Boolean).map(fn => `<option value=\"${fn}\">${fn}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Last Name</label>
                            <select id=\"filterLastName\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(lastNames).filter(Boolean).map(ln => `<option value=\"${ln}\">${ln}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Email</label>
                            <select id=\"filterEmail\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(emails).filter(Boolean).map(e => `<option value=\"${e}\">${e}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Phone</label>
                            <select id=\"filterPhone\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(phones).filter(Boolean).map(p => `<option value=\"${p}\">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Hire Date</label>
                            <select id=\"filterHireDate\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(hireDates).filter(Boolean).map(hd => `<option value=\"${hd}\">${hd}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class=\"block text-sm font-medium text-gray-700 mb-2\">Status</label>
                            <select id=\"filterStatus\" class=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\">
                                <option value=\"\">All</option>
                                ${Array.from(statuses).filter(Boolean).map(s => `<option value=\"${s}\">${s}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class=\"flex justify-end gap-2 mt-6\">
                        <button class=\"px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors\" id=\"resetFilter\">Reset</button>
                        <button class=\"px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors\" id=\"applyFilter\">Apply</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Focus the first dropdown for accessibility
            setTimeout(() => { modal.querySelector('#filterId').focus(); }, 100);

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
                const id = modal.querySelector('#filterId').value;
                const firstName = modal.querySelector('#filterFirstName').value;
                const lastName = modal.querySelector('#filterLastName').value;
                const email = modal.querySelector('#filterEmail').value;
                const phone = modal.querySelector('#filterPhone').value;
                const hireDate = modal.querySelector('#filterHireDate').value;
                const status = modal.querySelector('#filterStatus').value;
                rows.forEach(row => {
                    const rowId = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                    const rowFirstName = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowLastName = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
                    const rowEmail = row.querySelector('td:nth-child(5)')?.textContent.trim() || '';
                    const rowPhone = row.querySelector('td:nth-child(6)')?.textContent.trim() || '';
                    const rowHireDate = row.querySelector('td:nth-child(7)')?.textContent.trim() || '';
                    const rowStatus = row.querySelector('td:nth-child(8) span')?.textContent.trim() || '';
                    const match =
                        (!id || rowId === id) &&
                        (!firstName || rowFirstName === firstName) &&
                        (!lastName || rowLastName === lastName) &&
                        (!email || rowEmail === email) &&
                        (!phone || rowPhone === phone) &&
                        (!hireDate || rowHireDate === hireDate) &&
                        (!status || rowStatus === status);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }
}); 