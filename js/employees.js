// NOTE FOR DEVELOPERS:
// The contents of employee.js have been merged into this file (employees.js) for consolidation and maintainability.
// The original employee.js file has been deleted. Please add any new employee-related scripts here.
// -- Merge performed on [date].

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

// =====================
// Employee Details Page Logic
// =====================
// The following code is used exclusively for the employee-details.html page.
// It handles rendering employee details, tab switching, modals, and navigation.
//
// Author: [Your Name or Team]
// Date: [Date of Move]
//
// ---------------------
// Static employee data for demo purposes. In production, replace with API calls.
const employeeDetailsData = {
    '19': {
        initials: 'CM', name: 'carl louis manuel', memberSince: 'March 13, 2025', email: 'carllouismanuel09@gmail.com', phone: '09953076751', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '20': {
        initials: 'OB', name: 'oshwald briones', memberSince: 'March 13, 2025', email: 'oshwaldo@gmail.ocm', phone: '09262626262', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '21': {
        initials: 'JR', name: 'Joshua Rolluqui', memberSince: 'March 13, 2025', email: 'joshrolluqui@gmail.com', phone: '09753565927', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '22': {
        initials: 'CK', name: 'Customerkim@gmail.com', memberSince: 'March 14, 2025', email: 'Customerkim@gmail.com', phone: 'N/A', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '23': {
        initials: 'VK', name: 'vedrio.kimmmm@gmail.com', memberSince: 'March 14, 2025', email: 'N/A', phone: 'N/A', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '24': {
        initials: 'KN', name: 'Kim Nuevo', memberSince: 'March 14, 2025', email: 'kbrijetnuevo@gmail.com', phone: '06548791353', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '25': {
        initials: 'RA', name: 'rence art', memberSince: 'March 14, 2025', email: 'clarence.artisen00@gmail.com', phone: '0975222462', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '26': {
        initials: 'JA', name: 'Jesse Abajar', memberSince: 'March 14, 2025', email: 'rentifyapartment@gmail.com', phone: '0987654321', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '27': {
        initials: 'RB', name: 'renne ball', memberSince: 'March 14, 2025', email: 'anthonygabamurao@gmail.com', phone: 'N/A', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '28': {
        initials: 'NN', name: 'N/A N/A', memberSince: 'March 14, 2025', email: 'mendozamark1233@gmail.com', phone: 'N/A', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '29': {
        initials: 'NN', name: 'N/A N/A', memberSince: 'March 18, 2025', email: 'zacblau@gmail.com', phone: 'N/A', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '30': {
        initials: 'NN', name: 'N/A N/A', memberSince: 'March 18, 2025', email: 'zac@tabletcrm.com', phone: 'N/A', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '31': {
        initials: 'NN', name: 'N/A N/A', memberSince: 'March 21, 2025', email: 'supahshin@gmail.com', phone: 'N/A', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '32': {
        initials: 'QA', name: 'qqq ASDASDAS', memberSince: 'March 24, 2025', email: '3123123', phone: 'eQEQWEWQEQWEQWee@gmail.com', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '33': {
        initials: 'NN', name: 'N/A N/A', memberSince: 'March 30, 2025', email: 'deguzman124@gmail.com', phone: 'N/A', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '34': {
        initials: 'NN', name: 'N/A N/A', memberSince: 'April 2, 2025', email: 'dt.jessie7@gmail.com', phone: 'N/A', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '35': {
        initials: 'JA', name: 'Jesse Abajar', memberSince: 'April 3, 2025', email: 'arawarawbbko@gmail.com', phone: '09943946562', address1: '', address2: '', emergency: {}, spouse: {}
    },
    '36': {
        initials: 'RL', name: 'Ryan Lester', memberSince: 'April 3, 2025', email: 'rbulot12@gmail.com', phone: '09278508894', address1: '', address2: '', emergency: {}, spouse: {}
    }
};

/**
 * Utility to get a query parameter from the URL
 * @param {string} param - The parameter name
 * @returns {string|null}
 */
function getEmployeeQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Render the employee details on the page
 * @param {object} employee - Employee data object
 */
function renderEmployeeDetails(employee) {
    document.getElementById('employeeNameHeader').textContent = employee.name;
    document.getElementById('employeeEmail').textContent = employee.email;
    document.getElementById('employeePhone').textContent = employee.phone;
    document.getElementById('employeeAddress').textContent = (employee.address1 || '') + (employee.address2 ? ('\n' + employee.address2) : '');
}

// Main logic for employee-details page
(function initEmployeeDetailsPage() {
    const nameHeader = document.getElementById('employeeNameHeader');
    if (!nameHeader) return; // Only run on employee-details.html

    const id = getEmployeeQueryParam('id');
    if (id && employeeDetailsData[id]) {
        renderEmployeeDetails(employeeDetailsData[id]);
    } else {
        document.getElementById('employeeNameHeader').textContent = 'Not Found';
        document.getElementById('employeeEmail').textContent = 'Not Found';
        document.getElementById('employeePhone').textContent = 'Not Found';
        document.getElementById('employeeAddress').textContent = 'Not Found';
    }

    // Tab switching logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-panel').forEach(panel => {
                if (panel.getAttribute('data-tab') === tab) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            });
        });
    });

    // Dropdown logic for finances
    const select = document.getElementById('financeDropdown');
    if (select) {
        select.addEventListener('change', function() {
            document.querySelectorAll('.finance-section').forEach(sec => sec.classList.add('hidden'));
            document.getElementById('finance-' + this.value).classList.remove('hidden');
        });
    }

    // Create Bonus modal logic
    const openBtn = document.getElementById('openCreateBonus');
    const modal = document.getElementById('createBonusModal');
    const cancelBtn = document.getElementById('cancelCreateBonus');
    if (openBtn && modal) {
        openBtn.addEventListener('click', function() {
            modal.classList.remove('hidden');
        });
    }
    if (cancelBtn && modal) {
        cancelBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
    }
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }
    document.getElementById('createBonusForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        modal.classList.add('hidden');
        // Add logic to save bonus here
    });

    // Create Deduction modal logic
    const openDeductionBtn = document.getElementById('openCreateDeduction');
    const deductionModal = document.getElementById('createDeductionModal');
    const cancelDeductionBtn = document.getElementById('cancelCreateDeduction');
    if (openDeductionBtn && deductionModal) {
        openDeductionBtn.addEventListener('click', function() {
            deductionModal.classList.remove('hidden');
        });
    }
    if (cancelDeductionBtn && deductionModal) {
        cancelDeductionBtn.addEventListener('click', function() {
            deductionModal.classList.add('hidden');
        });
    }
    if (deductionModal) {
        deductionModal.addEventListener('click', function(e) {
            if (e.target === deductionModal) deductionModal.classList.add('hidden');
        });
    }
    document.getElementById('createDeductionForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        deductionModal.classList.add('hidden');
        // Add logic to save deduction here
    });

    // Add Leave Policy modal logic
    const openAddLeaveBtn = document.getElementById('openAddLeavePolicyModal');
    const addLeaveModal = document.getElementById('addLeavePolicyModal');
    const closeAddLeaveBtn = document.getElementById('closeAddLeavePolicyModal');
    const cancelAddLeaveBtn = document.getElementById('cancelAddLeavePolicy');
    if (openAddLeaveBtn && addLeaveModal) {
        openAddLeaveBtn.addEventListener('click', function() {
            addLeaveModal.classList.remove('hidden');
        });
    }
    if (closeAddLeaveBtn && addLeaveModal) {
        closeAddLeaveBtn.addEventListener('click', function() {
            addLeaveModal.classList.add('hidden');
        });
    }
    if (cancelAddLeaveBtn && addLeaveModal) {
        cancelAddLeaveBtn.addEventListener('click', function() {
            addLeaveModal.classList.add('hidden');
        });
    }
    if (addLeaveModal) {
        addLeaveModal.addEventListener('click', function(e) {
            if (e.target === addLeaveModal) addLeaveModal.classList.add('hidden');
        });
    }
    document.getElementById('addLeavePolicyForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addLeaveModal.classList.add('hidden');
        // Add logic to save leave policy here
    });

    // Create Employee Leave modal logic
    const openCreateLeaveBtn = document.getElementById('openCreateLeaveModal');
    const createLeaveModal = document.getElementById('createLeaveModal');
    const cancelCreateLeaveBtn = document.getElementById('cancelCreateLeave');
    if (openCreateLeaveBtn && createLeaveModal) {
        openCreateLeaveBtn.addEventListener('click', function() {
            createLeaveModal.classList.remove('hidden');
        });
    }
    if (cancelCreateLeaveBtn && createLeaveModal) {
        cancelCreateLeaveBtn.addEventListener('click', function() {
            createLeaveModal.classList.add('hidden');
        });
    }
    if (createLeaveModal) {
        createLeaveModal.addEventListener('click', function(e) {
            if (e.target === createLeaveModal) createLeaveModal.classList.add('hidden');
        });
    }
    document.getElementById('createLeaveForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        createLeaveModal.classList.add('hidden');
        // Add logic to save leave here
    });
})();
// =====================
// End code migrated from employee.js
// =====================
// ... existing code ... 

// Modal animation helpers (copied from contractors.js)
function showModal(modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.querySelector('.modal-content-modern').classList.add('show');
    }, 10);
}
function hideModal(modal) {
    modal.querySelector('.modal-content-modern').classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 250);
}
let restoreEmployeeIndex = null;
function showRestoreEmployeeModal(idx) {
    restoreEmployeeIndex = idx;
    const modal = document.getElementById('restoreEmployeeModal');
    if (!modal) return;
    showModal(modal);
}
function hideRestoreEmployeeModal() {
    const modal = document.getElementById('restoreEmployeeModal');
    if (!modal) return;
    hideModal(modal);
    restoreEmployeeIndex = null;
}
function showRestoreSelectedEmployeeModal() {
    const modal = document.getElementById('restoreSelectedEmployeeModal');
    if (!modal) return;
    showModal(modal);
}
function hideRestoreSelectedEmployeeModal() {
    const modal = document.getElementById('restoreSelectedEmployeeModal');
    if (!modal) return;
    hideModal(modal);
}
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('deleted-employees.html')) return;
    // Attach restore button handlers for deleted employees (desktop & mobile)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.restore-btn')) {
            // Find index from table row or card
            let idx = null;
            // Desktop table
            const tr = e.target.closest('tr');
            if (tr) {
                // Find index by row order in tbody
                const tbody = tr.parentElement;
                idx = Array.from(tbody.children).indexOf(tr);
            }
            // Mobile card
            const card = e.target.closest('.mobile-table-row');
            if (card) {
                // Find index by card order in container
                const container = card.parentElement;
                idx = Array.from(container.children).indexOf(card);
            }
            if (idx !== null && idx !== -1) {
                showRestoreEmployeeModal(idx);
            }
        }
    });
    // Restore Selected button handlers (desktop & mobile)
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
    if (restoreSelectedBtn) {
        restoreSelectedBtn.onclick = function(e) {
            e.preventDefault();
            showRestoreSelectedEmployeeModal();
        };
    }
    if (restoreSelectedBtnMobile) {
        restoreSelectedBtnMobile.onclick = function(e) {
            e.preventDefault();
            showRestoreSelectedEmployeeModal();
        };
    }
    // Modal button handlers
    const cancelRestoreBtn = document.getElementById('cancelRestoreEmployee');
    if (cancelRestoreBtn) {
        cancelRestoreBtn.onclick = hideRestoreEmployeeModal;
    }
    const confirmRestoreBtn = document.getElementById('confirmRestoreEmployee');
    if (confirmRestoreBtn) {
        confirmRestoreBtn.onclick = function() {
            if (restoreEmployeeIndex !== null) {
                // Remove employee from table (mock: just hide row)
                // Desktop table
                const table = document.querySelector('table');
                if (table) {
                    const row = table.querySelectorAll('tbody tr')[restoreEmployeeIndex];
                    if (row) row.remove();
                }
                // Mobile card
                const mobileList = document.querySelector('.p-3.space-y-2');
                if (mobileList) {
                    const card = mobileList.children[restoreEmployeeIndex];
                    if (card) card.remove();
                }
            }
            hideRestoreEmployeeModal();
        };
    }
    const cancelRestoreSelectedBtn = document.getElementById('cancelRestoreSelectedEmployee');
    if (cancelRestoreSelectedBtn) {
        cancelRestoreSelectedBtn.onclick = hideRestoreSelectedEmployeeModal;
    }
    const confirmRestoreSelectedBtn = document.getElementById('confirmRestoreSelectedEmployee');
    if (confirmRestoreSelectedBtn) {
        confirmRestoreSelectedBtn.onclick = function() {
            // Remove all checked employees (mock: just hide rows/cards)
            // Desktop table
            const checked = Array.from(document.querySelectorAll('.employee-checkbox:checked'));
            const table = document.querySelector('table');
            if (table) {
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.children);
                checked.forEach(cb => {
                    const tr = cb.closest('tr');
                    if (tr) tr.remove();
                });
            }
            // Mobile cards
            const mobileList = document.querySelector('.p-3.space-y-2');
            if (mobileList) {
                checked.forEach(cb => {
                    const card = cb.closest('.mobile-table-row');
                    if (card) card.remove();
                });
            }
            hideRestoreSelectedEmployeeModal();
        };
    }
}); 