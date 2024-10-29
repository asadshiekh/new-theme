<?php
// magic-login-request.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];

    // Überprüfen, ob Benutzer existiert
    $stmt = $mysqli->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if ($user) {
        $token = bin2hex(random_bytes(16));
        $_SESSION['magic_link_token'] = $token;

        // Magic Link per E-Mail senden
        $link = "http://localhost/magic-login.php?token=$token";
        mail($email, 'Ihr Magic Link', "Klicken Sie auf diesen Link, um sich anzumelden: $link");
    }

    echo "Wenn Ihr Konto existiert, erhalten Sie eine E-Mail mit dem Magic Link.";
}