<?php
session_start();
require 'db_connect.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["message" => "Access denied. Admin only."]);
    exit();
}

$report = [
    "summary" => [
        "total_users" => 0,
        "total_reservations" => 0
    ],
    "reservations" => []
];

// Get total users
$user_result = $conn->query("SELECT COUNT(id) as total FROM users");
if ($user_result) {
    $report['summary']['total_users'] = $user_result->fetch_assoc()['total'];
}

// Get total reservations
$res_result = $conn->query("SELECT COUNT(id) as total FROM reservations");
if ($res_result) {
    $report['summary']['total_reservations'] = $res_result->fetch_assoc()['total'];
}

// Get reservation list
$reservations_sql = "SELECT customer_name, phone_number, reservation_date, reservation_time, num_guests, special_request FROM reservations ORDER BY reservation_date DESC, reservation_time DESC";
$reservations_result = $conn->query($reservations_sql);
if ($reservations_result->num_rows > 0) {
    while($row = $reservations_result->fetch_assoc()) {
        $report['reservations'][] = $row;
    }
}

http_response_code(200);
echo json_encode($report);

$conn->close();
?>