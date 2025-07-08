// automation.js

document.addEventListener('DOMContentLoaded', function() {
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');
    // Modal logic
    const addBtn = document.getElementById('addAutomationBtn');
    const modalOverlay = document.getElementById('addAutomationModalOverlay');
    const modal = document.getElementById('addAutomationModal');
    const closeModalBtn = document.getElementById('closeAddAutomationModal');
    const addForm = document.getElementById('addAutomationForm');

    function openModal() {
        if (modalOverlay && modal) {
            modalOverlay.classList.remove('hidden');
            setTimeout(() => {
                modalOverlay.classList.add('bg-opacity-40');
                modal.classList.remove('scale-95', 'opacity-0');
                modal.classList.add('scale-100', 'opacity-100');
            }, 10);
            document.body.classList.add('overflow-hidden');
        }
    }
    function closeModal() {
        if (modalOverlay && modal) {
            modal.classList.remove('scale-100', 'opacity-100');
            modal.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                modalOverlay.classList.add('hidden');
                modalOverlay.classList.remove('bg-opacity-40');
            }, 200);
            document.body.classList.remove('overflow-hidden');
        }
    }
    if (addBtn) {
        addBtn.addEventListener('click', openModal);
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });
    }
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // TODO: Save logic here
            closeModal();
        });
    }
    // Dropdown logic
    document.addEventListener('click', function(event) {
        if (actionsDropdown && actionsMenu) {
            if (actionsDropdown.contains(event.target)) {
                actionsMenu.classList.toggle('hidden');
            } else if (!actionsMenu.contains(event.target)) {
                actionsMenu.classList.add('hidden');
            }
        }
        if (moreDropdown && moreMenu) {
            if (moreDropdown.contains(event.target)) {
                moreMenu.classList.toggle('hidden');
            } else if (!moreMenu.contains(event.target)) {
                moreMenu.classList.add('hidden');
            }
        }
    });
    // Edit Sequences button logic
    document.addEventListener('click', function(e) {
        const editBtn = e.target.closest('button');
        if (editBtn && editBtn.textContent.includes('Edit Sequences')) {
            // Optionally, pass the automation name as a query param
            // window.location.href = 'edit-sequences.html?name=' + encodeURIComponent(name);
            window.location.href = 'edit-sequences.html';
        }
    });

    // Edit Automation Name modal logic
    const editNameModalOverlay = document.getElementById('editAutomationNameModalOverlay');
    const editNameModal = document.getElementById('editAutomationNameModal');
    const closeEditNameModalBtn = document.getElementById('closeEditAutomationNameModal');
    const editNameForm = document.getElementById('editAutomationNameForm');
    const editNameInput = document.getElementById('editAutomationNameInput');
    const cancelEditNameBtn = document.getElementById('cancelEditAutomationName');

    let currentNameCell = null;

    function openEditNameModal(nameCell) {
        if (editNameModalOverlay && editNameModal && editNameInput) {
            editNameInput.value = nameCell.textContent;
            editNameModalOverlay.classList.remove('hidden');
            setTimeout(() => {
                editNameModalOverlay.classList.add('bg-opacity-40');
                editNameModal.classList.remove('scale-95', 'opacity-0');
                editNameModal.classList.add('scale-100', 'opacity-100');
            }, 10);
            document.body.classList.add('overflow-hidden');
            currentNameCell = nameCell;
        }
    }
    function closeEditNameModal() {
        if (editNameModalOverlay && editNameModal) {
            editNameModal.classList.remove('scale-100', 'opacity-100');
            editNameModal.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                editNameModalOverlay.classList.add('hidden');
                editNameModalOverlay.classList.remove('bg-opacity-40');
            }, 200);
            document.body.classList.remove('overflow-hidden');
            currentNameCell = null;
        }
    }
    // Attach event listeners to Edit Name buttons (desktop and mobile)
    document.addEventListener('click', function(e) {
        const editNameBtn = e.target.closest('button');
        if (editNameBtn && editNameBtn.textContent.includes('Edit Name')) {
            // Find the corresponding name cell
            let nameCell = null;
            // Desktop table
            const row = editNameBtn.closest('tr');
            if (row) {
                nameCell = row.querySelector('td');
            } else {
                // Mobile card
                const card = editNameBtn.closest('.bg-white.rounded-lg.shadow.p-2.mb-1');
                if (card) {
                    nameCell = card.querySelector('span.text-sky-500');
                }
            }
            if (nameCell) {
                openEditNameModal(nameCell);
            }
        }
    });
    if (closeEditNameModalBtn) {
        closeEditNameModalBtn.addEventListener('click', closeEditNameModal);
    }
    if (cancelEditNameBtn) {
        cancelEditNameBtn.addEventListener('click', closeEditNameModal);
    }
    if (editNameModalOverlay) {
        editNameModalOverlay.addEventListener('click', function(e) {
            if (e.target === editNameModalOverlay) closeEditNameModal();
        });
    }
    if (editNameForm) {
        editNameForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (currentNameCell && editNameInput.value.trim()) {
                currentNameCell.textContent = editNameInput.value.trim();
            }
            closeEditNameModal();
        });
    }

    // Duplicate Confirmation modal logic
    const duplicateModalOverlay = document.getElementById('duplicateConfirmModalOverlay');
    const duplicateModal = document.getElementById('duplicateConfirmModal');
    const cancelDuplicateBtn = document.getElementById('cancelDuplicateBtn');
    const confirmDuplicateBtn = document.getElementById('confirmDuplicateBtn');
    const duplicateIconAnim = document.getElementById('duplicateIconAnim');

    function openDuplicateModal() {
        if (duplicateModalOverlay && duplicateModal) {
            duplicateModalOverlay.classList.remove('hidden');
            setTimeout(() => {
                duplicateModalOverlay.classList.add('bg-opacity-40');
                duplicateModal.classList.remove('scale-95', 'opacity-0');
                duplicateModal.classList.add('scale-100', 'opacity-100');
            }, 10);
            document.body.classList.add('overflow-hidden');
        }
    }
    function closeDuplicateModal() {
        if (duplicateModalOverlay && duplicateModal) {
            duplicateModal.classList.remove('scale-100', 'opacity-100');
            duplicateModal.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                duplicateModalOverlay.classList.add('hidden');
                duplicateModalOverlay.classList.remove('bg-opacity-40');
            }, 200);
            document.body.classList.remove('overflow-hidden');
            if (duplicateIconAnim) {
                duplicateIconAnim.classList.remove('fa-spin');
            }
        }
    }
    // Attach event listeners to Duplicate buttons (desktop and mobile)
    document.addEventListener('click', function(e) {
        const duplicateBtn = e.target.closest('button');
        if (duplicateBtn && duplicateBtn.textContent.includes('Duplicate')) {
            // Avoid triggering on the modal's own button
            if (!duplicateBtn.closest('#duplicateConfirmModal')) {
                openDuplicateModal();
            }
        }
    });
    if (cancelDuplicateBtn) {
        cancelDuplicateBtn.addEventListener('click', closeDuplicateModal);
    }
    if (duplicateModalOverlay) {
        duplicateModalOverlay.addEventListener('click', function(e) {
            if (e.target === duplicateModalOverlay) closeDuplicateModal();
        });
    }
    if (confirmDuplicateBtn) {
        confirmDuplicateBtn.addEventListener('click', function() {
            if (duplicateIconAnim) {
                duplicateIconAnim.classList.add('fa-spin');
            }
            setTimeout(() => {
                closeDuplicateModal();
                // TODO: Add actual duplication logic here if needed
            }, 1000); // Animation duration
        });
    }

    // Delete Confirmation modal logic
    const deleteAutomationModal = document.getElementById('deleteAutomationModal');
    const cancelDeleteAutomation = document.getElementById('cancelDeleteAutomation');
    const confirmDeleteAutomation = document.getElementById('confirmDeleteAutomation');
    let automationToDelete = null;

    function openDeleteAutomationModal(target) {
        if (deleteAutomationModal) {
            deleteAutomationModal.classList.remove('hidden');
            const modalContent = deleteAutomationModal.querySelector('.modal-content-modern');
            setTimeout(() => {
                modalContent.classList.add('show');
            }, 10);
            document.body.classList.add('overflow-hidden');
            automationToDelete = target;
        }
    }
    function closeDeleteAutomationModal() {
        if (deleteAutomationModal) {
            const modalContent = deleteAutomationModal.querySelector('.modal-content-modern');
            modalContent.classList.remove('show');
            setTimeout(() => {
                deleteAutomationModal.classList.add('hidden');
            }, 200);
            document.body.classList.remove('overflow-hidden');
            automationToDelete = null;
        }
    }
    document.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('button');
        if (deleteBtn && deleteBtn.textContent.includes('Delete')) {
            // Avoid triggering on the modal's own button
            if (!deleteBtn.closest('#deleteAutomationModal')) {
                // Find the row or card to delete
                let target = null;
                const row = deleteBtn.closest('tr');
                if (row) {
                    target = row;
                } else {
                    const card = deleteBtn.closest('.bg-white.rounded-lg.shadow.p-2.mb-1');
                    if (card) {
                        target = card;
                    }
                }
                if (target) {
                    openDeleteAutomationModal(target);
                }
            }
        }
    });
    if (cancelDeleteAutomation) {
        cancelDeleteAutomation.addEventListener('click', closeDeleteAutomationModal);
    }
    if (confirmDeleteAutomation) {
        confirmDeleteAutomation.addEventListener('click', function() {
            if (automationToDelete) {
                automationToDelete.remove();
            }
            closeDeleteAutomationModal();
        });
    }
}); 