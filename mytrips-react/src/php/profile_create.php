<?php

// ===============================
// CORS
// ===============================

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");


// Preflight sofort beenden
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
	http_response_code(204);
	exit;
}



// ===============================
// Datenbank
// ===============================

require "config.php";



// ===============================
// JSON Daten lesen
// ===============================

$data = json_decode(
	file_get_contents("php://input"),
	true
);

$stmt = $pdo->prepare("
	INSERT INTO profiles (
		user_id,
		name,
		color
	)
	VALUES (?, ?, ?)
");

$stmt->execute([
	$data["user_id"],
	$data["name"],
	$data["color"]
]);

echo json_encode([
	"success" => true
]);