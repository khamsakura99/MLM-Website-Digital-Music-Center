<?php
/**
 * OMC MLM System - Database Connection Helper (PHP PDO)
 * Compatible with cPanel, Plesk, Apache, LiteSpeed & PHP 7.4 - 8.3+
 */

$db_host = 'localhost';
$db_name = 'omc_mlm_database';
$db_user = 'root';        // Replace with your cPanel database username
$db_pass = '';            // Replace with your cPanel database password
$charset = 'utf8mb4';

$dsn = "mysql:host=$db_host;dbname=$db_name;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    // Connection successful
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
