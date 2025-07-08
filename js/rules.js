// rules.js

document.addEventListener('DOMContentLoaded', function() {
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