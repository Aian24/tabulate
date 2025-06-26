document.addEventListener('DOMContentLoaded', function() {
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');

    // Toggle actions menu
    if (actionsDropdown && actionsMenu) {
        actionsDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            actionsMenu.classList.toggle('hidden');
            if (moreMenu) {
                moreMenu.classList.add('hidden');
            }
        });
    }

    // Toggle more menu
    if (moreDropdown && moreMenu) {
        moreDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            moreMenu.classList.toggle('hidden');
            if (actionsMenu) {
                actionsMenu.classList.add('hidden');
            }
        });
    }

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (actionsMenu && !actionsMenu.classList.contains('hidden')) {
            if (!actionsDropdown.contains(e.target)) {
                actionsMenu.classList.add('hidden');
            }
        }
        if (moreMenu && !moreMenu.classList.contains('hidden')) {
            if (!moreDropdown.contains(e.target)) {
                moreMenu.classList.add('hidden');
            }
        }
    });

    // Add click event to each row in the reports table to navigate to report-details.html
    const reportsTableRows = document.querySelectorAll('table tbody tr');
    reportsTableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Prevent navigation if a checkbox or button is clicked
            if (e.target.closest('input[type="checkbox"]') || e.target.closest('button')) {
                return;
            }
            // Get the report name from the row
            const reportName = row.querySelector('td:nth-child(2)').textContent.trim();
            // Redirect to report-details.html with report name as query param
            window.location.href = `report-details.html?report=${encodeURIComponent(reportName)}`;
        });
    });
}); 