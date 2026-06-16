<?php
require_once 'db.php';

// NEU: Länderliste aus der JSON-Datei laden
$json_data = file_get_contents('countries.json');
$countries = json_decode($json_data, true);
asort($countries);

if (!isset($_GET['id'])) { header('Location: index.php'); exit; }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = $_POST['country_code'];
    $name = $countries[$code] ?? 'Unbekanntes Land';
    
    $stmt = $pdo->prepare('UPDATE trips SET country_code = ?, country_name = ?, start_date = ?, end_date = ?, notes = ? WHERE id = ?');
    $stmt->execute([$code, $name, $_POST['start_date'], $_POST['end_date'], $_POST['notes'], $_POST['id']]);
    header('Location: index.php');
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM trips WHERE id = ?');
$stmt->execute([$_GET['id']]);
$trip = $stmt->fetch();
if (!$trip) { header('Location: index.php'); exit; }
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trip bearbeiten</title>
    <link href="https://jsdelivr.net" rel="stylesheet">
    <link href="https://jsdelivr.net" rel="stylesheet">
    <style>
        .choices__inner { background-color: #fff; border-radius: 0.375rem; border: 1px solid #dee2e6; }
    </style>
</head>
<body class="bg-light">
    <div class="container my-5" style="max-width: 600px;">
        <div class="card shadow-sm p-4 border-0">
            <h3 class="mb-4 fw-bold">Trip bearbeiten</h3>
            <form action="edit.php" method="POST">
                <input type="hidden" name="id" value="<?= $trip['id'] ?>">
                
                <div class="mb-3">
                    <label class="form-label">Land</label>
                    <select name="country_code" id="country-select" class="form-select" required>
                        <?php foreach ($countries as $code => $name): ?>
                            <option value="<?= $code ?>" <?= $trip['country_code'] === $code ? 'selected' : '' ?>><?= htmlspecialchars($name) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="row">
                    <div class="col-6 mb-3">
                        <label class="form-label">Von</label>
                        <input type="date" name="start_date" class="form-control" value="<?= $trip['start_date'] ?>" required>
                    </div>
                    <div class="col-6 mb-3">
                        <label class="form-label">Bis</label>
                        <input type="date" name="end_date" class="form-control" value="<?= $trip['end_date'] ?>" required>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Städte & Notizen</label>
                    <textarea name="notes" class="form-control" rows="5"><?= htmlspecialchars($trip['notes']) ?></textarea>
                </div>
                
                <div class="d-flex justify-content-between">
                    <a href="index.php" class="btn btn-secondary">Abbrechen</a>
                    <button type="submit" class="btn btn-success fw-bold">Änderungen speichern</button>
                </div>
            </form>
        </div>
    </div>

    <script src="https://jsdelivr.net"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            new Choices(document.getElementById('country-select'), { searchEnabled: true, itemSelectText: '' });
        });
    </script>
</body>
</html>
