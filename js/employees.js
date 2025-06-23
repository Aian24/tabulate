document.addEventListener('DOMContentLoaded', function () {
    const isDeletedPage = window.location.pathname.includes('deleted-employees.html');
    const isEmployeeListPage = window.location.pathname.includes('employee.html');

    if (isDeletedPage) {
        initializeDeletedEmployeesCheckboxes();
    }

    if (isEmployeeListPage) {
        initializeEmployeeRowClicks();
    }
});

function initializeDeletedEmployeesCheckboxes() {
    const selectAllCheckbox = document.getElementById('selectAllDeleted');
    const itemCheckboxes = document.querySelectorAll('.employee-checkbox');
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');

    function updateRestoreButtonVisibility() {
        const anySelected = Array.from(itemCheckboxes).some(cb => cb.checked);
        if (restoreSelectedBtn) {
            restoreSelectedBtn.classList.toggle('hidden', !anySelected);
        }
         if (restoreSelectedBtnMobile) {
            restoreSelectedBtnMobile.style.display = anySelected ? 'flex' : 'none';
        }
    }

    function updateSelectAllCheckbox() {
        const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = allChecked;
        }
    }

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function () {
            itemCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
            updateRestoreButtonVisibility();
        });
    }

    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            updateSelectAllCheckbox();
            updateRestoreButtonVisibility();
        });
    });

    // Initial state
    updateRestoreButtonVisibility();
} 

function initializeEmployeeRowClicks() {
    // Select all rows except the header
    const rows = document.querySelectorAll('table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', function (e) {
            // Prevent checkbox clicks from triggering row click
            if (e.target.tagName.toLowerCase() === 'input') return;
            // Get the employee ID from the second cell (index 1)
            const idCell = row.querySelector('td:nth-child(2)');
            if (idCell) {
                const employeeId = idCell.textContent.trim();
                window.location.href = `employee-details.html?id=${employeeId}`;
            }
        });
    });
} 