// roles.js
// Scripts for managing the Permissions (Roles) table

// Placeholder for future code

document.addEventListener('DOMContentLoaded', function() {
    // Modal open/close logic
    const createBtn = document.getElementById('createRoleButton');
    const modal = document.getElementById('addRoleModal');
    const closeModalBtn = document.getElementById('closeAddRoleModal');
    const closeModalBtn2 = document.getElementById('closeAddRoleModalBtn');

    if (createBtn && modal) {
        createBtn.addEventListener('click', function() {
            modal.classList.remove('hidden');
            modal.classList.add('animate-fade-in');
        });
    }
    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('animate-fade-in');
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeModalBtn2) closeModalBtn2.addEventListener('click', closeModal);

    // Actions and More dropdown logic (from rules.js)
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');
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
}); 