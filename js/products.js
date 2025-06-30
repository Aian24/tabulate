// Product data from the provided image
const products = [
  { name: 'Plant Cutters 1.', vendors: 'Global', price: '$ 97.34', date: 'March 12, 2025' },
  { name: 'Stairs', vendors: 'DIYI', price: '$ 800.00', date: 'March 12, 2025' },
  { name: 'Steel Bars', vendors: 'Global', price: '$ 76.87', date: 'March 12, 2025' },
  { name: 'Parasitic Acid', vendors: 'Citi Hardware', price: '$ 50.00', date: 'March 12, 2025' },
  { name: 'Paint Brush Set', vendors: 'LIXIL', price: '$ 350.00', date: 'March 12, 2025' },
  { name: 'Wheelbarrows', vendors: 'Ryobi', price: '$ 3,200.00', date: 'March 12, 2025' },
  { name: 'Garden Soil Mix', vendors: 'Stanley', price: '$ 231.28', date: 'March 12, 2025' },
  { name: 'Bricks', vendors: 'Ace Hardware', price: '$ 20.00', date: 'March 12, 2025' },
  { name: 'Gloves (Rubber-coated)', vendors: 'LIXIL', price: '$ 150.00', date: 'March 12, 2025' },
  { name: 'Rake.', vendors: 'Ace Hardware, Oshwald', price: '$ 1,000.00, $ 112.25', date: 'March 12, 2025' },
  { name: 'Mawer', vendors: 'DIYI', price: '$ 1,000.00', date: 'March 12, 2025' },
];

const vendors = ["Global", "Interline", "DIYI", "Citi Hardware", "LIXIL", "Ryobi", "Stanley", "Ace Hardware", "Oshwald"];

function renderProductsTable() {
  const tbody = document.getElementById('products-table-body');
  tbody.innerHTML = '';
  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-6 py-4"><input type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" onclick="event.stopPropagation()"></td>
      <td class="px-6 py-4 text-sm text-gray-900">${product.name}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${product.vendors}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${product.price}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${product.date}</td>
    `;
    tr.classList.add('cursor-pointer', 'hover:bg-blue-50', 'transition-colors');
    tr.addEventListener('click', () => {
      window.location.href = `products-details.html?name=${encodeURIComponent(product.name)}`;
    });
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', renderProductsTable);

// =========================
// Product Details Edit Mode
// =========================
// This section enables edit mode, multi-select dropdown for business category, and vendor row actions on products-details.html
// It is safe to include here as it only runs if the relevant elements exist on the page.

document.addEventListener('DOMContentLoaded', function() {
  // Only run on the details page
  const editBtn = document.getElementById('editBtn');
  const mainContent = document.querySelector('main');
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.onclick = function(e) {
      e.preventDefault();
      window.location.href = 'products.html';
    };
  }
  if (!editBtn || !mainContent) return;

  let isEditing = false;

  // Toggle edit/view mode for all fields
  function renderEditMode(edit, saveChanges = false) {
    isEditing = edit;
    // Toggle Edit/Update+Cancel buttons
    const btnContainer = editBtn.parentElement;
    if (edit) {
      editBtn.classList.add('hidden');
      if (!document.getElementById('updateBtn')) {
        // Create a flex container for the buttons
        const btnGroup = document.createElement('div');
        btnGroup.className = 'flex gap-2';
        btnGroup.id = 'editBtnGroup';
        // Create Update button
        const updateBtn = document.createElement('button');
        updateBtn.id = 'updateBtn';
        updateBtn.className = 'px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 flex items-center gap-2 text-sm';
        updateBtn.innerHTML = '<i class="fas fa-save"></i> Update';
        updateBtn.onclick = () => renderEditMode(false, true); // Implement save logic
        // Create Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelBtn';
        cancelBtn.className = 'px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 flex items-center gap-2 text-sm';
        cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
        cancelBtn.onclick = () => renderEditMode(false, false); // Implement revert logic
        btnGroup.appendChild(updateBtn);
        btnGroup.appendChild(cancelBtn);
        btnContainer.appendChild(btnGroup);
      }
    } else {
      editBtn.classList.remove('hidden');
      document.getElementById('editBtnGroup')?.remove();
    }

    // Store original values when entering edit mode
    if (edit) {
      mainContent.querySelectorAll('input, textarea').forEach(input => {
        if (input.type !== 'file') {
          input.setAttribute('data-original-value', input.value);
        }
      });
    }

    // Toggle fields
    mainContent.querySelectorAll('input, textarea').forEach(input => {
      if (!saveChanges && input.hasAttribute('data-original-value')) {
        input.value = input.getAttribute('data-original-value');
      }

      if (input.name === 'businessCategory') {
        input.parentElement.querySelector('.custom-multiselect')?.classList.toggle('hidden', !edit);
        input.classList.toggle('hidden', edit);
      } else {
        input.readOnly = !edit;
        input.classList.toggle('bg-gray-100', !edit);
        input.classList.toggle('bg-white', edit);
      }
    });

    // Vendors table: show/hide Action column and Add Vendors button
    const vendorsTable = mainContent.querySelector('table');
    const vendorTableHeader = vendorsTable.querySelector('thead tr');

    let actionTh = vendorsTable.querySelector('th.action-col');
    const addVendorBtnContainer = document.getElementById('addVendorBtnContainer');
    // Show/hide Submit button in edit mode
    let submitBtn = document.getElementById('detailsSubmitBtn');
    if (edit) {
      // Make existing vendor rows editable
      vendorsTable.querySelectorAll('tbody tr').forEach(row => {
        row.querySelectorAll('td[data-col]').forEach(cell => {
          const currentValue = cell.textContent.trim();
          cell.setAttribute('data-original-value', currentValue);
          const colType = cell.getAttribute('data-col');

          if (colType === 'vendor') {
            const optionsHtml = vendors.map(vendor => 
                `<option value="${vendor}" ${currentValue === vendor ? 'selected' : ''}>${vendor}</option>`
            ).join('');
            cell.innerHTML = `
              <div class="relative w-full h-full">
                <select class="w-full h-full rounded border border-gray-400 bg-white px-3 py-2 text-base appearance-none pr-8">
                  ${optionsHtml}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            `;
          } else {
            cell.innerHTML = `<input type="text" class="w-full h-full rounded border border-gray-400 bg-white px-3 py-2 text-base" value="${currentValue}">`;
          }
        });
      });

      const headerCells = vendorTableHeader.querySelectorAll('th');
      if (!vendorTableHeader.querySelector('.action-col')) {
        headerCells.forEach(th => {
          th.classList.remove('w-1/5');
          th.style.width = '18.4%';
        });
        vendorTableHeader.insertAdjacentHTML('beforeend', '<th class="px-4 py-2 text-left action-col" style="width: 8%;">Action</th>');
      }

      vendorsTable.querySelectorAll('tbody tr').forEach(row => {
        if (!row.querySelector('.action-col')) {
          row.insertAdjacentHTML('beforeend', `<td class="px-4 py-2 text-center action-col"><button class="delete-vendor px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"><i class="fas fa-trash"></i></button></td>`);
        }
      });
      // Add Vendors button
      if (addVendorBtnContainer && !document.getElementById('addVendorBtn')) {
        const addBtn = document.createElement('button');
        addBtn.id = 'addVendorBtn';
        addBtn.className = 'px-4 py-2 bg-cyan-500 text-white rounded shadow hover:bg-cyan-600 flex items-center gap-2 text-sm';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Vendors';
        addBtn.onclick = function() {
          // Add a new editable row to the vendors table
          const newRow = document.createElement('tr');
          const optionsHtml = '<option value="" disabled selected>Select A Vendor</option>' + vendors.map(vendor => `<option value="${vendor}">${vendor}</option>`).join('');
          newRow.innerHTML = `
            <td class='px-4 py-2'>
              <div class="relative w-full h-full">
                <select class='w-full h-full rounded border border-gray-400 bg-white px-3 py-2 text-base appearance-none pr-8'>
                  ${optionsHtml}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </td>
            <td class='px-4 py-2'><input type='text' class='w-full h-full rounded border border-gray-400 bg-white px-3 py-2 text-base' /></td>
            <td class='px-4 py-2'><input type='text' class='w-full h-full rounded border border-gray-400 bg-white px-3 py-2 text-base' /></td>
            <td class='px-4 py-2'><input type='text' class='w-full h-full rounded border border-gray-400 bg-white px-3 py-2 text-base' /></td>
            <td class='px-4 py-2'><input type='text' class='w-full h-full rounded border border-gray-400 bg-white px-3 py-2 text-base' /></td>
            <td class='px-4 py-2 text-center action-col'><button class='delete-vendor px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600'><i class='fas fa-trash'></i></button></td>
          `;
          vendorsTable.querySelector('tbody').appendChild(newRow);
        };
        addVendorBtnContainer.appendChild(addBtn);
      }
      // Make delete buttons work for all rows
      vendorsTable.querySelectorAll('.delete-vendor').forEach(btn => {
        btn.onclick = function(e) {
          e.preventDefault();
          const row = btn.closest('tr');
          if (row) row.remove();
        };
      });
    } else {
      // Revert existing vendor rows to readonly
      vendorsTable.querySelectorAll('tbody tr').forEach(row => {
        // vendor cell
        row.querySelectorAll('td[data-col]').forEach(cell => {
          if (cell.hasAttribute('data-original-value')) {
            let displayValue = '';
            const colType = cell.getAttribute('data-col');

            if (saveChanges) {
              if (colType === 'vendor') {
                displayValue = cell.querySelector('select').value;
              } else {
                displayValue = cell.querySelector('input').value;
              }
            } else {
              displayValue = cell.getAttribute('data-original-value');
            }
            cell.innerHTML = displayValue;
          }
        });
      });

      // Remove all Action columns and cells robustly
      const headerCells = vendorTableHeader.querySelectorAll('th');
      headerCells.forEach(th => {
        if (!th.classList.contains('action-col')) {
          th.classList.add('w-1/5');
          th.style.width = '';
        }
      });
      vendorsTable.querySelectorAll('th.action-col').forEach(th => th.remove());
      vendorsTable.querySelectorAll('td.action-col').forEach(td => td.remove());
      vendorsTable.querySelectorAll('td .delete-vendor').forEach(btn => btn.closest('td')?.remove());
      // Remove Add Vendors button
      if (addVendorBtnContainer) addVendorBtnContainer.innerHTML = '';
    }
  }
  editBtn.addEventListener('click', () => renderEditMode(true));

  // --- Custom Multiselect for Business Category ---
  // Only render in edit mode
  // This logic is based on the dropdown in create-service.html
  const bcInput = document.querySelector('input[name="businessCategory"]');
  if (bcInput) {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-multiselect hidden';
    wrapper.innerHTML = `
      <div class="relative" id="businessCategoryDropdown">
        <button type="button" id="dropdownButton" class="w-full border border-blue-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-800 text-left flex items-center justify-between">
          <span id="dropdownSelected">Select options...</span>
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="dropdownMenu" class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg hidden max-h-60 overflow-y-auto grid grid-cols-1 md:grid-cols-2">
          <div class="px-3 py-2 hover:bg-gray-100 flex items-center gap-2">
            <input type="checkbox" id="selectAllCategories" class="w-5 h-5 rounded border-gray-300">
            <label for="selectAllCategories" class="text-sm font-medium text-gray-800 select-none">Select All</label>
          </div>
          <div class="px-3 py-2 hover:bg-gray-100 flex items-center gap-2">
            <input type="checkbox" class="categoryOption w-5 h-5 rounded border-gray-300" value="Construction Services" id="cat-construction">
            <label for="cat-construction" class="text-sm font-medium text-gray-800 select-none">Construction Services</label>
          </div>
          <div class="px-3 py-2 hover:bg-gray-100 flex items-center gap-2">
            <input type="checkbox" class="categoryOption w-5 h-5 rounded border-gray-300" value="Plumbing Services" id="cat-plumbing">
            <label for="cat-plumbing" class="text-sm font-medium text-gray-800 select-none">Plumbing Services</label>
          </div>
          <div class="px-3 py-2 hover:bg-gray-100 flex items-center gap-2">
            <input type="checkbox" class="categoryOption w-5 h-5 rounded border-gray-300" value="Landscaping & Maintenance" id="cat-landscaping">
            <label for="cat-landscaping" class="text-sm font-medium text-gray-800 select-none">Landscaping & Maintenance</label>
          </div>
          <div class="px-3 py-2 hover:bg-gray-100 flex items-center gap-2">
            <input type="checkbox" class="categoryOption w-5 h-5 rounded border-gray-300" value="Maintenance Services" id="cat-maintenance">
            <label for="cat-maintenance" class="text-sm font-medium text-gray-800 select-none">Maintenance Services</label>
          </div>
          <div class="px-3 py-2 hover:bg-gray-100 flex items-center gap-2">
            <input type="checkbox" class="categoryOption w-5 h-5 rounded border-gray-300" value="Electrical Services" id="cat-electrical">
            <label for="cat-electrical" class="text-sm font-medium text-gray-800 select-none">Electrical Services</label>
          </div>
        </div>
      </div>
    `;
    bcInput.parentElement.appendChild(wrapper);
  }
  // Multiselect dropdown logic
  let dropdownButton = document.getElementById('dropdownButton');
  let dropdownMenu = document.getElementById('dropdownMenu');
  let dropdownSelected = document.getElementById('dropdownSelected');
  let categoryOptions = document.querySelectorAll('.categoryOption');
  let selectAll = document.getElementById('selectAllCategories');
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
    bcInput.value = selected.join(', ');
  }
}); 