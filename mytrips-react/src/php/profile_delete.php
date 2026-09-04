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
		"error" => "Missing profile id"
	]);
	exit;
}

$profileId = intval($data["id"]);

try {


	/*
		Optional:
		Prüfen, ob das Profil existiert
	*/

	$stmt = $pdo->prepare(
		"SELECT id FROM profiles WHERE id = ?"
	);

	$stmt->execute([
		$profileId
	]);


	if (!$stmt->fetch()) {
		http_response_code(404);
		echo json_encode([
			"error" => "Profile not found"
		]);
		exit;
	}


	/*
		Erst abhängige Reisen löschen
	*/

	$stmt = $pdo->prepare(
		"DELETE FROM trips WHERE profile_id = ?"
	);

	$stmt->execute([
		$profileId
	]);





	/*
		Dann Profil löschen
	*/

	$stmt = $pdo->prepare(
		"DELETE FROM profiles WHERE id = ?"
	);

	$stmt->execute([
		$profileId
	]);

	echo json_encode([
		"success" => true,
		"message" => "Profile deleted"
	]);

} catch (Exception $e) {
	http_response_code(500);
	echo json_encode([
		"error" => $e->getMessage()
	]);

}
