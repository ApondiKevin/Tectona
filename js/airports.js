var map;
//initMap() called when Google Maps API code is loaded - when web page is opened/refreshed 
function initMap() {
    map = new google.maps.Map(document.getElementById('airports_map'), {
        zoom: 2,
        center: new google.maps.LatLng(2.8, -187.3), // Center Map. Set this to any location that you like
        mapTypeId: 'terrain' // can be any valid type
    });
    loadMap('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson');
}

function loadMap(link) {
    // The following uses JQuery library
    $.ajax({
        // The URL of the specific data required
        url: link,

        // Called if there is a problem loading the data
        error: function () {
            console.log('no map loaded');
            $('#info').html('<p>An error has occurred</p>');
        },

        // Called when the data has succesfully loaded
        success: function (data) {
            var i = 0;
            console.log(data);
            var markers = [];
            $.each(data.features, function (key, val) {
                // Get the lat and lng data for use in the markers
                var coords = val.geometry.coordinates;
                var latLng = new google.maps.LatLng(coords[1], coords[0]);
                // Now create a new marker on the map
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
                markers[i++] = marker; //Add the marker to array to be used by clusters
                // Form a string that holds desired marker infoWindow content. The infoWindow will pop up when you click on a marker on the map
                var infowindow = new google.maps.InfoWindow({
                    content: "<h3>Name: " + val.properties.name + "</h3><h4>Type: " + val.properties.type +"<p><a href='" + val.properties.wikipedia + "'>Details</a></p>"
                });
                marker.addListener('click', function () {
                    infowindow.open(map, marker); // Open the Google maps marker infoWindow
                });
            });
            var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        }
    });
}

$(document).ready(function () {
    // Set Google map  to its start state
    initMap();
});



