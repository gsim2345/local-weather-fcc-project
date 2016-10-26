$(document).ready(function() {
  // initializing material JS
  $.material.init();
  //$( "div" ).effect( "slide", 800 );

  //connecting weather-icons to the icons property from the weather API
  var weatherIcons = {
    'clear-day': 'wi-day-sunny',
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

  var temperatureF;
  var temperatureC;

  // getting data from the browsers geolocation API (latitude, longitude)
  if("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
		// getting data from google's geocode API to determine the place from lat and long
    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '',
      dataType: 'json'
    })
    .done(function(data) {
      var city = data.results[0].address_components[2].long_name;
      $('.city').html(city);
    });


    // getting weather data from darksky.net API
    $.ajax({
      url: 'https://api.darksky.net/forecast/51c52962b36fc78232c5d78a3ba8e5e8/' + position.coords.latitude + ',' + position.coords.longitude + '?callback=?',
      dataType: 'jsonp'
    })
    .done(function(data) {
      console.log(data.currently);
      var weather = data.currently.summary;
      var icon = data.currently.icon;
      temperatureF = data.currently.temperature;
      // getting Celsius from Farenheit
      temperatureC = Math.round((temperatureF - 32)/1.8 * 100)/100;

      $('.weatherDescription').html(weather);
      // if the weatherIcons object has the property the api provides as icon
      if (weatherIcons.hasOwnProperty(icon) ) {
        //display this icon
        $('.weatherIcon').html('<i class="wi ' + weatherIcons[icon] + ' icon"></i>');
      } else {
        // display a neutral icon
        $('.weatherIcon').html('<i class="wi wi-cloud icon"></i>');
      }
      $('.temperature').html(temperatureC + ' ℃');

    });
	});
  }


  // togglebutton switching between Celsius and Farenheit
  $('.togglebutton').click(function() {

    if ($('#toggleCF').prop('checked')) {
      $('.temperature').html(temperatureF + ' ℉');
    } else {
      $('.temperature').html(temperatureC + ' ℃');
    }

  });


});
