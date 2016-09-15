var GeoLocation = require("FuseJS/GeoLocation");
var Observable = require('FuseJS/Observable');
var Bundle = require("FuseJS/Bundle");
var colorSchemes = JSON.parse(Bundle.readSync("colorSchemes.json"));

var lat, lon;
var timeoutMs = 5000;
var displayContent = Observable(false);
var location = Observable(),
    temperature = Observable(),
    summary = Observable(),
    background = Observable(),
    icon = Observable(),
    iconColor = Observable(),
    textColor = Observable();

// GET GPS location store latitude and longtitude
GeoLocation.getLocation(timeoutMs).then(function(coordinates) {
  lat = coordinates.latitude;
  lon = coordinates.longitude;
  var getCityName = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&sensor=true";
  var getWeather = "https://api.forecast.io/forecast/4fc9c5c879c5ea04dfb7d5fc956a88cd/" + lat + "," + lon + "?units=si";
  
  // Fetch weather data from server, store data to variables
  fetch(getWeather, {
      method: 'GET'
  }).then(function(response) {
      return response.json();
  }).then(function(responseObject) {
    
      //Store data to Variables
      temperature.value = Math.round(responseObject.currently.temperature);
      summary.value = responseObject.currently.summary;
      background.value = colorSchemes[responseObject.currently.icon].background;
      icon.value = colorSchemes[responseObject.currently.icon].icon;
      iconColor.value = colorSchemes[responseObject.currently.icon].iconColor;
      textColor.value = colorSchemes[responseObject.currently.icon].textColor
      
      // GET name of the location by GOOGLE Maps API (city name / country)
      fetch(getCityName, {
          method: 'GET'
      }).then(function(response) {
          return response.json();
      }).then(function(responseObject) {
          location.value = responseObject.results[0].address_components[3].long_name;
          // Now, i can display content to the user by enabling the hidden page and hide the loading page
          displayContent.value = true;
      });
  });
});

module.exports = {
  displayContent: displayContent,
  location: location,
  temperature: temperature,
  summary: summary,
  background: background,
  icon: icon,
  iconColor: iconColor,
  textColor: textColor
};