document.addEventListener('DOMContentLoaded', function() {
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
}); 