/**
 * Pending Projects Page JavaScript
 * Handles the functionality for the pending projects table and modal
 */

const isPendingProjectsPage = window.location.pathname.includes('pendingprojects.html');
const isPendingDetailsPage = window.location.pathname.includes('pending-details.html');

// --- 1. On pendingprojects.html: Row click to show job details modal ---
if (isPendingProjectsPage) {
    document.addEventListener('DOMContentLoaded', function() {
        // The row click functionality is now handled by the onclick="showJobDetailsModal(this)" 
        // attribute in the HTML, so we don't need to attach event listeners here
        console.log('Pending Projects page loaded - modal functionality ready');
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
// All logic for both pages is contained here for maintainability. 