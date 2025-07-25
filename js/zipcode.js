// zipcode.js
// Scripts for managing the Zip Codes table and dropdowns

document.addEventListener('DOMContentLoaded', function() {
    // Example data for Zip Codes
    const exampleZipCodes = [
        { zip: '90210', area: 'Beverly Hills', created: '2024-04-01', updated: '2024-04-10' },
        { zip: '10001', area: 'New York', created: '2024-03-15', updated: '2024-04-09' },
        { zip: '60611', area: 'Chicago', created: '2024-02-20', updated: '2024-03-01' },
        { zip: '94105', area: 'San Francisco', created: '2024-01-10', updated: '2024-02-15' }
    ];

    // Populate the table
    const tableBody = document.getElementById('zipcodeTableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
        exampleZipCodes.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4"><input type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"></td>
                <td class="px-6 py-4">${data.zip}</td>
                <td class="px-6 py-4">${data.area}</td>
                <td class="px-6 py-4">${data.created}</td>
                <td class="px-6 py-4">${data.updated}</td>
            `;
            // Add click event to row (excluding the checkbox)
            row.style.cursor = 'pointer';
            row.addEventListener('click', function(e) {
                // Prevent navigation if checkbox is clicked
                if (e.target.tagName.toLowerCase() === 'input' && e.target.type === 'checkbox') return;
                window.location.href = `zip-details.html?zip=${encodeURIComponent(data.zip)}`;
            });
            tableBody.appendChild(row);
        });
    }

    // Create button logic: navigate to create-zip.html
    const createBtn = document.getElementById('createRoleButton');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            window.location.href = 'create-zip.html';
        });
    }

    // Actions and More dropdown logic (from roles.js)
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