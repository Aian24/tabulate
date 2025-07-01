// packages.js

document.addEventListener('DOMContentLoaded', function () {
    // Create Package button logic
    const createBtn = document.getElementById('createPackage');
    if (createBtn) {
        createBtn.addEventListener('click', function () {
            window.location.href = 'create-package.html';
        });
    }

    // Dropdown toggles
    function setupDropdown(buttonId, menuId) {
        const btn = document.getElementById(buttonId);
        const menu = document.getElementById(menuId);
        if (btn && menu) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                menu.classList.toggle('hidden');
            });
        }
    }
    setupDropdown('actionsDropdown', 'actionsMenu');
    setupDropdown('moreDropdown', 'moreMenu');

    // Close dropdowns when clicking outside
    document.addEventListener('click', function () {
        const menus = ['actionsMenu', 'moreMenu'];
        menus.forEach(id => {
            const menu = document.getElementById(id);
            if (menu && !menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
            }
        });
    });

    // Placeholder for filter/search logic
    // document.getElementById('openFilter').addEventListener('click', ...);
    // document.querySelector('input[type="search"]').addEventListener('input', ...);

    // Details page logic for packages-details.html
    if (window.location.pathname.includes('packages-details.html')) {
        // Handle back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.history.length > 1 ? window.history.back() : window.location.href = 'packages.html';
            });
        }

        // Set package name header
        const packageName = 'Deep Clean with Free Hose Package'; // Static for now
        const header = document.getElementById('packageNameHeader');
        if (header) header.textContent = packageName;

        // Use a variable to store the services data for dynamic row management
        let servicesData = [
            {
                type: 'Electrical Wiring Installation',
                start: '2025-03-14',
                end: '2025-03-14',
                hours: '600.00',
                rate: '80.00',
                price: '1663.20'
            },
            {
                type: 'Roofing Installation',
                start: '2025-06-27',
                end: '2025-06-27',
                hours: '750.00',
                rate: '200.00',
                price: '6230.00'
            }
        ];

        function renderPackageDetails(editMode = false) {
            // Calculate total price
            let totalPrice = servicesData.reduce((sum, s) => sum + parseFloat(s.price || 0), 0).toFixed(2);
            const detailsContainer = document.getElementById('packageDetailsContainer');
            if (detailsContainer) {
                detailsContainer.innerHTML = `
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex-1">
                        <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full mb-6">
                            <h2 class="text-lg font-bold text-purple-700 mb-4">Packages Information</h2>
                            <div class="mb-4">
                                <label class="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                                <input type="text" id="packageNameInput" class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 font-semibold" value="Deep Clean with Free Hose Package" ${editMode ? '' : 'readonly'} />
                            </div>
                            <div class="mb-4">
                                <label class="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                                <textarea id="packageDescInput" class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 font-semibold" rows="2" ${editMode ? '' : 'readonly'}>Deep Clean Washing Machine With Free Hose</textarea>
                            </div>
                            <div class="mb-4">
                                <label class="block text-xs font-semibold text-gray-700 mb-1">Renewal Date</label>
                                <input type="date" id="packageRenewalInput" class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 font-semibold" value="2025-03-14" ${editMode ? '' : 'readonly'} />
                            </div>
                            <div class="flex items-center gap-6 mb-4">
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" id="renewServicesInput" class="accent-blue-500" ${editMode ? '' : 'disabled checked'} />
                                    <span class="text-sm text-gray-700">Renew Services</span>
                                </label>
                                <label class="inline-flex items-center gap-2">
                                    <input type="checkbox" id="activeInput" class="accent-blue-500" ${editMode ? '' : 'disabled checked'} />
                                    <span class="text-sm text-gray-700">Active</span>
                                </label>
                            </div>
                            <div class="overflow-x-auto mt-6">
                                <table class="min-w-full text-xs mb-2 border rounded-lg" id="servicesTable">
                                    <thead>
                                        <tr class="bg-blue-500 text-white">
                                            <th class="px-4 py-2 text-left">Service Type</th>
                                            <th class="px-4 py-2 text-left">Start</th>
                                            <th class="px-4 py-2 text-left">End</th>
                                            <th class="px-4 py-2 text-left">Default B. Hrs</th>
                                            <th class="px-4 py-2 text-left">Default Rate</th>
                                            <th class="px-4 py-2 text-left">Price</th>
                                            ${editMode ? '<th class="px-4 py-2 text-left">Action</th>' : ''}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${servicesData.map((s, i) => `
                                        <tr class="bg-gray-50">
                                            <td><input type="text" class="w-full border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="${s.type}" ${editMode ? '' : 'readonly'} data-index="${i}" data-field="type" /></td>
                                            <td><input type="date" class="w-full border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="${s.start}" ${editMode ? '' : 'readonly'} data-index="${i}" data-field="start" /></td>
                                            <td><input type="date" class="w-full border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="${s.end}" ${editMode ? '' : 'readonly'} data-index="${i}" data-field="end" /></td>
                                            <td><input type="number" class="w-full border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="${s.hours}" ${editMode ? '' : 'readonly'} data-index="${i}" data-field="hours" /></td>
                                            <td><input type="number" class="w-full border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="${s.rate}" ${editMode ? '' : 'readonly'} data-index="${i}" data-field="rate" /></td>
                                            <td><input type="number" class="w-full border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="${s.price}" ${editMode ? '' : 'readonly'} data-index="${i}" data-field="price" /></td>
                                            ${editMode ? `<td class="text-center"><button class="text-red-500 hover:bg-red-100 rounded p-2 delete-service-btn" data-index="${i}"><i class="fas fa-trash"></i></button></td>` : ''}
                                        </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                                <div class="flex justify-between items-center mt-2">
                                    <span class="font-semibold text-gray-700">OVER ALL TOTAL PRICE</span>
                                    <input type="number" class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold" value="${totalPrice}" readonly />
                                </div>
                                ${editMode ? '<button class="mt-4 px-4 py-2 bg-red-600 text-white rounded shadow flex items-center gap-2" id="addServiceBtn"><i class="fas fa-plus-circle"></i> Service</button>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-1/3 lg:w-1/4">
                        <div class="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 w-full flex flex-col items-center">
                            <label class="block text-xs font-semibold text-gray-700 mb-2">Upload Image</label>
                            <input type="file" class="mb-4" ${editMode ? '' : 'disabled'} />
                            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Package Image" class="rounded-lg border shadow-sm w-full h-auto object-cover" style="max-width: 250px; max-height: 250px;" />
                        </div>
                    </div>
                </div>
                ${editMode ? '<div class="flex gap-2 mt-8"><button class="px-6 py-2 bg-sky-500 text-white rounded shadow hover:bg-sky-600 flex items-center gap-2 text-sm" id="updateBtn"><i class="fas fa-save"></i> Update</button></div>' : ''}
                `;

                // Add event listeners for delete and add service in edit mode
                if (editMode) {
                    document.querySelectorAll('.delete-service-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const idx = parseInt(this.getAttribute('data-index'));
                            servicesData.splice(idx, 1);
                            renderPackageDetails(true);
                        });
                    });
                    const addBtn = document.getElementById('addServiceBtn');
                    if (addBtn) {
                        addBtn.addEventListener('click', function() {
                            servicesData.push({ type: '', start: '', end: '', hours: '', rate: '', price: '' });
                            renderPackageDetails(true);
                        });
                    }
                    // Update servicesData on input change
                    document.querySelectorAll('#servicesTable input').forEach(input => {
                        input.addEventListener('input', function() {
                            const idx = this.getAttribute('data-index');
                            const field = this.getAttribute('data-field');
                            if (idx !== null && field) {
                                servicesData[idx][field] = this.value;
                            }
                        });
                    });
                }
            }
        }
        // Initial render (view mode)
        renderPackageDetails(false);

        // Edit button logic
        const editBtn = document.getElementById('editBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        if (editBtn) {
            editBtn.onclick = function() {
                renderPackageDetails(true);
                // Re-attach cancel and update logic in edit mode
                const cancelBtnEdit = document.getElementById('cancelBtn');
                if (cancelBtnEdit) {
                    cancelBtnEdit.onclick = function() {
                        if (window.history.length > 1) {
                            window.history.back();
                        } else {
                            window.location.href = 'packages.html';
                        }
                    };
                }
            };
        }
        if (cancelBtn) {
            cancelBtn.onclick = function() {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = 'packages.html';
                }
            };
        }
    }

    // Make table rows clickable in packages.html
    if (window.location.pathname.includes('packages.html')) {
        const tableRows = document.querySelectorAll('table tbody tr');
        tableRows.forEach(row => {
            row.classList.add('cursor-pointer');
            row.addEventListener('click', function(e) {
                // Prevent navigation if a checkbox or button is clicked
                if (e.target.closest('input[type="checkbox"]') || e.target.closest('button')) return;
                const packageName = row.querySelector('td:nth-child(2)')?.textContent.trim();
                if (packageName) {
                    window.location.href = `packages-details.html?package=${encodeURIComponent(packageName)}`;
                }
            });
        });
    }

    // --- Package Creation Page Logic ---
    // This section handles dynamic service row addition and deletion for create-package.html

    if (window.location.pathname.includes('create-package.html')) {
        // +Service button functionality
        const addBtn = document.getElementById('addServiceBtn');
        const tableBody = document.getElementById('servicesTableBody');
        if (addBtn && tableBody) {
            addBtn.addEventListener('click', function() {
                // Create a new row for a service
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="text" class="border border-gray-300 rounded px-2 py-1 w-full text-base font-medium text-gray-800" name="serviceType[]" placeholder="Choose..." /></td>
                    <td><input type="date" class="border border-gray-300 rounded px-2 py-1 w-full text-base font-medium text-gray-800" name="start[]" /></td>
                    <td><input type="date" class="border border-gray-300 rounded px-2 py-1 w-full text-base font-medium text-gray-800" name="end[]" /></td>
                    <td><input type="number" class="border border-gray-300 rounded px-2 py-1 w-full text-base font-medium text-gray-800" name="defaultHours[]" /></td>
                    <td><input type="number" class="border border-gray-300 rounded px-2 py-1 w-full text-base font-medium text-gray-800" name="defaultRate[]" /></td>
                    <td><input type="number" class="border border-gray-300 rounded px-2 py-1 w-full text-base font-medium text-gray-800" name="price[]" /></td>
                    <td class="text-center align-middle action-cell">
                        <button type="button" class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded transition delete-service-btn">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
        // Delete row functionality
        tableBody.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-service-btn')) {
                const tr = e.target.closest('tr');
                if (tr) tr.remove();
            }
        });
    }
    // --- End Package Creation Page Logic ---
}); 