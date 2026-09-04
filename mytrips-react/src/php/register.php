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



if (
	!isset($data["username"]) ||
	!isset($data["email"]) ||
	!isset($data["password"])
) {

	echo json_encode([
		"success" => false,
		"message" => "Missing data"
	]);

	exit;

}



$username = trim($data["username"]);
$email = strtolower(trim($data["email"]));
$password = $data["password"];





// Prüfen ob Email bereits existiert

$stmt = $pdo->prepare(
	"SELECT id FROM users WHERE email = ?"
);


$stmt->execute([
	$email
]);


if ($stmt->fetch()) {


	echo json_encode([
		"success" => false,
		"message" => "Email already registered"
	]);


	exit;

}






// Passwort verschlüsseln

$passwordHash = password_hash(
	$password,
	PASSWORD_DEFAULT
);






// User anlegen

$stmt = $pdo->prepare(
	"
	INSERT INTO users
	(
		username,
		email,
		password_hash
	)
	VALUES
	(
		?,
		?,
		?
	)
	"
);



$stmt->execute([

	$username,

	$email,

	$passwordHash

]);





$userId = $pdo->lastInsertId();






// Standardprofil erzeugen

$stmt = $pdo->prepare(
	"
	INSERT INTO profiles
	(
		user_id,
		name,
		color
	)
	VALUES
	(
		?,
		?,
		?
	)
	"
);



$stmt->execute([

	$userId,

	"Privat",

	"#2196f3"

]);







echo json_encode([

	"success" => true,

	"message" => "Registration successful",

	"user" => [

		"id" => (int)$userId,

		"username" => $username,

		"email" => $email

	]

]);