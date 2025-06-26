document.addEventListener('DOMContentLoaded', function() {
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            const sortKey = e.target.value;
            if (sortKey) {
                // In a real application, you would fetch and sort data here.
                // For this example, we'll just log the selected key.
                console.log(`Sorting by: ${sortKey}`);
            }
        });
    }
}); 