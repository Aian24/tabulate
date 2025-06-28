<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function() {
    // Load header and navigation if needed
    if (typeof loadHTML === 'function') {
        loadHTML('../nav/header.html', 'header-container');
        loadHTML('../nav/navigation.html', 'nav-container');
    }

    // Get customer data
    let customerData = null;
    try {
        customerData = JSON.parse(localStorage.getItem('selectedCustomer'));
    } catch (e) {}
    if (!customerData) {
        const nameHeader = document.getElementById('customerNameHeader');
        if (nameHeader) nameHeader.textContent = 'Not Found';
        return;
    }
    // Header
    const nameHeader = document.getElementById('customerNameHeader');
    if (nameHeader) nameHeader.textContent = customerData.fullName || '';
    // Personal Info
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('personalFirstName', customerData.personalFirstName);
    setVal('personalLastName', customerData.personalLastName);
    setVal('personalPhone', customerData.personalPhone);
    setVal('personalEmail', customerData.personalEmail);
    setVal('personalAddress', customerData.personalAddress);
    setVal('personalBuildingAddress', customerData.personalBuildingAddress);
    // Preferences
    setVal('prefClientSince', customerData.prefClientSince);
    setVal('prefLeadAcquiredDate', customerData.prefLeadAcquiredDate);
    setVal('prefMainLanguage', customerData.prefMainLanguage);
    setVal('prefPreferredCommunication', customerData.prefPreferredCommunication);
    setVal('prefPaymentTerms', customerData.prefPaymentTerms);
    setVal('prefPaymentMethod', customerData.prefPaymentMethod);
    setVal('prefTaxable', customerData.prefTaxable);
    setVal('prefTags', customerData.prefTags);
    setVal('prefSalesPerson', customerData.prefSalesPerson);
    setVal('prefContractor', customerData.prefContractor);
    setVal('prefInvoiceFrequency', customerData.prefInvoiceFrequency);
    // Billing
    setVal('billingFirstName', customerData.billingFirstName);
    setVal('billingLastName', customerData.billingLastName);
    setVal('billingPhone', customerData.billingPhone);
    setVal('billingEmail', customerData.billingEmail);
    setVal('billingAddress', customerData.billingAddress);
    setVal('billingCompanyName', customerData.billingCompanyName);
    // Notes
    setVal('customerNotes', customerData.customerNotes);
    // Custom Fields
    const customFieldsTbody = document.getElementById('customFields');
    function renderCustomFields(fields) {
        if (!customFieldsTbody) return;
        customFieldsTbody.innerHTML = '';
        (fields || []).forEach((f, idx) => {
            customFieldsTbody.innerHTML += `<tr>
                <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.name}" data-idx="${idx}" data-type="name"></td>
                <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.value}" data-idx="${idx}" data-type="value"></td>
                <td><button type="button" class="removeCustomFieldBtn text-red-500" data-idx="${idx}"><i class='fas fa-trash'></i></button></td>
            </tr>`;
        });
    }
    renderCustomFields(customerData.customFields || []);
    // Add custom field
    const addCustomFieldBtn = document.getElementById('addCustomFieldBtn');
    if (addCustomFieldBtn && customFieldsTbody) {
        addCustomFieldBtn.addEventListener('click', function() {
            const fields = [];
            customFieldsTbody.querySelectorAll('tr').forEach(tr => {
                const name = tr.querySelector('input[data-type="name"]').value;
                const value = tr.querySelector('input[data-type="value"]').value;
                if (name || value) fields.push({ name, value });
            });
            fields.push({ name: '', value: '' });
            renderCustomFields(fields);
        });
    }
    // Remove custom field
    if (customFieldsTbody) {
        customFieldsTbody.addEventListener('click', function(e) {
            if (e.target.closest('.removeCustomFieldBtn')) {
                e.target.closest('tr').remove();
            }
        });
    }
    // Cancel/back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'customer-details.html';
        });
    }
    // Update/save button
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            // Gather all fields
            const customFields = [];
            if (customFieldsTbody) {
                customFieldsTbody.querySelectorAll('tr').forEach(tr => {
                    const name = tr.querySelector('input[data-type="name"]').value;
                    const value = tr.querySelector('input[data-type="value"]').value;
                    if (name || value) customFields.push({ name, value });
                });
            }
            const updated = {
                ...customerData,
                personalFirstName: document.getElementById('personalFirstName')?.value || '',
                personalLastName: document.getElementById('personalLastName')?.value || '',
                personalPhone: document.getElementById('personalPhone')?.value || '',
                personalEmail: document.getElementById('personalEmail')?.value || '',
                personalAddress: document.getElementById('personalAddress')?.value || '',
                personalBuildingAddress: document.getElementById('personalBuildingAddress')?.value || '',
                prefClientSince: document.getElementById('prefClientSince')?.value || '',
                prefLeadAcquiredDate: document.getElementById('prefLeadAcquiredDate')?.value || '',
                prefMainLanguage: document.getElementById('prefMainLanguage')?.value || '',
                prefPreferredCommunication: document.getElementById('prefPreferredCommunication')?.value || '',
                prefPaymentTerms: document.getElementById('prefPaymentTerms')?.value || '',
                prefPaymentMethod: document.getElementById('prefPaymentMethod')?.value || '',
                prefTaxable: document.getElementById('prefTaxable')?.value || '',
                prefTags: document.getElementById('prefTags')?.value || '',
                prefSalesPerson: document.getElementById('prefSalesPerson')?.value || '',
                prefContractor: document.getElementById('prefContractor')?.value || '',
                prefInvoiceFrequency: document.getElementById('prefInvoiceFrequency')?.value || '',
                billingFirstName: document.getElementById('billingFirstName')?.value || '',
                billingLastName: document.getElementById('billingLastName')?.value || '',
                billingPhone: document.getElementById('billingPhone')?.value || '',
                billingEmail: document.getElementById('billingEmail')?.value || '',
                billingAddress: document.getElementById('billingAddress')?.value || '',
                billingCompanyName: document.getElementById('billingCompanyName')?.value || '',
                customerNotes: document.getElementById('customerNotes')?.value || '',
                customFields
            };
            localStorage.setItem('selectedCustomer', JSON.stringify(updated));
            window.location.href = 'customer-details.html';
        });
    }
=======
document.addEventListener('DOMContentLoaded', function() {
    // Load header and navigation if needed
    if (typeof loadHTML === 'function') {
        loadHTML('../nav/header.html', 'header-container');
        loadHTML('../nav/navigation.html', 'nav-container');
    }

    // Get customer data
    let customerData = null;
    try {
        customerData = JSON.parse(localStorage.getItem('selectedCustomer'));
    } catch (e) {}
    if (!customerData) {
        const nameHeader = document.getElementById('customerNameHeader');
        if (nameHeader) nameHeader.textContent = 'Not Found';
        return;
    }
    // Header
    const nameHeader = document.getElementById('customerNameHeader');
    if (nameHeader) nameHeader.textContent = customerData.fullName || '';
    // Personal Info
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('personalFirstName', customerData.personalFirstName);
    setVal('personalLastName', customerData.personalLastName);
    setVal('personalPhone', customerData.personalPhone);
    setVal('personalEmail', customerData.personalEmail);
    setVal('personalAddress', customerData.personalAddress);
    setVal('personalBuildingAddress', customerData.personalBuildingAddress);
    // Preferences
    setVal('prefClientSince', customerData.prefClientSince);
    setVal('prefLeadAcquiredDate', customerData.prefLeadAcquiredDate);
    setVal('prefMainLanguage', customerData.prefMainLanguage);
    setVal('prefPreferredCommunication', customerData.prefPreferredCommunication);
    setVal('prefPaymentTerms', customerData.prefPaymentTerms);
    setVal('prefPaymentMethod', customerData.prefPaymentMethod);
    setVal('prefTaxable', customerData.prefTaxable);
    setVal('prefTags', customerData.prefTags);
    setVal('prefSalesPerson', customerData.prefSalesPerson);
    setVal('prefContractor', customerData.prefContractor);
    setVal('prefInvoiceFrequency', customerData.prefInvoiceFrequency);
    // Billing
    setVal('billingFirstName', customerData.billingFirstName);
    setVal('billingLastName', customerData.billingLastName);
    setVal('billingPhone', customerData.billingPhone);
    setVal('billingEmail', customerData.billingEmail);
    setVal('billingAddress', customerData.billingAddress);
    setVal('billingCompanyName', customerData.billingCompanyName);
    // Notes
    setVal('customerNotes', customerData.customerNotes);
    // Custom Fields
    const customFieldsTbody = document.getElementById('customFields');
    function renderCustomFields(fields) {
        if (!customFieldsTbody) return;
        customFieldsTbody.innerHTML = '';
        (fields || []).forEach((f, idx) => {
            customFieldsTbody.innerHTML += `<tr>
                <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.name}" data-idx="${idx}" data-type="name"></td>
                <td><input type="text" class="border rounded px-2 py-1 w-full" value="${f.value}" data-idx="${idx}" data-type="value"></td>
                <td><button type="button" class="removeCustomFieldBtn text-red-500" data-idx="${idx}"><i class='fas fa-trash'></i></button></td>
            </tr>`;
        });
    }
    renderCustomFields(customerData.customFields || []);
    // Add custom field
    const addCustomFieldBtn = document.getElementById('addCustomFieldBtn');
    if (addCustomFieldBtn && customFieldsTbody) {
        addCustomFieldBtn.addEventListener('click', function() {
            const fields = [];
            customFieldsTbody.querySelectorAll('tr').forEach(tr => {
                const name = tr.querySelector('input[data-type="name"]').value;
                const value = tr.querySelector('input[data-type="value"]').value;
                if (name || value) fields.push({ name, value });
            });
            fields.push({ name: '', value: '' });
            renderCustomFields(fields);
        });
    }
    // Remove custom field
    if (customFieldsTbody) {
        customFieldsTbody.addEventListener('click', function(e) {
            if (e.target.closest('.removeCustomFieldBtn')) {
                e.target.closest('tr').remove();
            }
        });
    }
    // Cancel/back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'customer-details.html';
        });
    }
    // Update/save button
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            // Gather all fields
            const customFields = [];
            if (customFieldsTbody) {
                customFieldsTbody.querySelectorAll('tr').forEach(tr => {
                    const name = tr.querySelector('input[data-type="name"]').value;
                    const value = tr.querySelector('input[data-type="value"]').value;
                    if (name || value) customFields.push({ name, value });
                });
            }
            const updated = {
                ...customerData,
                personalFirstName: document.getElementById('personalFirstName')?.value || '',
                personalLastName: document.getElementById('personalLastName')?.value || '',
                personalPhone: document.getElementById('personalPhone')?.value || '',
                personalEmail: document.getElementById('personalEmail')?.value || '',
                personalAddress: document.getElementById('personalAddress')?.value || '',
                personalBuildingAddress: document.getElementById('personalBuildingAddress')?.value || '',
                prefClientSince: document.getElementById('prefClientSince')?.value || '',
                prefLeadAcquiredDate: document.getElementById('prefLeadAcquiredDate')?.value || '',
                prefMainLanguage: document.getElementById('prefMainLanguage')?.value || '',
                prefPreferredCommunication: document.getElementById('prefPreferredCommunication')?.value || '',
                prefPaymentTerms: document.getElementById('prefPaymentTerms')?.value || '',
                prefPaymentMethod: document.getElementById('prefPaymentMethod')?.value || '',
                prefTaxable: document.getElementById('prefTaxable')?.value || '',
                prefTags: document.getElementById('prefTags')?.value || '',
                prefSalesPerson: document.getElementById('prefSalesPerson')?.value || '',
                prefContractor: document.getElementById('prefContractor')?.value || '',
                prefInvoiceFrequency: document.getElementById('prefInvoiceFrequency')?.value || '',
                billingFirstName: document.getElementById('billingFirstName')?.value || '',
                billingLastName: document.getElementById('billingLastName')?.value || '',
                billingPhone: document.getElementById('billingPhone')?.value || '',
                billingEmail: document.getElementById('billingEmail')?.value || '',
                billingAddress: document.getElementById('billingAddress')?.value || '',
                billingCompanyName: document.getElementById('billingCompanyName')?.value || '',
                customerNotes: document.getElementById('customerNotes')?.value || '',
                customFields
            };
            localStorage.setItem('selectedCustomer', JSON.stringify(updated));
            window.location.href = 'customer-details.html';
        });
    }
>>>>>>> master
}); 