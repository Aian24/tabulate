document.addEventListener('DOMContentLoaded', function() {
    // Function to load HTML content
    async function loadHTML(url, containerId) {
        try {
            // Get the current directory depth
            const pathParts = window.location.pathname.split('/');
            const isInSubfolder = pathParts.includes('sales') || pathParts.includes('dispatch') || pathParts.includes('financial') || pathParts.includes('accounts') || pathParts.includes('reports');
            
            // Adjust the path based on whether we're in a subfolder
            const adjustedUrl = isInSubfolder ? '../' + url : url;
            
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

    // Function to create mobile cards from table data
    function createMobileCards() {
        const tableBody = document.querySelector('tbody');
        const mobileCardView = document.querySelector('.mobile-card-view');
        const tableContainer = document.querySelector('.overflow-x-auto');
        
        if (!tableBody || !mobileCardView || !tableContainer) return;

        // Clear existing cards
        mobileCardView.innerHTML = '';

        // Get all rows from table
        const rows = tableBody.querySelectorAll('tr');

        // Create a card for each row
        rows.forEach(row => {
            if (row.style.display === 'none') return; // Skip hidden rows

            const cells = row.querySelectorAll('td');
            if (cells.length === 0) return;

            const card = document.createElement('div');
            card.className = 'job-card bg-white rounded-lg shadow-md mb-4 p-4 w-full';

            // Get data from cells
            const priority = cells[0]?.querySelector('.status-badge')?.textContent || 'N/A';
            const serviceCategory = cells[1]?.querySelector('span')?.textContent || 'N/A';
            const clientName = cells[2]?.querySelector('span')?.textContent || 'N/A';
            const address = cells[3]?.querySelector('p')?.getAttribute('title') || cells[3]?.querySelector('p')?.textContent || 'N/A';
            const startDate = cells[4]?.querySelector('span')?.textContent || 'N/A';
            const hours = cells[5]?.querySelector('span')?.textContent || 'N/A';
            const distance = cells[6]?.querySelector('span')?.textContent || 'N/A';
            const eta = cells[7]?.querySelector('span')?.textContent || 'N/A';
            const team = cells[8]?.querySelector('span')?.textContent || 'N/A';
            const status = cells[9]?.querySelector('span')?.textContent || 'N/A';

            // Get the current page URL to determine which template to use
            const currentPage = window.location.pathname;
            const isPendingProjects = currentPage.includes('pendingprojects.html');
            const isEstimates = currentPage.includes('estimates.html');
            const isCarts = currentPage.includes('carts.html');
            const isUnscheduled = currentPage.includes('unscheduled.html');

            if (isUnscheduled) {
                // Get data from cells for unscheduled jobs
                const jobId = cells[1]?.textContent.trim() || 'N/A';
                const serviceType = cells[2]?.textContent.trim() || 'N/A';
                const requestDate = cells[3]?.textContent.trim() || 'N/A';
                const priority = cells[4]?.querySelector('.inline-flex')?.textContent.trim() || 'N/A';
                const duration = cells[5]?.textContent.trim() || 'N/A';
                const location = cells[6]?.textContent.trim() || 'N/A';
                const clientName = cells[7]?.textContent.trim() || 'N/A';
                const status = cells[8]?.querySelector('.inline-flex')?.textContent.trim() || 'N/A';

                // Get priority color classes
                const priorityColorClass = priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                                        priority.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800';

                card.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${jobId}</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">Client:</span>
                                <span class="text-sm font-medium">${clientName}</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColorClass}">
                                ${priority}
                            </span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ${status}
                            </span>
                        </div>
                    </div>
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Service Type:</span>
                            <span class="text-sm font-medium">${serviceType}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Request Date:</span>
                                <span>${requestDate}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Est. Duration:</span>
                                <span>${duration}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Location:</span>
                            <span class="text-sm">${location}</span>
                        </div>
                    </div>
                    <div class="job-card-actions grid grid-cols-2 gap-3">
                        <button class="w-full py-1 px-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs">
                            Schedule Job
                        </button>
                        <button class="w-full py-1 px-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 text-xs">
                            View Details
                        </button>
                    </div>
                `;
            } else if (isCarts) {
                // Get data from cells for carts
                const fullName = cells[1]?.textContent.trim() || 'N/A';
                const quantity = cells[2]?.textContent.trim() || 'N/A';
                const type = cells[3]?.textContent.trim() || 'N/A';
                const totalPrice = cells[4]?.textContent.trim() || 'N/A';
                const orderDate = cells[5]?.textContent.trim() || 'N/A';

                card.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${fullName}</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">Order Date:</span>
                                <span class="text-sm font-medium">${orderDate}</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-sm text-gray-500">Total Price:</span>
                            <span class="text-sm font-medium text-green-600">${totalPrice}</span>
                        </div>
                    </div>
                    <div class="space-y-2 mb-4">
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Type:</span>
                                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">${type}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Quantity:</span>
                                <span class="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">${quantity}</span>
                            </div>
                        </div>
                    </div>
                    <div class="job-card-actions grid grid-cols-2 gap-3">
                        <button class="w-full py-1 px-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs">
                            Create Estimate
                        </button>
                        <button class="w-full py-1 px-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 text-xs">
                            View Details
                        </button>
                    </div>
                `;
            } else if (isEstimates) {
                // Get data from cells for estimates - fixing the selectors
                const estimateNumber = cells[1]?.textContent.trim() || 'N/A';
                const customer = cells[2]?.textContent.trim() || 'N/A';
                const dateCreated = cells[3]?.textContent.trim() || 'N/A';
                const dateSent = cells[4]?.textContent.trim() || 'N/A';
                const price = cells[5]?.textContent.trim() || 'N/A';
                const address = cells[6]?.textContent.trim() || 'N/A';
                const category = cells[7]?.textContent.trim() || 'N/A';
                const status = cells[8]?.querySelector('.inline-flex')?.textContent.trim() || 'N/A';

                card.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">Estimate ${estimateNumber}</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">Customer:</span>
                                <span class="text-sm font-medium">${customer}</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-sm text-gray-500">Status:</span>
                            <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">${status}</span>
                        </div>
                    </div>
                    <div class="space-y-2 mb-4">
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Date Created:</span>
                                <span>${dateCreated}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Date Sent:</span>
                                <span>${dateSent}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Price:</span>
                            <span class="text-sm font-medium text-green-600">${price}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Address:</span>
                            <span class="text-sm">${address}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Category:</span>
                            <span class="text-sm">${category}</span>
                        </div>
                    </div>
                    <div class="job-card-actions grid grid-cols-2 gap-3">
                        <button class="w-full py-1 px-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs">
                            Convert to Invoice
                        </button>
                        <button class="w-full py-1 px-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 text-xs">
                            View Details
                        </button>
                    </div>
                `;
            } else if (isPendingProjects) {
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${startDate}</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">Priority Type:</span>
                                <span class="status-badge text-white text-xs font-semibold px-3 py-1 rounded-full ${priority === 'VIP' ? 'bg-blue-500' : ''}">${priority}</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-sm text-gray-500">Status:</span>
                            <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">${status}</span>
                        </div>
                    </div>
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Service Category:</span>
                            <span class="text-sm font-medium">${serviceCategory}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Client Name:</span>
                            <span class="text-sm font-medium">${clientName}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Address:</span>
                            <p class="text-sm text-gray-700">${address}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Start Date:</span>
                                <span>${startDate}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">B. Hours:</span>
                                <span>${hours}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Distance:</span>
                                <span>${distance}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">ETA:</span>
                                <span>${eta}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Team Assigned:</span>
                                <span>${team}</span>
                            </div>
                        </div>
                    </div>
                    <div class="job-card-actions grid grid-cols-2 gap-3">
                        <button class="w-full py-1 px-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-xs">
                            Start Job
                        </button>
                        <button class="w-full py-1 px-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 text-xs">
                            View Work Order
                        </button>
                    </div>
                `;
            } else {
                // Original template for dispatchboard.html
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${startDate}</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">Priority Type:</span>
                                <span class="status-badge text-white text-xs font-semibold px-3 py-1 rounded-full ${priority === 'VIP' ? 'bg-blue-500' : ''}">${priority}</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-sm text-gray-500">Status:</span>
                            <span class="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">${status}</span>
                        </div>
                    </div>
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Service Category:</span>
                            <span class="text-sm font-medium">${serviceCategory}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Client Name:</span>
                            <span class="text-sm font-medium">${clientName}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Address:</span>
                            <p class="text-sm text-gray-700">${address}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Start Date:</span>
                                <span>${startDate}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">B. Hours:</span>
                                <span>${hours}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Distance:</span>
                                <span>${distance}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">ETA:</span>
                                <span>${eta}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Team Assigned:</span>
                                <span>${team}</span>
                            </div>
                        </div>
                    </div>
                    <div class="job-card-actions grid grid-cols-2 gap-3">
                        <button class="w-full py-1 px-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-xs">
                            Start Job
                        </button>
                        <button class="w-full py-1 px-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 text-xs">
                            View Work Order
                        </button>
                    </div>
                `;
            }

            // Add click event to the view button
            const viewWorkOrderButton = card.querySelector('button:nth-child(2)'); // Selects the 'View Work Order' button
            viewWorkOrderButton.addEventListener('click', () => {
                const details = {
                    Priority: priority,
                    'Service Category': serviceCategory,
                    Address: address,
                    'Start Date': startDate,
                    'B. Hours': hours,
                    Distance: distance,
                    ETA: eta,
                    Team: team,
                    'Job Type': jobType
                };

                showDispatchModal(details);
            });

            mobileCardView.appendChild(card);
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
                createMobileCards();
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

    // Initialize Side Navigation for Mobile
    function initializeMobileNav() {
        const burgerMenuBtn = document.getElementById('burgerMenuBtn');
        const sideNav = document.getElementById('sideNav');
        const closeSideNav = document.getElementById('closeSideNav');
        const sideNavOverlay = document.getElementById('sideNavOverlay');

        if (!burgerMenuBtn || !sideNav || !closeSideNav || !sideNavOverlay) {
            console.warn('Mobile navigation elements not found');
            return;
        }

        function openSideNav() {
            sideNav.classList.remove('-translate-x-full');
            sideNavOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeSideNavMenu() {
            sideNav.classList.add('-translate-x-full');
            sideNavOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }

        // Remove any existing event listeners
        burgerMenuBtn.removeEventListener('click', openSideNav);
        closeSideNav.removeEventListener('click', closeSideNavMenu);
        sideNavOverlay.removeEventListener('click', closeSideNavMenu);

        // Add event listeners
        burgerMenuBtn.addEventListener('click', openSideNav);
        closeSideNav.addEventListener('click', closeSideNavMenu);
        sideNavOverlay.addEventListener('click', closeSideNavMenu);

        // Close side nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!sideNav.contains(e.target) && !burgerMenuBtn.contains(e.target) && !sideNav.classList.contains('-translate-x-full')) {
                closeSideNavMenu();
            }
        });
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

    // Toast notification auto-hide
    setTimeout(() => {
        const toast = document.querySelector('.toast');
        if (toast) {
            toast.style.animation = 'slideOut 0.5s ease-in forwards';
            setTimeout(() => toast.remove(), 500);
        }
    }, 5000);

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
                    createMobileCards();
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
            createMobileCards();
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