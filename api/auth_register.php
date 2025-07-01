<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->username) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Username and password are required."]);
    exit();
}

$username = $conn->real_escape_string($data->username);
$password = password_hash($data->password, PASSWORD_DEFAULT);

// Cek duplikasi username
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["message" => "Username already exists."]);
} else {
    // Insert user baru
    $stmt_insert = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')");
    $stmt_insert->bind_param("ss", $username, $password);

    if ($stmt_insert->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Registration successful!"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Registration failed."]);
    }
    $stmt_insert->close();
}

$stmt->close();
$conn->close();
?>