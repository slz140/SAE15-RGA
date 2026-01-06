import csv
import json

COLS = [
    "referenceRGA",
    "famille",
    "typeArme",
    "marque",
    "modele",
    "fabricant",
    "paysFabricant",
    "modeFonctionnement"
]

armes = []
familles = {}
types = {}
pays = {}
modes = {}

with open("RGA(in).csv", encoding="utf-8") as f:
    reader = csv.reader(f, delimiter=";")
    header = next(reader)

    normalized = [c.strip().replace("\ufeff", "").lower() for c in header]
    idx = {col: normalized.index(col.lower()) for col in COLS}

    for row in reader:
        a = {col: row[idx[col]].strip() for col in COLS}
        armes.append(a)

        familles[a["famille"]] = familles.get(a["famille"], 0) + 1
        types[a["typeArme"]] = types.get(a["typeArme"], 0) + 1
        pays[a["paysFabricant"]] = pays.get(a["paysFabricant"], 0) + 1
        modes[a["modeFonctionnement"]] = modes.get(a["modeFonctionnement"], 0) + 1

charts = {
    "familles": familles,
    "types": types,
    "pays": pays,
    "modes": modes
}

html = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Référentiel Général des Armes (RGA)</title>
<br><br>

<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
const ARMES_DATA = {json.dumps(armes)};
const CHARTS_DATA = {json.dumps(charts)};
</script>

<script src="script.js" defer></script>
</head>

<body>

<nav class="navbar">
<ul>
<li><a href="#accueil">Accueil</a></li>
<li><a href="#tableau">Tableau</a></li>
<li><a href="#familles">Familles</a></li>
<li><a href="#types">Types d'arme</a></li>
<li><a href="#pays">Pays fabricants</a></li>
<li><a href="#modes">Modes</a></li>
<li><a href="#mapSection">Carte mondiale</a></li>
</ul>
</nav>

<div id="content">
<div class="pnj-container">
    <img src="pnj1.png" class="pnj">
</div>

<section id="accueil" class="section">
<h1>Les caractéristiques des armes répertoriés basé sur le RGA</h1>
<br>
<p class="intro">

Ce site web est un projet réalisé dans le cadre de la SAE15 du BUT Réseaux & Télécommunications.
Il a pour objectif d’exploiter les données du Référentiel Général des Armes (RGA) issu du site <a href="https://www.data.gouv.fr/datasets/referentiel-general-des-armes" target="_blank">datagouv</a>
, et d’apprendre les caractéristiques des armes, ainsi que d’analyser les fabricants et la provenance des armes, ce qui peut constituer un indice sur les plus grandes puissances mondiales.
<br><br>
Ce site a été réalisé en automatisant la lecture d’un fichier CSV complexe, en structurant les données via Python, 
puis en générant une interface web enrichie de graphiques, filtres dynamiques, pagination et d’une carte interactive Leaflet.<br><br>
Projet réalisé par : <b>OZKAN Emre</b> & <b>HOURI Ilyes</b> — BUT1 R&T — Novembre 2025.
</p>
</section>

<hr class="divider">

<section id="tableau" class="section">
<h2>Tableau des Armes</h2>

<div class="search-container">
    <input id="searchBar" placeholder="Rechercher..." />
</div>

<br><br>
<table id="armesTable">
<thead>
<tr>
<th>Référence</th>
<th>Famille</th>
<th>Type</th>
<th>Marque</th>
<th>Modèle</th>
<th>Fabricant</th>
<th>Pays</th>
<th>Mode</th>
</tr>
</thead>
<tbody></tbody>
</table>

<div id="pagination"></div>
</section>

<hr class="divider">

<section id="familles" class="section">
<h2>Familles d'arme</h2>
<div class="chart-container"><canvas id="famillesChart"></canvas></div>
</section>

<hr class="divider">

<section id="types" class="section">
<h2>Types d'arme</h2>
<div class="chart-container"><canvas id="typesChart"></canvas></div>
</section>

<hr class="divider">

<section id="pays" class="section">
<h2>Pays fabricants</h2>
<div class="chart-container"><canvas id="paysChart"></canvas></div>
</section>

<hr class="divider">

<section id="modes" class="section">
<h2>Modes de fonctionnement des armes</h2>
<div class="chart-container"><canvas id="modesChart"></canvas></div>
</section>

<hr class="divider">

<section id="mapSection" class="section">
<h2>Carte mondiale des principaux fabricants</h2>
<div id="map"></div>
</section>

<footer>
<p>Propriété du site et création : OZKAN Emre & HOURI Ilyes — BUT1 R&T — Novembre 2025</p>
</footer>

</div>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("compilé avec succés")
