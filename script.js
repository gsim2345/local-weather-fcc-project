$(document).ready(function() {
  // initializing material JS
  $.material.init();

  var temperatureF;
  var temperatureC;

  //connecting weather-icons to the icons property getting from the weather API
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

  // function getting data from the weather API and displaying it on the screen
  var weatherData = function(url) {
    $.ajax({
      url: url,
      dataType: 'jsonp'
    })
    .done(function(data) {
      console.log(data);
      var weather = data.currently.summary;
      var icon = data.currently.icon;
      temperatureF = data.currently.temperature;
      // getting Celsius from Farenheit:
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
      $('#addon1').val('');
    });
  };

  // preloader starts
  $("#status").fadeIn();
  $("#preloader").fadeIn();


  // getting data from the browsers geolocation API (latitude, longitude)
  if('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
    // preloader finishes:
    $("#status").fadeOut();
    $("#preloader").fadeOut();
    // getting data from google's geocode API to determine the city name from lat and long and dispay it
    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '',
      dataType: 'json'
    })
    .done(function(data) {
      var city = data.results[0].address_components[2].long_name;
      $('.city').html(city);

    });

    // getting weather data from darksky.net API
    var positionUrl = 'https://api.darksky.net/forecast/51c52962b36fc78232c5d78a3ba8e5e8/' + position.coords.latitude + ',' + position.coords.longitude + '?callback=?';
    weatherData(positionUrl);
	  });
    }

    // on click on the search icon getting city name and the corresponding weather
    $('.input-group-btn').on('click', function() {
      console.log($('#addon1').val());
      var cityName = $('#addon1').val();
      if (cityName === "") {
          console.log('Please write a city name');
          $('.city').html('');
          $('.weatherDescription').html('');
          $('.weatherIcon').html('<i class="wi wi-na icon"></i>');
          $('.temperature').html('<i class="wi wi-na"></i>');
          // adding alert 
          $('.alert').removeClass('inactive');
      } else {
          $('.city').html(cityName);
          // remove alert if there was from earlier.
          $('.alert').addClass('inactive');

      }

      // getting the latitude and longitude of the city from input field
      var cityURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '';
      $.ajax({
        url: cityURL,
        dataType: 'json'
      })
      .done(function(data) {
        console.log(data);
        if (data.status === "ZERO_RESULTS") {
          console.log('Please write an existing city name');
          $('.city').html('');
        } else {
          var cityLat = data.results[0].geometry.location.lat;
          var cityLng = data.results[0].geometry.location.lng;
          var cityurl = 'https://api.darksky.net/forecast/51c52962b36fc78232c5d78a3ba8e5e8/' + cityLat + ',' + cityLng + '?callback=?';
          weatherData(cityurl);
        }

      });

  //$.ajax({
  //  url: 'http://api.sunrise-sunset.org/json?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude + '&date=today',
  //  dataType: 'json'
  //})
  //.done(function(data) {
  //  console.log(data);
  //});


  // togglebutton switching between Celsius and Farenheit
  $('.togglebutton').click(function() {
    if ($('#toggleCF').prop('checked')) {
      $('.temperature').html(temperatureF + ' ℉');
      } else {
      $('.temperature').html(temperatureC + ' ℃');
      }
    });




  }); // if('geolocation' in navigator)


}); // document.ready
