// services.js

document.addEventListener('DOMContentLoaded', function() {
    // Utility: Get query param
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 1. On services.html: Make each row clickable
    if (window.location.pathname.includes('services.html')) {
        const tableRows = document.querySelectorAll('table tbody tr');
        tableRows.forEach(row => {
            row.classList.add('cursor-pointer');
            row.addEventListener('click', function(e) {
                // Prevent navigation if a checkbox or button is clicked
                if (e.target.closest('input[type="checkbox"]') || e.target.closest('button')) return;
                const serviceName = row.querySelector('td:nth-child(2)')?.textContent.trim();
                if (serviceName) {
                    window.location.href = `services-details.html?service=${encodeURIComponent(serviceName)}`;
                }
            });
        });
    }

    // 2. On services-details.html: Render details
    if (window.location.pathname.includes('services-details.html')) {
        // Handle back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.history.length > 1 ? window.history.back() : window.location.href = 'services.html';
            });
        }

        // Set service name header
        const serviceName = getQueryParam('service');
        if (serviceName) {
            const header = document.getElementById('serviceNameHeader');
            if (header) header.textContent = serviceName;
        }

        // Render details UI (modern, fancy, improved alignment, full width, visible inputs)
        const detailsContainer = document.getElementById('serviceDetailsContainer');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <section class="space-y-8">
                    <!-- Service Info Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                            <i class="fas fa-leaf text-green-400"></i> Service Information
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Service Name</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Weed control" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Estimate Name</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Weed control" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Tag</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Weed" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Business Category <span class='text-red-500'>*</span></div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Landscaping & Maintenance" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Budget Hour/s</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="2" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Default Rate</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="100.00" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Billing Mode <span class='text-red-500'>*</span></div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Flat rate" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Tax <span class='text-red-500'>*</span></div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Not" readonly />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Upload Image</div>
                                <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                                    <img src="https://via.placeholder.com/120x60?text=Tool+Image" alt="Tool Image" class="rounded-lg border shadow-sm" />
                                    <span class="text-xs text-gray-400">(Image upload disabled)</span>
                                </div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Select Seasons: <span class='text-red-500'>*</span></div>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full text-xs mb-2" id="seasonsTable">
                                        <thead>
                                            <tr class="bg-blue-500 text-white">
                                                <th class="px-4 py-2 text-left">Season</th>
                                                <th class="px-4 py-2 text-left">Start Date</th>
                                                <th class="px-4 py-2 text-left">End Date</th>
                                                <th class="px-4 py-2 text-left" id="seasonsActionsHeader" style="display:none;">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="bg-gray-50">
                                                <td><input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Fall" readonly /></td>
                                                <td><input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="09/01/2025" readonly /></td>
                                                <td><input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="11/30/2025" readonly /></td>
                                                <td class="px-4 py-2 season-action" style="display:none;"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Scheduling Settings Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <div class="flex items-center gap-2 mb-4">
                            <i class="fas fa-calendar-check text-blue-400"></i>
                            <h2 class="text-xl font-bold text-blue-700">Scheduling Settings <span class='text-red-500'>*</span></h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Recurrence Type</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Monthly" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Description</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="test" readonly />
                            </div>
                        </div>
                    </div>

                    <!-- Terms and Conditions Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-xl font-bold text-blue-700 mb-4">Terms and Conditions <span class='text-red-500'>*</span></h2>
                        <textarea class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" rows="2" readonly>test</textarea>
                    </div>

                    <!-- Related Services Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-xl font-bold text-blue-700 mb-4">Related Services</h2>
                        <select class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" multiple disabled>
                            <option selected>Plant Cutters</option>
                        </select>
                    </div>

                    <!-- Material List Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-xl font-bold text-blue-700 mb-4">Material List</h2>
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-xs mb-2" id="materialListTable">
                                <thead>
                                    <tr class="bg-blue-500 text-white">
                                        <th class="px-4 py-2 text-left">Material</th>
                                        <th class="px-4 py-2 text-left">Quantity</th>
                                        <th class="px-4 py-2 text-left">Unit</th>
                                        <th class="px-4 py-2 text-left">Price</th>
                                        <th class="px-4 py-2 text-left">Total</th>
                                        <th class="px-4 py-2 text-left">Profit (%)</th>
                                        <th class="px-4 py-2 text-left">Profit</th>
                                        <th class="px-4 py-2 text-left">Final Total</th>
                                        <th class="px-4 py-2 text-left" id="materialActionsHeader" style="display:none;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Plant Cutters" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="1" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Unit" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="500.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="500.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="40" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="200.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="700.00" readonly /></td>
                                        <td class="px-4 py-2 material-action" style="display:none;"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="flex justify-end items-center gap-2 mt-2">
                                <span class="font-semibold text-gray-700">OVERALL TOTAL</span>
                                <span class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold">700.00</span>
                            </div>
                        </div>
                    </div>

                    <!-- Equipment List Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-xl font-bold text-blue-700 mb-4">Equipment List</h2>
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-xs mb-2" id="equipmentListTable">
                                <thead>
                                    <tr class="bg-blue-500 text-white">
                                        <th class="px-4 py-2 text-left">Equipment Name</th>
                                        <th class="px-4 py-2 text-left">Quantity</th>
                                        <th class="px-4 py-2 text-left">Cost per Hour</th>
                                        <th class="px-4 py-2 text-left">Total Cost</th>
                                        <th class="px-4 py-2 text-left">Profit (%)</th>
                                        <th class="px-4 py-2 text-left">Profit</th>
                                        <th class="px-4 py-2 text-left">Final Total</th>
                                        <th class="px-4 py-2 text-left" id="equipmentActionsHeader" style="display:none;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="shovel" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="1" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="2.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="2.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="40" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="0.80" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="2.80" readonly /></td>
                                        <td class="px-4 py-2 equipment-action" style="display:none;"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="flex justify-end items-center gap-2 mt-2">
                                <span class="font-semibold text-gray-700">OVERALL TOTAL</span>
                                <span class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold">2.80</span>
                            </div>
                        </div>
                    </div>

                    <!-- Manpower Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-xl font-bold text-blue-700 mb-4">Manpower</h2>
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-xs mb-2">
                                <thead>
                                    <tr class="bg-blue-500 text-white">
                                        <th class="px-4 py-2 text-left">Job Description</th>
                                        <th class="px-4 py-2 text-left">Quantity</th>
                                        <th class="px-4 py-2 text-left">Est. Hours</th>
                                        <th class="px-4 py-2 text-left">Rate</th>
                                        <th class="px-4 py-2 text-left">Total Cost</th>
                                        <th class="px-4 py-2 text-left">Profit (%)</th>
                                        <th class="px-4 py-2 text-left">Profit</th>
                                        <th class="px-4 py-2 text-left">Final Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Leader" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="1" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="2.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="1.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="2.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="40.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="0.80" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="2.80" readonly /></td>
                                    </tr>
                                    <tr class="bg-white">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Labor" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="1" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="2.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="1.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="2.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="40" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="0.80" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="2.80" readonly /></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="flex justify-end items-center gap-2 mt-2">
                                <span class="font-semibold text-gray-700">OVERALL TOTAL</span>
                                <span class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold">5.60</span>
                            </div>
                        </div>
                    </div>

                    <!-- Price Matrix Alert -->
                    <div class="flex items-center gap-2 mb-6 w-full">
                        <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-300 shadow">
                            <i class="fas fa-exclamation-circle mr-2"></i> No Price Matrix
                        </span>
                    </div>

                    <!-- Custom Fields Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-xl font-bold text-blue-700 mb-4">Custom Fields</h2>
                        <table class="min-w-full text-xs mb-2" id="customFieldsTable">
                            <thead>
                                <tr class="bg-blue-500 text-white">
                                    <th class="px-4 py-2 text-left">Custom Field Name</th>
                                    <th class="px-4 py-2 text-left">Value</th>
                                    <th class="px-4 py-2 text-left" id="customFieldsActionsHeader" style="display:none;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-gray-50">
                                    <td class="px-4 py-2">Lot Size</td>
                                    <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="-" readonly /></td>
                                    <td class="px-4 py-2 custom-field-action" style="display:none;"></td>
                                </tr>
                                <tr class="bg-white">
                                    <td class="px-4 py-2">Floor Area</td>
                                    <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="-" readonly /></td>
                                    <td class="px-4 py-2 custom-field-action" style="display:none;"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Total Service Cost Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <div class="text-xs text-gray-500 mb-1">Total Service Cost</div>
                        <input type="text" class="w-full border border-green-300 rounded-lg px-4 py-3 bg-green-50 text-2xl font-bold text-green-600" value="708.40" readonly />
                    </div>
                </section>
            `;
        }

        // --- Edit Mode Logic ---
        const editBtn = document.getElementById('editBtn');
        if (editBtn) {
            let isEditing = false;
            let originalValues = {};
            let saveCancelContainer = null;
            editBtn.addEventListener('click', function() {
                const allInputs = document.querySelectorAll('#serviceDetailsContainer input, #serviceDetailsContainer textarea, #serviceDetailsContainer select');
                const customFieldsActionsHeader = document.getElementById('customFieldsActionsHeader');
                const customFieldActions = document.querySelectorAll('.custom-field-action');
                const seasonsActionsHeader = document.getElementById('seasonsActionsHeader');
                const seasonActions = document.querySelectorAll('.season-action');
                const materialActionsHeader = document.getElementById('materialActionsHeader');
                const materialActions = document.querySelectorAll('.material-action');
                const equipmentActionsHeader = document.getElementById('equipmentActionsHeader');
                const equipmentActions = document.querySelectorAll('.equipment-action');
                if (!isEditing) {
                    // Enter edit mode
                    allInputs.forEach(el => {
                        if (el.tagName === 'SELECT') {
                            el.disabled = false;
                        } else {
                            el.readOnly = false;
                        }
                        originalValues[el.name || el.id || el.outerHTML] = el.value;
                    });
                    // Show actions columns
                    if (customFieldsActionsHeader) customFieldsActionsHeader.style.display = '';
                    customFieldActions.forEach(td => {
                        td.style.display = '';
                        td.innerHTML = `<button class='delete-custom-field px-2 py-1 text-red-600 hover:text-white hover:bg-red-500 rounded transition' title='Delete'><i class='fas fa-trash text-xl'></i></button>`;
                    });
                    if (seasonsActionsHeader) seasonsActionsHeader.style.display = '';
                    seasonActions.forEach(td => {
                        td.style.display = '';
                        td.innerHTML = `<button class='delete-season px-2 py-1 text-red-600 hover:text-white hover:bg-red-500 rounded transition' title='Delete'><i class='fas fa-trash text-xl'></i></button>`;
                    });
                    if (materialActionsHeader) materialActionsHeader.style.display = '';
                    materialActions.forEach(td => {
                        td.style.display = '';
                        td.innerHTML = `<button class='delete-material px-2 py-1 text-red-600 hover:text-white hover:bg-red-500 rounded transition' title='Delete'><i class='fas fa-trash text-xl'></i></button>`;
                    });
                    if (equipmentActionsHeader) equipmentActionsHeader.style.display = '';
                    equipmentActions.forEach(td => {
                        td.style.display = '';
                        td.innerHTML = `<button class='delete-equipment px-2 py-1 text-red-600 hover:text-white hover:bg-red-500 rounded transition' title='Delete'><i class='fas fa-trash text-xl'></i></button>`;
                    });
                    // Add delete logic
                    document.querySelectorAll('.delete-custom-field').forEach(btn => {
                        btn.addEventListener('click', function(e) {
                            e.preventDefault();
                            const row = btn.closest('tr');
                            const fieldName = row?.querySelector('td')?.textContent?.trim() || '';
                            const modal = document.getElementById('deleteServiceModal');
                            if (!modal) { row.remove(); return; }
                            document.getElementById('deleteServiceModalTitle').textContent = 'Delete Custom Field?';
                            document.getElementById('deleteServiceModalText').textContent = `Are you sure you want to delete the custom field \"${fieldName}\"?`;
                            showModal(modal);
                            const confirmBtn = document.getElementById('confirmDeleteService');
                            const cancelBtn = document.getElementById('cancelDeleteService');
                            const newConfirm = confirmBtn.cloneNode(true);
                            const newCancel = cancelBtn.cloneNode(true);
                            confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
                            cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
                            newConfirm.onclick = function() {
                                row.remove();
                                hideModal(modal);
                            };
                            newCancel.onclick = function() {
                                hideModal(modal);
                            };
                            modal.onclick = function(event) {
                                if (event.target === modal) hideModal(modal);
                            };
                        });
                    });
                    document.querySelectorAll('.delete-season').forEach(btn => {
                        btn.addEventListener('click', function(e) {
                            e.preventDefault();
                            const row = btn.closest('tr');
                            const seasonName = row?.querySelector('td input')?.value?.trim() || '';
                            const modal = document.getElementById('deleteServiceModal');
                            if (!modal) { row.remove(); return; }
                            document.getElementById('deleteServiceModalTitle').textContent = 'Delete Season?';
                            document.getElementById('deleteServiceModalText').textContent = `Are you sure you want to delete the season \"${seasonName}\"?`;
                            showModal(modal);
                            const confirmBtn = document.getElementById('confirmDeleteService');
                            const cancelBtn = document.getElementById('cancelDeleteService');
                            const newConfirm = confirmBtn.cloneNode(true);
                            const newCancel = cancelBtn.cloneNode(true);
                            confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
                            cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
                            newConfirm.onclick = function() {
                                row.remove();
                                hideModal(modal);
                            };
                            newCancel.onclick = function() {
                                hideModal(modal);
                            };
                            modal.onclick = function(event) {
                                if (event.target === modal) hideModal(modal);
                            };
                        });
                    });
                    document.querySelectorAll('.delete-material').forEach(btn => {
                        btn.addEventListener('click', function(e) {
                            e.preventDefault();
                            const row = btn.closest('tr');
                            const materialName = row?.querySelector('td input')?.value?.trim() || '';
                            const modal = document.getElementById('deleteServiceModal');
                            if (!modal) { row.remove(); return; }
                            document.getElementById('deleteServiceModalTitle').textContent = 'Delete Material?';
                            document.getElementById('deleteServiceModalText').textContent = `Are you sure you want to delete the material \"${materialName}\"?`;
                            showModal(modal);
                            const confirmBtn = document.getElementById('confirmDeleteService');
                            const cancelBtn = document.getElementById('cancelDeleteService');
                            const newConfirm = confirmBtn.cloneNode(true);
                            const newCancel = cancelBtn.cloneNode(true);
                            confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
                            cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
                            newConfirm.onclick = function() {
                                row.remove();
                                hideModal(modal);
                            };
                            newCancel.onclick = function() {
                                hideModal(modal);
                            };
                            modal.onclick = function(event) {
                                if (event.target === modal) hideModal(modal);
                            };
                        });
                    });
                    document.querySelectorAll('.delete-equipment').forEach(btn => {
                        btn.addEventListener('click', function(e) {
                            e.preventDefault();
                            const row = btn.closest('tr');
                            const equipmentName = row?.querySelector('td input')?.value?.trim() || '';
                            const modal = document.getElementById('deleteServiceModal');
                            if (!modal) { row.remove(); return; }
                            document.getElementById('deleteServiceModalTitle').textContent = 'Delete Equipment?';
                            document.getElementById('deleteServiceModalText').textContent = `Are you sure you want to delete the equipment \"${equipmentName}\"?`;
                            showModal(modal);
                            const confirmBtn = document.getElementById('confirmDeleteService');
                            const cancelBtn = document.getElementById('cancelDeleteService');
                            const newConfirm = confirmBtn.cloneNode(true);
                            const newCancel = cancelBtn.cloneNode(true);
                            confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
                            cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
                            newConfirm.onclick = function() {
                                row.remove();
                                hideModal(modal);
                            };
                            newCancel.onclick = function() {
                                hideModal(modal);
                            };
                            modal.onclick = function(event) {
                                if (event.target === modal) hideModal(modal);
                            };
                        });
                    });
                    // Hide Edit button, show Save and Cancel in a flex container
                    const headerBar = editBtn.parentNode;
                    editBtn.style.display = 'none';
                    if (!saveCancelContainer) {
                        saveCancelContainer = document.createElement('div');
                        saveCancelContainer.id = 'saveCancelContainer';
                        saveCancelContainer.className = 'flex items-center gap-2';
                        // Save button
                        const saveBtn = document.createElement('button');
                        saveBtn.id = 'saveEditBtn';
                        saveBtn.className = 'px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 flex items-center gap-2 text-sm';
                        saveBtn.innerHTML = '<i class="fas fa-save"></i> Update';
                        // Cancel button
                        const cancelBtn = document.createElement('button');
                        cancelBtn.id = 'cancelEditBtn';
                        cancelBtn.className = 'px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 flex items-center gap-2 text-sm';
                        cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
                        saveCancelContainer.appendChild(saveBtn);
                        saveCancelContainer.appendChild(cancelBtn);
                        headerBar.appendChild(saveCancelContainer);
                        // Save reference for later
                        saveCancelContainer.saveBtn = saveBtn;
                        saveCancelContainer.cancelBtn = cancelBtn;
                    } else {
                        saveCancelContainer.style.display = 'flex';
                        saveCancelContainer.saveBtn.style.display = '';
                        saveCancelContainer.cancelBtn.style.display = '';
                    }
                    // Cancel logic
                    saveCancelContainer.cancelBtn.onclick = function() {
                        // Revert all values
                        allInputs.forEach(el => {
                            if (el.tagName === 'SELECT') {
                                el.disabled = true;
                            } else {
                                el.readOnly = true;
                            }
                            const key = el.name || el.id || el.outerHTML;
                            if (originalValues[key] !== undefined) el.value = originalValues[key];
                        });
                        // Hide actions columns
                        if (customFieldsActionsHeader) customFieldsActionsHeader.style.display = 'none';
                        customFieldActions.forEach(td => {
                            td.style.display = 'none';
                            td.innerHTML = '';
                        });
                        if (seasonsActionsHeader) seasonsActionsHeader.style.display = 'none';
                        seasonActions.forEach(td => {
                            td.style.display = 'none';
                            td.innerHTML = '';
                        });
                        if (materialActionsHeader) materialActionsHeader.style.display = 'none';
                        materialActions.forEach(td => {
                            td.style.display = 'none';
                            td.innerHTML = '';
                        });
                        if (equipmentActionsHeader) equipmentActionsHeader.style.display = 'none';
                        equipmentActions.forEach(td => {
                            td.style.display = 'none';
                            td.innerHTML = '';
                        });
                        editBtn.style.display = '';
                        saveCancelContainer.style.display = 'none';
                        isEditing = false;
                    };
                    // Save logic
                    saveCancelContainer.saveBtn.onclick = function() {
                        // Save (for now, just exit edit mode)
                        allInputs.forEach(el => {
                            if (el.tagName === 'SELECT') {
                                el.disabled = true;
                            } else {
                                el.readOnly = true;
                            }
                        });
                        // Hide actions columns
                        if (customFieldsActionsHeader) customFieldsActionsHeader.style.display = 'none';
                        customFieldActions.forEach(td => {
                            td.style.display = 'none';
                            td.innerHTML = '';
                        });
                        if (seasonsActionsHeader) seasonsActionsHeader.style.display = 'none';
                        seasonActions.forEach(td => {
                            td.style.display = 'none';
                            td.innerHTML = '';
                        });
                        if (materialActionsHeader) materialActionsHeader.style.display = 'none';
                        materialActions.forEach(td => {
                            td.style.display = 'none';
                            td.innerHTML = '';
                        });
                        if (equipmentActionsHeader) equipmentActionsHeader.style.display = 'none';
                        equipmentActions.forEach(td => {
                            td.style.display = 'none';
                            td.innerHTML = '';
                        });
                        editBtn.style.display = '';
                        saveCancelContainer.style.display = 'none';
                        isEditing = false;
                    };
                    isEditing = true;
                }
            });
        }
    }

    // === Custom Dropdown for Business Category ===
    // Handles the multi-select dropdown with checkboxes and select all for business categories
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownSelected = document.getElementById('dropdownSelected');
    const categoryOptions = document.querySelectorAll('.categoryOption');
    const selectAll = document.getElementById('selectAllCategories');
    const businessCategoryInput = document.getElementById('businessCategoryInput');

    if(dropdownButton && dropdownMenu) {
        dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', () => {
            dropdownMenu.classList.add('hidden');
        });
        dropdownMenu.addEventListener('click', e => e.stopPropagation());
    }
    if(selectAll && categoryOptions.length) {
        selectAll.addEventListener('change', function() {
            categoryOptions.forEach(opt => { opt.checked = this.checked; });
            updateSelected();
        });
        categoryOptions.forEach(opt => {
            opt.addEventListener('change', function() {
                selectAll.checked = Array.from(categoryOptions).every(opt => opt.checked);
                updateSelected();
            });
        });
    }
    function updateSelected() {
        const selected = Array.from(categoryOptions).filter(opt => opt.checked).map(opt => opt.value);
        dropdownSelected.textContent = selected.length ? selected.join(', ') : 'Select options...';
        businessCategoryInput.value = selected.join(',');
    }

    // === Add/Remove Season Rows ===
    // Handles dynamic addition and removal of season rows in the Select Seasons section
    const seasonsContainer = document.getElementById('seasonsContainer');
    const addSeasonBtn = document.getElementById('addSeason');
    function createSeasonRow() {
        const div = document.createElement('div');
        div.className = 'grid grid-cols-1 md:grid-cols-4 gap-4 items-center season-row border border-blue-200 rounded-lg p-4';
        div.innerHTML = `
            <div>
                <label class='block text-sm font-medium text-gray-700 mb-1'>Seasons:</label>
                <select name='seasons[]' class='w-full border border-black rounded-lg px-4 py-2 text-sm font-medium text-gray-800' required>
                    <option value=''>Select...</option>
                    <option value='Spring'>Spring</option>
                    <option value='Summer'>Summer</option>
                    <option value='Fall'>Fall</option>
                    <option value='Winter'>Winter</option>
                </select>
            </div>
            <div>
                <label class='block text-sm font-medium text-gray-700 mb-1'>Start Date:</label>
                <input type='date' name='startDate[]' class='w-full border border-black rounded-lg px-4 py-2 text-sm font-medium text-gray-800' required />
            </div>
            <div>
                <label class='block text-sm font-medium text-gray-700 mb-1'>End Date:</label>
                <input type='date' name='endDate[]' class='w-full border border-black rounded-lg px-4 py-2 text-sm font-medium text-gray-800' required />
            </div>
            <div class='flex items-end h-full'>
                <button type='button' class='removeSeason bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold'>Remove</button>
            </div>
        `;
        return div;
    }
    if (addSeasonBtn && seasonsContainer) {
        addSeasonBtn.addEventListener('click', function() {
            const newRow = createSeasonRow();
            seasonsContainer.appendChild(newRow);
        });
        seasonsContainer.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('removeSeason')) {
                const row = e.target.closest('.season-row');
                if (row && seasonsContainer.children.length > 1) {
                    row.remove();
                }
            }
        });
    }

    // === Related Services Dropdown ===
    // Handles the multi-select dropdown for related services with select all
    const relatedDropdownButton = document.getElementById('relatedDropdownButton');
    const relatedDropdownMenu = document.getElementById('relatedDropdownMenu');
    const relatedDropdownSelected = document.getElementById('relatedDropdownSelected');
    const relatedOptions = document.querySelectorAll('.relatedOption');
    const selectAllRelated = document.getElementById('selectAllRelated');
    const relatedServicesInput = document.getElementById('relatedServicesInput');

    if(relatedDropdownButton && relatedDropdownMenu) {
        relatedDropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            relatedDropdownMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', () => {
            relatedDropdownMenu.classList.add('hidden');
        });
        relatedDropdownMenu.addEventListener('click', e => e.stopPropagation());
    }
    if(selectAllRelated && relatedOptions.length) {
        selectAllRelated.addEventListener('change', function() {
            relatedOptions.forEach(opt => { opt.checked = this.checked; });
            updateRelatedSelected();
        });
        relatedOptions.forEach(opt => {
            opt.addEventListener('change', function() {
                selectAllRelated.checked = Array.from(relatedOptions).every(opt => opt.checked);
                updateRelatedSelected();
            });
        });
    }
    function updateRelatedSelected() {
        const selected = Array.from(relatedOptions).filter(opt => opt.checked).map(opt => opt.value);
        relatedDropdownSelected.textContent = selected.length ? selected.join(', ') : 'Select options...';
        relatedServicesInput.value = selected.join(',');
    }

    // === Material List: Show Add Items Button for each row ===
    // Handles multiple rows in the Material List table
    document.querySelectorAll('table tr').forEach(row => {
        const materialSelect = row.querySelector('td select');
        const addItemBtn = row.querySelector('.add-item-btn');
        if (materialSelect && addItemBtn) {
            materialSelect.addEventListener('change', function() {
                if (materialSelect.value && materialSelect.value !== 'Select Materials') {
                    addItemBtn.classList.remove('hidden');
                } else {
                    addItemBtn.classList.add('hidden');
                }
            });
        }
    });

    // === Equipment List: Show Add Equipment Button for each row ===
    // Handles multiple rows in the Equipment List table
    document.querySelectorAll('table tr').forEach(row => {
        const equipmentSelect = row.querySelector('td select');
        const addEquipmentBtn = row.querySelector('.add-equipment-btn');
        if (equipmentSelect && addEquipmentBtn) {
            equipmentSelect.addEventListener('change', function() {
                if (equipmentSelect.value && equipmentSelect.value !== 'Select Equipment') {
                    addEquipmentBtn.classList.remove('hidden');
                } else {
                    addEquipmentBtn.classList.add('hidden');
                }
            });
        }
    });

    // Scheduling Settings: Show/hide Recurrence Type dropdown and ensure consistent input height
    const schedulingCheckbox = document.getElementById('schedulingSettings');
    const recurrenceTypeContainer = document.getElementById('recurrenceTypeContainer');
    const recurrenceTypeSelect = document.getElementById('recurrenceType');
    if (schedulingCheckbox && recurrenceTypeContainer && recurrenceTypeSelect) {
        schedulingCheckbox.addEventListener('change', function() {
            if (schedulingCheckbox.checked) {
                recurrenceTypeContainer.classList.remove('hidden');
            } else {
                recurrenceTypeContainer.classList.add('hidden');
            }
        });
        // Set initial state
        if (schedulingCheckbox.checked) {
            recurrenceTypeContainer.classList.remove('hidden');
        } else {
            recurrenceTypeContainer.classList.add('hidden');
        }
        // Always ensure the select has the same height as Upload Image
        recurrenceTypeSelect.classList.add('h-[42px]', 'px-4', 'py-2');
    }

    // Add these utility functions for modal display/animation (from products.js)
    function showModal(modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.querySelector('.modal-content-modern').classList.add('show');
        }, 10);
    }
    function hideModal(modal) {
        modal.querySelector('.modal-content-modern').classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 250);
    }
});
