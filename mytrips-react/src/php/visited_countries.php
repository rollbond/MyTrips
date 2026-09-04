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

$profileId = $_GET["profile_id"] ?? null;
$userId = $_GET["user_id"] ?? null;

if ($userId) {
	$sql = "
		SELECT DISTINCT t.country_code, t.profile_id
		FROM trips t
		INNER JOIN profiles p ON p.id = t.profile_id
		WHERE p.user_id = ?
	";

	$stmt = $pdo->prepare($sql);
	$stmt->execute([$userId]);
} else {
	$profileId = $profileId ?? 1;

	$sql = "
		SELECT DISTINCT country_code
		FROM trips
		WHERE profile_id = ?
	";

	$stmt = $pdo->prepare($sql);
	$stmt->execute([$profileId]);
}

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));