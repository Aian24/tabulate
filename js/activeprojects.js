document.addEventListener('DOMContentLoaded', function() {
    // Show entries functionality
    const entriesSelect = document.querySelector('.pagination-entries-select');
    if (entriesSelect) {
        entriesSelect.addEventListener('change', function(e) {
            const entriesPerPage = parseInt(e.target.value);
            // Here you would typically:
            // 1. Update the table to show the selected number of entries
            // 2. Update the pagination
            // 3. Update the "Showing X to Y of Z entries" text
            
            // For now, we'll just log the change
            console.log(`Changed entries per page to: ${entriesPerPage}`);
            
            // You would implement the actual pagination logic here
            // This would typically involve:
            // - Fetching new data if using server-side pagination
            // - Or slicing the existing data if using client-side pagination
            // - Updating the table contents
            // - Updating the pagination controls
        });
    }
}); 