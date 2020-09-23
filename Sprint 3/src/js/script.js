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
    setTimeout(function() {
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
locateOptionsBtn.onclick = function() {
    locateOptionsModal.style.display = "flex";
};

// Close model on outside click
window.onclick = function(e) {
    if (e.target == locateOptionsModal) {
        locateOptionsModal.style.display = "none";
    }
};

// Close modal on done click
locateOptionsDone.onclick = function(e) {
    locateOptionsModal.style.display = "none";
};

// Getting data from updated Flamingo API / starting map code.
let scooterData = [];
var userLocation;
locateUser(); // intial locate user call
const maxSize = 10; // Maximum size for a route.
var routingControl = null; // Keep track of routingControl

function getData() {
    let url = "https://api.flamingoscooters.com/weka/feed.json";

    fetch(url).then(function(response) {
        response.json().then(function(data) {
            scooterData = data.data;
            locateUser(); // find user again when map is redraw
            displayMarkers();
        });
    });
}

// Base Leaflet / Map code
var map = L.map("map").setView([-41.28664, 174.7757], 13);
var layerGroup = L.layerGroup().addTo(map); // contains markers for map

L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 24,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoiY3J1bmNoeXBhbmNha2VzIiwiYSI6ImNrM25temk0YzFzMjMzcHM3bWdocXZuOXgifQ.m6zMp4CxLPXi5xp-zB1kkg",
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

    console.log(userLocation);
    var userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
        icon: userIcon,
    }).addTo(layerGroup);
}

/* Creates popups for each marker */
function createMarkerPopups() {
    markerList.forEach(function(marker) {
        marker.on("click", function() {
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

    map = document.getElementById("map");
    const locateBtn = document.getElementById("locateBtn");
    const locateOptionsBtn = document.getElementById("locateOptionsBtn");
    const locateOptionsModal = document.getElementById("locateOptionsModal");


    if (map != null) {
        map.style.zIndex = "-1";
        locateBtn.style.zIndex = "-1";
        locateOptionsBtn.style.zIndex = "-1";

    }
}

// Clsose popup for locate button code
function closePopup() {
    document.getElementById("nearby").style.height = "0";
    setTimeout(function() {
        map = document.getElementById("map");
        const locateBtn = document.getElementById("locateBtn");
        const locateOptionsBtn = document.getElementById("locateOptionsBtn");
        const locateOptionsModal = document.getElementById("locateOptionsModal");

        if (map != null) {
            map.style.zIndex = "0";
            locateBtn.style.zIndex = "1";
            locateOptionsBtn.style.zIndex = "1";

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
    iconRadios[i].addEventListener("change", function() {
        prevIconRadio ? console.log(prevIconRadio.value) : null;
        if (this !== prevIconRadio) {
            prevIconRadio = this;
        }
        console.log(this.value);

        getData();
    });
}

/* Route finding code */
/* Find what scooters should be part of the route */
function findRoute() {
    // Remove the previous route, if it existed.
    if (routingControl != null) {
        map.removeControl(routingControl);
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
    scooterData.sort(function(a, b) {
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
    scooterData.sort(function(a, b) {
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
    }).addTo(map);
}

// Event listeners
window.addEventListener("onload", getData());