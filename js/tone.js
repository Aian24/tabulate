// Tone of Communication filter button UI/UX logic

document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.tone-filter-btn');
    const tableRows = document.querySelectorAll('tbody tr');
    const categoryFilter = document.getElementById('category-filter');
    const showEntries = document.getElementById('show-entries');
    let currentTone = 'all';
    let currentCategory = 'all';
    let currentShow = 50;

    function applyFilters() {
        let shown = 0;
        tableRows.forEach(row => {
            const tone = row.getAttribute('data-tone');
            const category = row.getAttribute('data-category');
            const toneMatch = (currentTone === 'all' || tone === currentTone);
            const categoryMatch = (currentCategory === 'all' || category === currentCategory);
            if (toneMatch && categoryMatch && shown < currentShow) {
                row.style.display = '';
                shown++;
            } else {
                row.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active-filter', 'bg-blue-500', 'text-white', 'border-blue-500'));
            this.classList.add('active-filter', 'bg-blue-500', 'text-white', 'border-blue-500');
            currentTone = this.getAttribute('data-filter');
            applyFilters();
        });
    });

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function () {
            currentCategory = this.value;
            applyFilters();
        });
    }

    if (showEntries) {
        showEntries.addEventListener('change', function () {
            currentShow = parseInt(this.value, 10);
            applyFilters();
        });
    }

    // Dropdown logic for Actions and More
    function closeAllDropdowns() {
        document.getElementById('actionsMenu').classList.add('hidden');
        document.getElementById('moreMenu').classList.add('hidden');
    }
    document.getElementById('actionsDropdown').addEventListener('click', function (e) {
        e.stopPropagation();
        const menu = document.getElementById('actionsMenu');
        const isHidden = menu.classList.contains('hidden');
        closeAllDropdowns();
        if (isHidden) menu.classList.remove('hidden');
    });
    document.getElementById('moreDropdown').addEventListener('click', function (e) {
        e.stopPropagation();
        const menu = document.getElementById('moreMenu');
        const isHidden = menu.classList.contains('hidden');
        closeAllDropdowns();
        if (isHidden) menu.classList.remove('hidden');
    });
    document.addEventListener('click', function () {
        closeAllDropdowns();
    });

    // Set default active to 'All' and show all rows
    const defaultBtn = document.getElementById('filter-all');
    if (defaultBtn) {
        defaultBtn.classList.add('active-filter', 'bg-blue-500', 'text-white', 'border-blue-500');
    }
    applyFilters();
}); 