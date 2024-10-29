function changeTheme() {
    const themeSelect = document.getElementById('theme-select').value;
    if (themeSelect === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else if (themeSelect === 'light') {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.removeItem('theme');
    }
}

function toggleNotifications() {
    const notificationsToggle = document.getElementById('notifications-toggle').checked;
    if (notificationsToggle) {
        alert('Benachrichtigungen aktiviert');
    } else {
        alert('Benachrichtigungen deaktiviert');
    }
}

function updatePassword() {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    if (oldPassword && newPassword) {
        if (oldPassword === "userOldPassword") { // Passwortcheck simulieren
            alert('Passwort erfolgreich geändert');
        } else {
            alert('Falsches altes Passwort');
        }
    } else {
        alert('Bitte füllen Sie beide Felder aus');
    }
}

function deleteProfile() {
    const password = document.getElementById('delete-profile-password').value;
    if (password === "deinPasswort") {
        alert('Profil erfolgreich gelöscht');
    } else {
        alert('Falsches Passwort. Profil konnte nicht gelöscht werden.');
    }
}

function resetStats() {
    const password = document.getElementById('reset-stats-password').value;
    if (password === "deinPasswort") {
        alert('Alle Statistiken wurden erfolgreich zurückgesetzt');
    } else {
        alert('Falsches Passwort. Statistiken konnten nicht zurückgesetzt werden.');
    }
}

function logout() {
    alert('Sie wurden abgemeldet');
    window.location.href = 'login.html';
}

function changeLanguage() {
    const language = document.getElementById('languageSelect').value;
    alert(`Sprache geändert zu ${language}`);
}
