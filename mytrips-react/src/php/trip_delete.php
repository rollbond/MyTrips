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


$data = json_decode(
    file_get_contents("php://input"),
    true
);



if (!isset($data["id"])) {

    http_response_code(400);

    echo json_encode([
        "error" => "Missing trip id"
    ]);

    exit;
}



$sql = "

DELETE FROM trips

WHERE id = :id

";



$stmt = $pdo->prepare($sql);


$stmt->execute([

    ":id" => $data["id"]

]);



echo json_encode([

    "success" => true

]);