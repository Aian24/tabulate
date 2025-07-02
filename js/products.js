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
        // Remove any existing dropdown to prevent duplicates
        input.parentElement.querySelector('.custom-multiselect')?.remove();
        if (edit) {
          // Create dropdown
          const wrapper = document.createElement('div');
          wrapper.className = 'custom-multiselect';
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
          input.parentElement.appendChild(wrapper);
          input.classList.add('hidden');

          // Initialize dropdown logic
          const dropdownButton = wrapper.querySelector('#dropdownButton');
          const dropdownMenu = wrapper.querySelector('#dropdownMenu');
          const dropdownSelected = wrapper.querySelector('#dropdownSelected');
          const categoryOptions = wrapper.querySelectorAll('.categoryOption');
          const selectAll = wrapper.querySelector('#selectAllCategories');

          // Set checked state from input value
          const selectedValues = input.value.split(',').map(v => v.trim());
          categoryOptions.forEach(opt => {
            if (selectedValues.includes(opt.value)) opt.checked = true;
          });
          // Set select all if all are checked
          if (Array.from(categoryOptions).every(opt => opt.checked)) selectAll.checked = true;

          function updateSelected() {
            const selected = Array.from(categoryOptions).filter(opt => opt.checked).map(opt => opt.value);
            dropdownSelected.textContent = selected.length ? selected.join(', ') : 'Select options...';
            // Update the hidden input value
            input.value = selected.join(', ');
          }

          dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
          });
          document.addEventListener('click', () => {
            dropdownMenu.classList.add('hidden');
          });
          dropdownMenu.addEventListener('click', e => e.stopPropagation());

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
          updateSelected();
        } else {
          input.classList.remove('hidden');
        }
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
          // Show confirmation modal
          const deleteVendorModal = document.getElementById('deleteVendorModal');
          if (!deleteVendorModal) { row.remove(); return; } // fallback
          showModal(deleteVendorModal);
          // Remove any previous listeners
          const confirmBtn = document.getElementById('confirmDeleteVendor');
          const cancelBtn = document.getElementById('cancelDeleteVendor');
          // Remove old listeners by cloning
          const newConfirm = confirmBtn.cloneNode(true);
          const newCancel = cancelBtn.cloneNode(true);
          confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
          cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
          // Confirm delete
          newConfirm.onclick = function() {
            row.remove();
            hideModal(deleteVendorModal);
          };
          // Cancel delete
          newCancel.onclick = function() {
            hideModal(deleteVendorModal);
          };
          // Hide modal if background is clicked
          deleteVendorModal.onclick = function(event) {
            if (event.target === deleteVendorModal) hideModal(deleteVendorModal);
          };
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
});

// =========================
// Code below was moved from create-product.js (now deleted)
// If you are looking for create-product logic, it is now here for maintainability.
// =========================

// Add Cancel button logic for create-product.html

document.addEventListener('DOMContentLoaded', function() {
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.onclick = function(e) {
      e.preventDefault();
      window.location.href = 'products.html';
    };
  }

  // Back button logic
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.onclick = function(e) {
      e.preventDefault();
      window.location.href = 'products.html';
    };
  }

  // Business Category Dropdown
  const dropdownButton = document.getElementById('dropdownButton');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const dropdownSelected = document.getElementById('dropdownSelected');
  const categoryOptions = document.querySelectorAll('.categoryOption');
  const selectAll = document.getElementById('selectAllCategories');
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
  }

  // Vendors Table Logic
  const vendorList = [
    'Global', 'DIYI', 'Stanley', 'Ryobi', 'Oshwald', 'Ace Hardware', 'LIXIL', 'Citi Hardware'
  ];
  const addVendorBtnContainer = document.getElementById('addVendorBtnContainer');
  const vendorsTable = document.querySelector('table');
  if (addVendorBtnContainer && vendorsTable) {
    // Always show at least one vendor row on load
    if (vendorsTable.querySelectorAll('tbody tr').length === 0) {
      addVendorRow();
    }
  }

  function addVendorRow() {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td class='px-4 py-2'>
        <select class='w-full rounded border border-gray-400 bg-white px-2 py-1 text-base'>
          <option value=''>Select A Vendor</option>
          ${vendorList.map(v => `<option value='${v}'>${v}</option>`).join('')}
        </select>
      </td>
      <td class='px-4 py-2'><input type='text' class='w-full rounded border border-gray-400 bg-white px-2 py-1 text-base' placeholder='' /></td>
      <td class='px-4 py-2'><input type='text' class='w-full rounded border border-gray-400 bg-white px-2 py-1 text-base' placeholder='' /></td>
      <td class='px-4 py-2'><input type='text' class='w-full rounded border border-gray-400 bg-white px-2 py-1 text-base' placeholder='' /></td>
      <td class='px-4 py-2'><input type='text' class='w-full rounded border border-gray-400 bg-white px-2 py-1 text-base' placeholder='' /></td>
      <td class='px-4 py-2 text-center action-col flex items-center justify-center'>
        <button class='delete-vendor px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600'><i class='fas fa-trash'></i></button>
      </td>
    `;
    vendorsTable.querySelector('tbody').appendChild(newRow);
    // Attach delete event with modal
    newRow.querySelector('.delete-vendor').onclick = function(e) {
      e.preventDefault();
      const deleteVendorModal = document.getElementById('deleteVendorModal');
      if (!deleteVendorModal) { newRow.remove(); return; }
      showModal(deleteVendorModal);
      // Remove any previous listeners
      const confirmBtn = document.getElementById('confirmDeleteVendor');
      const cancelBtn = document.getElementById('cancelDeleteVendor');
      const newConfirm = confirmBtn.cloneNode(true);
      const newCancel = cancelBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
      cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
      newConfirm.onclick = function() {
        newRow.remove();
        hideModal(deleteVendorModal);
      };
      newCancel.onclick = function() {
        hideModal(deleteVendorModal);
      };
      deleteVendorModal.onclick = function(event) {
        if (event.target === deleteVendorModal) hideModal(deleteVendorModal);
      };
    };
  }

  // Attach delete event to any existing rows (if any)
  vendorsTable.querySelectorAll('.delete-vendor').forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      const row = btn.closest('tr');
      const deleteVendorModal = document.getElementById('deleteVendorModal');
      if (!deleteVendorModal) { row.remove(); return; }
      showModal(deleteVendorModal);
      // Remove any previous listeners
      const confirmBtn = document.getElementById('confirmDeleteVendor');
      const cancelBtn = document.getElementById('cancelDeleteVendor');
      const newConfirm = confirmBtn.cloneNode(true);
      const newCancel = cancelBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
      cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
      newConfirm.onclick = function() {
        row.remove();
        hideModal(deleteVendorModal);
      };
      newCancel.onclick = function() {
        hideModal(deleteVendorModal);
      };
      deleteVendorModal.onclick = function(event) {
        if (event.target === deleteVendorModal) hideModal(deleteVendorModal);
      };
    };
  });
});

// Add this helper for modal animation (like po.js)
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

// =========================
// Deleted Products Page Logic
// =========================

// Sample deleted products data
const deletedProducts = [
  {
    name: 'Paint Brush Set',
    vendors: 'LIXIL',
    price: '$ 350.00',
    deletedDate: 'April 1, 2025',
  },
  {
    name: 'Wheelbarrows',
    vendors: 'Ryobi',
    price: '$ 3,200.00',
    deletedDate: 'April 2, 2025',
  },
  {
    name: 'Bricks',
    vendors: 'Ace Hardware',
    price: '$ 20.00',
    deletedDate: 'April 3, 2025',
  },
  {
    name: 'Gloves (Rubber-coated)',
    vendors: 'LIXIL',
    price: '$ 150.00',
    deletedDate: 'April 4, 2025',
  },
];

function renderDeletedProductsTable() {
  const tbody = document.getElementById('deleted-products-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  deletedProducts.forEach((product, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-6 py-4"><input type="checkbox" class="deleted-product-checkbox w-4 h-4 text-purple-600 rounded focus:ring-purple-500" data-idx="${idx}" onclick="event.stopPropagation()"></td>
      <td class="px-6 py-4 text-sm font-medium text-gray-900">${product.name}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${product.vendors}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${product.price}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${product.deletedDate}</td>
      <td class="px-6 py-4">
        <button class="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors restore-btn"><i class="fas fa-undo-alt mr-1"></i> Restore</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDeletedProductsMobileCards() {
  const container = document.getElementById('mobile-deleted-products-list');
  if (!container) return;
  container.innerHTML = '';
  deletedProducts.forEach((product, idx) => {
    const card = document.createElement('div');
    card.className = 'mobile-table-row bg-white rounded-lg border border-gray-100';
    card.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-3">
          <input type="checkbox" class="deleted-product-checkbox w-4 h-4 text-purple-600 rounded focus:ring-purple-500" data-idx="${idx}">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">${product.name.slice(0,2).toUpperCase()}</div>
          <div>
            <h3 class="font-semibold text-gray-900 text-sm">${product.name}</h3>
            <p class="text-xs text-gray-500">Vendor: ${product.vendors}</p>
          </div>
        </div>
        <span class="mobile-status bg-red-100 text-red-800 text-xs">Deleted</span>
      </div>
      <div class="space-y-1 text-xs">
        <div><span class="text-gray-500">Price:</span><span class="text-gray-900">${product.price}</span></div>
        <div><span class="text-gray-500">Deleted Date:</span><span class="text-gray-900">${product.deletedDate}</span></div>
      </div>
      <div class="mt-1 flex justify-between items-center">
        <button class="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors restore-btn"><i class="fas fa-undo-alt mr-1"></i> Restore</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateRestoreButtonVisibilityProducts() {
  const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
  const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
  const checkedBoxes = document.querySelectorAll('.deleted-product-checkbox:checked');
  if (restoreSelectedBtn) {
    restoreSelectedBtn.classList.toggle('hidden', checkedBoxes.length === 0);
  }
  if (restoreSelectedBtnMobile) {
    restoreSelectedBtnMobile.classList.toggle('hidden', checkedBoxes.length === 0);
  }
}

function updateSelectAllCheckboxProducts() {
  const selectAllCheckbox = document.getElementById('selectAllDeleted');
  const checkboxes = document.querySelectorAll('.deleted-product-checkbox');
  const checkedBoxes = document.querySelectorAll('.deleted-product-checkbox:checked');
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length && checkboxes.length > 0;
    selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
  }
}

let restoreProductIndex = null;

function showRestoreProductModal(idx) {
  restoreProductIndex = idx;
  const modal = document.getElementById('restoreProductModal');
  if (!modal) return;
  showModal(modal);
}

function hideRestoreProductModal() {
  const modal = document.getElementById('restoreProductModal');
  if (!modal) return;
  hideModal(modal);
  restoreProductIndex = null;
}

document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...
  // Render deleted products table and mobile cards if on deleted-products.html
  if (document.getElementById('deleted-products-table-body')) {
    renderDeletedProductsTable();
  }
  if (document.getElementById('mobile-deleted-products-list')) {
    renderDeletedProductsMobileCards();
  }
  // Select all checkbox
  const selectAllCheckbox = document.getElementById('selectAllDeleted');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.deleted-product-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
      updateRestoreButtonVisibilityProducts();
      updateSelectAllCheckboxProducts();
    });
  }
  // Individual checkbox handlers
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('deleted-product-checkbox')) {
      updateRestoreButtonVisibilityProducts();
      updateSelectAllCheckboxProducts();
    }
  });
  // Initial state
  updateRestoreButtonVisibilityProducts();
  updateSelectAllCheckboxProducts();
  // Attach restore button handlers for deleted products (desktop)
  document.addEventListener('click', function(e) {
    if (e.target.closest('.restore-btn')) {
      // Find index from table row or card
      let idx = null;
      // Desktop table
      const tr = e.target.closest('tr');
      if (tr && tr.querySelector('.deleted-product-checkbox')) {
        idx = tr.querySelector('.deleted-product-checkbox').getAttribute('data-idx');
      }
      // Mobile card
      const card = e.target.closest('.mobile-table-row');
      if (card && card.querySelector('.deleted-product-checkbox')) {
        idx = card.querySelector('.deleted-product-checkbox').getAttribute('data-idx');
      }
      if (idx !== null) {
        showRestoreProductModal(Number(idx));
      }
    }
  });
  // Modal button handlers
  const cancelRestoreBtn = document.getElementById('cancelRestoreProduct');
  if (cancelRestoreBtn) {
    cancelRestoreBtn.onclick = hideRestoreProductModal;
  }
  const confirmRestoreBtn = document.getElementById('confirmRestoreProduct');
  if (confirmRestoreBtn) {
    confirmRestoreBtn.onclick = function() {
      if (restoreProductIndex !== null && deletedProducts[restoreProductIndex]) {
        deletedProducts.splice(restoreProductIndex, 1);
        renderDeletedProductsTable();
        renderDeletedProductsMobileCards();
        updateRestoreButtonVisibilityProducts();
        updateSelectAllCheckboxProducts();
      }
      hideRestoreProductModal();
    };
  }
});

function showRestoreSelectedProductModal() {
  const modal = document.getElementById('restoreSelectedProductModal');
  if (!modal) return;
  showModal(modal);
}

function hideRestoreSelectedProductModal() {
  const modal = document.getElementById('restoreSelectedProductModal');
  if (!modal) return;
  hideModal(modal);
}

// =========================
// Deleted Services Example Data & Logic
// =========================
const deletedServices = [
  {
    name: 'Weed Control',
    unitPrice: '$708.40',
    priceMatrix: 'No Price Matrix',
    priceMatrixStatus: 'danger', // 'danger' or 'success'
    status: 'Active',
    dateCreated: 'June 3, 2025'
  },
  {
    name: 'Lawn Mowing',
    unitPrice: '$78.40',
    priceMatrix: 'Price Matrix Available',
    priceMatrixStatus: 'success',
    status: 'Active',
    dateCreated: 'March 13, 2025'
  },
  {
    name: 'Roofing Installation',
    unitPrice: '$6,230.00',
    priceMatrix: 'No Price Matrix',
    priceMatrixStatus: 'danger',
    status: 'Active',
    dateCreated: 'March 13, 2025'
  },
  {
    name: 'Office Cleaning Service',
    unitPrice: '$5,712.00',
    priceMatrix: 'No Price Matrix',
    priceMatrixStatus: 'danger',
    status: 'Active',
    dateCreated: 'March 13, 2025'
  }
];

function renderDeletedServicesTable() {
  const tbody = document.getElementById('deleted-services-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  deletedServices.forEach((service, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-6 py-4"><input type="checkbox" class="deleted-service-checkbox w-4 h-4 text-purple-600 rounded focus:ring-purple-500" data-idx="${idx}" onclick="event.stopPropagation()"></td>
      <td class="px-6 py-4 text-sm font-medium text-gray-900">${service.name}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${service.unitPrice}</td>
      <td class="px-6 py-4 text-sm">
        <span class="${service.priceMatrixStatus === 'danger' ? 'text-red-500' : 'text-sky-500'}">
          <i class="fas ${service.priceMatrixStatus === 'danger' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-1"></i>${service.priceMatrix}
        </span>
      </td>
      <td class="px-6 py-4"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${service.status}</span></td>
      <td class="px-6 py-4 text-sm text-gray-900">${service.dateCreated}</td>
      <td class="px-6 py-4">
        <button class="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors restore-btn"><i class="fas fa-undo-alt mr-1"></i> Restore</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  updateSelectAllCheckboxServices();
}

function renderDeletedServicesMobileCards() {
  const container = document.getElementById('mobile-deleted-services-list');
  if (!container) return;
  container.innerHTML = '';
  deletedServices.forEach((service, idx) => {
    const card = document.createElement('div');
    card.className = 'mobile-table-row bg-white rounded-lg border border-gray-100';
    card.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-3">
          <input type="checkbox" class="deleted-service-checkbox w-4 h-4 text-purple-600 rounded focus:ring-purple-500" data-idx="${idx}">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">${service.name.slice(0,2).toUpperCase()}</div>
          <div>
            <h3 class="font-semibold text-gray-900 text-sm">${service.name}</h3>
            <p class="text-xs text-gray-500">${service.unitPrice}</p>
          </div>
        </div>
        <span class="mobile-status bg-blue-100 text-blue-800 text-xs">${service.status}</span>
      </div>
      <div class="space-y-1 text-xs">
        <div><span class="text-gray-500">Price Matrix:</span><span class="${service.priceMatrixStatus === 'danger' ? 'text-red-500' : 'text-sky-500'} ml-1">${service.priceMatrix}</span></div>
        <div><span class="text-gray-500">Date Created:</span><span class="text-gray-900 ml-1">${service.dateCreated}</span></div>
      </div>
      <div class="mt-1 flex justify-between items-center">
        <button class="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors restore-btn"><i class="fas fa-undo-alt mr-1"></i> Restore</button>
      </div>
    `;
    container.appendChild(card);
  });
  updateSelectAllCheckboxServices();
}

function updateRestoreButtonVisibilityServices() {
  const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
  const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
  const checkedBoxes = document.querySelectorAll('.deleted-service-checkbox:checked');
  if (restoreSelectedBtn) {
    restoreSelectedBtn.classList.toggle('hidden', checkedBoxes.length === 0);
  }
  if (restoreSelectedBtnMobile) {
    restoreSelectedBtnMobile.classList.toggle('hidden', checkedBoxes.length === 0);
  }
}

function updateSelectAllCheckboxServices() {
  const selectAllCheckbox = document.getElementById('selectAllDeleted');
  const checkboxes = document.querySelectorAll('.deleted-service-checkbox');
  const checkedBoxes = document.querySelectorAll('.deleted-service-checkbox:checked');
  if (selectAllCheckbox && document.getElementById('deleted-services-table-body')) {
    // Remove any previous event listeners by replacing the node
    const cloned = selectAllCheckbox.cloneNode(true);
    selectAllCheckbox.parentNode.replaceChild(cloned, selectAllCheckbox);
    const newSelectAllCheckbox = document.getElementById('selectAllDeleted');
    newSelectAllCheckbox.addEventListener('change', function() {
      console.log('Select all clicked');
      const checkboxes = document.querySelectorAll('.deleted-service-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      });
      console.log('Checked:', document.querySelectorAll('.deleted-service-checkbox:checked').length);
    });
  }
}

let restoreServiceIndex = null;

function showRestoreServiceModal(idx) {
  restoreServiceIndex = idx;
  const modal = document.getElementById('restoreServiceModal');
  if (!modal) return;
  showModal(modal);
}

function hideRestoreServiceModal() {
  const modal = document.getElementById('restoreServiceModal');
  if (!modal) return;
  hideModal(modal);
  restoreServiceIndex = null;
}

function showRestoreSelectedServiceModal() {
  const modal = document.getElementById('restoreSelectedServiceModal');
  if (!modal) return;
  showModal(modal);
}

function hideRestoreSelectedServiceModal() {
  const modal = document.getElementById('restoreSelectedServiceModal');
  if (!modal) return;
  hideModal(modal);
}

document.addEventListener('DOMContentLoaded', function() {
  // Render deleted services table and mobile cards if on deleted-services.html
  if (document.getElementById('deleted-services-table-body')) {
    renderDeletedServicesTable();
  }
  if (document.getElementById('mobile-deleted-services-list')) {
    renderDeletedServicesMobileCards();
  }
  // Select all checkbox
  const selectAllCheckbox = document.getElementById('selectAllDeleted');
  if (selectAllCheckbox && document.getElementById('deleted-services-table-body')) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.deleted-service-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }
  // Individual checkbox handlers
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('deleted-service-checkbox')) {
      updateRestoreButtonVisibilityServices();
      updateSelectAllCheckboxServices();
    }
  });
  // Initial state
  updateRestoreButtonVisibilityServices();
  updateSelectAllCheckboxServices();
  // Attach restore button handlers for deleted services (desktop & mobile)
  document.addEventListener('click', function(e) {
    if (e.target.closest('.restore-btn') && (document.getElementById('deleted-services-table-body') || document.getElementById('mobile-deleted-services-list'))) {
      // Find index from table row or card
      let idx = null;
      // Desktop table
      const tr = e.target.closest('tr');
      if (tr && tr.querySelector('.deleted-service-checkbox')) {
        idx = tr.querySelector('.deleted-service-checkbox').getAttribute('data-idx');
      }
      // Mobile card
      const card = e.target.closest('.mobile-table-row');
      if (card && card.querySelector('.deleted-service-checkbox')) {
        idx = card.querySelector('.deleted-service-checkbox').getAttribute('data-idx');
      }
      if (idx !== null) {
        showRestoreServiceModal(Number(idx));
      }
    }
  });
  // Modal button handlers
  const cancelRestoreBtn = document.getElementById('cancelRestoreService');
  if (cancelRestoreBtn) {
    cancelRestoreBtn.onclick = hideRestoreServiceModal;
  }
  const confirmRestoreBtn = document.getElementById('confirmRestoreService');
  if (confirmRestoreBtn) {
    confirmRestoreBtn.onclick = function() {
      if (restoreServiceIndex !== null && deletedServices[restoreServiceIndex]) {
        deletedServices.splice(restoreServiceIndex, 1);
        renderDeletedServicesTable();
        renderDeletedServicesMobileCards();
        updateRestoreButtonVisibilityServices();
        updateSelectAllCheckboxServices();
      }
      hideRestoreServiceModal();
    };
  }
  // Restore Selected button handlers (desktop & mobile)
  const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
  const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
  if (restoreSelectedBtn) {
    restoreSelectedBtn.onclick = function(e) {
      e.preventDefault();
      showRestoreSelectedServiceModal();
    };
  }
  if (restoreSelectedBtnMobile) {
    restoreSelectedBtnMobile.onclick = function(e) {
      e.preventDefault();
      showRestoreSelectedServiceModal();
    };
  }
  // Modal button handlers for restore selected
  const cancelRestoreSelectedBtn = document.getElementById('cancelRestoreSelectedService');
  if (cancelRestoreSelectedBtn) {
    cancelRestoreSelectedBtn.onclick = hideRestoreSelectedServiceModal;
  }
  const confirmRestoreSelectedBtn = document.getElementById('confirmRestoreSelectedService');
  if (confirmRestoreSelectedBtn) {
    confirmRestoreSelectedBtn.onclick = function() {
      // Get all checked indexes
      const checked = Array.from(document.querySelectorAll('.deleted-service-checkbox:checked'));
      const indexes = checked.map(cb => Number(cb.getAttribute('data-idx'))).sort((a, b) => b - a); // sort desc to splice safely
      indexes.forEach(idx => {
        if (deletedServices[idx]) deletedServices.splice(idx, 1);
      });
      renderDeletedServicesTable();
      renderDeletedServicesMobileCards();
      updateRestoreButtonVisibilityServices();
      updateSelectAllCheckboxServices();
      hideRestoreSelectedServiceModal();
    };
  }
});

// =========================
// Restore Selected Products Logic (for deleted-products.html)
// =========================

document.addEventListener('DOMContentLoaded', function() {
  // Only run on deleted-products.html
  const isDeletedProductsPage = document.getElementById('deleted-products-table-body') || document.getElementById('mobile-deleted-products-list');
  if (!isDeletedProductsPage) return;

  // Render deleted products table and mobile cards
  if (document.getElementById('deleted-products-table-body')) {
    renderDeletedProductsTable();
  }
  if (document.getElementById('mobile-deleted-products-list')) {
    renderDeletedProductsMobileCards();
  }

  // Select all checkbox logic
  const selectAllCheckbox = document.getElementById('selectAllDeleted');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.deleted-product-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
      updateRestoreButtonVisibilityProducts();
      updateSelectAllCheckboxProducts();
    });
  }

  // Individual checkbox handlers
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('deleted-product-checkbox')) {
      updateRestoreButtonVisibilityProducts();
      updateSelectAllCheckboxProducts();
    }
  });

  // Initial state
  updateRestoreButtonVisibilityProducts();
  updateSelectAllCheckboxProducts();

  // Restore Selected button handlers (desktop & mobile)
  const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
  const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
  if (restoreSelectedBtn) {
    restoreSelectedBtn.onclick = function(e) {
      e.preventDefault();
      showRestoreSelectedProductModal();
    };
  }
  if (restoreSelectedBtnMobile) {
    restoreSelectedBtnMobile.onclick = function(e) {
      e.preventDefault();
      showRestoreSelectedProductModal();
    };
  }

  // Modal button handlers
  const cancelRestoreSelectedBtn = document.getElementById('cancelRestoreSelectedProduct');
  if (cancelRestoreSelectedBtn) {
    cancelRestoreSelectedBtn.onclick = hideRestoreSelectedProductModal;
  }
  const confirmRestoreSelectedBtn = document.getElementById('confirmRestoreSelectedProduct');
  if (confirmRestoreSelectedBtn) {
    confirmRestoreSelectedBtn.onclick = function() {
      // Get all checked indexes
      const checked = Array.from(document.querySelectorAll('.deleted-product-checkbox:checked'));
      const indexes = checked.map(cb => Number(cb.getAttribute('data-idx'))).sort((a, b) => b - a); // sort desc to splice safely
      indexes.forEach(idx => {
        if (deletedProducts[idx]) deletedProducts.splice(idx, 1);
      });
      renderDeletedProductsTable();
      renderDeletedProductsMobileCards();
      updateRestoreButtonVisibilityProducts();
      updateSelectAllCheckboxProducts();
      hideRestoreSelectedProductModal();
    };
  }
});

// Update restore button visibility for products
function updateRestoreButtonVisibilityProducts() {
  const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
  const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
  const checkedBoxes = document.querySelectorAll('.deleted-product-checkbox:checked');
  if (restoreSelectedBtn) {
    restoreSelectedBtn.classList.toggle('hidden', checkedBoxes.length === 0);
  }
  if (restoreSelectedBtnMobile) {
    restoreSelectedBtnMobile.classList.toggle('hidden', checkedBoxes.length === 0);
  }
}

// Update select all checkbox for products
function updateSelectAllCheckboxProducts() {
  const selectAllCheckbox = document.getElementById('selectAllDeleted');
  const checkboxes = document.querySelectorAll('.deleted-product-checkbox');
  const checkedBoxes = document.querySelectorAll('.deleted-product-checkbox:checked');
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length && checkboxes.length > 0;
    selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
  }
}

// Show/Hide restore selected modal for products
function showRestoreSelectedProductModal() {
  const modal = document.getElementById('restoreSelectedProductModal');
  if (!modal) return;
  showModal(modal);
}
function hideRestoreSelectedProductModal() {
  const modal = document.getElementById('restoreSelectedProductModal');
  if (!modal) return;
  hideModal(modal);
} 