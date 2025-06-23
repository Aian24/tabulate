document.addEventListener('DOMContentLoaded', function() {
    // Actions dropdown functionality
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');

    // Toggle more menu
    moreDropdown.addEventListener('click', () => {
        moreMenu.classList.toggle('hidden');
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!moreDropdown.contains(e.target)) {
            moreMenu.classList.add('hidden');
        }
    });

    // Tab switching functionality
    const payrollTab = document.getElementById('payrollTab');
    const generatedPayrollTab = document.getElementById('generatedPayrollTab');
    const payrollContent = document.getElementById('payrollContent');
    const generatedPayrollContent = document.getElementById('generatedPayrollContent');

    function showPayrollContent() {
        payrollContent.classList.remove('hidden');
        generatedPayrollContent.classList.add('hidden');
        payrollTab.classList.add('text-gray-800');
        payrollTab.classList.remove('text-gray-400');
        generatedPayrollTab.classList.remove('text-gray-800');
        generatedPayrollTab.classList.add('text-gray-400');
    }

    function showGeneratedPayrollContent() {
        payrollContent.classList.add('hidden');
        generatedPayrollContent.classList.remove('hidden');
        generatedPayrollTab.classList.add('text-gray-800');
        generatedPayrollTab.classList.remove('text-gray-400');
        payrollTab.classList.remove('text-gray-800');
        payrollTab.classList.add('text-gray-400');
    }

    payrollTab.addEventListener('click', showPayrollContent);
    generatedPayrollTab.addEventListener('click', showGeneratedPayrollContent);

    // Show payroll content by default
    showPayrollContent();

    // Date selection functionality
    const dateCells = document.querySelectorAll('.date-cell');
    const cutoffDateElement = document.querySelector('.bg-blue-500 p');

    dateCells.forEach(cell => {
        cell.addEventListener('click', () => {
            // Remove selected-date from previously selected cell
            const currentSelected = document.querySelector('.date-cell.selected-date');
            if (currentSelected) {
                currentSelected.classList.remove('selected-date');
                currentSelected.classList.remove('text-white', 'bg-blue-500');
                currentSelected.classList.add('text-gray-700', 'bg-gray-50');
            }

            // Add selected-date to clicked cell
            cell.classList.add('selected-date');
            cell.classList.remove('text-gray-700', 'bg-gray-50');
            cell.classList.add('text-white', 'bg-blue-500');

            // Update the cutoff date card
            const selectedDate = cell.getAttribute('data-date');
            if (cutoffDateElement) {
                // For simplicity, just update the single selected date. You might want to handle ranges differently.
                cutoffDateElement.textContent = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';
            }
        });
    });
}); 