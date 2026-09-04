<?php

header("Content-Type: application/json; charset=utf-8");

require "config.php";


$sql = "
SELECT
    code,
    name_de,
    name_en,
    continent_id
FROM countries
ORDER BY name_de
";


$stmt = $pdo->query($sql);


echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC),
    JSON_UNESCAPED_UNICODE
);