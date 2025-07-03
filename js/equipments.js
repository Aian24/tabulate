// Equipment data as seen in the provided image
const equipmentData = [
  {
    name: 'Lawn Mower',
    specification: 'Self-propelled Gas-powered Mower For Residential Lawns',
    code: 'LM100',
    status: 'On Stock',
    active: true,
    acquisitionDate: 'March 12, 2025'
  },
  {
    name: 'Shovel',
    specification: 'Very Small But Yayay',
    code: '1sh0w-b1ll',
    status: 'On Stock',
    active: true,
    acquisitionDate: 'March 12, 2025'
  },
  {
    name: 'Garden Hose',
    specification: 'Thread 1/2, 50 Meters Long',
    code: 'H0s3',
    status: 'On Stock',
    active: true,
    acquisitionDate: 'March 12, 2025'
  },
  {
    name: 'Nails',
    specification: 'Of All Inches 0.5in - 10in',
    code: "Nell'sArmstrong",
    status: 'On Stock',
    active: true,
    acquisitionDate: 'March 12, 2025'
  },
  {
    name: 'Concrete Mixer',
    specification: 'Portable Concrete Mixer, 3 Cubic Ft Capacity',
    code: 'EQP-0001',
    status: 'On Stock',
    active: true,
    acquisitionDate: 'March 12, 2025'
  },
  {
    name: 'Welding Machine',
    specification: 'Arc Welding Machine, 300 Amps Output',
    code: 'EQP-0002',
    status: 'On Stock',
    active: true,
    acquisitionDate: 'March 12, 2025'
  }
];

// =============================
// Restore Selected Button Logic for Deleted Equipments
// Handles showing/hiding the 'Restore Selected' button when checkboxes are checked
// =============================

// Utility function to get query parameters from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to render equipment data into the table
function renderEquipmentTable() {
  const tbody = document.getElementById('equipment-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  equipmentData.forEach((item, idx) => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50 transition-colors cursor-pointer';
    // Set a data attribute for the equipment code
    row.setAttribute('data-equipment-code', item.code);
    // Add click event to navigate to details page
    row.addEventListener('click', function() {
      window.location.href = `equipment-details.html?code=${encodeURIComponent(item.code)}`;
    });
    row.innerHTML = `
      <td class="px-6 py-4">
        <input type="checkbox" class="equipment-checkbox w-4 h-4 text-blue-600 rounded focus:ring-blue-500" onclick="event.stopPropagation()">
      </td>
      <td class="px-6 py-4 text-sm font-medium text-gray-900">${item.name}</td>
      <td class="px-6 py-4 text-sm text-gray-600">${item.specification}</td>
      <td class="px-6 py-4 text-sm text-gray-600">${item.code}</td>
      <td class="px-6 py-4 text-sm text-gray-600">${item.status}</td>
      <td class="px-6 py-4">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          ${item.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td class="px-6 py-4 text-sm text-gray-600">${item.acquisitionDate}</td>
    `;
    tbody.appendChild(row);
  });
}

// Function to populate equipment details page
function populateEquipmentDetails() {
  // Only run on equipment-details.html
  if (!window.location.pathname.includes('equipment-details.html')) return;

  // Get equipment code from URL
  const code = getQueryParam('code');
  if (!code) return;

  // Find the equipment by code
  const equipment = equipmentData.find(eq => eq.code === code);
  if (!equipment) return;

  // Populate fields
  document.getElementById('equipmentCode').value = equipment.code || '';
  document.getElementById('equipmentName').value = equipment.name || '';
  document.getElementById('equipmentDescription').value = equipment.specification || '';
  document.getElementById('acquisitionDate').value = equipment.acquisitionDate || '';
  // These fields are not in the original data, so use placeholders or blank
  document.getElementById('availableQuantity').value = equipment.availableQuantity || '1';
  document.getElementById('powerType').value = equipment.powerType || (equipment.name === 'Lawn Mower' ? 'Gas' : '');
  document.getElementById('condition').value = equipment.condition || 'Brand New';
  document.getElementById('status').value = equipment.status || '';
  document.getElementById('vendor').value = equipment.vendor || (equipment.name === 'Lawn Mower' ? 'Ace Hardware' : '');
  // Image upload is not pre-filled

  // Back button returns to equipment list
  document.getElementById('backBtn').onclick = function() {
    window.location.href = 'equipment.html';
  };

  // Set the page title to the equipment name
  document.getElementById('equipmentDetailsTitle').textContent = equipment.name || 'Equipment Details';

  // Add Vendor button navigates to create vendor page
  const addVendorBtn = document.getElementById('addVendorBtn');
  if (addVendorBtn) {
    addVendorBtn.onclick = function() {
      window.location.href = '../accounts/create-vendor.html';
    };
  }

  // --- Edit Mode Logic ---
  const editBtn = document.getElementById('editBtn');
  if (editBtn) {
    let isEditing = false;
    let originalValues = {};
    const fieldIds = [
      'equipmentCode',
      'equipmentName',
      'equipmentDescription',
      'acquisitionDate',
      'availableQuantity',
      'powerType',
      'condition',
      'status',
      'vendor'
    ];
    // Helper to set fields editable or readonly
    function setFieldsEditable(editable) {
      fieldIds.forEach(id => {
        // Special handling for condition, status, powerType, and vendor
        if (id === 'condition' || id === 'status' || id === 'powerType' || id === 'vendor') {
          const container = document.getElementById(id + 'Container');
          const input = document.getElementById(id);
          const chevron = container.querySelector('.dropdown-chevron');
          if (editable) {
            // Replace input with select
            const select = document.createElement('select');
            select.id = id;
            select.className = input.className.replace('bg-gray-100', 'bg-white') + ' appearance-none pr-8';
            select.style.background = 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' viewBox=\'0 0 24 24\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E") no-repeat right 0.75rem center/1.25em auto, white';
            let options = [];
            if (id === 'condition') {
              options = ['Brand New', 'Good', 'Fair', 'Needs Repair', 'Scrap'];
            } else if (id === 'status') {
              options = ['On Stock', 'In Use', 'Under Repair', 'Disposed'];
            } else if (id === 'powerType') {
              options = ['Select Power Type', 'Gas', 'Electric', 'Battery'];
            } else if (id === 'vendor') {
              // Use unique vendors from equipmentData or static list
              const vendorSet = new Set(equipmentData.map(eq => eq.vendor).filter(Boolean));
              options = ['Select Vendor', ...Array.from(vendorSet)];
            }
            options.forEach(opt => {
              const option = document.createElement('option');
              option.value = opt === 'Select Power Type' || opt === 'Select Vendor' ? '' : opt;
              option.textContent = opt;
              if (input.value === opt) option.selected = true;
              select.appendChild(option);
            });
            container.replaceChild(select, input);
            if (chevron) chevron.classList.remove('hidden');
          } else {
            // Replace select with input
            if (input.tagName.toLowerCase() !== 'input') {
              const select = input;
              const newInput = document.createElement('input');
              newInput.type = 'text';
              newInput.id = id;
              newInput.className = select.className.replace('bg-white', 'bg-gray-100').replace(' appearance-none pr-8', '');
              newInput.value = select.value;
              newInput.readOnly = true;
              container.replaceChild(newInput, select);
            } else {
              input.readOnly = true;
              input.classList.add('bg-gray-100');
              input.classList.remove('bg-white');
            }
            if (chevron) chevron.classList.add('hidden');
          }
        } else {
          const el = document.getElementById(id);
          if (el) {
            el.readOnly = !editable;
            el.classList.toggle('bg-gray-100', !editable);
            el.classList.toggle('bg-white', editable);
          }
        }
      });
    }
    // Helper to get current field values
    function getFieldValues() {
      const values = {};
      fieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) values[id] = el.value;
      });
      return values;
    }
    // Helper to set field values
    function setFieldValues(values) {
      fieldIds.forEach(id => {
        // Special handling for condition and status
        if ((id === 'condition' || id === 'status') && document.getElementById(id)) {
          const el = document.getElementById(id);
          if (el.tagName.toLowerCase() === 'select') {
            el.value = values[id];
          } else {
            el.value = values[id];
          }
        } else {
          const el = document.getElementById(id);
          if (el && values[id] !== undefined) el.value = values[id];
        }
      });
    }
    // Create Save/Cancel buttons
    function createEditButtons() {
      const btnGroup = document.createElement('div');
      btnGroup.id = 'editBtnGroup';
      btnGroup.className = 'flex gap-2';
      const saveBtn = document.createElement('button');
      saveBtn.className = 'px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 flex items-center gap-2';
      saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 flex items-center gap-2';
      cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
      btnGroup.appendChild(saveBtn);
      btnGroup.appendChild(cancelBtn);
      // Insert after editBtn
      editBtn.parentNode.insertBefore(btnGroup, editBtn.nextSibling);
      // Save handler
      saveBtn.onclick = function() {
        // Save to equipmentData
        const code = document.getElementById('equipmentCode').value;
        const eq = equipmentData.find(eq => eq.code === code);
        if (eq) {
          eq.name = document.getElementById('equipmentName').value;
          eq.specification = document.getElementById('equipmentDescription').value;
          eq.acquisitionDate = document.getElementById('acquisitionDate').value;
          eq.availableQuantity = document.getElementById('availableQuantity').value;
          eq.powerType = document.getElementById('powerType').value;
          eq.condition = document.getElementById('condition').value;
          eq.status = document.getElementById('status').value;
          eq.vendor = document.getElementById('vendor').value;
        }
        setFieldsEditable(false);
        isEditing = false;
        editBtn.classList.remove('hidden');
        btnGroup.remove();
      };
      // Cancel handler
      cancelBtn.onclick = function() {
        setFieldValues(originalValues);
        setFieldsEditable(false);
        isEditing = false;
        editBtn.classList.remove('hidden');
        btnGroup.remove();
      };
    }
    // Edit button click
    editBtn.addEventListener('click', function() {
      if (isEditing) return;
      isEditing = true;
      originalValues = getFieldValues();
      setFieldsEditable(true);
      editBtn.classList.add('hidden');
      createEditButtons();
    });
  }
}

// =============================
// Main DOMContentLoaded logic
// =============================
document.addEventListener('DOMContentLoaded', function() {
  console.log('equipments.js loaded and DOM ready');

  // Render table if on equipment list page
  if (document.getElementById('equipment-table-body')) {
    renderEquipmentTable();
  }

  // Populate details if on details page
  if (window.location.pathname.includes('equipment-details.html')) {
    populateEquipmentDetails();
  }

  // Restore Selected Button logic (works for deleted-equipments.html)
  function updateRestoreButtonVisibility() {
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
    const checkedBoxes = document.querySelectorAll('.equipment-checkbox:checked');
    if (restoreSelectedBtn) {
      restoreSelectedBtn.classList.toggle('hidden', checkedBoxes.length === 0);
    }
    if (restoreSelectedBtnMobile) {
      restoreSelectedBtnMobile.classList.toggle('hidden', checkedBoxes.length === 0);
    }
  }
  function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllDeleted');
    const checkboxes = document.querySelectorAll('.equipment-checkbox');
    const checkedBoxes = document.querySelectorAll('.equipment-checkbox:checked');
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length && checkboxes.length > 0;
      selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
    }
  }
  // Select all checkbox
  const selectAllCheckbox = document.getElementById('selectAllDeleted');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.equipment-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
      updateRestoreButtonVisibility();
    });
  }
  // Individual checkbox handlers
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('equipment-checkbox')) {
      updateRestoreButtonVisibility();
      updateSelectAllCheckbox();
    }
  });
  // Initial state
  updateRestoreButtonVisibility();
  updateSelectAllCheckbox();

  // Attach restore button handlers for deleted equipments (desktop & mobile)
  document.addEventListener('click', function(e) {
    if (e.target.closest('.restore-btn')) {
      // Find index from table row or card
      let idx = null;
      // Desktop table
      const tr = e.target.closest('tr');
      if (tr) {
        // Find index by row order in tbody
        const tbody = tr.parentElement;
        idx = Array.from(tbody.children).indexOf(tr);
      }
      // Mobile card
      const card = e.target.closest('.mobile-table-row');
      if (card) {
        // Find index by card order in container
        const container = card.parentElement;
        idx = Array.from(container.children).indexOf(card);
      }
      if (idx !== null && idx !== -1) {
        showRestoreEquipmentModal(idx);
      }
    }
  });
  // Restore Selected button handlers (desktop & mobile)
  const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
  const restoreSelectedBtnMobile = document.getElementById('restoreSelectedBtnMobile');
  if (restoreSelectedBtn) {
    restoreSelectedBtn.onclick = function(e) {
      e.preventDefault();
      showRestoreSelectedEquipmentModal();
    };
  }
  if (restoreSelectedBtnMobile) {
    restoreSelectedBtnMobile.onclick = function(e) {
      e.preventDefault();
      showRestoreSelectedEquipmentModal();
    };
  }
  // Modal button handlers
  const cancelRestoreBtn = document.getElementById('cancelRestoreEquipment');
  if (cancelRestoreBtn) {
    cancelRestoreBtn.onclick = hideRestoreEquipmentModal;
  }
  const confirmRestoreBtn = document.getElementById('confirmRestoreEquipment');
  if (confirmRestoreBtn) {
    confirmRestoreBtn.onclick = function() {
      if (restoreEquipmentIndex !== null && equipmentData[restoreEquipmentIndex]) {
        equipmentData.splice(restoreEquipmentIndex, 1);
        // Re-render table and mobile cards if needed
        // (Assume renderEquipmentTable is used for both views)
        renderEquipmentTable();
        // Optionally, re-render mobile cards if you have a function for that
      }
      hideRestoreEquipmentModal();
      // Update restore button visibility
      const updateRestoreButtonVisibility = window.updateRestoreButtonVisibility || (()=>{});
      updateRestoreButtonVisibility();
    };
  }
  const cancelRestoreSelectedBtn = document.getElementById('cancelRestoreSelectedEquipment');
  if (cancelRestoreSelectedBtn) {
    cancelRestoreSelectedBtn.onclick = hideRestoreSelectedEquipmentModal;
  }
  const confirmRestoreSelectedBtn = document.getElementById('confirmRestoreSelectedEquipment');
  if (confirmRestoreSelectedBtn) {
    confirmRestoreSelectedBtn.onclick = function() {
      // Get all checked indexes
      const checked = Array.from(document.querySelectorAll('.equipment-checkbox:checked'));
      // Find indexes in table (desktop)
      const tbody = document.querySelector('table tbody');
      let indexes = checked.map(cb => {
        const tr = cb.closest('tr');
        return tr ? Array.from(tbody.children).indexOf(tr) : -1;
      });
      // Also check mobile cards if needed (not implemented here)
      indexes = indexes.filter(idx => idx !== -1).sort((a, b) => b - a); // sort desc to splice safely
      indexes.forEach(idx => {
        if (equipmentData[idx]) equipmentData.splice(idx, 1);
      });
      renderEquipmentTable();
      hideRestoreSelectedEquipmentModal();
      // Update restore button visibility
      const updateRestoreButtonVisibility = window.updateRestoreButtonVisibility || (()=>{});
      updateRestoreButtonVisibility();
    };
  }

  // Dropdown logic for Actions and More buttons (copied from estimates.js)
  const actionsDropdown = document.getElementById('actionsDropdown');
  const actionsMenu = document.getElementById('actionsMenu');
  const moreDropdown = document.getElementById('moreDropdown');
  const moreMenu = document.getElementById('moreMenu');

  // Toggle actions menu
  if (actionsDropdown && actionsMenu && moreMenu) {
    actionsDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      actionsMenu.classList.toggle('hidden');
      moreMenu.classList.add('hidden');
    });
  }

  // Toggle more menu
  if (moreDropdown && moreMenu && actionsMenu) {
    moreDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      moreMenu.classList.toggle('hidden');
      actionsMenu.classList.add('hidden');
    });
  }

  // Close menus when clicking outside
  if (actionsDropdown && moreDropdown && actionsMenu && moreMenu) {
    document.addEventListener('click', (e) => {
      if (!actionsDropdown.contains(e.target) && !moreDropdown.contains(e.target)) {
        actionsMenu.classList.add('hidden');
        moreMenu.classList.add('hidden');
      }
    });
  }
});

let restoreEquipmentIndex = null;

function showRestoreEquipmentModal(idx) {
  restoreEquipmentIndex = idx;
  const modal = document.getElementById('restoreEquipmentModal');
  if (!modal) return;
  showModal(modal);
}

function hideRestoreEquipmentModal() {
  const modal = document.getElementById('restoreEquipmentModal');
  if (!modal) return;
  hideModal(modal);
  restoreEquipmentIndex = null;
}

function showRestoreSelectedEquipmentModal() {
  const modal = document.getElementById('restoreSelectedEquipmentModal');
  if (!modal) return;
  showModal(modal);
}

function hideRestoreSelectedEquipmentModal() {
  const modal = document.getElementById('restoreSelectedEquipmentModal');
  if (!modal) return;
  hideModal(modal);
}

// Modal animation helpers (copied from products.js)
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