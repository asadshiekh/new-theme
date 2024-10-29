// Toggle Sidebar (Main Menu)
function toggleMainMenu() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const menuList = sidebar.querySelector('.menu-list-modern');
    
    sidebar.classList.toggle('collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
        content.style.marginLeft = '70px';
        content.style.overflowY = 'scroll';
        menuList.style.opacity = '0';
    } else {
        content.style.marginLeft = '250px';
        content.style.overflowY = 'auto';
        menuList.style.opacity = '1';
    }
}

// Toggle Submenu with Arrow Animation
document.querySelectorAll('.submenu-toggle').forEach(item => {
    item.addEventListener('click', function () {
        const submenu = this.nextElementSibling;
        const arrow = this.querySelector('.submenu-arrow');
        
        submenu.classList.toggle('show');
        arrow.classList.toggle('rotate');
    });
});

// Erweiterte Abmelde-Button Logik mit Sicherheitsmaßnahmen
document.getElementById('logout-btn').addEventListener('click', function () {
    // 1. Sicheres Entfernen von Benutzerdaten (Tokens, Cookies, etc.)
    function clearSessionData() {
        localStorage.removeItem('userToken');  // Entfernt den Authentifizierungstoken aus dem LocalStorage
        sessionStorage.clear();  // Entfernt alle Session-Daten

        // Sicheres Löschen von Cookies (falls verwendet)
        document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // 2. Anzeige eines Bestätigungsdialogs vor der Abmeldung
    if (confirm("Möchten Sie sich wirklich abmelden?")) {
        
        // 3. CSRF-Schutz durch Hinzufügen eines Tokens in die Abmelde-Anfrage
        const csrfToken = getCSRFToken();  // Funktion zum Abrufen des CSRF-Tokens
        
        // 4. Abmeldung über eine API
        fetch('https://example.com/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                'X-CSRF-Token': csrfToken  // CSRF-Token in die Anfrage aufnehmen
            }
        }).then(response => {
            if (response.ok) {
                clearSessionData(); // Sitzung sicher beenden
                alert('Sie wurden erfolgreich abgemeldet.');
                window.location.href = 'index.html';  // Weiterleitung zur Startseite
            } else {
                console.log('Fehler bei der Abmeldung');
                alert('Fehler: Abmeldung fehlgeschlagen.');
            }
        }).catch(error => {
            console.error('Abmelde-Fehler:', error);
            alert('Fehler: Netzwerkproblem. Versuchen Sie es später erneut.');
        });
    }
});

// Funktion zum Abrufen des CSRF-Tokens (falls verwendet)
function getCSRFToken() {
    // Beispiel: Token aus Cookie holen
    return document.cookie.replace(/(?:(?:^|.*;\s*)csrf_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}

// Automatische Abmeldung bei Inaktivität
const lastActivity = Date.now();
const sessionTimeout = 30 * 60 * 1000; // 30 Minuten Timeout

setInterval(() => {
    if (Date.now() - lastActivity > sessionTimeout) {
        alert("Ihre Sitzung ist abgelaufen. Sie werden jetzt abgemeldet.");
        window.location.href = 'index.html';  // Automatische Abmeldung nach 30 Minuten
    }
}, 60000); // Prüft alle 60 Sekunden

// Weitere Sicherheit durch sicheres Löschen von Cookies (optional)
// Sicheres Löschen von Sitzungs-Cookies durch Setzen abgelaufener Daten
function deleteCookies() {
    document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Zusätzliche Sicherheitslogik zum Deaktivieren von Formularen oder Sitzungen
window.addEventListener('load', function () {
    // Hier kann zusätzliche Logik implementiert werden, um unsichere Aktionen nach der Abmeldung zu verhindern.
    // Zum Beispiel: Schalte Formular-Submits oder UI-Interaktionen aus, wenn die Sitzung abgelaufen ist.
});
