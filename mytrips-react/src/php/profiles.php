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




$userId = $_GET["user_id"] ?? 1;

$stmt = $pdo->prepare("
	SELECT
		p.id,
		p.name,
		p.color,
		COUNT(t.id) AS trips,
		COUNT(DISTINCT t.country_code) AS countries
	FROM profiles p
		LEFT JOIN trips t ON p.id = t.profile_id
	WHERE p.user_id = ?
	GROUP BY
		p.id,
		p.name,
		p.color
	ORDER BY p.name;
");

$stmt->execute([$userId]);

echo json_encode(
	$stmt->fetchAll(PDO::FETCH_ASSOC)
);