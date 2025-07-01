<?php
// File: api/db_connect.php

$servername = "localhost";
$username = "root"; // Username default XAMPP
$password = "";     // Password default XAMPP adalah kosong
$dbname = "db_resto";
$port = 3308;

// Buat koneksi
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    // Hentikan eksekusi dan kirim response error jika koneksi gagal
    header('Content-Type: application/json');
    http_response_code(500); // Internal Server Error
    die(json_encode(['message' => 'Connection failed: ' . $conn->connect_error]));
}

// Atur header default untuk semua file yang menggunakan koneksi ini
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Sesuaikan jika perlu
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
?>