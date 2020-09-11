// Variables
var scooterData = [];
var markerList = [];
var route = [];
const maxSize = 10;

var userLocation;

var routingControl = null; // Keep track of routingControl

// Custom icon to indicate where user is.
const userIcon = L.icon({
  iconUrl: "resources/male-solid.svg",
  iconSize: [16],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

// Custom battery icons for scooters on map
batteryFull = L.icon({
  iconUrl: "resources/battery-full-solid.svg",
  iconSize: [16],
});

batteryThreeQuarter = L.icon({
  iconUrl: "resources/battery-three-quarters-solid.svg",
  iconSize: [16],
});

batteryHalf = L.icon({
  iconUrl: "resources/battery-half-solid.svg",
  iconSize: [16],
});

batteryQuarter = L.icon({
  iconUrl: "resources/battery-quarter-solid.svg",
  iconSize: [16],
});

batteryEmpty = L.icon({
  iconUrl: "resources/battery-empty-solid.svg",
  iconSize: [16],
});

// Custom status icons for scooters on map
statusAvailable = L.icon({
  iconUrl: "resources/check-circle-solid.svg",
  iconSize: [16],
});

statusUnavailable = L.icon({
  iconUrl: "resources/times-circle-solid.svg",
  iconSize: [16],
});

statusInuse = L.icon({
  iconUrl: "resources/sync-alt-solid.svg",
  iconSize: [16],
});

statusMaintenance = L.icon({
  iconUrl: "resources/wrench-solid.svg",
  iconSize: [16],
});

// Map code
// Set up map, centering on Wellington.
var mymap = L.map("mymap").setView([-41.28666552, 174.772996908], 13);
var layerGroup = L.layerGroup().addTo(mymap); // contains markers for map

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
      displayMarkers();
    });
  });
}

/* Display a marker for each scooter. */
function displayMarkers() {
  // Empty the markers array
  markerList = [];
  layerGroup.clearLayers();

  for (var i = 0; i < scooterData.length; i++) {
    let marker = L.marker([scooterData[i].latitude, scooterData[i].longitude], {
      icon: getIcon(scooterData[i]),
    }).addTo(layerGroup);
    markerList.push(marker);
  }
}

/* Determine the type of icon to display for this scooter */
function getIcon(scooter) {
  const displayIcon = document.querySelector(
    'input[name="displayIcon"]:checked'
  ).value;

  if (displayIcon == "battery") {
    return getBatteryIcon(scooter.batteryPercent);
  } else if (displayIcon == "status") {
    return getStatusIcon(scooter.status);
  } else {
    errorMessage("No display selected");
  }
}

/* Return the correct icon for a scooter based on it's battery percent. */
function getBatteryIcon(percent) {
  if (percent < 0.15) {
    // Below 15% is the level at which a scooter becomes unavailable to hire.
    return batteryEmpty;
  } else if (percent <= 0.25) {
    return batteryQuarter;
  } else if (percent <= 0.5) {
    return batteryHalf;
  } else if (percent <= 0.75) {
    return batteryThreeQuarter;
  } else {
    return batteryFull;
  }
}

function getStatusIcon(status) {
  if (status == "INUSE") {
    return statusInuse;
  } else if (status == "AVAILABLE") {
    return statusAvailable;
  } else if (status == "UNAVAILABLE") {
    return statusUnavailable;
  } else if (status == "MAINTENANCE") {
    return statusMaintenance;
  }
}

/* Find what scooters should be part of the route */
function findRoute() {
  // Remove the previous route, if it existed.
  if (routingControl != null) {
    mymap.removeControl(routingControl);
  }
  // removeRoutingControl();

  // What are we basing the search on.
  const metric = document.querySelector('input[name="metric"]:checked').value;

  if (metric === "distance") {
    findDistanceRoute();
  } else if (metric == "battery") {
    findBatteryRoute();
  } else {
    errorMessage("No metric selected");
  }
}

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

    // Add dist property to each scooter, where dist is distance from user as this function is executed.
    scooterData[i].dist = distance;
  }
  // After loop.
  // Sort scooter list by dist smallest to largest.
  scooterData.sort(function (a, b) {
    return a.dist - b.dist;
  });

  // Get the maxSize closest scooters.
  route = [];
  for (var i = 0; i < maxSize; i++) {
    route.push(scooterData[i]);
  }

  // Display the route on the map.
  displayRoute(route);
}

/* Gets battery percentage for each scooter, then provides a 
route for the user to take to get to the maxSize closest scooters*/
function findBatteryRoute() {
  // Sort scooter list by battery percentage smallest to largest.
  scooterData.sort(function (a, b) {
    return a.batteryPercent - b.batteryPercent;
  });

  // Get the maxSize scooters with lowest battery percentage.
  route = [];
  for (var i = 0; i < maxSize; i++) {
    route.push(scooterData[i]);
  }

  // Display the route on the map.
  displayRoute(route);
}

/* Visualises route on map given a list of waypoints. 
Expects to be passed an array of points. */
function displayRoute(points) {
  console.log(points);

  var pointsLatLon = [];

  // Loop to extract the lat and lon from each point.
  for (var i = 0; i < points.length; i++) {
    pointsLatLon.push(L.latLng(points[i].latitude, points[i].longitude));
  }

  routingControl = L.Routing.control({
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

var redisplayButton = document.getElementById("redisplayButton");
redisplayButton.addEventListener("click", getData);
