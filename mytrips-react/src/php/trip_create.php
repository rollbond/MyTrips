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



if (!$data) {

    http_response_code(400);

    echo json_encode([
        "error" => "Invalid JSON"
    ]);

    exit;

}



// ===============================
// Pflichtfelder prüfen
// ===============================

$required = [
    "user_id",
    "profile_id",
    "country_code",
    "start_date",
    "end_date"
];


foreach ($required as $field) {


    if (!isset($data[$field]) || $data[$field] === "") {


        http_response_code(400);


        echo json_encode([

            "error" => "Missing field: " . $field

        ]);


        exit;

    }

}



// ===============================
// INSERT
// ===============================

$sql = "

INSERT INTO trips
(
    user_id,
    profile_id,
    country_code,
    start_date,
    end_date,
    notes
)

VALUES
(
    :user_id,
    :profile_id,
    :country_code,
    :start_date,
    :end_date,
    :notes
)

";



try {


    $stmt = $pdo->prepare($sql);


    $stmt->execute([
        ":user_id" => $data["user_id"],
        ":profile_id" => $data["profile_id"],
        ":country_code" => $data["country_code"],
        ":start_date" => $data["start_date"],
        ":end_date" => $data["end_date"],
        ":notes" => $data["notes"] ?? ""
    ]);



    echo json_encode([

        "success" => true,

        "id" => $pdo->lastInsertId()

    ]);



} catch (PDOException $e) {


    http_response_code(500);


    echo json_encode([

        "error" => "Database insert failed",

        "message" => $e->getMessage()

    ]);

}