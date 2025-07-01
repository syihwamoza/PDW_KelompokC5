<?php
session_start();
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->username) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Username and password are required."]);
    exit();
}

$username = $conn->real_escape_string($data->username);

$stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($data->password, $user['password'])) {
        // Login berhasil
        $_SESSION['user'] = ['username' => $user['username'], 'role' => $user['role']];
        unset($user['password']); // Jangan kirim hash password ke frontend

        http_response_code(200);
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        // Password salah
        http_response_code(401);
        echo json_encode(["message" => "Invalid username or password."]);
    }
} else {
    // Username tidak ditemukan
    http_response_code(401);
    echo json_encode(["message" => "Invalid username or password."]);
}

$stmt->close();
$conn->close();
?>