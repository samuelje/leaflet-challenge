// Geojson URL
var url = "https://earthquake.usgs.gov/earthquakes/fehttps://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojsoned/v1.0/summary/all_week.geojson"

// CreateMap function
function createMap(response) {
   
    // Starting parameters for map
    var centerCoordinates = [37.0902, -110.7129];
    var mapZoom = 5;

    // Set up map object with options
    var myMap = L.map("map", {
        center: centerCoordinates,
        zoom: mapZoom
    });

    // Tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    }).addTo(myMap);

     // Create a GeoJSON layer containing the features array on the response object
     L.geoJSON(response, {

        // Create circle markers for each data point using pointToLayer function
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: magColor(feature.properties.mag),
                color: "#000",
                weight: 0.3,
                opacity: 0.5,
                fillOpacity: 1
            });
        },

        // Use onEachFeature function for each data point in array
        onEachFeature: onEachFeature
    }).addTo(myMap)

     // Bind pop ups to each layer
     function onEachFeature(feature, layer) {

        // Date formatter for pop up
        var format = d3.timeFormat("%d-%b-%Y at %H:%M");

        layer.bindPopup(`<strong>Place: </strong> ${feature.properties.place}<br><strong>Time: </strong>${format(new Date(feature.properties.time))}<br><strong>Magnitude: </strong>${feature.properties.mag}`);
    };

    // Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var magnitudes = [0, 1, 2, 3, 4, 5];
        var labels = [];
        var legendInfo = "<h5>Magnitude</h5>";

        div.innerHTML = legendInfo;

        // Loop through each magnitude for legend labels and colors
        for (var i = 0; i < magnitudes.length; i++) {
            labels.push('<li style="background-color:' + magColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');
        }

        // Add each label list to the div under the <ul> tag
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";

        return div;
    };

    // Add legend to map
    legend.addTo(myMap);

};

// Set markerSize function that will give each city a different marker radius for earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Color functions based on magnitude 
function magColor(magnitude) {
    if (magnitude <= 1) {
        return "#a7fb09"
    } else if (magnitude <= 2) {
        return "#dcf900"
    } else if (magnitude <= 3) {
        return "#f6de1a"
    } else if (magnitude <= 4) {
        return "#fbb92e"
    } else if (magnitude <= 5) {
        return "#faa35f"
    } else {
        return "#ff5967"
    }
};

// API call to the USGS earthquakes API to obtain earthquake data
d3.json(url, function(response) {

    // Call createMap with response.features
    createMap(response.features);

});