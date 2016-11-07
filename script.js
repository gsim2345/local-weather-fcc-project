$(document).ready(function () {
    /** Initializing material design for bootstrap */
    $.material.init();

    var temperatureF;
    var temperatureC;

    /** connecting weather-icons to the icons property getting from the weather API */
    var weatherIcons = {
        "clear-day": 'wi-day-sunny',
        'clear-night': 'wi-night-clear',
        'rain': 'wi-rain',
        'snow': 'wi-snow',
        'sleet': 'wi-sleet',
        'wind': 'wi-windy',
        'fog': 'wi-fog',
        'cloudy': 'wi-cloudy',
        'partly-cloudy-day': 'wi-day-cloudy',
        'partly-cloudy-night': 'wi-night-alt-cloudy'
    };

    /** function switching between Celsius and Farenheit */
    var toggleFC = function () {
        if ($('#toggleCF').prop('checked')) {
            $('.temperature').html(temperatureF + ' ℉');
        } else {
            $('.temperature').html(temperatureC + ' ℃');
        }
    };

    /**
     * function getting data from the weather API and displaying it on the screen
     * @param  {string} url - darksky.net API url with latitude and longitude
     * @return {[type]}     [description]
     */
    var fetchWeatherData = function (url) {
        $.ajax({
                url: url,
                dataType: 'jsonp'
            })
            .done(function (data) {
                var weather = data.currently.summary;
                var icon = data.currently.icon;
                temperatureF = data.currently.temperature;
                temperatureC = Math.round((temperatureF - 32) / 1.8 * 100) / 100; // getting Celsius from Farenheit
                $('.weatherDescription').html(weather);
                // if the weatherIcons object has the property the api provides as icon
                if (weatherIcons.hasOwnProperty(icon)) {
                    $('.weatherIcon').html('<i class="wi ' + weatherIcons[icon] + ' icon"></i>'); //display this icon
                } else {
                    $('.weatherIcon').html('<i class="wi wi-cloud icon"></i>'); // display a neutral icon
                }
                $('.temperature').html(temperatureC + ' ℃');
                $('#addon1').val(''); // reseting input field to empty
                $('#toggleCF').prop('checked', false); // reseting the toggle button to C

                $('.togglebutton').on('click', toggleFC);
            })
            .fail(function () {
                $('.weatherDescription').html('Failed to load weather data');
                $('.weatherIcon').html('<i class="wi wi-na icon"></i>');
                $('.temperature').html('<i class="wi wi-na" id="temp"></i>');
            });
    };






    /** preloader starts */
    $("#status").fadeIn();
    $("#preloader").fadeIn();

    /** getting data from the browsers geolocation API (latitude, longitude) */
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // preloader finishes:
            $("#status").fadeOut();
            $("#preloader").fadeOut();
            // getting data from google's geocode API to determine the city name from lat and long and dispay it
            $.ajax({
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '',
                    dataType: 'json'
                })
                .done(function (data) {
                    var city = data.results[0].address_components[2].long_name;
                    $('.city').html(city);
                })
                .fail(function () {
                    $('.city').html('Cannot load coordinates');
                });
            /** getting weather data from darksky.net API */
            var positionUrl = 'https://api.darksky.net/forecast/51c52962b36fc78232c5d78a3ba8e5e8/' + position.coords.latitude + ',' + position.coords.longitude + '?callback=?';
            fetchWeatherData(positionUrl);
        });

    } else {
        alert("Your browser doesn't support this feature.");
    }
    /** on clickin the search icon getting city name and the corresponding weather */
    $('.input-group-btn').on('click', function () {
        var cityName = $('#addon1').val(); // input value
        if (cityName === "") { // if nothing is written in the search field
            $('.city').html('');
            $('.weatherDescription').html('');
            $('.weatherIcon').html('<i class="wi wi-na icon"></i>');
            $('.temperature').html('<i class="wi wi-na" id="temp"></i>');
            $('.alert').removeClass('inactive'); // adding alert
        } else {
            $('.city').html(cityName);
            $('.alert').addClass('inactive'); // remove alert if there was from earlier.

        }
        /** getting the latitude and longitude of the city from input field */
        var cityURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '';
        $.ajax({
                url: cityURL,
                dataType: 'json'
            })
            .done(function(data) {
                if (data.status === "ZERO_RESULTS") { // if the city name does not exist.
                    $('.city').html('');
                    $('.weatherDescription').html('');
                    $('.weatherIcon').html('<i class="wi wi-na icon"></i>');
                    $('.temperature').html('<i class="wi wi-na" id="temp"></i>');
                    $('.alert').removeClass('inactive'); // adding alert
                    $('#addon1').val('');
                } else {
                    var cityLat = data.results[0].geometry.location.lat;
                    var cityLng = data.results[0].geometry.location.lng;
                    var cityurl = 'https://api.darksky.net/forecast/51c52962b36fc78232c5d78a3ba8e5e8/' + cityLat + ',' + cityLng + '?callback=?';
                    fetchWeatherData(cityurl);
                }
            })
            .fail(function () {
                $('.weatherDescription').html('Failed to load weather data');
                $('.weatherIcon').html('<i class="wi wi-na icon"></i>');
                $('.temperature').html('<i class="wi wi-na" id="temp"></i>');
            });

    }); // end of onclick
}); // document.ready
