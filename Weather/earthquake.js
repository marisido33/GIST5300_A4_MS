var map = L.map("earthquake").setView([20, 0], 2);

// OpenTopoMap basemap
L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 17,
        attribution: "© OpenTopoMap contributors"
    }
).addTo(map);

// Function to determine marker color
function getColor(mag) {
    if (mag >= 5) return "red";
    if (mag >= 3) return "orange";
    if (mag >= 1) return "yellow";
    return "green";
}

// Function to determine marker size
function getRadius(mag) {
    return mag * 3 + 3;
}

fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
    .then(response => response.json())
    .then(data => {

        L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {

                var mag = feature.properties.mag || 0;

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

                var time =
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

        }).addTo(map);

    });

// Legend
var legend = L.control({position: "bottomright"});

legend.onAdd = function() {

    var div = L.DomUtil.create("div", "info legend");

    div.innerHTML =
        '<h4>Magnitude</h4>' +
        '<i style="background:green;width:15px;height:15px;display:inline-block;"></i> &lt; 1<br>' +
        '<i style="background:yellow;width:15px;height:15px;display:inline-block;"></i> 1 - 2.9<br>' +
        '<i style="background:orange;width:15px;height:15px;display:inline-block;"></i> 3 - 4.9<br>' +
        '<i style="background:red;width:15px;height:15px;display:inline-block;"></i> 5+';

    return div;
};

legend.addTo(map);