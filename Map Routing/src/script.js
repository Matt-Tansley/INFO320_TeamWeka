// Variables
var scooterData = [];
var markerList = [];
var route = [];
const maxSize = 10;

var userLocation;

// Customer icon to indicate where user is.
const userIcon = L.icon({
  iconUrl: "male-solid.svg",
  iconSize: [16],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

// Map code
var mymap = L.map("mymap").setView([-41.28666552, 174.772996908], 13);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiY3J1bmNoeXBhbmNha2VzIiwiYSI6ImNrM25temk0YzFzMjMzcHM3bWdocXZuOXgifQ.m6zMp4CxLPXi5xp-zB1kkg",
  }
).addTo(mymap);

/* Getting data from API */
function getData() {
  console.log("Get data called");
  let url = "https://api.flamingoscooters.com/weka/feed.json";

  fetch(url).then(function (response) {
    response.json().then(function (data) {
      scooterData = data.data;
      console.log(scooterData);
      // displayMarkers();
    });
  });
}

function displayMarkers() {
  for (var i = 0; i < scooterData.length; i++) {
    let marker = L.marker([
      scooterData[i].latitude,
      scooterData[i].longitude,
    ]).addTo(mymap);
    markerList.push(marker);
  }
}

// Leaflet Routing Machine
// L.Routing.control({
//   waypoints: [
//     L.latLng(-41.28666552, 174.772996908),
//     L.latLng(-41.28766552, 174.772996908),
//   ],
//   routeWhileDragging: true,
// }).addTo(mymap);

// L.Routing.Itinerary.hide();

/* Find route to replace batteries on scooters 
Currently finds 10 closest scooters. 
*/

/* Find what scooters should be part of the route */
function findWaypoints() {
  // Sort scooter list by current range smallest to largest.
  scooterData.sort(function (a, b) {
    return a.current_range_meters - b.current_range_meters;
  });

  // Get the maxSize (10) closest scooters.
  route = [];
  for (var i = 0; i < maxSize; i++) {
    route.push(scooterData[i]);
  }

  // Show the closest scooters to the user as a list.
  var routeList = document.getElementById("routeList");
  routeList.innerHTML = "";
  for (var i = 0; i < route.length; i++) {
    routeList.innerHTML += `<li>Scooter ID: ${route[i].bike_id}, Current Range: ${route[i].current_range_meters}</li>`;
  }

  // Display the closest scooters on the map.
  displayRoute(route);
}

function findRoute() {
  const metric = document.querySelector('input[name="metric"]:checked').value;

  console.log(metric);

  if (metric === "distance") {
    findDistanceRoute();
  } else if (metric == "range") {
    findRangeRoute();
  } else {
    errorMessage("No metric selected");
  }
}

var scooterDataDistance = [];
/* Finds distance between user and each scooter, then provides a 
route for the user to take to get to the maxSize closest scooters*/
function findDistanceRoute() {
  for (var i = 0; i < scooterData.length; i++) {
    // First, user and scooter location have to be converted to markers to be compared using leaflet.
    var userMarker = L.circleMarker([
      userLocation.latitude,
      userLocation.longitude,
    ]);
    var scooterMarker = L.circleMarker([
      scooterData[i].latitude,
      scooterData[i].longitude,
    ]);

    // Then extract coordinates from markers.
    var from = userMarker.getLatLng();
    var to = scooterMarker.getLatLng();

    // Get distance between each marker in meters.
    var distance = from.distanceTo(to);
    // Create object with scooterData plus distance from user.
    var scooterDistance = { scooter: scooterData[i], dist: distance };

    // Add new object to the array.
    scooterDataDistance.push(scooterDistance);
  }
  // After loop.
  // Sort scooter list by current range smallest to largest.
  scooterDataDistance.sort(function (a, b) {
    return a.dist - b.dist;
  });

  // Get the maxSize closest scooters.
  route = [];
  for (var i = 0; i < maxSize; i++) {
    route.push(scooterDataDistance[i]);
  }

  // Display the route on the map.
  displayRoute(route);
}

var scooterDataRange = [];
function findRangeRoute() {
  for (var i = 0; i < scooterData.length; i++) {}

  console.log(scooterDataRange);
}

/* Visualises route on map given a list of waypoints. 
Expects to be passed an array of points. */
function displayRoute(points) {
  console.log(points);

  var pointsLatLon = [];

  // Loop to extract the lat and lon from each point.
  for (var i = 0; i < points.length; i++) {
    pointsLatLon.push(
      L.latLng(points[i].scooter.latitude, points[i].scooter.longitude)
    );
  }

  L.Routing.control({
    waypoints: pointsLatLon,
    routeWhileDragging: true,
  }).addTo(mymap);
}

// Code to locate user
// First, find coordinates through geolocation.
function locateUser() {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    L.marker([crd.latitude, crd.longitude], { icon: userIcon }).addTo(mymap);
    userLocation = crd;
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

/* General error function */
function errorMessage(message) {
  console.warn(`ERROR: ${message}`);
}

// Event listners
getData();
locateUser();

var button = document.getElementById("button");
button.addEventListener("click", findRoute);
