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
    // Add Vendors button
    if (!document.getElementById('addVendorBtn')) {
      const addBtn = document.createElement('button');
      addBtn.id = 'addVendorBtn';
      addBtn.className = 'px-4 py-2 bg-cyan-500 text-white rounded shadow hover:bg-cyan-600 flex items-center gap-2 text-sm';
      addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Vendors';
      addBtn.onclick = function() {
        addVendorRow();
      };
      addVendorBtnContainer.appendChild(addBtn);
    }
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
    // Attach delete event
    newRow.querySelector('.delete-vendor').onclick = function(e) {
      e.preventDefault();
      newRow.remove();
    };
  }

  // Attach delete event to any existing rows (if any)
  vendorsTable.querySelectorAll('.delete-vendor').forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      btn.closest('tr').remove();
    };
  });
}); 