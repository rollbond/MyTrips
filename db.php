<?php
$host = 'rdbms.strato.de';
$db   = 'dbs15786568'; // Ihr STRATO Datenbankname
$user = 'dbu4873049';  // Ihr STRATO Benutzername
$pass = 'DW0bsIIKwWYt09'; // Ihr Datenbank-Passwort
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>