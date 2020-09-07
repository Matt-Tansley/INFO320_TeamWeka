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

// Getting data from Flamingo Public API
let scooterData = [];

function getData() {
    let url =
        "http://api.flamingoscooters.com/gbfs/wellington/free_bike_status.json";

    fetch(url).then(function(response) {
        response.json().then(function(data) {
            scooterData = data.data.bikes;
            displayMarkers();
        });
    });
}

// Base Leaflet / Map code
var map = L.map("map").setView([-41.28664, 174.7757], 13);

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
    let markerCluster = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
    for (var i = 0; i < scooterData.length; i++) {
        let marker = L.marker([scooterData[i].lat, scooterData[i].lon]);
        markerCluster.addLayer(marker);
        markerList.push(marker);
    }
    map.addLayer(markerCluster);
    createMarkerPopups();
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
    scooterID.innerHTML = scooterData[index].bike_id;

    var scooterRange = iFrame.contentWindow.document.getElementById(
        "scooterRange"
    );
    scooterRange.innerHTML = scooterData[index].current_range_meters + "m";
}

// Event listeners
window.addEventListener("onload", getData());