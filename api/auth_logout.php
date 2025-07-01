<?php
session_start();
session_unset();
session_destroy();

require 'db_connect.php'; // Hanya untuk header

http_response_code(200);
echo json_encode(["message" => "Logout successful."]);
?>