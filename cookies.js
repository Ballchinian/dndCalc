// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to load selected values from cookies
function loadSelectedValues() {
    const savedValues = getCookie('actions');
    if (savedValues) {
        const values = JSON.parse(savedValues);
        const selects = document.querySelectorAll('#actions .action');
        selects.forEach((select, index) => {
            if (values[index]) {
                select.value = values[index]; // Set the selected value
            }
        });
    }
}

// Function to save selected values to cookies
function saveSelectedValues() {
    const selects = document.querySelectorAll('#actions .action');
    const values = [];
    selects.forEach(select => {
        values.push(select.value); // Store selected values in an array
    });
    setCookie('actions', JSON.stringify(values), 30); // Save as a JSON string for 30 days
}

// Event listeners to save selected values on change
document.querySelectorAll('#actions .action').forEach(select => {
    select.addEventListener('change', saveSelectedValues);
});

// Load selected values when the page loads
document.addEventListener('DOMContentLoaded', function () {
    loadSelectedValues();
});