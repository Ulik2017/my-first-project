<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'sales_app';

function db(): PDO {
    global $host, $user, $pass, $dbname;
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}
