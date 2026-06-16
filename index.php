<?php
require_once 'db.php';

// NEU: Länderliste aus der JSON-Datei laden
$json_data = file_get_contents('countries.json');
$countries = json_decode($json_data, true);
asort($countries); // Alphabetisch sortieren nach Ländernamen

// 1. Neuen Trip speichern
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create') {
    $code = $_POST['country_code'];
    $name = $countries[$code] ?? 'Unbekanntes Land';
    
    $stmt = $pdo->prepare('INSERT INTO trips (country_code, country_name, start_date, end_date, notes) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$code, $name, $_POST['start_date'], $_POST['end_date'], $_POST['notes']]);
    header('Location: index.php');
    exit;
}

// 2. Trip löschen
if (isset($_GET['delete'])) {
    $stmt = $pdo->prepare('DELETE FROM trips WHERE id = ?');
    $stmt->execute([$_GET['delete']]);
    header('Location: index.php');
    exit;
}

// 3. Alle Trips abrufen
$trips = $pdo->query('SELECT * FROM trips ORDER BY start_date DESC')->fetchAll();

// 4. Statistiken berechnen
$total_trips = count($trips);
$unique_countries = $pdo->query('SELECT COUNT(DISTINCT country_code) FROM trips')->fetchColumn();
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mein Reisetagebuch</title>
    <!-- Bootstrap 5 & Choices.js CSS -->
    <link href="https://jsdelivr.net" rel="stylesheet">
    <link href="https://jsdelivr.net" rel="stylesheet">
    <style>
        .choices__inner { background-color: #fff; border-radius: 0.375rem; border: 1px solid #dee2e6; }
    </style>
</head>
<body class="bg-light">
    <div class="container my-5">
        <h1 class="mb-4 text-center">🌍 Mein Reisetagebuch (v1.1)</h1>
        
        <!-- NEU: Kleine Statistik-Leiste auf Länderebene -->
        <div class="row g-3 mb-4 text-center">
            <div class="col-6 col-md-3 mx-auto">
                <div class="card p-3 shadow-sm bg-white border-0">
                    <span class="text-muted small uppercase">Besuchte Länder</span>
                    <h3 class="fw-bold text-primary m-0"><?= $unique_countries ?></h3>
                </div>
            </div>
            <div class="col-6 col-md-3 mx-auto">
                <div class="card p-3 shadow-sm bg-white border-0">
                    <span class="text-muted small">Gesamte Trips</span>
                    <h3 class="fw-bold text-success m-0"><?= $total_trips ?></h3>
                </div>
            </div>
        </div>
        
        <div class="row g-4">
            <!-- Formular -->
            <div class="col-lg-4">
                <div class="card shadow-sm p-4 border-0">
                    <h5 class="card-title mb-3 fw-bold">Neuen Trip eintragen</h5>
                    <form action="index.php" method="POST">
                        <input type="hidden" name="action" value="create">
                        
                        <div class="mb-3">
                            <label class="form-label">Land auswählen</label>
                            <!-- Suchbares Dropdown -->
                            <select name="country_code" id="country-select" class="form-select" required>
                                <option value="">Land eingeben oder wählen...</option>
                                <?php foreach ($countries as $code => $name): ?>
                                    <option value="<?= $code ?>"><?= htmlspecialchars($name) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">Von</label>
                                <input type="date" name="start_date" class="form-control" required>
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">Bis</label>
                                <input type="date" name="end_date" class="form-control" required>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Städte & Notizen</label>
                            <textarea name="notes" class="form-control" rows="4" placeholder="z.B. Paris, Lyon, tolles Hotel am Fluss..."></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100 fw-bold">Trip speichern</button>
                    </form>
                </div>
            </div>

            <!-- Liste -->
            <div class="col-lg-8">
                <div class="card shadow-sm p-4 border-0">
                    <h5 class="card-title mb-3 fw-bold">Meine Reisen</h5>
                    <?php if (empty($trips)): ?>
                        <p class="text-muted">Noch keine Trips eingetragen.</p>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th>Land</th>
                                        <th>Städte / Details</th>
                                        <th>Zeitraum</th>
                                        <th class="text-end">Aktionen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($trips as $trip): ?>
                                        <tr>
                                            <td>
                                                <span class="fw-bold"><?= htmlspecialchars($trip['country_name']) ?></span>
                                                <br><span class="badge bg-secondary text-uppercase"><?= htmlspecialchars($trip['country_code']) ?></span>
                                            </td>
                                            <td>
                                                <span class="text-secondary small"><?= nl2br(htmlspecialchars($trip['notes'] ?? '')) ?></span>
                                            </td>
                                            <td>
                                                <small class="text-nowrap">
                                                    <?= date('d.m.Y', strtotime($trip['start_date'])) ?> -<br>
                                                    <?= date('d.m.Y', strtotime($trip['end_date'])) ?>
                                                </small>
                                            </td>
                                            <td class="text-end">
                                                <a href="edit.php?id=<?= $trip['id'] ?>" class="btn btn-sm btn-outline-warning me-1">Edit</a>
                                                <a href="index.php?delete=<?= $trip['id'] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Trip wirklich löschen?')">X</a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- JavaScript für das Such-Dropdown -->
    <script src="https://jsdelivr.net"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const element = document.getElementById('country-select');
            new Choices(element, {
                searchEnabled: true,
                itemSelectText: '',
                noResultsText: 'Kein Land gefunden',
            });
        });
    </script>
</body>
</html>
