<<<<<<< HEAD
/**
 * Pending Projects Page JavaScript
 * Handles the functionality for the pending projects table and modal
 */

const isPendingProjectsPage = window.location.pathname.includes('pendingprojects.html');
const isPendingDetailsPage = window.location.pathname.includes('pending-details.html');

// --- 1. On pendingprojects.html: Row click to details page ---
if (isPendingProjectsPage) {
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.dispatch-card').forEach(row => {
            row.addEventListener('click', function() {
                // Gather data from the row's cells (adjust indices as needed for your table)
                const data = {
                    team: row.cells[8]?.innerText.trim() || '',
                    vip: row.cells[0]?.innerText.trim() || '', // Adjust if VIP is present
                    startDate: row.cells[4]?.innerText.trim() || '',
                    status: row.cells[9]?.innerText.trim() || '',
                    billingType: '', // Not present in table, can be set later
                    customer: row.cells[2]?.innerText.trim() || '',
                    address: row.cells[3]?.innerText.trim() || '',
                    service: row.cells[1]?.innerText.trim() || '',
                    jobStatus: '',
                    jobTeam: row.cells[8]?.innerText.trim() || '',
                    jobStartDate: '',
                    priorityType: row.cells[0]?.innerText.trim() || '',
                    budgetHours: row.cells[5]?.innerText.trim() || '',
                    distance: row.cells[6]?.innerText.trim() || '',
                    eta: row.cells[7]?.innerText.trim() || ''
                };
                localStorage.setItem('pendingJobDetails', JSON.stringify(data));
                window.location.href = 'pending-details.html';
            });
        });
    });
}

// --- 2. On pending-details.html: Populate form from localStorage ---
if (isPendingDetailsPage) {
    document.addEventListener('DOMContentLoaded', function() {
        const data = JSON.parse(localStorage.getItem('pendingJobDetails') || '{}');
        if (data) {
            document.getElementById('teamField').value = data.team || '';
            document.getElementById('vipField').value = data.vip || '';
            document.getElementById('startDateField').value = data.startDate || '';
            document.getElementById('statusField').value = data.status || '';
            document.getElementById('billingTypeField').value = data.billingType || '';
            document.getElementById('customerField').value = data.customer || '';
            document.getElementById('addressField').value = data.address || '';
            document.getElementById('serviceField').value = data.service || '';
            document.getElementById('jobStatusField').value = data.jobStatus || '';
            document.getElementById('jobTeamField').value = data.jobTeam || '';
            document.getElementById('jobStartDateField').value = data.jobStartDate || '';
            document.getElementById('priorityTypeField').value = data.priorityType || '';
            document.getElementById('budgetHoursField').value = data.budgetHours || '';
            document.getElementById('distanceField').value = data.distance || '';
            document.getElementById('etaField').value = data.eta || '';
        }
    });
}
// --- End of pendingprojects.js ---
=======
/**
 * Pending Projects Page JavaScript
 * Handles the functionality for the pending projects table and modal
 */

const isPendingProjectsPage = window.location.pathname.includes('pendingprojects.html');
const isPendingDetailsPage = window.location.pathname.includes('pending-details.html');

// --- 1. On pendingprojects.html: Row click to details page ---
if (isPendingProjectsPage) {
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.dispatch-card').forEach(row => {
            row.addEventListener('click', function() {
                // Gather data from the row's cells (adjust indices as needed for your table)
                const data = {
                    team: row.cells[8]?.innerText.trim() || '',
                    vip: row.cells[0]?.innerText.trim() || '', // Adjust if VIP is present
                    startDate: row.cells[4]?.innerText.trim() || '',
                    status: row.cells[9]?.innerText.trim() || '',
                    billingType: '', // Not present in table, can be set later
                    customer: row.cells[2]?.innerText.trim() || '',
                    address: row.cells[3]?.innerText.trim() || '',
                    service: row.cells[1]?.innerText.trim() || '',
                    jobStatus: '',
                    jobTeam: row.cells[8]?.innerText.trim() || '',
                    jobStartDate: '',
                    priorityType: row.cells[0]?.innerText.trim() || '',
                    budgetHours: row.cells[5]?.innerText.trim() || '',
                    distance: row.cells[6]?.innerText.trim() || '',
                    eta: row.cells[7]?.innerText.trim() || ''
                };
                localStorage.setItem('pendingJobDetails', JSON.stringify(data));
                window.location.href = 'pending-details.html';
            });
        });
    });
}

// --- 2. On pending-details.html: Populate form from localStorage ---
if (isPendingDetailsPage) {
    document.addEventListener('DOMContentLoaded', function() {
        const data = JSON.parse(localStorage.getItem('pendingJobDetails') || '{}');
        if (data) {
            document.getElementById('teamField').value = data.team || '';
            document.getElementById('vipField').value = data.vip || '';
            document.getElementById('startDateField').value = data.startDate || '';
            document.getElementById('statusField').value = data.status || '';
            document.getElementById('billingTypeField').value = data.billingType || '';
            document.getElementById('customerField').value = data.customer || '';
            document.getElementById('addressField').value = data.address || '';
            document.getElementById('serviceField').value = data.service || '';
            document.getElementById('jobStatusField').value = data.jobStatus || '';
            document.getElementById('jobTeamField').value = data.jobTeam || '';
            document.getElementById('jobStartDateField').value = data.jobStartDate || '';
            document.getElementById('priorityTypeField').value = data.priorityType || '';
            document.getElementById('budgetHoursField').value = data.budgetHours || '';
            document.getElementById('distanceField').value = data.distance || '';
            document.getElementById('etaField').value = data.eta || '';
        }
    });
}
// --- End of pendingprojects.js ---
>>>>>>> master
// All logic for both pages is contained here for maintainability. 