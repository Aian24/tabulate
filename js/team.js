// team.js

document.addEventListener('DOMContentLoaded', function() {
    // Utility: Get query param
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 1. On team-management.html: Make each row clickable
    if (window.location.pathname.includes('team-management.html')) {
        const tableRows = document.querySelectorAll('table tbody tr');
        tableRows.forEach(row => {
            row.classList.add('cursor-pointer');
            row.addEventListener('click', function(e) {
                // Prevent navigation if a checkbox or button is clicked
                if (e.target.closest('input[type="checkbox"]') || e.target.closest('button')) return;
                const teamName = row.querySelector('td:nth-child(2)')?.textContent.trim();
                if (teamName) {
                    window.location.href = `team-details.html?team=${encodeURIComponent(teamName)}`;
                }
            });
        });

        // Handle mobile card clicks
        const mobileCards = document.querySelectorAll('.md\\:hidden .bg-white.rounded-lg');
        mobileCards.forEach(card => {
            card.classList.add('cursor-pointer');
            card.addEventListener('click', function(e) {
                if (e.target.closest('button')) return;
                const teamName = card.querySelector('h3')?.textContent.trim();
                if (teamName) {
                    window.location.href = `team-details.html?team=${encodeURIComponent(teamName)}`;
                }
            });
        });
    }

    // 2. On team-details.html: Render details
    if (window.location.pathname.includes('team-details.html')) {
        // Handle back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.history.length > 1 ? window.history.back() : window.location.href = 'team-management.html';
            });
        }

        // Set team name header
        const teamName = getQueryParam('team');
        if (teamName) {
            const header = document.getElementById('teamNameHeader');
            if (header) header.textContent = teamName;
        }

        // Render details UI (modern, fancy, improved alignment, full width, visible inputs)
        const detailsContainer = document.getElementById('teamDetailsContainer');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <section class="space-y-8">
                    <!-- Team Info Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                            <i class="fas fa-users text-blue-400"></i> Team Information
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Team Name</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Landscaping Team A" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Default Service</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Lawn Mowing" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Team Lead</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="John Smith" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Total Members</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="5" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Rate Per Day</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="$450.00" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Status</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="Active" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Created Date</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="March 15, 2025" readonly />
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Last Updated</div>
                                <input type="text" class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" value="March 20, 2025" readonly />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Team Description</div>
                                <textarea class="w-full border border-black rounded-lg px-3 py-2 bg-gray-50 text-gray-800 font-semibold" rows="3" readonly>Specialized landscaping team focused on lawn maintenance and garden care services. Experienced in residential and commercial properties.</textarea>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 mb-1">Team Photo</div>
                                <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                                    <img src="https://via.placeholder.com/120x80?text=Team+Photo" alt="Team Photo" class="rounded-lg border shadow-sm" />
                                    <span class="text-xs text-gray-400">(Photo upload disabled)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Team Members Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-xl font-bold text-blue-700 mb-4">Team Members</h2>
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-xs mb-2" id="teamMembersTable">
                                <thead>
                                    <tr class="bg-blue-500 text-white">
                                        <th class="px-4 py-2 text-left">Member Name</th>
                                        <th class="px-4 py-2 text-left">Role</th>
                                        <th class="px-4 py-2 text-left">Contact</th>
                                        <th class="px-4 py-2 text-left">Daily Rate</th>
                                        <th class="px-4 py-2 text-left">Status</th>
                                        <th class="px-4 py-2 text-left" id="memberActionsHeader" style="display:none;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="John Smith" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Team Lead" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="john.smith@email.com" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="$120.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Active" readonly /></td>
                                        <td class="px-4 py-2 member-action" style="display:none;"></td>
                                    </tr>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Mike Johnson" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Member" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="mike.johnson@email.com" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="$90.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Active" readonly /></td>
                                        <td class="px-4 py-2 member-action" style="display:none;"></td>
                                    </tr>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Sarah Wilson" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Member" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="sarah.wilson@email.com" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="$85.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Active" readonly /></td>
                                        <td class="px-4 py-2 member-action" style="display:none;"></td>
                                    </tr>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="David Brown" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Member" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="david.brown@email.com" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="$80.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Active" readonly /></td>
                                        <td class="px-4 py-2 member-action" style="display:none;"></td>
                                    </tr>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Lisa Garcia" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Member" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="lisa.garcia@email.com" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="$75.00" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Active" readonly /></td>
                                        <td class="px-4 py-2 member-action" style="display:none;"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="flex justify-end items-center gap-2 mt-2">
                                <span class="font-semibold text-gray-700">TOTAL DAILY RATE</span>
                                <span class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold">$450.00</span>
                            </div>
                        </div>
                    </div>

                    <!-- Assigned Services Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-xl font-bold text-blue-700 mb-4">Assigned Services</h2>
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-xs mb-2" id="assignedServicesTable">
                                <thead>
                                    <tr class="bg-blue-500 text-white">
                                        <th class="px-4 py-2 text-left">Service Name</th>
                                        <th class="px-4 py-2 text-left">Category</th>
                                        <th class="px-4 py-2 text-left">Priority</th>
                                        <th class="px-4 py-2 text-left">Status</th>
                                        <th class="px-4 py-2 text-left" id="serviceActionsHeader" style="display:none;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Lawn Mowing" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Landscaping" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="High" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Active" readonly /></td>
                                        <td class="px-4 py-2 service-action" style="display:none;"></td>
                                    </tr>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Weed Control" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Landscaping" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Medium" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Active" readonly /></td>
                                        <td class="px-4 py-2 service-action" style="display:none;"></td>
                                    </tr>
                                    <tr class="bg-gray-50">
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Garden Maintenance" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Landscaping" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Low" readonly /></td>
                                        <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" value="Active" readonly /></td>
                                        <td class="px-4 py-2 service-action" style="display:none;"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Performance Metrics Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 w-full">
                        <h2 class="text-xl font-bold text-blue-700 mb-4">Performance Metrics</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div class="bg-blue-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-blue-600 mb-2">95%</div>
                                <div class="text-sm text-gray-600">Completion Rate</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-green-600 mb-2">4.8</div>
                                <div class="text-sm text-gray-600">Average Rating</div>
                            </div>
                            <div class="bg-orange-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-orange-600 mb-2">12</div>
                                <div class="text-sm text-gray-600">Projects This Month</div>
                            </div>
                            <div class="bg-purple-50 rounded-lg p-6 text-center">
                                <div class="text-3xl font-bold text-purple-600 mb-2">$5,400</div>
                                <div class="text-sm text-gray-600">Revenue This Month</div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
        }
    }

    // 3. On create-team.html: Handle team creation
    if (window.location.pathname.includes('create-team.html')) {
        // Handle form submission
        const createTeamForm = document.getElementById('createTeamForm');
        if (createTeamForm) {
            createTeamForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Handle team creation logic here
                console.log('Creating new team...');
                // Redirect to team management page
                window.location.href = 'team-management.html';
            });
        }
    }

    // 4. On deleted-teams.html: Handle deleted teams view
    if (window.location.pathname.includes('deleted-teams.html')) {
        // Handle restore functionality
        const restoreButtons = document.querySelectorAll('.restore-team-btn');
        restoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                const teamId = this.dataset.teamId;
                // Handle restore logic here
                console.log('Restoring team:', teamId);
            });
        });

        // Restore Selected Button Logic for Deleted Teams
        // Handles showing/hiding the 'Restore Selected' button when checkboxes are checked
        const selectAllDeleted = document.getElementById('selectAllDeleted');
        const teamCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
        const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');

        function updateRestoreSelectedVisibility() {
            const checkedBoxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
            const anySelected = checkedBoxes.length > 0;

            if (restoreSelectedBtn) {
                restoreSelectedBtn.classList.toggle('hidden', !anySelected);
            }
            if (restoreSelectedBtnMobile) {
                restoreSelectedBtnMobile.classList.toggle('hidden', !anySelected);
            }
        }

        // Add event listeners to checkboxes
        if (selectAllDeleted) {
            selectAllDeleted.addEventListener('change', function() {
                teamCheckboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
                updateRestoreSelectedVisibility();
            });
        }

        teamCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (selectAllDeleted) {
                    selectAllDeleted.checked = Array.from(teamCheckboxes).every(cb => cb.checked);
                    selectAllDeleted.indeterminate = Array.from(teamCheckboxes).some(cb => cb.checked) && !Array.from(teamCheckboxes).every(cb => cb.checked);
                }
                updateRestoreSelectedVisibility();
            });
        });

        // Restore Selected button handlers (desktop & mobile)
        if (restoreSelectedBtn) {
            restoreSelectedBtn.onclick = function(e) {
                e.preventDefault();
                showRestoreSelectedTeamModal();
            };
        }

        if (restoreSelectedBtnMobile) {
            restoreSelectedBtnMobile.onclick = function(e) {
                e.preventDefault();
                showRestoreSelectedTeamModal();
            };
        }

        // Modal functions
        function showRestoreSelectedTeamModal() {
            const modal = document.getElementById('restoreSelectedTeamModal');
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.querySelector('.modal-content-modern').classList.add('show');
                }, 10);
            }
        }

        function hideRestoreSelectedTeamModal() {
            const modal = document.getElementById('restoreSelectedTeamModal');
            if (modal) {
                modal.querySelector('.modal-content-modern').classList.remove('show');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 250);
            }
        }

        // Modal button handlers
        const cancelRestoreSelectedBtn = document.getElementById('cancelRestoreSelectedTeam');
        if (cancelRestoreSelectedBtn) {
            cancelRestoreSelectedBtn.onclick = hideRestoreSelectedTeamModal;
        }

        const confirmRestoreSelectedBtn = document.getElementById('confirmRestoreSelectedTeam');
        if (confirmRestoreSelectedBtn) {
            confirmRestoreSelectedBtn.onclick = function() {
                const checkedBoxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
                const selectedTeamIds = Array.from(checkedBoxes).map(checkbox => {
                    const row = checkbox.closest('tr');
                    return row ? row.dataset.teamId : null;
                }).filter(id => id !== null);

                console.log('Restoring selected teams:', selectedTeamIds);
                
                // Handle restore logic here
                // You can make an API call to restore the selected teams
                
                // Hide modal and redirect
                hideRestoreSelectedTeamModal();
                window.location.href = 'team-management.html';
            };
        }

        // Initialize visibility
        updateRestoreSelectedVisibility();
    }

    // 5. Handle dropdown menus
    const actionsDropdown = document.getElementById('actionsDropdown');
    const actionsMenu = document.getElementById('actionsMenu');
    const moreDropdown = document.getElementById('moreDropdown');
    const moreMenu = document.getElementById('moreMenu');

    if (actionsDropdown && actionsMenu) {
        actionsDropdown.addEventListener('click', function() {
            actionsMenu.classList.toggle('hidden');
            moreMenu.classList.add('hidden');
        });
    }

    if (moreDropdown && moreMenu) {
        moreDropdown.addEventListener('click', function() {
            moreMenu.classList.toggle('hidden');
            actionsMenu.classList.add('hidden');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.relative')) {
            if (actionsMenu) actionsMenu.classList.add('hidden');
            if (moreMenu) moreMenu.classList.add('hidden');
        }
    });

    // 6. Handle search functionality
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // 7. Handle pagination
    const paginationSelect = document.querySelector('.pagination-entries-select');
    if (paginationSelect) {
        paginationSelect.addEventListener('change', function() {
            const entries = this.value;
            console.log('Showing', entries, 'entries per page');
            // Handle pagination logic here
        });
    }

    // 8. Handle checkbox selection
    const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateSelected();
        });
    }

    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelected);
    });

    function updateSelected() {
        const checkedBoxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
        const totalBoxes = document.querySelectorAll('tbody input[type="checkbox"]');
        
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkedBoxes.length === totalBoxes.length;
            selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < totalBoxes.length;
        }
    }

    // 9. Handle mobile accordion functionality
    function toggleAccordion(index) {
        const content = document.getElementById(`accordion-content-${index}`);
        const arrow = document.getElementById(`accordion-arrow-${index}`);
        
        if (content && arrow) {
            const isHidden = content.classList.contains('hidden');
            
            // Hide all accordion contents
            document.querySelectorAll('[id^="accordion-content-"]').forEach(item => {
                item.classList.add('hidden');
            });
            
            // Reset all arrows
            document.querySelectorAll('[id^="accordion-arrow-"]').forEach(item => {
                item.style.transform = 'rotate(0deg)';
            });
            
            // Show selected content and rotate arrow
            if (isHidden) {
                content.classList.remove('hidden');
                arrow.style.transform = 'rotate(180deg)';
            }
        }
    }

    // Make toggleAccordion globally available
    window.toggleAccordion = toggleAccordion;

    // 10. Handle team member management
    function addTeamMember() {
        const table = document.getElementById('teamMembersTable');
        if (table) {
            const tbody = table.querySelector('tbody');
            const newRow = document.createElement('tr');
            newRow.className = 'bg-gray-50';
            newRow.innerHTML = `
                <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" placeholder="Member Name" /></td>
                <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" placeholder="Role" /></td>
                <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" placeholder="Contact" /></td>
                <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" placeholder="Daily Rate" /></td>
                <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" placeholder="Status" /></td>
                <td class="px-4 py-2 member-action" style="display:none;"></td>
            `;
            tbody.appendChild(newRow);
        }
    }

    // 11. Handle service assignment
    function assignService() {
        const table = document.getElementById('assignedServicesTable');
        if (table) {
            const tbody = table.querySelector('tbody');
            const newRow = document.createElement('tr');
            newRow.className = 'bg-gray-50';
            newRow.innerHTML = `
                <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" placeholder="Service Name" /></td>
                <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" placeholder="Category" /></td>
                <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" placeholder="Priority" /></td>
                <td><input type="text" class="w-full border border-black rounded-lg px-2 py-1 bg-gray-50 text-gray-800 font-semibold" placeholder="Status" /></td>
                <td class="px-4 py-2 service-action" style="display:none;"></td>
            `;
            tbody.appendChild(newRow);
        }
    }

    // Make functions globally available
    window.addTeamMember = addTeamMember;
    window.assignService = assignService;

    // 12. Handle team deletion
    function deleteTeam(teamId) {
        if (confirm('Are you sure you want to delete this team?')) {
            // Handle team deletion logic here
            console.log('Deleting team:', teamId);
            // Remove from DOM or update UI
            const row = document.querySelector(`[data-team-id="${teamId}"]`);
            if (row) {
                row.remove();
            }
        }
    }

    // 13. Handle team editing
    function editTeam(teamId) {
        // Navigate to edit page or enable editing mode
        window.location.href = `edit-team.html?team=${teamId}`;
    }

    // Make functions globally available
    window.deleteTeam = deleteTeam;
    window.editTeam = editTeam;

    // 14. Handle team status updates
    function updateTeamStatus(teamId, status) {
        // Handle team status update logic here
        console.log('Updating team status:', teamId, status);
    }

    // 15. Handle team rate calculations
    function calculateTeamRate(members) {
        let totalRate = 0;
        members.forEach(member => {
            totalRate += parseFloat(member.rate) || 0;
        });
        return totalRate.toFixed(2);
    }

    // 16. Handle team performance metrics
    function updatePerformanceMetrics(teamId) {
        // Handle performance metrics update logic here
        console.log('Updating performance metrics for team:', teamId);
    }

    // Make functions globally available
    window.updateTeamStatus = updateTeamStatus;
    window.calculateTeamRate = calculateTeamRate;
    window.updatePerformanceMetrics = updatePerformanceMetrics;

    // Restore modal logic for single and bulk restore
    let restoreTeamId = null;
    const restoreTeamModal = document.getElementById('restoreTeamModal');
    const restoreSelectedTeamModal = document.getElementById('restoreSelectedTeamModal');
    const cancelRestoreTeamBtn = document.getElementById('cancelRestoreTeam');
    const confirmRestoreTeamBtn = document.getElementById('confirmRestoreTeam');
    const cancelRestoreSelectedTeamBtn = document.getElementById('cancelRestoreSelectedTeam');
    const confirmRestoreSelectedTeamBtn = document.getElementById('confirmRestoreSelectedTeam');

    // Show single restore modal
    document.querySelectorAll('.restore-team-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            restoreTeamId = this.getAttribute('data-team-id');
            restoreTeamModal.classList.remove('hidden');
            setTimeout(() => restoreTeamModal.querySelector('.modal-content-modern').classList.add('show'), 10);
        });
    });
    // Hide single restore modal
    if (cancelRestoreTeamBtn) {
        cancelRestoreTeamBtn.onclick = function() {
            restoreTeamModal.querySelector('.modal-content-modern').classList.remove('show');
            setTimeout(() => restoreTeamModal.classList.add('hidden'), 200);
        };
    }
    // Confirm single restore
    if (confirmRestoreTeamBtn) {
        confirmRestoreTeamBtn.onclick = function() {
            // TODO: Add restore logic here (AJAX or local update)
            restoreTeamModal.querySelector('.modal-content-modern').classList.remove('show');
            setTimeout(() => restoreTeamModal.classList.add('hidden'), 200);
        };
    }
    // Show bulk restore modal
    if (restoreSelectedTeamModal) {
        const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
        if (restoreSelectedBtn) {
            restoreSelectedBtn.onclick = function() {
                restoreSelectedTeamModal.classList.remove('hidden');
                setTimeout(() => restoreSelectedTeamModal.querySelector('.modal-content-modern').classList.add('show'), 10);
            };
        }
        const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
        if (restoreSelectedBtnMobile) {
            restoreSelectedBtnMobile.onclick = function() {
                restoreSelectedTeamModal.classList.remove('hidden');
                setTimeout(() => restoreSelectedTeamModal.querySelector('.modal-content-modern').classList.add('show'), 10);
            };
        }
        // Hide bulk restore modal
        if (cancelRestoreSelectedTeamBtn) {
            cancelRestoreSelectedTeamBtn.onclick = function() {
                restoreSelectedTeamModal.querySelector('.modal-content-modern').classList.remove('show');
                setTimeout(() => restoreSelectedTeamModal.classList.add('hidden'), 200);
            };
        }
        // Confirm bulk restore
        if (confirmRestoreSelectedTeamBtn) {
            confirmRestoreSelectedTeamBtn.onclick = function() {
                // TODO: Add bulk restore logic here (AJAX or local update)
                restoreSelectedTeamModal.querySelector('.modal-content-modern').classList.remove('show');
                setTimeout(() => restoreSelectedTeamModal.classList.add('hidden'), 200);
            };
        }
    }
}); 