function getCurrentDateInIndianFormat() {
    // Get the current date
    const currentDate = new Date();

    // Create options for formatting
    const options = { day: 'numeric', month: 'short', year: 'numeric' };

    // Format the date
    const formattedDate = new Intl.DateTimeFormat('en-In', options).format(currentDate);

    return formattedDate
}

module.exports = { getCurrentDateInIndianFormat }