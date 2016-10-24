$(document).ready(function() {
  // initializing material JS
  $.material.init();
  // getting data from the browsers geolocation API
  if("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
		console.log(position);
    var city;
    $.ajax({
      url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '',
      dataType: 'json'
    })
    .done(function(data) {
      city = data.results[0].address_components[2].long_name;
      console.log(city);
    });


    $.ajax({
      url: 'https://api.darksky.net/forecast/51c52962b36fc78232c5d78a3ba8e5e8/' + position.coords.latitude + ',' + position.coords.longitude + '?callback=?',
      dataType: 'jsonp'
    })
    .done(function(data) {
      console.log(data);
    });
	});
  }

});
