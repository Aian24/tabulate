document.addEventListener('DOMContentLoaded', function() {
    // Load header and navigation only in the main container
    if (typeof loadHTML === 'function') {
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
            loadHTML('../nav/header.html', 'header-container');
            loadHTML('../nav/navigation.html', 'nav-container');
        }
    }

    // Initialize dropdowns
    initializeDropdowns();

    const createBtn = document.getElementById('createCustomerBtn');
    const modal = document.getElementById('customerCreateModal');
    const closeModal = document.getElementById('closeCustomerCreateModal');
    const form = document.getElementById('customerCreateForm');
    const deletedBtn = document.getElementById('deletedCustomersBtn');
    const deletedModal = document.getElementById('deletedCustomersModal');
    const closeDeletedModal = document.getElementById('closeDeletedCustomersModal');

    function setDefaultValues() {
        if (!form) return;
        const inputs = form.querySelectorAll('input, select, textarea');
        // Personal Information
        inputs[0].value = '';
        inputs[1].value = '';
        inputs[2].value = '';
        inputs[3].value = '';
        inputs[4].value = '';
        inputs[5].value = '';
        inputs[6].value = '';
        inputs[7].value = '';
        // Preferences
        inputs[8].value = '2025-06-16'; // Client Since
        inputs[9].value = '2025-06-16'; // Lead Acquired Date
        inputs[10].value = 'English';
        inputs[11].value = 'Call';
        inputs[12].value = '2025-06-16'; // Payment Terms
        inputs[13].value = 'Cash';
        inputs[14].value = 'Daily';
        inputs[15].value = 'Yes';
        inputs[16].value = 'Tag';
        inputs[17].value = '';
        inputs[18].value = '';
        // Billing Information
        inputs[19].value = 'First Name';
        inputs[20].value = 'Last Name';
        inputs[21].value = 'Phone';
        inputs[22].value = 'Email';
        inputs[23].value = 'Street';
        inputs[24].value = 'State';
        inputs[25].value = 'City';
        inputs[26].value = 'Zip';
    }

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

    if (deletedBtn && deletedModal && closeDeletedModal) {
        deletedBtn.addEventListener('click', function() {
            deletedModal.classList.remove('hidden');
            deletedModal.classList.add('flex');
            // Initialize DataTable if not already initialized
            if (!$.fn.DataTable.isDataTable('#deletedCustomersTable')) {
                const table = $('#deletedCustomersTable').DataTable({
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

                // Handle select all checkbox
                const selectAllCheckbox = document.getElementById('selectAllDeleted');
                const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');

                if (selectAllCheckbox) {
                    selectAllCheckbox.addEventListener('change', function() {
                        const checkboxes = document.querySelectorAll('.customer-checkbox');
                        checkboxes.forEach(checkbox => {
                            checkbox.checked = this.checked;
                        });
                        updateRestoreButtonVisibility();
                    });
                }

                // Handle individual checkboxes
                document.addEventListener('change', function(e) {
                    if (e.target.classList.contains('customer-checkbox')) {
                        updateRestoreButtonVisibility();
                        updateSelectAllCheckbox();
                    }
                });

                // Handle restore selected button
                if (restoreSelectedBtn) {
                    restoreSelectedBtn.addEventListener('click', function() {
                        const selectedCustomers = getSelectedCustomers();
                        if (selectedCustomers.length > 0) {
                            // Here you would typically make an API call to restore the customers
                            console.log('Restoring customers:', selectedCustomers);
                            // After successful restore, you might want to:
                            // 1. Remove the rows from the table
                            // 2. Show a success message
                            // 3. Refresh the table
                        }
                    });
                }

                // Handle individual restore buttons
                document.addEventListener('click', function(e) {
                    if (e.target.closest('.restore-btn')) {
                        const row = e.target.closest('tr');
                        const customerData = getCustomerDataFromRow(row);
                        // Here you would typically make an API call to restore the customer
                        console.log('Restoring customer:', customerData);
                    }
                });
            }
        });

        closeDeletedModal.addEventListener('click', function() {
            deletedModal.classList.add('hidden');
            deletedModal.classList.remove('flex');
        });
    }

    // Helper functions for deleted customers modal
    function updateRestoreButtonVisibility() {
        const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
        const checkedBoxes = document.querySelectorAll('.customer-checkbox:checked');
        if (restoreSelectedBtn) {
            restoreSelectedBtn.classList.toggle('hidden', checkedBoxes.length === 0);
        }
    }

    function updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAllDeleted');
        const checkboxes = document.querySelectorAll('.customer-checkbox');
        const checkedBoxes = document.querySelectorAll('.customer-checkbox:checked');
        
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length;
            selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
        }
    }

    function getSelectedCustomers() {
        const selectedCustomers = [];
        document.querySelectorAll('.customer-checkbox:checked').forEach(checkbox => {
            const row = checkbox.closest('tr');
            selectedCustomers.push(getCustomerDataFromRow(row));
        });
        return selectedCustomers;
    }

    function getCustomerDataFromRow(row) {
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

    // Function to initialize dropdowns
    function initializeDropdowns() {
        // Actions dropdown
        const actionsDropdown = document.getElementById('actionsDropdown');
        const actionsMenu = document.getElementById('actionsMenu');
        const moreDropdown = document.getElementById('moreDropdown');
        const moreMenu = document.getElementById('moreMenu');

        if (actionsDropdown && actionsMenu) {
            actionsDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
                actionsMenu.classList.toggle('hidden');
                if (moreMenu) {
                    moreMenu.classList.add('hidden');
                }
            });
        }

        if (moreDropdown && moreMenu) {
            moreDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
                moreMenu.classList.toggle('hidden');
                if (actionsMenu) {
                    actionsMenu.classList.add('hidden');
                }
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (actionsMenu && !actionsDropdown?.contains(e.target) && !actionsMenu.contains(e.target)) {
                actionsMenu.classList.add('hidden');
            }
            if (moreMenu && !moreDropdown?.contains(e.target) && !moreMenu.contains(e.target)) {
                moreMenu.classList.add('hidden');
            }
        });

        // Handle dropdown menu item clicks
        if (actionsMenu) {
            const actionsMenuItems = actionsMenu.querySelectorAll('button');
            actionsMenuItems.forEach(item => {
                item.addEventListener('click', function() {
                    const action = this.querySelector('span')?.textContent;
                    if (action) {
                        switch(action) {
                            case 'Delete':
                                // Handle delete action
                                console.log('Delete action clicked');
                                break;
                            // Add more cases as needed
                        }
                        actionsMenu.classList.add('hidden');
                    }
                });
            });
        }

        if (moreMenu) {
            const moreMenuItems = moreMenu.querySelectorAll('button');
            moreMenuItems.forEach(item => {
                item.addEventListener('click', function() {
                    const action = this.querySelector('span')?.textContent;
                    if (action) {
                        switch(action) {
                            case 'Settings':
                                // Handle settings action
                                console.log('Settings clicked');
                                break;
                            case 'Report':
                                // Handle report action
                                console.log('Report clicked');
                                break;
                            case 'Audit Trail':
                                // Handle audit trail action
                                console.log('Audit Trail clicked');
                                break;
                        }
                        moreMenu.classList.add('hidden');
                    }
                });
            });
        }
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
        if (e.target === deletedModal) {
            deletedModal.classList.add('hidden');
        }
    });
}); 