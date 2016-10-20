$(document).ready(function() {
  $.ajax({
    url: 'https://api.darksky.net/forecast/51c52962b36fc78232c5d78a3ba8e5e8/37.8267,-122.4233?callback=?',
    dataType: 'jsonp'
  })
  .done(function(data) {
    console.log(data);
  });
});
