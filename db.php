<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'sales_app';

function ensureSchema(PDO $pdo, string $dbname): void {
    $q = $pdo->prepare("SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'sales' AND COLUMN_NAME = 'password'");
    $q->execute([$dbname]);
    $exists = (int)$q->fetchColumn() > 0;

    if (!$exists) {
        $pdo->exec("ALTER TABLE sales ADD COLUMN password VARCHAR(100) NOT NULL DEFAULT 'sales123' AFTER username");
        $pdo->exec("UPDATE sales SET password = 'admin123' WHERE username = 'admin'");
        $pdo->exec("UPDATE sales SET password = 'sales123' WHERE (password = '' OR password IS NULL)");
    }
}

function db(): PDO {
    global $host, $user, $pass, $dbname;
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        ensureSchema($pdo, $dbname);
    }
    return $pdo;
}
