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

    const createReportForm = document.getElementById('createReportForm');
    if (createReportForm) {
        createReportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real application, you would handle form submission here,
            // for example, by sending the data to a server.
            console.log('Create report form submitted');
            
            // For demonstration, we can collect the form data.
            const formData = new FormData(createReportForm);
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            // After successful submission, you might redirect the user.
            // window.location.href = 'reports.html';
        });
    }

    // ---
    // The following code was moved from report-details.js for consolidation. 
    // Handles sorting logic on the report details page.
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            const sortKey = e.target.value;
            if (sortKey) {
                // In a real application, you would fetch and sort data here.
                // For this example, we'll just log the selected key.
                console.log(`Sorting by: ${sortKey}`);
            }
        });
    }
}); 