<?php
session_start();
require 'db_connect.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["message" => "Access denied. Admin only."]);
    exit();
}

$menuData = json_decode(file_get_contents("php://input"), true);

if (!$menuData) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid data received."]);
    exit();
}

// Mulai transaksi
$conn->begin_transaction();

try {
    // 1. Hapus semua data menu yang lama
    $conn->query("TRUNCATE TABLE menu_items");

    // 2. Siapkan statement untuk insert data baru
    $stmt = $conn->prepare("INSERT INTO menu_items (category, name, price, description) VALUES (?, ?, ?, ?)");

    // 3. Loop dan insert setiap item menu
    foreach ($menuData as $section) {
        $category = $section['title'];
        foreach ($section['items'] as $item) {
            $stmt->bind_param("ssss", $category, $item['name'], $item['price'], $item['description']);
            $stmt->execute();
        }
    }
    
    // Jika semua berhasil, commit transaksi
    $conn->commit();
    http_response_code(200);
    echo json_encode(["message" => "Menu updated successfully."]);

} catch (Exception $e) {
    // Jika ada error, rollback (batalkan semua perubahan)
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["message" => "Failed to update menu: " . $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>