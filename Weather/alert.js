fetch("https://api.weather.gov/alerts/active")
    .then(response => response.json())
    .then(data => {

      L.geoJSON(data, {

    style: function(feature) {

        let color = "orange";

        if (feature.properties.severity === "Severe") {
            color = "red";
        }

        if (feature.properties.severity === "Extreme") {
            color = "purple";
        }

        if (feature.properties.severity === "Minor") {
            color = "green";
        }

        return {
            color: color,
            weight: 2
        };
    },

    onEachFeature: function(feature, layer) {

        layer.bindPopup(
            "<b>" + feature.properties.headline + "</b><br>" +
            "Severity: " + feature.properties.severity
        );

    }
    }).addTo(map);

    })
    .catch(error => console.log(error));

    var legend = L.control({position: "bottomright"});

legend.onAdd = function () {

    var div = L.DomUtil.create("div", "info legend");

    div.innerHTML =
        "<h4>Alert Severity</h4>" +
        '<i style="background:purple;width:15px;height:15px;display:inline-block;"></i> Extreme<br>' +
        '<i style="background:red;width:15px;height:15px;display:inline-block;"></i> Severe<br>' +
        '<i style="background:green;width:15px;height:15px;display:inline-block;"></i> Minor<br>' +
        '<i style="background:orange;width:15px;height:15px;display:inline-block;"></i> Other';

    return div;
};

legend.addTo(map);