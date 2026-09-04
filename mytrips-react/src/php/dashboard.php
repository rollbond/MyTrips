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


$profile_id = $_GET["profile_id"] ?? null;


if (!$profile_id) {

    http_response_code(400);

    echo json_encode([
        "error" => "Missing profile_id"
    ]);

    exit;

}



// =================================
// Anzahl Reisen
// =================================

$stmt = $pdo->prepare("
    SELECT COUNT(*)
    FROM trips
    WHERE profile_id = ?
");

$stmt->execute([$profile_id]);

$trips = (int)$stmt->fetchColumn();




// =================================
// Anzahl Länder
// =================================

$stmt = $pdo->prepare("
    SELECT COUNT(DISTINCT country_code)
    FROM trips
    WHERE profile_id = ?
");

$stmt->execute([$profile_id]);

$countries = (int)$stmt->fetchColumn();




// =================================
// Reisetage
// =================================

$stmt = $pdo->prepare("
    SELECT 
        COALESCE(
            SUM(
                DATEDIFF(end_date, start_date) + 1
            ),
            0
        )

    FROM trips

    WHERE profile_id = ?
");

$stmt->execute([$profile_id]);

$travel_days = (int)$stmt->fetchColumn();




// =================================
// Letzte Reise
// =================================

$stmt = $pdo->prepare("
    SELECT 
        c.name_de

    FROM trips t

    LEFT JOIN countries c
        ON c.code = t.country_code

    WHERE t.profile_id = ?

    ORDER BY t.end_date DESC

    LIMIT 1
");

$stmt->execute([$profile_id]);

$last_trip = $stmt->fetchColumn();





// =================================
// Letzte 5 Reisen
// =================================

$stmt = $pdo->prepare("

    SELECT

        t.id,

        c.name_de AS country_name,

        t.start_date,

        t.end_date,

        t.notes


    FROM trips t


    LEFT JOIN countries c

        ON c.code = t.country_code


    WHERE t.profile_id = ?


    ORDER BY t.start_date DESC


    LIMIT 5

");


$stmt->execute([$profile_id]);


$recent_trips = $stmt->fetchAll(PDO::FETCH_ASSOC);





// =================================
// Meist besuchte Länder
// =================================

$stmt = $pdo->prepare("

    SELECT

        c.name_de,

        COUNT(*) AS visits


    FROM trips t


    LEFT JOIN countries c

        ON c.code = t.country_code


    WHERE t.profile_id = ?


    GROUP BY t.country_code


    ORDER BY visits DESC


    LIMIT 5

");


$stmt->execute([$profile_id]);


$top_countries = $stmt->fetchAll(PDO::FETCH_ASSOC);





// =================================
// Ausgabe
// =================================

echo json_encode([
    "countries" => $countries,
    "trips" => $trips,
    "travel_days" => $travel_days,
    "last_trip" => $last_trip ?: "-",
    "recent_trips" => $recent_trips,
    "top_countries" => $top_countries

], JSON_UNESCAPED_UNICODE);