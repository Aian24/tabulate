// packages.js

document.addEventListener('DOMContentLoaded', function () {
    // Create Package button logic
    const createBtn = document.getElementById('createPackage');
    if (createBtn) {
        createBtn.addEventListener('click', function () {
            window.location.href = 'create-package.html';
        });
    }

    // Dropdown toggles (fix: only one open at a time)
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');

    if (actionsDropdown && actionsMenu && moreMenu) {
        actionsDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            actionsMenu.classList.toggle('hidden');
            moreMenu.classList.add('hidden');
        });
    }
    if (moreDropdown && moreMenu && actionsMenu) {
        moreDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            moreMenu.classList.toggle('hidden');
            actionsMenu.classList.add('hidden');
        });
    }
    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!actionsDropdown.contains(e.target) && !moreDropdown.contains(e.target)) {
            actionsMenu && actionsMenu.classList.add('hidden');
            moreMenu && moreMenu.classList.add('hidden');
        }
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
                                ${!editMode ? '<div class="mt-2 flex justify-start"><button id="editBtn" class="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 flex items-center gap-2 text-sm"><i class="fas fa-edit"></i> Edit</button></div>' : ''}
                                ${editMode ? '<div class="flex gap-2 mt-2"><button class="px-6 py-2 bg-sky-500 text-white rounded shadow hover:bg-sky-600 flex items-center gap-2 text-sm" id="updateBtn"><i class="fas fa-save"></i> Update</button><button class="px-6 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 flex items-center gap-2 text-sm" id="cancelBtn">Cancel</button></div>' : ''}
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
        if (editBtn) {
            editBtn.onclick = function() {
                editBtn.style.display = 'none'; // Hide Edit button
                renderPackageDetails(true);
                // Re-attach cancel and update logic in edit mode
                const cancelBtnEdit = document.getElementById('cancelBtn');
                if (cancelBtnEdit) {
                    cancelBtnEdit.onclick = function() {
                        renderPackageDetails(false);
                        editBtn.style.display = ''; // Show Edit button again
                    };
                }
                const updateBtnEdit = document.getElementById('updateBtn');
                if (updateBtnEdit) {
                    updateBtnEdit.onclick = function() {
                        // Save logic here (if any)
                        renderPackageDetails(false);
                        editBtn.style.display = ''; // Show Edit button again
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

    // =============================
    // Deleted Packages Logic
    // =============================
    if (window.location.pathname.includes('deleted-packages.html')) {
        // Sample deleted packages data (based on packages.html)
        let deletedPackages = [
            { name: 'Deep Clean With Free Hose Package', amount: '$7,893.20', status: 'Active', created: 'March 14, 2025' },
            { name: 'Garden Landscaping Package', amount: '$200.00', status: 'Active', created: 'March 12, 2025' },
            { name: 'Office Cleaning Package', amount: '$14,266.00', status: 'Active', created: 'March 12, 2025' },
            { name: 'Basic Home Repair Package', amount: '$2,139.20', status: 'Active', created: 'March 12, 2025' },
            { name: 'Electrical Installation Package', amount: '$6,230.00', status: 'Active', created: 'March 12, 2025' },
            { name: 'Buten Package', amount: '$14,081.20', status: 'Active', created: 'June 27, 2025' },
        ];
        let selectedPackages = new Set();
        let restoreIdx = null;

        // Render desktop table
        function renderDeletedPackagesTable() {
            const tbody = document.getElementById('deleted-packages-table-body');
            if (!tbody) return;
            tbody.innerHTML = '';
            deletedPackages.forEach((pkg, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-4"><input type="checkbox" class="package-checkbox w-4 h-4 text-purple-600 rounded focus:ring-purple-500" data-idx="${idx}"></td>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${pkg.name}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${pkg.amount}</td>
                    <td class="px-6 py-4"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${pkg.status}</span></td>
                    <td class="px-6 py-4 text-sm text-gray-900">${pkg.created}</td>
                    <td class="px-6 py-4"><button class="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600 transition-colors restore-btn" data-idx="${idx}"><i class="fas fa-undo mr-1"></i>Restore</button></td>
                `;
                tbody.appendChild(tr);
            });
            // Attach checkbox listeners
            tbody.querySelectorAll('.package-checkbox').forEach(cb => {
                cb.addEventListener('change', function(e) {
                    const idx = parseInt(this.getAttribute('data-idx'));
                    if (this.checked) selectedPackages.add(idx);
                    else selectedPackages.delete(idx);
                    updateRestoreButtonVisibility();
                    updateSelectAllCheckbox();
                });
            });
            // Attach restore button listeners
            tbody.querySelectorAll('.restore-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    restoreIdx = parseInt(this.getAttribute('data-idx'));
                    showRestorePackageModal();
                });
            });
        }

        // Render mobile cards
        function renderDeletedPackagesMobileCards() {
            const container = document.getElementById('deleted-packages-mobile-cards');
            if (!container) return;
            container.innerHTML = '';
            deletedPackages.forEach((pkg, idx) => {
                const card = document.createElement('div');
                card.className = 'mobile-table-row bg-white rounded-lg border border-gray-100';
                card.innerHTML = `
                    <div class="flex items-center justify-between mb-1">
                        <div class="flex items-center gap-3">
                            <input type="checkbox" class="package-checkbox w-4 h-4 text-purple-600 rounded focus:ring-purple-500" data-idx="${idx}">
                            <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">${pkg.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}</div>
                            <div>
                                <h3 class="font-semibold text-gray-900 text-sm">${pkg.name}</h3>
                                <p class="text-xs text-gray-500">${pkg.amount}</p>
                            </div>
                        </div>
                        <span class="mobile-status bg-blue-100 text-blue-800 text-xs">${pkg.status}</span>
                    </div>
                    <div class="space-y-1 text-xs">
                        <div><span class="text-gray-500">Status:</span><span class="text-gray-900">${pkg.status}</span></div>
                    </div>
                    <div class="mt-1 flex justify-between items-center">
                        <div><span class="text-gray-500 text-xs">Created:</span><span class="text-gray-900 text-xs">${pkg.created}</span></div>
                        <button class="flex-1 px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600 transition-colors restore-btn" data-idx="${idx}"><i class="fas fa-undo mr-1"></i>Restore</button>
                    </div>
                `;
                container.appendChild(card);
            });
            // Attach checkbox listeners
            container.querySelectorAll('.package-checkbox').forEach(cb => {
                cb.addEventListener('change', function(e) {
                    const idx = parseInt(this.getAttribute('data-idx'));
                    if (this.checked) selectedPackages.add(idx);
                    else selectedPackages.delete(idx);
                    updateRestoreButtonVisibility();
                    updateSelectAllCheckbox();
                });
            });
            // Attach restore button listeners
            container.querySelectorAll('.restore-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    restoreIdx = parseInt(this.getAttribute('data-idx'));
                    showRestorePackageModal();
                });
            });
        }

        // Update restore selected button visibility
        function updateRestoreButtonVisibility() {
            const btn = document.getElementById('restoreSelectedPackagesBtn');
            const btnMobile = document.getElementById('restoreSelectedPackagesBtnMobile');
            if (btn) btn.classList.toggle('hidden', selectedPackages.size === 0);
            if (btnMobile) btnMobile.disabled = selectedPackages.size === 0;
            if (btnMobile) btnMobile.classList.toggle('opacity-50', selectedPackages.size === 0);
        }

        // Update select all checkbox
        function updateSelectAllCheckbox() {
            const selectAll = document.getElementById('selectAllDeletedPackages');
            const checkboxes = document.querySelectorAll('.package-checkbox');
            if (!selectAll) return;
            selectAll.checked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
            selectAll.indeterminate = !selectAll.checked && Array.from(checkboxes).some(cb => cb.checked);
        }

        // Select all logic
        const selectAll = document.getElementById('selectAllDeletedPackages');
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.package-checkbox');
                checkboxes.forEach((cb, idx) => {
                    cb.checked = this.checked;
                    if (this.checked) selectedPackages.add(idx);
                    else selectedPackages.delete(idx);
                });
                updateRestoreButtonVisibility();
                updateSelectAllCheckbox();
            });
        }

        // Restore modals logic
        function showRestorePackageModal() {
            const modal = document.getElementById('restorePackageModal');
            if (!modal) return;
            modal.classList.remove('hidden');
            setTimeout(() => modal.querySelector('.modal-content-modern').classList.add('show'), 10);
        }
        function hideRestorePackageModal() {
            const modal = document.getElementById('restorePackageModal');
            if (!modal) return;
            modal.querySelector('.modal-content-modern').classList.remove('show');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
        function showRestoreSelectedPackagesModal() {
            const modal = document.getElementById('restoreSelectedPackagesModal');
            if (!modal) return;
            modal.classList.remove('hidden');
            setTimeout(() => modal.querySelector('.modal-content-modern').classList.add('show'), 10);
        }
        function hideRestoreSelectedPackagesModal() {
            const modal = document.getElementById('restoreSelectedPackagesModal');
            if (!modal) return;
            modal.querySelector('.modal-content-modern').classList.remove('show');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }

        // Restore single package
        document.getElementById('cancelRestorePackage')?.addEventListener('click', hideRestorePackageModal);
        document.getElementById('confirmRestorePackage')?.addEventListener('click', function() {
            if (restoreIdx !== null) {
                deletedPackages.splice(restoreIdx, 1);
                selectedPackages.delete(restoreIdx);
                restoreIdx = null;
                renderDeletedPackagesTable();
                renderDeletedPackagesMobileCards();
                updateRestoreButtonVisibility();
                updateSelectAllCheckbox();
            }
            hideRestorePackageModal();
        });

        // Restore selected packages
        document.getElementById('restoreSelectedPackagesBtn')?.addEventListener('click', function() {
            if (selectedPackages.size > 0) showRestoreSelectedPackagesModal();
        });
        document.getElementById('restoreSelectedPackagesBtnMobile')?.addEventListener('click', function() {
            if (selectedPackages.size > 0) showRestoreSelectedPackagesModal();
        });
        document.getElementById('cancelRestoreSelectedPackages')?.addEventListener('click', hideRestoreSelectedPackagesModal);
        document.getElementById('confirmRestoreSelectedPackages')?.addEventListener('click', function() {
            deletedPackages = deletedPackages.filter((pkg, idx) => !selectedPackages.has(idx));
            selectedPackages.clear();
            renderDeletedPackagesTable();
            renderDeletedPackagesMobileCards();
            updateRestoreButtonVisibility();
            updateSelectAllCheckbox();
            hideRestoreSelectedPackagesModal();
        });

        // Initial render
        renderDeletedPackagesTable();
        renderDeletedPackagesMobileCards();
        updateRestoreButtonVisibility();
        updateSelectAllCheckbox();
    }
}); 