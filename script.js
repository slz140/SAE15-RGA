/*  Pagination  */


let currentPage = 1;
const perPage = 20;
let filteredData = [...ARMES_DATA];

function renderTable() {
    let tbody = document.querySelector("#armesTable tbody");
    tbody.innerHTML = "";

    let start = (currentPage - 1) * perPage;
    let end = start + perPage;

    filteredData.slice(start, end).forEach(a => {
        tbody.innerHTML += `
        <tr>
            <td>${a.referenceRGA}</td>
            <td>${a.famille}</td>
            <td>${a.typeArme}</td>
            <td>${a.marque}</td>
            <td>${a.modele}</td>
            <td>${a.fabricant}</td>
            <td>${a.paysFabricant}</td>
            <td>${a.modeFonctionnement}</td>
        </tr>`;
    });

    renderPagination();
}

function renderPagination() {
    let total = Math.ceil(filteredData.length / perPage);

    document.getElementById("pagination").innerHTML = `
        <div class="pagination-wrapper">
            <button class="page-btn" onclick="prevPage()" ${currentPage==1?"disabled":""}>⟵</button>
            <span class="page-number">Page ${currentPage} / ${total}</span>
            <button class="page-btn" onclick="nextPage()" ${currentPage==total?"disabled":""}>⟶</button>
        </div>
    `;
}

function prevPage(){ currentPage--; renderTable(); }
function nextPage(){ currentPage++; renderTable(); }



/*  Recherche   */

document.getElementById("searchBar").addEventListener("input", function() {
    let f = this.value.toLowerCase();
    filteredData = ARMES_DATA.filter(a =>
        Object.values(a).join(" ").toLowerCase().includes(f)
    );
    currentPage = 1;
    renderTable();
});



/*  Graphique   */

function createChart(canvasId, dataObject) {

    const palette = [
        "#4b3f2f", "#6d5a45", "#8c785e", "#b49e7a",
        "#d3c4a1", "#544c3f", "#7b705e", "#9e9178"
    ];

    let labels = Object.keys(dataObject);
    let values = Object.values(dataObject);
    let colors = labels.map((_, i) => palette[i % palette.length]);

    let ctx = document.getElementById(canvasId).getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Nombre",
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" } }
            },
            plugins: {
                legend: { labels: { color: "white" } }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    createChart("famillesChart", CHARTS_DATA.familles);
    createChart("typesChart", CHARTS_DATA.types);
    createChart("paysChart", CHARTS_DATA.pays);
    createChart("modesChart", CHARTS_DATA.modes);
});



/*  Carte leaflet avec GeoJSON mondial  */

const WORLD_SIMPLIFIED = {
"type": "FeatureCollection",
"features": [
{"type":"Feature","properties":{"name":"France"},"geometry":{"type":"Polygon","coordinates":[[[ -5,42 ],[8,42],[8,51],[-5,51],[-5,42 ]]]}},
{"type":"Feature","properties":{"name":"Germany"},"geometry":{"type":"Polygon","coordinates":[[[ 5,47 ],[15,47],[15,55],[5,55],[5,47 ]]]}},
{"type":"Feature","properties":{"name":"Belgium"},"geometry":{"type":"Polygon","coordinates":[[[ 2,49 ],[6,49],[6,51],[2,51],[2,49 ]]]}},
{"type":"Feature","properties":{"name":"Spain"},"geometry":{"type":"Polygon","coordinates":[[[ -10,36 ],[4,36],[4,43],[-10,43],[-10,36 ]]]}},
{"type":"Feature","properties":{"name":"Italy"},"geometry":{"type":"Polygon","coordinates":[[[ 7,37 ],[19,37],[19,47],[7,47],[7,37 ]]]}},
{"type":"Feature","properties":{"name":"United Kingdom"},"geometry":{"type":"Polygon","coordinates":[[[ -8,50 ],[2,50],[2,59],[-8,59],[-8,50 ]]]}},
{"type":"Feature","properties":{"name":"Turkey"},"geometry":{"type":"Polygon","coordinates":[[[ 26,36 ],[45,36],[45,42],[26,42],[26,36 ]]]}},
{"type":"Feature","properties":{"name":"United States"},"geometry":{"type":"Polygon","coordinates":[[[-125,25],[-65,25],[-65,49],[-125,49],[-125,25]]]}}
]};


const COUNTRY_MAP = {
    "FRANCE": "France",
    "ALLEMAGNE": "Germany",
    "BELGIQUE": "Belgium",
    "ESPAGNE": "Spain",
    "ITALIE": "Italy",
    "ROYAUME-UNI": "United Kingdom",
    "TURQUIE": "Turkey",
    "ÉTATS-UNIS": "United States"
};


/* couleurs*/

function getMilitaryColor(count) {
    if (count > 500) return "#4b3f2f";     
    if (count > 200) return "#6d5a45";     
    if (count > 50)  return "#8c785e";    
    if (count > 10)  return "#b49e7a";     
    return "#7b705e";                      
}

function initMapLeaflet() {
    const map = L.map("map").setView([25, 10], 2);

    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CARTO'}).addTo(map);

    const paysCSV = CHARTS_DATA.pays;

    L.geoJSON(WORLD_SIMPLIFIED, {
        style: feature => {
            const enName = feature.properties.name;
            const frMatch = Object.keys(COUNTRY_MAP).find(k => COUNTRY_MAP[k] === enName);
            const count = frMatch && paysCSV[frMatch] ? paysCSV[frMatch] : 0;

            return {
                fillColor: getMilitaryColor(count),
                fillOpacity: 0.75,
                color: "#000",
                weight: 1
            };
        },
        onEachFeature: (feature, layer) => {
            const enName = feature.properties.name;
            const frMatch = Object.keys(COUNTRY_MAP).find(k => COUNTRY_MAP[k] === enName);
            const count = frMatch && paysCSV[frMatch] ? paysCSV[frMatch] : 0;

            layer.bindPopup(`<b>${enName}</b><br>Armes : ${count}`);
        }
    }).addTo(map);
}

document.addEventListener("DOMContentLoaded", initMapLeaflet);

renderTable();
