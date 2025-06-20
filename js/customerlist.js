document.addEventListener('DOMContentLoaded', function() {
    // Load header and navigation only in the main container
    if (typeof loadHTML === 'function') {
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
            loadHTML('../nav/header.html', 'header-container');
            loadHTML('../nav/navigation.html', 'nav-container');
        }
    }

    // Initialize dropdowns
    initializeDropdowns();

    // FILTER MODAL LOGIC FOR CUSTOMERS
    const filterBtn = document.getElementById('openFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Gather unique values from the desktop table
            const table = document.querySelector('table');
            if (!table) return;
            const rows = table.querySelectorAll('tbody tr');
            const names = new Set();
            const phones = new Set();
            const emails = new Set();
            const verificationStatuses = new Set();
            const accountStatuses = new Set();
            const dates = new Set();
            rows.forEach(row => {
                names.add(row.querySelector('td:nth-child(2)')?.textContent.trim() || '');
                phones.add(row.querySelector('td:nth-child(3)')?.textContent.trim() || '');
                emails.add(row.querySelector('td:nth-child(4)')?.textContent.trim() || '');
                verificationStatuses.add(row.querySelector('td:nth-child(5) span')?.textContent.trim() || '');
                accountStatuses.add(row.querySelector('td:nth-child(6) span')?.textContent.trim() || '');
                dates.add(row.querySelector('td:nth-child(7)')?.textContent.trim() || '');
            });

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-[95vw]">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Filter Customers</h3>
                        <button class="text-gray-500 hover:text-gray-700" id="closeFilterModal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <select id="filterName" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(names).filter(Boolean).map(n => `<option value="${n}">${n}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <select id="filterPhone" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(phones).filter(Boolean).map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <select id="filterEmail" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(emails).filter(Boolean).map(e => `<option value="${e}">${e}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                            <select id="filterVerification" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(verificationStatuses).filter(Boolean).map(v => `<option value="${v}">${v}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                            <select id="filterAccount" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(accountStatuses).filter(Boolean).map(a => `<option value="${a}">${a}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date Registered</label>
                            <select id="filterDate" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">All</option>
                                ${Array.from(dates).filter(Boolean).map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" id="resetFilter">Reset</button>
                        <button class="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors" id="applyFilter">Apply</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Focus the first dropdown for accessibility
            setTimeout(() => { modal.querySelector('#filterName').focus(); }, 100);

            // Close modal
            modal.querySelector('#closeFilterModal').addEventListener('click', () => modal.remove());
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

            // Reset filter
            modal.querySelector('#resetFilter').addEventListener('click', () => {
                modal.querySelectorAll('select').forEach(select => {
                    select.value = '';
                });
                // Show all rows
                rows.forEach(row => { row.style.display = ''; });
            });

            // Apply filter
            modal.querySelector('#applyFilter').addEventListener('click', () => {
                const name = modal.querySelector('#filterName').value;
                const phone = modal.querySelector('#filterPhone').value;
                const email = modal.querySelector('#filterEmail').value;
                const verification = modal.querySelector('#filterVerification').value;
                const account = modal.querySelector('#filterAccount').value;
                const date = modal.querySelector('#filterDate').value;
                rows.forEach(row => {
                    const rowName = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                    const rowPhone = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
                    const rowEmail = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
                    const rowVerification = row.querySelector('td:nth-child(5) span')?.textContent.trim() || '';
                    const rowAccount = row.querySelector('td:nth-child(6) span')?.textContent.trim() || '';
                    const rowDate = row.querySelector('td:nth-child(7)')?.textContent.trim() || '';
                    const match =
                        (!name || rowName === name) &&
                        (!phone || rowPhone === phone) &&
                        (!email || rowEmail === email) &&
                        (!verification || rowVerification === verification) &&
                        (!account || rowAccount === account) &&
                        (!date || rowDate === date);
                    row.style.display = match ? '' : 'none';
                });
                modal.remove();
            });
        });
    }
}); 