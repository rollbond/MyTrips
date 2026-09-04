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
	empty($data["email"]) ||
	empty($data["password"])
) {

	echo json_encode([
		"success" => false,
		"message" => "Missing credentials"
	]);

	exit;

}



$email = trim($data["email"]);
$password = $data["password"];





$stmt = $pdo->prepare(
	"
	SELECT
		id,
		username,
		email,
		password_hash
	FROM users
	WHERE email = ?
	"
);


$stmt->execute([
	$email
]);


$user = $stmt->fetch(
	PDO::FETCH_ASSOC
);




if (
	!$user ||
	!password_verify(
		$password,
		$user["password_hash"]
	)
) {


	echo json_encode([
		"success" => false,
		"message" => "Invalid login"
	]);


	exit;

}




echo json_encode([

	"success" => true,


	"user" => [

		"id" => (int)$user["id"],

		"username" => $user["username"],

		"email" => $user["email"]

	]

]);