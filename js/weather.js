$(".lat-lng button").click(function () {
    console.log('clicked');
    var lat = parseFloat($("#lat").val());
    var lng = parseFloat($("#lng").val());
    theURL = 'http://api.apixu.com/v1/current.json?key=23a39b6c08e84cbbbd662710181709&q=' + lat.toFixed(4) + ',' + lng.toFixed(4);

    // var lat = -1.28333;
    // var lng = 36.81667;
    getData(theURL);
})

$(".location button").click(function () {
    console.log('clicked');
    var location = $("#loc").val();
    theURL = 'http://api.apixu.com/v1/current.json?key=23a39b6c08e84cbbbd662710181709&q=' + location;

    getData(theURL);
})

function getData(theURL) {
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
                
                $('#weather-title-text').html(data.location.name + ' - ' + data.location.region + ', ' + data.location.country);
                $('.weather-supporting-text').html('<p> Local time: ' + data.location.localtime + '</p>' +
                '<p> Weather summary: ' + data.current.condition.text + '</p>' +
                '<p>Wind Direction: ' + data.current.wind_dir + '</p>' +
                '<p>Temperature (Celcius): ' + data.current.temp_c + '</p>' + 
                '<p>Humidity: ' + data.current.humidity + '</p>'                
                ); // current weather in text format
            }
            image.onload = function () {
                $('#weather-image').empty().append(image);
            };

        },
        error: function () { // Weather service could not provide weather for requested lat,lon world location
            image = new Image();
            // A local 64*64 transparent image. Generated from the useful site: http://png-pixel.com/
            image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAPElEQVR42u3OMQEAAAgDIJfc6BpjDyQgt1MVAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBgXbgARTAX8ECcrkoAAAAAElFTkSuQmCC";
            image.onload = function () {
                //set the image into the web page
                $('#weather-image').empty().append(image);
            };
        }
    });
}