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


// User-ID aus URL holen
$profile_id = $_GET["profile_id"] ?? null;


if (!$profile_id) {

    http_response_code(400);

    echo json_encode([
        "error" => "Missing profile_id"
    ]);

    exit;
}



$sql = "

SELECT

    t.id,
    t.country_code,
    c.name_de AS country_name,
    t.start_date,
    t.end_date,
    t.notes,
    t.created_at

FROM trips t

LEFT JOIN countries c
    ON c.code = t.country_code

WHERE t.profile_id = ?

ORDER BY t.start_date DESC

";



$stmt = $pdo->prepare($sql);

$stmt->execute([
    $profile_id
]);



echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC),
    JSON_UNESCAPED_UNICODE
);