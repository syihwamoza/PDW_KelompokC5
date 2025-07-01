<?php
require 'db_connect.php';

$sql = "SELECT category, name, price, description FROM menu_items";
$result = $conn->query($sql);

$menu_structured = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Mengelompokkan item berdasarkan kategori
        $menu_structured[$row['category']]['title'] = $row['category'];
        $menu_structured[$row['category']]['items'][] = [
            'name' => $row['name'],
            'price' => $row['price'],
            'description' => $row['description']
        ];
    }
}

// Mengubah dari array asosiatif menjadi array numerik
$output = array_values($menu_structured);

http_response_code(200);
echo json_encode($output);

$conn->close();
?>