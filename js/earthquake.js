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
            var i = 0;
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
                    content: "<h3>" + val.properties.title + "</h3><p><a href='" + val.properties.url + "'>Details</a></p>"
                });
                marker.addListener('click', function () {
                    // We use the lat and lon as the parameters in the API call to weather service
                    var lat = marker.position.lat();
                    var lng = marker.position.lng();
                    // You need to use the FREE signup at https://www.apixu.com/ to get a key for the Weather URL below
                    theURL = 'http://api.apixu.com/v1/current.json?key=23a39b6c08e84cbbbd662710181709&q=' + lat.toFixed(4) + ',' + lng.toFixed(4);
                    $.ajax({
                        url: theURL,
                        success: function (data) {
                            console.log(data);
                            image = new Image();
                            $('.sub-nav').append('<div class="weather-card"><div id="weatherImage"></div><div id="weatherInfo"></div><div id="wind_dir"></div></div>')
                            if (data.error) {
                                image.src = "http://via.placeholder.com/64x64?text=%20"; // Error, so we use blank image for weather. See 'error:' below for another way to include a small blank image
                            }
                            else {
                                image.src = "http:" + data.current.condition.icon; // icon is specified within the data

                                $('#weatherInfo').html('<p>' + data.current.condition.text + '</p>'); // current weather in text format
                                $('#wind_dir').html('<p>Wind Direction: ' + data.current.wind_dir + '</p>');
                            }
                            image.onload = function () {
                                $('#weatherImage').empty().append(image);
                            };

                        },
                        error: function () { // Weather service could not provide weather for requested lat,lon world location
                            image = new Image();
                            // A local 64*64 transparent image. Generated from the useful site: http://png-pixel.com/
                            image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAPElEQVR42u3OMQEAAAgDIJfc6BpjDyQgt1MVAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBgXbgARTAX8ECcrkoAAAAAElFTkSuQmCC";
                            image.onload = function () {
                                //set the image into the web page
                                $('#weatherImage').empty().append(image);
                            };
                        }
                    });
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

function processLink(magnitude, duration) {
    var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/" + magnitude + "_" + duration + ".geojson";
    initMap();
    loadMap(link);
}

$('.details-nav li').click(function() {
    var magnitude = $(this).attr('class');
    var parent = $(this).closest('ul').attr('id');

    $('.details-nav li').each(function(){
        if($(this).is('.active')) $(this).removeClass('active');
    });

    $(this).addClass('active');

    processLink(magnitude, parent);
});


