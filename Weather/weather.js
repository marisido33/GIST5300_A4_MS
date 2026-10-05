var map = L.map("weathermap").setView([38, -95], 4);

L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 17,
        attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap'
    }
).addTo(map);


L.tileLayer.wms(
    "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi",
    {
        layers: "nexrad-n0r-900913",
        format: "image/png",
        transparent: true
    }
).addTo(map);
map.on("click", function(e) {

    L.popup()
        .setLatLng(e.latlng)
        .setContent(
            "Latitude: " +
            e.latlng.lat.toFixed(2) +
            "<br>Longitude: " +
            e.latlng.lng.toFixed(2)
        )
        .openOn(map);

});
