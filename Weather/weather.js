// Create map
var map = L.map("weathermap").setView([38, -95], 4);

// OpenStreetMap basemap
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

// Radar layer
L.tileLayer.wms(
    "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi",
    {
        layers: "nexrad-n0r-900913",
        format: "image/png",
        transparent: true
    }
).addTo(map);

// Weather Alerts
$.getJSON(
    "https://api.weather.gov/alerts/active",
    function(data) {

        L.geoJSON(data, {
            style: function(feature) {

                var color = "orange";

                if (feature.properties.severity === "Severe") {
                    color = "red";
                }

                if (feature.properties.severity === "Extreme") {
                    color = "purple";
                }

                return {
                    color: color,
                    weight: 2
                };
            },

            onEachFeature: function(feature, layer) {
                layer.bindPopup(
                    "<b>" + feature.properties.headline + "</b><br>" +
                    feature.properties.severity
                );
            }

        }).addTo(map);

    }
);