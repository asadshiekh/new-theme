<?php
session_start();

// Sicherheits-Header setzen
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("Content-Security-Policy: script-src 'self' https://www.google.com/recaptcha/; style-src 'self';");

// CSRF-Token generieren, falls nicht vorhanden
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// CSRF-Token überprüfen
if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    die('Ungültiges CSRF-Token.');
}

// Eingabedaten bereinigen
$username = htmlspecialchars($_POST['username']);
$password = $_POST['password'];
$mfa_code = isset($_POST['mfa_code']) ? $_POST['mfa_code'] : null;

// Datenbankverbindung herstellen
$mysqli = new mysqli("localhost", "root", "password", "database");

if ($mysqli->connect_error) {
    error_log('Datenbankfehler: ' . $mysqli->connect_error, 3, '/var/log/php_errors.log');
    die('Datenbankfehler. Bitte versuchen Sie es später erneut.');
}

// Benutzerabfrage
$stmt = $mysqli->prepare('SELECT id, password_hash, mfa_secret, failed_attempts, last_attempt, email FROM users WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Fehlschlagende Login-Versuche prüfen
check_failed_attempts($user);

// Passwortüberprüfung
if ($user && password_verify($password, $user['password_hash'])) {
    // MFA-Überprüfung
    if ($user['mfa_secret'] && !empty($mfa_code)) {
        if (!verify_mfa($user['mfa_secret'], $mfa_code)) {
            die('Ungültiger MFA-Code.');
        }
    }

    // "Remember Me"-Funktion
    if (isset($_POST['remember_me'])) {
        $token = bin2hex(random_bytes(16));
        setcookie('remember_me', $token, time() + (86400 * 30), "/", "", true, true);
        $stmt = $mysqli->prepare('UPDATE users SET remember_token = ? WHERE id = ?');
        $stmt->bind_param('si', $token, $user['id']);
        $stmt->execute();
    }

    // Erfolgreiche Anmeldung
    $_SESSION['user_id'] = $user['id'];
    header('Location: /dashboard.php');

} else {
    // Fehlgeschlagene Login-Versuche speichern
    log_failed_attempt($username, $mysqli);
    header('Location: /login.html?error=invalid_credentials');
}

// Funktion zur Überprüfung der fehlgeschlagenen Anmeldeversuche
function check_failed_attempts($user) {
    $max_attempts = 5;
    $lockout_time = 15 * 60; // 15 Minuten
    $current_time = time();

    if ($user['failed_attempts'] >= $max_attempts && ($current_time - strtotime($user['last_attempt'])) < $lockout_time) {
        die('Konto gesperrt. Bitte nach 15 Minuten erneut versuchen.');
    }
}

// Funktion zur Protokollierung fehlgeschlagener Login-Versuche
function log_failed_attempt($username, $mysqli) {
    $stmt = $mysqli->prepare('UPDATE users SET failed_attempts = failed_attempts + 1, last_attempt = NOW() WHERE username = ?');
    $stmt->bind_param('s', $username);
    $stmt->execute();
}

// MFA-Überprüfung (z.B. Google Authenticator)
function verify_mfa($secret, $code) {
    // TOTP-basierte Überprüfung für MFA (Beispielimplementierung)
    return true;
}
