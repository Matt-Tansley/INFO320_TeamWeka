var mymap = L.map("mymap").setView([-41.28666552, 174.772996908], 13);

L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoiY3J1bmNoeXBhbmNha2VzIiwiYSI6ImNrM25temk0YzFzMjMzcHM3bWdocXZuOXgifQ.m6zMp4CxLPXi5xp-zB1kkg",
    }
).addTo(mymap);

/* Getting data from API */
var scooterData = [];

function getData() {
    console.log("Get data called");
    let url =
        "http://api.flamingoscooters.com/gbfs/wellington/free_bike_status.json";

    fetch(url).then(function(response) {
        response.json().then(function(data) {
            scooterData = data.data.bikes;
            displayMarkers();
        });
    });
}

var markerList = [];

function displayMarkers() {
    for (var i = 0; i < scooterData.length; i++) {
        let marker = L.marker([scooterData[i].lat, scooterData[i].lon]).addTo(
            mymap
        );
        markerList.push(marker);
    }
}

// Leaflet Routing Machine
L.Routing.control({
    waypoints: [
        L.latLng(-41.28666552, 174.772996908),
        L.latLng(-41.28766552, 174.772996908),
    ],
    routeWhileDragging: true,
}).addTo(mymap);

L.Routing.Itinerary.hide();

/* Find route to replace batteries on scooters 
Currently finds 10 closest scooters. 
*/
var route = [];
var maxSize = 10;

function findRoute() {
    // Sort scooter list by current range smallest to largest.
    scooterData.sort(function(a, b) {
        return a.current_range_meters - b.current_range_meters;
    });

    // Get the maxSize (10) closest scooters.
    for (var i = 0; i < maxSize; i++) {
        route.push(scooterData[i]);
    }

    // Show the closest scooters to the user.
    var routeList = document.getElementById("routeList");
    routeList.innerHTML = "";
    for (var i = 0; i < route.length; i++) {
        routeList.innerHTML += `<li>Scooter ID: ${route[i].bike_id}, Current Range: ${route[i].current_range_meters}</li>`;
    }
}

// Event listners
getData();

var button = document.getElementById("button");
button.addEventListener("click", findRoute);