document.addEventListener('DOMContentLoaded', function() {
    // Function to load HTML content
    async function loadHTML(url, containerId) {
        try {
            // Always load from the project root
            const adjustedUrl = '/tabulate/' + url.replace(/^\/+/,'');
            const response = await fetch(adjustedUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            document.getElementById(containerId).innerHTML = html;
            return Promise.resolve();
        } catch (error) {
            console.error('Error loading ' + url + ':', error);
            return Promise.reject(error);
        }
    }

    // Initialize modal functionality
    function initializeModal() {
        const modal = document.getElementById('dispatchModal');
        const closeBtn = document.getElementById('closeModal');
        
        if (!modal || !closeBtn) return;

        // Close modal on close button click
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });

        // Close modal on clicking outside modal content
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }

    // Function to show modal with dispatch details
    function showDispatchModal(details) {
        const modal = document.getElementById('dispatchModal');
        const modalContentDiv = document.getElementById('modalContent');
        
        if (!modal || !modalContentDiv) return;

        // Build modal content HTML
        const modalContent = Object.entries(details).map(([key, value]) => {
            return `<div class="mb-2"><strong>${key}:</strong> ${value}</div>`;
        }).join('');

        // Populate modal content
        modalContentDiv.innerHTML = modalContent;

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    // Add event listeners for view buttons in table
    function initializeViewButtons() {
        document.querySelectorAll('button.animated-button').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                if (!row) return;

                // Extract details from the row cells
                const details = {
                    Priority: row.querySelector('td:nth-child(1) .status-badge')?.textContent.trim() || '',
                    'Service Category': row.querySelector('td:nth-child(2) span.text-sm.font-medium')?.textContent.trim() || '',
                    Address: row.querySelector('td:nth-child(3) p')?.getAttribute('title') || row.querySelector('td:nth-child(3) p')?.textContent.trim() || '',
                    'Start Date': row.querySelector('td:nth-child(4) span')?.textContent.trim() || '',
                    'B. Hours': row.querySelector('td:nth-child(5) span')?.textContent.trim() || '',
                    Distance: row.querySelector('td:nth-child(6) span.text-sm.font-medium')?.textContent.trim() || '',
                    ETA: row.querySelector('td:nth-child(7) span.text-sm.font-medium')?.textContent.trim() || '',
                    Team: row.querySelector('td:nth-child(8) span.text-sm.font-medium')?.textContent.trim() || '',
                    'Job Type': row.querySelector('td:nth-child(9) span')?.textContent.trim() || ''
                };

                showDispatchModal(details);
            });
        });
    }

    // Function to handle responsive view
    function handleResponsiveView() {
        const tableContainer = document.querySelector('.overflow-x-auto');
        const mobileCardView = document.querySelector('.mobile-card-view');
        const searchContainer = document.getElementById('search-container');
        
        if (!tableContainer || !mobileCardView || !searchContainer) return;

        function updateView() {
            if (window.innerWidth < 768) { // Mobile view
                tableContainer.classList.add('hidden');
                mobileCardView.classList.remove('hidden');
                searchContainer.classList.remove('md:w-64');
                searchContainer.classList.add('w-full');
            } else { // Desktop view
                tableContainer.classList.remove('hidden');
                mobileCardView.classList.add('hidden');
                searchContainer.classList.remove('w-full');
                searchContainer.classList.add('md:w-64');
            }
        }

        // Initial view update
        updateView();

        // Update view on window resize
        window.addEventListener('resize', updateView);
    }

   

    // Initialize Desktop Dropdown Menu
    function initializeDesktopNav() {
        const projectButton = document.getElementById('projectButton');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const salesButton = document.getElementById('salesButton');
        const salesDropdownMenu = document.getElementById('salesDropdownMenu');
        const financialButton = document.getElementById('financialButton');
        const accountsButton = document.getElementById('accountsButton');
        const accountsDropdownMenu = document.getElementById('accountsDropdownMenu');
        const automationButton = document.getElementById('automationButton');
        const automationDropdownMenu = document.getElementById('automationDropdownMenu');

        // Set active state based on current page
        const currentPage = window.location.pathname.split('/').pop();
        const isSalesPage = [
            'carts.html', 'estimates.html',
            'carts-details.html', 'estimate-details.html'
        ].includes(currentPage);
        const isProjectPage = [
            'activeprojects.html', 'pendingprojects.html', 'dispatchboard.html',
            'active-details.html', 'pending-details.html', 'dispatchboard-details.html'
        ].includes(currentPage);
        const isFinancialPage = [
            'payroll.html', 'invoices.html', 'expenses.html', 'po.html'
        ].includes(currentPage);
        const isAccountsPage = [
            'customerlist.html', 'employee.html', 'contractors.html', 'vendors.html', 'create-vendor.html'
        ].includes(currentPage);

        if (isSalesPage) {
            salesButton.classList.add('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            salesButton.classList.remove('text-white', 'hover:text-sky-500');
            projectButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            projectButton.classList.add('text-white', 'hover:text-sky-500');
            financialButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            financialButton.classList.add('text-white', 'hover:text-sky-500');
            accountsButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            accountsButton.classList.add('text-white', 'hover:text-sky-500');
        } else if (isProjectPage) {
            projectButton.classList.add('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            projectButton.classList.remove('text-white', 'hover:text-sky-500');
            salesButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            salesButton.classList.add('text-white', 'hover:text-sky-500');
            financialButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            financialButton.classList.add('text-white', 'hover:text-sky-500');
            accountsButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            accountsButton.classList.add('text-white', 'hover:text-sky-500');
        } else if (isFinancialPage) {
            financialButton.classList.add('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            financialButton.classList.remove('text-white', 'hover:text-sky-500');
            salesButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            salesButton.classList.add('text-white', 'hover:text-sky-500');
            projectButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            projectButton.classList.add('text-white', 'hover:text-sky-500');
            accountsButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            accountsButton.classList.add('text-white', 'hover:text-sky-500');
        } else if (isAccountsPage) {
            accountsButton.classList.add('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            accountsButton.classList.remove('text-white', 'hover:text-sky-500');
            salesButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            salesButton.classList.add('text-white', 'hover:text-sky-500');
            projectButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            projectButton.classList.add('text-white', 'hover:text-sky-500');
            financialButton.classList.remove('text-sky-500', 'font-semibold', 'bg-white/10', 'px-4', 'py-2', 'rounded-lg');
            financialButton.classList.add('text-white', 'hover:text-sky-500');
        }

        // Remove manual click listeners and stopPropagation, rely on Tippy.js
        // for dropdown functionality and hiding.

        // Sales & Estimates Dropdown
        tippy('#salesButton', {
            content: salesDropdownMenu.innerHTML,
            allowHTML: true,
            interactive: true,
            trigger: 'click',
            placement: 'bottom-start',
            animation: 'scale',
            theme: 'light',
            onShow(instance) {
                instance.popper.addEventListener('mouseleave', () => {
                    instance.hide();
                });
            }
        });

        // Project & Dispatch Dropdown
        tippy('#projectButton', {
            content: dropdownMenu.innerHTML,
            allowHTML: true,
            interactive: true,
            trigger: 'click',
            placement: 'bottom-start',
            animation: 'scale',
            theme: 'light',
            onShow(instance) {
                instance.popper.addEventListener('mouseleave', () => {
                    instance.hide();
                });
            }
        });

        // Financial Dropdown
        const financialDropdownMenu = document.getElementById('financialDropdownMenu');
        if (financialButton && financialDropdownMenu) {
            tippy(financialButton, {
                content: financialDropdownMenu.innerHTML,
                allowHTML: true,
                interactive: true,
                trigger: 'click',
                placement: 'bottom-start',
                animation: 'scale',
                theme: 'light',
                onShow(instance) {
                    instance.popper.addEventListener('mouseleave', () => {
                        instance.hide();
                    });
                }
            });
        }

        // Accounts Dropdown
        if (accountsButton && accountsDropdownMenu) {
            tippy(accountsButton, {
                content: accountsDropdownMenu.innerHTML,
                allowHTML: true,
                interactive: true,
                trigger: 'click',
                placement: 'bottom-start',
                animation: 'scale',
                theme: 'light',
                onShow(instance) {
                    instance.popper.addEventListener('mouseleave', () => {
                        instance.hide();
                    });
                }
            });
        }

        // System & Automation Dropdown
        if (automationButton && automationDropdownMenu) {
            tippy(automationButton, {
                content: automationDropdownMenu.innerHTML,
                allowHTML: true,
                interactive: true,
                trigger: 'click',
                placement: 'bottom-start',
                animation: 'scale',
                theme: 'light',
                onShow(instance) {
                    instance.popper.addEventListener('mouseleave', () => {
                        instance.hide();
                    });
                }
            });
        }
    }

    // Initialize Mobile Side Navigation and Dropdowns
    function initializeMobileNav() {
        const sideNav = document.getElementById('sideNav');
        const sideNavOverlay = document.getElementById('sideNavOverlay');
        const closeSideNavBtn = document.getElementById('closeSideNav');
        // Use the correct burger menu button id from header
        const openSideNavBtn = document.getElementById('burgerMenuBtn');

        // Open side nav
        if (openSideNavBtn && sideNav && sideNavOverlay) {
            openSideNavBtn.addEventListener('click', () => {
                sideNav.classList.remove('-translate-x-full');
                sideNavOverlay.classList.remove('hidden');
            });
        }
        // Close side nav
        if (closeSideNavBtn && sideNav && sideNavOverlay) {
            closeSideNavBtn.addEventListener('click', () => {
                sideNav.classList.add('-translate-x-full');
                sideNavOverlay.classList.add('hidden');
            });
        }
        // Close on overlay click
        if (sideNavOverlay && sideNav) {
            sideNavOverlay.addEventListener('click', () => {
                sideNav.classList.add('-translate-x-full');
                sideNavOverlay.classList.add('hidden');
            });
        }

        // Dropdown logic for each main section
        const sections = [
            {
                headerSelector: '.text-sky-500.font-semibold.mb-2', // Sales & Estimates
                submenuSelector: '.text-sky-500.font-semibold.mb-2 + .pl-2'
            },
            {
                headerSelector: '.text-white.font-semibold.mb-2 i.fa-cogs', // Project & Dispatch
                submenuSelector: '.text-white.font-semibold.mb-2 i.fa-cogs'
            },
            {
                headerSelector: '.text-white.font-semibold.mb-2 i.fa-chart-line', // Financial
                submenuSelector: '.text-white.font-semibold.mb-2 i.fa-chart-line'
            },
            {
                headerSelector: '.text-white.font-semibold.mb-2 i.fa-users', // Accounts
                submenuSelector: '.text-white.font-semibold.mb-2 i.fa-users'
            }
        ];

        // Improved: Find all px-2 py-1 blocks and add toggle to their header
        document.querySelectorAll('#sideNav .px-2.py-1').forEach((section, idx) => {
            const header = section.querySelector('div.font-semibold');
            const submenu = section.querySelector('div.pl-2');
            if (header && submenu) {
                // Add a chevron if not present
                if (!header.querySelector('.fa-chevron-down')) {
                    const chevron = document.createElement('i');
                    chevron.className = 'fas fa-chevron-down ml-2';
                    header.appendChild(chevron);
                }
                // Start collapsed except first section
                if (idx !== 0) {
                    submenu.style.display = 'none';
                } else {
                    submenu.style.display = 'block';
                }
                header.style.cursor = 'pointer';
                header.style.display = 'flex';
                header.style.alignItems = 'center';
                header.style.justifyContent = 'flex-start';
                header.addEventListener('click', () => {
                    const isOpen = submenu.style.display !== 'none';
                    // Collapse all
                    document.querySelectorAll('#sideNav .px-2.py-1 .pl-2').forEach(s => s.style.display = 'none');
                    // Toggle this one
                    submenu.style.display = isOpen ? 'none' : 'block';
                });
            }
        });
    }

    // Load header and navigation
    Promise.all([
        loadHTML('nav/header.html', 'header-container'),
        loadHTML('nav/navigation.html', 'nav-container')
    ]).then(() => {
        // Initialize navigation functionality after loading
        initializeDesktopNav();
        initializeMobileNav();
        
        // Initialize other functionality
        initializeCalendar();
        initializeDateRangePicker();
        handleResponsiveView();
        initializeModal();
        initializeViewButtons();
    })
    .catch(error => {
        console.error('Error loading navigation:', error);
    });

    // Initialize tooltips
    tippy('[data-tippy-content]', {
        animation: 'scale',
        theme: 'light',
    });

    // Add entrance animation delay to cards
    document.querySelectorAll('.dispatch-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Column reordering functionality
    function initializeColumnReordering() {
        const table = document.querySelector('table');
        const headers = table.querySelectorAll('th.draggable-header');
        let draggedHeader = null;

        headers.forEach(header => {
            header.addEventListener('dragstart', (e) => {
                draggedHeader = header;
                header.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', header.dataset.column);
            });

            header.addEventListener('dragend', () => {
                header.classList.remove('dragging');
                headers.forEach(h => h.classList.remove('column-drop-target'));
            });

            header.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                headers.forEach(h => h.classList.remove('column-drop-target'));
                if (header !== draggedHeader) {
                    header.classList.add('column-drop-target');
                }
            });

            header.addEventListener('dragleave', () => {
                header.classList.remove('column-drop-target');
            });

            header.addEventListener('drop', (e) => {
                e.preventDefault();
                const sourceColumn = e.dataTransfer.getData('text/plain');
                const targetColumn = header.dataset.column;
                
                if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
                    const sourceIndex = Array.from(headers).findIndex(h => h.dataset.column === sourceColumn);
                    const targetIndex = Array.from(headers).findIndex(h => h.dataset.column === targetColumn);
                    
                    // Reorder headers
                    const headerRow = table.querySelector('thead tr');
                    const sourceHeader = headerRow.children[sourceIndex];
                    const targetHeader = headerRow.children[targetIndex];
                    
                    if (sourceIndex < targetIndex) {
                        targetHeader.parentNode.insertBefore(sourceHeader, targetHeader.nextSibling);
                    } else {
                        targetHeader.parentNode.insertBefore(sourceHeader, targetHeader);
                    }
                    
                    // Reorder data cells in each row
                    const rows = table.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        const sourceCell = row.children[sourceIndex];
                        const targetCell = row.children[targetIndex];
                        
                        if (sourceIndex < targetIndex) {
                            targetCell.parentNode.insertBefore(sourceCell, targetCell.nextSibling);
                        } else {
                            targetCell.parentNode.insertBefore(sourceCell, targetCell);
                        }
                    });

                    // Update mobile cards to reflect new column order
                    // REMOVED: createMobileCards();
                }
                
                headers.forEach(h => h.classList.remove('column-drop-target'));
            });
        });
    }

    // Calendar functions
    function initializeCalendar() {
        function getWeekDates(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day;
            const week = [];
            
            for (let i = 0; i < 7; i++) {
                const newDate = new Date(d.setDate(diff + i));
                week.push(new Date(newDate));
            }
            return week;
        }

        function formatDate(date) {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
            });
        }

        function formatDayName(date) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }

        function renderWeek() {
            const weekDaysContainer = document.getElementById('weekDays');
            if (!weekDaysContainer) return;

            const today = new Date();
            const weekDates = getWeekDates(today);
            weekDaysContainer.innerHTML = '';

            weekDates.forEach((date, index) => {
                const isToday = date.toDateString() === today.toDateString();
                const button = document.createElement('button');
                button.className = `week-day-btn ${isToday ? 'selected' : ''}`;
                button.innerHTML = `
                    <span class="day-name">${formatDayName(date)}</span>
                    <span class="day-number">${date.getDate()}</span>
                `;
                
                button.addEventListener('click', () => {
                    weekDaysContainer.querySelectorAll('.week-day-btn').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    button.classList.add('selected');
                    
                    // Filter table rows based on selected date
                    filterTableByDate(date);
                });
                
                weekDaysContainer.appendChild(button);
            });
        }

        function filterTableByDate(selectedDate) {
            const tableBody = document.querySelector('tbody');
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const dateCell = row.querySelector('td:nth-child(4)'); // Start Date column
                if (dateCell) {
                    const dateText = dateCell.textContent.trim();
                    if (dateText === 'N/A') {
                        // Show rows with N/A dates by default
                        row.style.display = '';
                        return;
                    }

                    const rowDate = new Date(dateText);
                    if (rowDate.toDateString() === selectedDate.toDateString()) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });

            // Update mobile cards view
            // REMOVED: createMobileCards();
        }

        // Initialize the calendar
        renderWeek();
    }

    // Date Range Picker functions
    function initializeDateRangePicker() {
        const dateRangeBtn = document.getElementById('openDateRangePicker');
        const modal = document.getElementById('dateRangeModal');
        const closeBtn = document.getElementById('closeDateRangeModal');
        const applyBtn = document.getElementById('applyDateRange');
        const resetBtn = document.getElementById('resetDateRange');
        const fromPicker = document.getElementById('fromDatePicker');
        const toPicker = document.getElementById('toDatePicker');
        
        if (!dateRangeBtn || !modal || !fromPicker || !toPicker) return;

        // Initialize date range state
        let selectedStart = new Date();
        let selectedEnd = new Date();
        selectedEnd.setDate(selectedEnd.getDate() + 6); // Default to a week range

        // Initialize Flatpickr for From Date
        const fromDateFlatpickr = flatpickr(fromPicker, {
            dateFormat: "Y-m-d",
            defaultDate: selectedStart,
            onChange: function(selectedDates) {
                if (selectedDates[0]) {
                    selectedStart = selectedDates[0];
                    // Update the minimum date of the end date picker
                    toDateFlatpickr.set('minDate', selectedDates[0]);
                }
            }
        });

        // Initialize Flatpickr for To Date
        const toDateFlatpickr = flatpickr(toPicker, {
            dateFormat: "Y-m-d",
            defaultDate: selectedEnd,
            minDate: selectedStart,
            onChange: function(selectedDates) {
                if (selectedDates[0]) {
                    selectedEnd = selectedDates[0];
                }
            }
        });

        // Update button text with current date range
        function updateDateRangeButtonText() {
            const formatDate = (date) => {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            };
            dateRangeBtn.innerHTML = `
                <i class="fas fa-calendar"></i>
                <span>${formatDate(selectedStart)} - ${formatDate(selectedEnd)}</span>
            `;
        }

        // Initial button text update
        updateDateRangeButtonText();

        // Modal controls
        dateRangeBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            });
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                // Update the date range button text
                updateDateRangeButtonText();
                
                // Filter the table based on selected dates
                filterTableByDateRange(selectedStart, selectedEnd);
                
                // Close the modal
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Reset to default dates
                selectedStart = new Date();
                selectedEnd = new Date();
                selectedEnd.setDate(selectedEnd.getDate() + 6);
                
                // Update both date pickers
                fromDateFlatpickr.setDate(selectedStart);
                toDateFlatpickr.setDate(selectedEnd);
                
                // Update button text
                updateDateRangeButtonText();
            });
        }

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }

    // Show entries functionality
    const entriesSelect = document.querySelector('.pagination-entries-select');
    if (entriesSelect) {
        entriesSelect.addEventListener('change', function(e) {
            const entriesPerPage = parseInt(e.target.value);
            // Here you would typically:
            // 1. Update the table to show the selected number of entries
            // 2. Update the pagination
            // 3. Update the "Showing X to Y of Z entries" text
            
            // For now, we'll just log the change
            console.log(`Changed entries per page to: ${entriesPerPage}`);
            
            // You would implement the actual pagination logic here
            // This would typically involve:
            // - Fetching new data if using server-side pagination
            // - Or slicing the existing data if using client-side pagination
            // - Updating the table contents
            // - Updating the pagination controls
        });
    }
}); 