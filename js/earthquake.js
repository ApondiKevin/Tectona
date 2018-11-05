var map;
//initMap() called when Google Maps API code is loaded - when web page is opened/refreshed 
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(2.8, -187.3), // Center Map. Set this to any location that you like
        mapTypeId: 'terrain' // can be any valid type
    });
    loadMap("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson");
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
            $.each(data.features, function (key, val) {
                // Get the lat and lng data for use in the markers
                var coords = val.geometry.coordinates;
                var latLng = new google.maps.LatLng(coords[1], coords[0]);
                // Now create a new marker on the map
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
            });
        }
    });
}

$(document).ready(function () {
    // Set Google map  to its start state
    initMap();
});

function processLink(magnitude, duration) {
    var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/" + magnitude + "_" + duration + ".geojson";
    initMap();
    loadMap(link);
}

$('li').click(function() {
    var magnitude = $(this).attr('class');
    var parent = $(this).closest('ul').attr('id');

    $('li').each(function(){
        if($(this).is('.active')) $(this).removeClass('active');
    });

    $(this).addClass('active');

    processLink(magnitude, parent);
});


