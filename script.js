$(document).ready(function() {
  // initializing material JS
  $.material.init();
  // getting data from the browsers geolocation API
  if("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
		console.log(position);

    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '',
      dataType: 'json'
    })
    .done(function(data) {
      var city = data.results[0].address_components[2].long_name;
      $('.city').html(city);

    });


    $.ajax({
      url: 'https://api.darksky.net/forecast/51c52962b36fc78232c5d78a3ba8e5e8/' + position.coords.latitude + ',' + position.coords.longitude + '?callback=?',
      dataType: 'jsonp'
    })
    .done(function(data) {
      console.log(data.currently);
      var weather = data.currently.summary;
      var icon = data.currently.icon;
      $('.weatherDescription').html(weather);
      $('.weatherIcon').html(icon);
      var temperatureF = data.currently.temperature;
      $('.temperature').html(temperatureF + ' ℉');
      console.log(temperatureF.toString());
    });
	});
  }

});
