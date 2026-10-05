// Earthquakes from USGS

$.getJSON(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
    function(data) {

        L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {

                var magnitude = feature.properties.mag || 0;

                return L.circleMarker(latlng, {
                    radius: magnitude * 3,
                    fillColor: "yellow",
                    color: "black",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });

            },

            onEachFeature: function(feature, layer) {

                layer.bindPopup(
                    "<b>Magnitude:</b> " + feature.properties.mag +
                    "<br><b>Location:</b> " + feature.properties.place
                );

            }

        }).addTo(map);

    }
);