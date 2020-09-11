// Sidebar Nav code
function openNav() {
  document.getElementById("sidebar").style.width = "70vw";
  document.getElementById("opaque").style.display = "block";

  const map = document.getElementById("map");
  if (map != null) {
    map.style.zIndex = "-1";
  }
}
const openBtn = document.getElementById("openBtn");
openBtn.addEventListener("click", openNav);

function closeNav() {
  document.getElementById("sidebar").style.width = "0";
  setTimeout(function () {
    const map = document.getElementById("map");
    if (map != null) {
      map.style.zIndex = "0";
    }
  }, 500);
  document.getElementById("opaque").style.display = "none";
}
const closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", closeNav);

// Login validation
function validate(form) {
  if (form.email.value == "test" && form.password.value == "123") {
    window.location.href = "main.html";
  } else {
    alert("Email or Password is invalid");
  }
}

// Route/ locate options
// Get locate options button
const locateOptionsBtn = document.getElementById("locateOptionsBtn");
// Get the modal
const locateOptionsModal = document.getElementById("locateOptionsModal");
// Get the done button
const locateOptionsDone = document.getElementById("locateOptionsDone");

// Open modal
locateOptionsBtn.onclick = function () {
  locateOptionsModal.style.display = "flex";
};

// Close model on outside click
window.onclick = function (e) {
  if (e.target == locateOptionsModal) {
    locateOptionsModal.style.display = "none";
  }
};

// Close modal on done click
locateOptionsDone.onclick = function (e) {
  locateOptionsModal.style.display = "none";
};

// Getting data from Flamingo Public API
// let scooterData = [];

// function getData() {
//     console.log("Getting old data")
//     let url =
//         "http://api.flamingoscooters.com/gbfs/wellington/free_bike_status.json";

//     fetch(url).then(function(response) {
//         response.json().then(function(data) {
//             scooterData = data.data.bikes;
//         });
//     });
// }

// Getting data from updated Flamingo API
let scooterData = [];

function getData() {
  let url = "https://api.flamingoscooters.com/weka/feed.json";

  fetch(url).then(function (response) {
    response.json().then(function (data) {
      scooterData = data.data;
      displayMarkers();
    });
  });
}

// Base Leaflet / Map code
var map = L.map("map").setView([-41.28664, 174.7757], 13);
var layerGroup = L.layerGroup().addTo(map); // contains markers for map

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 24,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiY3J1bmNoeXBhbmNha2VzIiwiYSI6ImNrM25temk0YzFzMjMzcHM3bWdocXZuOXgifQ.m6zMp4CxLPXi5xp-zB1kkg",
  }
).addTo(map);

// Markers on the map code
var markerList = []; // array of markers so they can accssed throughout the code.

/* Creates a marker for each scooter.
Adds all the markers to a markerClusterGroup so that they will 'cluster'. */
function displayMarkers() {
  // Reset arrays
  markerList = [];
  layerGroup.clearLayers();

  let markerCluster = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
  for (var i = 0; i < scooterData.length; i++) {
    let marker = L.marker([scooterData[i].latitude, scooterData[i].longitude], {
      icon: getIcon(scooterData[i]),
    });
    markerCluster.addLayer(marker);
    markerList.push(marker);
  }
  layerGroup.addLayer(markerCluster);
  createMarkerPopups();
}

/* Creates popups for each marker */
function createMarkerPopups() {
  markerList.forEach(function (marker) {
    marker.on("click", function () {
      // Index used to find the scooter the marker is associated with.
      var index = markerList.indexOf(marker);

      // Create an iframe html element to display the scooter data.
      // id="popUp" is important so JS can find the iframe.
      // onload="getPopUpData(${index})" is called so the right data for this scooter can be displayed.
      let output = `<iframe id="popUp" onload="getPopUpData(${index})" src="scooter_info.html"></iframe>`;

      // Finally, bind the output with this marker.
      marker.bindPopup(output);
    });
  });
}

/* Display data about scooter inside Leaflet popup.
Is passed the index of the scooter/marker in the scooterData array. */
function getPopUpData(index) {
  var iFrame = document.getElementById("popUp");

  var scooterID = iFrame.contentWindow.document.getElementById("scooterID");
  scooterID.innerHTML = scooterData[index].registration;

  // var scooterRange = iFrame.contentWindow.document.getElementById("scooterRange");
  // scooterRange.innerHTML = old_scooterData[index].current_range_meters + "m";

  var scooterStatus = iFrame.contentWindow.document.getElementById(
    "scooterStatus"
  );
  scooterStatus.innerHTML = scooterData[index].status;

  var scooterBattery = iFrame.contentWindow.document.getElementById(
    "scooterBattery"
  );
  scooterBattery.innerHTML = scooterData[index].batteryPercent * 100 + "%";
}

// Open popup for locate button code
function openPopup() {
  document.getElementById("nearby").style.height = "60vw";

  const map = document.getElementById("map");
  const locateBtn = document.getElementById("locateBtn");

  if (map != null) {
    map.style.zIndex = "-1";
    locateBtn.style.zIndex = "-1";
  }
}

function closePopup() {
  document.getElementById("nearby").style.height = "0";
  setTimeout(function () {
    const map = document.getElementById("map");
    const locateBtn = document.getElementById("locateBtn");

    if (map != null) {
      map.style.zIndex = "0";
      locateBtn.style.zIndex = "1";
    }
  }, 500);
}

// Clsose popup for locate button code
function closePopup() {
  document.getElementById("nearby").style.height = "0";
  setTimeout(function () {
    const map = document.getElementById("map");
    const locateBtn = document.getElementById("locateBtn");

    if (map != null) {
      map.style.zIndex = "0";
      locateBtn.style.zIndex = "1";
    }
  }, 500);
}

/* Custom icons for map */
const iconSize = 20;
// Custom icon to indicate where user is.
const userIcon = L.icon({
  iconUrl: "resources/male-solid.svg",
  iconSize: [iconSize],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

// Custom battery icons for scooters on map
batteryFull = L.icon({
  iconUrl: "resources/battery-full-solid.svg",
  iconSize: [iconSize],
});
batteryThreeQuarter = L.icon({
  iconUrl: "resources/battery-three-quarters-solid.svg",
  iconSize: [iconSize],
});
batteryHalf = L.icon({
  iconUrl: "resources/battery-half-solid.svg",
  iconSize: [iconSize],
});
batteryQuarter = L.icon({
  iconUrl: "resources/battery-quarter-solid.svg",
  iconSize: [iconSize],
});
batteryEmpty = L.icon({
  iconUrl: "resources/battery-empty-solid.svg",
  iconSize: [iconSize],
});

// Custom status icons for scooters on map
statusAvailable = L.icon({
  iconUrl: "resources/check-circle-solid.svg",
  iconSize: [iconSize],
});
statusUnavailable = L.icon({
  iconUrl: "resources/times-circle-solid.svg",
  iconSize: [iconSize],
});
statusInuse = L.icon({
  iconUrl: "resources/sync-alt-solid.svg",
  iconSize: [iconSize],
});
statusMaintenance = L.icon({
  iconUrl: "resources/wrench-solid.svg",
  iconSize: [iconSize],
});

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

// Event listener for changing display icons
const iconRadios = document.querySelectorAll('input[name="displayIcon"]');
var prevIconRadio = null;
for (var i = 0; i < iconRadios.length; i++) {
  iconRadios[i].addEventListener("change", function () {
    prevIconRadio ? console.log(prevIconRadio.value) : null;
    if (this !== prevIconRadio) {
      prevIconRadio = this;
    }
    console.log(this.value);

    getData();
  });
}

// Event listeners
window.addEventListener("onload", getData());
