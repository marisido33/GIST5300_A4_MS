// Create map
var map = L.map("weathermap").setView([38, -95], 4);

// OpenTopoMap Basemap
var topo = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 17,
        attribution: "© OpenTopoMap"
    }
).addTo(map);

// Radar Layer
var radar = L.tileLayer.wms(
    "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi",
    {
        layers: "nexrad-n0r-900913",
        format: "image/png",
        transparent: true
    }
).addTo(map);

// Alert Layer Group
var alertsLayer = L.layerGroup().addTo(map);

// Earthquake Layer Group
var earthquakeLayer = L.layerGroup().addTo(map);

// WEATHER ALERTS
fetch("https://api.weather.gov/alerts/active")
.then(response => response.json())
.then(data => {

    var alerts = L.geoJSON(data, {

        style: function(feature) {

            let color = "orange";

            if (feature.properties.severity === "Extreme")
                color = "purple";

            if (feature.properties.severity === "Severe")
                color = "red";

            if (feature.properties.severity === "Minor")
                color = "green";

            return {
                color: color,
                weight: 2
            };
        },

        onEachFeature: function(feature, layer) {

            layer.bindPopup(
                "<b>" + feature.properties.headline + "</b>" +
                "<br><b>Severity:</b> " + feature.properties.severity +
                "<br><b>Event:</b> " + feature.properties.event +
                "<br><b>Area:</b> " + feature.properties.areaDesc
            );

        }

    });

    alertsLayer.addLayer(alerts);

});

// EARTHQUAKES

function getColor(mag) {
    if (mag >= 5) return "red";
    if (mag >= 3) return "orange";
    if (mag >= 1) return "yellow";
    return "green";
}

function getRadius(mag) {
    return mag * 3 + 3;
}

fetch(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
)
.then(response => response.json())
.then(data => {

    var earthquakes = L.geoJSON(data, {

        pointToLayer: function(feature, latlng) {

            let mag = feature.properties.mag || 0;

            return L.circleMarker(latlng, {
                radius: getRadius(mag),
                fillColor: getColor(mag),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

        },

        onEachFeature: function(feature, layer) {

            let time =
                new Date(feature.properties.time)
                .toLocaleString();

            layer.bindPopup(
                "<b>Magnitude:</b> " +
                feature.properties.mag +
                "<br><b>Location:</b> " +
                feature.properties.place +
                "<br><b>Time:</b> " +
                time
            );

        }

    });

    earthquakeLayer.addLayer(earthquakes);

});

// Layer Control
var overlays = {
    "Weather Radar": radar,
    "Weather Alerts": alertsLayer,
    "Earthquakes": earthquakeLayer
};

L.control.layers(null, overlays).addTo(map);



// Earthquake Legend
var earthquakeLegend = L.control({position: "bottomright"});

earthquakeLegend.onAdd = function () {

    var div = L.DomUtil.create("div", "info legend");

    div.innerHTML =
        "<h4>Earthquake Magnitude</h4>" +
        '<i style="background:green;width:15px;height:15px;display:inline-block;"></i> &lt; 1<br>' +
        '<i style="background:yellow;width:15px;height:15px;display:inline-block;"></i> 1 - 2.9<br>' +
        '<i style="background:orange;width:15px;height:15px;display:inline-block;"></i> 3 - 4.9<br>' +
        '<i style="background:red;width:15px;height:15px;display:inline-block;"></i> 5+';

    return div;
};

earthquakeLegend.addTo(map);