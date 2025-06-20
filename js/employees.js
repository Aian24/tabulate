document.addEventListener('DOMContentLoaded', function () {
    const isDeletedPage = window.location.pathname.includes('deleted-employees.html');

    if (isDeletedPage) {
        initializeDeletedEmployeesCheckboxes();
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