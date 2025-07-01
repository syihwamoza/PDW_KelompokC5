<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

// Validasi sederhana
if (empty($data->customer_name) || empty($data->reservation_date) || empty($data->reservation_time)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete reservation data."]);
    exit();
}

$stmt = $conn->prepare("INSERT INTO reservations (customer_name, phone_number, reservation_date, reservation_time, num_guests, special_request) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", 
    $data->customer_name, 
    $data->phone_number, 
    $data->reservation_date, 
    $data->reservation_time, 
    $data->num_guests, 
    $data->special_request
);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["message" => "Reservation created successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to create reservation."]);
}

$stmt->close();
$conn->close();
?>