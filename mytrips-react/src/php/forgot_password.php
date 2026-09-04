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
	!isset($data["email"])
) {

	echo json_encode([
		"success" => false,
		"message" => "Email missing"
	]);

	exit;

}



$email = strtolower(trim($data["email"]));




// User suchen

$stmt = $pdo->prepare(
	"
	SELECT
		id
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





/*
 Sicherheitsgründe:
 Wir geben nicht zurück,
 ob die Email existiert.
*/

if (!$user) {


	echo json_encode([

		"success" => true,

		"message" =>
			"If the email exists, a reset link was sent"

	]);


	exit;

}







// Token erzeugen

$token = bin2hex(
	random_bytes(32)
);



// Ablaufzeit: 1 Stunde

$expires = date(
	"Y-m-d H:i:s",
	strtotime("+1 hour")
);






// Token speichern

$stmt = $pdo->prepare(
	"
	UPDATE users
	SET
		reset_token = ?,
		reset_token_expires = ?
	WHERE id = ?
	"
);



$stmt->execute([

	$token,

	$expires,

	$user["id"]

]);








// Reset-Link erzeugen

$resetLink =
	"https://yogi-tech.de/mytrips/reset-password?token="
	.$token;







/*
 TODO:
 Hier später echte Mail versenden

 mail(
	$email,
	"MyTrips Passwort zurücksetzen",
	$resetLink
 );

*/





// Für Entwicklung zurückgeben

echo json_encode([

	"success" => true,

	"message" =>
		"If the email exists, a reset link was sent",

	/*
	 Nur während Entwicklung aktiv!
	 Später entfernen.
	*/

	"debug_reset_link" =>
		$resetLink

]);