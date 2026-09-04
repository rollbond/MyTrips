<?php

header("Content-Type: text/plain; charset=utf-8");

if (!isset($_GET["password"])) {
	http_response_code(400);
	exit("Usage: ?password=yourPassword");
}

$password = $_GET["password"];

echo password_hash($password, PASSWORD_DEFAULT);