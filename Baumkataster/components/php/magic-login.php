// magic-login.php

if (isset($_GET['token']) && $_GET['token'] === $_SESSION['magic_link_token']) {
    // Benutzeranmeldung (Session erstellen)
    $_SESSION['user_id'] = $user_id;
    header('Location: /dashboard.php');
} else {
    die('Ungültiger Magic Link.');
}
?>