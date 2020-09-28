/* Maintenance page code */

// Getting scooter data
let scooterData = [];
var userLocation;
locateUser();
function getData() {
  let url = "https://api.flamingoscooters.com/weka/feed.json";

  fetch(url).then(function (response) {
    response.json().then(function (data) {
      scooterData = data.data;
      locateUser(); // find user again when map is redraw
      updateDistance(); // update dist property of each scooter
      populateDropdown(scooterData); // fill out the dropdown with the data;
    });
  });
}

function populateDropdown(data) {
  const scooterIDs = document.getElementById("scooterIDInput");
  data.forEach((scooter) => {
    var option = document.createElement("option");
    option.innerText = "ID: " + scooter.registration;
    option.value = scooter.registration;
    scooterIDs.appendChild(option);
  });
}

/* Adds a dist property to each scooter, where dist is the distance from the user's location to that scooter.
 */
function updateDistance() {
  // Add dist property to each scooter to get distance from current user location.
  for (var i = 0; i < scooterData.length; i++) {
    // First, user and scooter location have to be converted to markers to be compared using leaflet.
    var userMarker = L.circleMarker([
      userLocation.latitude,
      userLocation.longitude,
    ]);

    // For testing purposes; a marker with hardcoded location.
    // var userMarker = L.circleMarker([-41.28664, 174.7757]);

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
    userLocation = crd;
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

// Get and load data
getData();

// Popup for selected scooter
function getScooterInfo() {
  const scooterInfo = document.getElementById("scooterInfo");
  scooterInfo.innerHTML = "";
  scooterInfo.innerHTML = `<iframe id="popUp" onload="getPopUpData(${findIndexByRegistration(
    document.getElementById("scooterIDInput").value
  )})" src="scooter_info.html"></iframe>`;
}

function openHatch() {
  fetch("https://api.flamingoscooters.com/weka/battery", {
    method: "post",
  }).then(getScooterInfo());
}

function findIndexByRegistration(rego) {
  for (var i = 0; i < scooterData.length; i++) {
    if (scooterData[i].registration == rego) {
      return i;
    }
  }
}

/* Display data about scooter inside Leaflet popup.
Is passed the index of the scooter/marker in the scooterData array. */
function getPopUpData(index) {
  var iFrame = document.getElementById("popUp");

  // ID
  var scooterID = iFrame.contentWindow.document.getElementById("scooterID");
  scooterID.innerHTML = scooterData[index].registration;

  // Battery
  var scooterBattery = iFrame.contentWindow.document.getElementById(
    "scooterBattery"
  );
  scooterBattery.innerHTML =
    Math.round(scooterData[index].batteryPercent * 100) + "%";

  // Status
  var scooterStatus = iFrame.contentWindow.document.getElementById(
    "scooterStatus"
  );
  scooterStatus.innerHTML = scooterData[index].status;

  // Model
  var scooterModel = iFrame.contentWindow.document.getElementById(
    "scooterModel"
  );
  scooterModel.innerHTML = scooterData[index].model;

  // Distance
  var scooterDistance = iFrame.contentWindow.document.getElementById(
    "scooterDistance"
  );
  scooterDistance.innerHTML = Math.round(scooterData[index].dist) + "m";
}

const openHatchBtn = document.getElementById("openHatchBtn");
openHatchBtn.addEventListener("click", openHatch);
