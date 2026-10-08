function formatShortDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

function formatLongDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

module.exports = {
    formatShortDate,
    formatLongDate
}