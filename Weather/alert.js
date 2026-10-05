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