document.addEventListener('chainhook-event', (e) => {
    const data = e.detail;
    showNotification(`New Event: ${data.name || 'Unknown'}`);
    // Auto-refresh stats on relevant events
    if (data.name === 'dungeon-complete') {
        // updateStats(); // Assuming global availability or re-import
    }
});

function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 5000);
}
