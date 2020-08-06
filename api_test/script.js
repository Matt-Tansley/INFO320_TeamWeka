const getBtn = document.getElementById("getBtn");
const dataOutput = document.getElementById("dataOutput");
const getBikeBtn = document.getElementById("getBikeBtn");

// Functions
function getData() {
    console.log("Button clicked!");

    let url =
        "http://api.flamingoscooters.com/gbfs/wellington/free_bike_status.json";

    fetch(url).then(function(response) {
        response.json().then(function(data) {
            dataOutput.innerHTML = JSON.stringify(data);
            console.log(data.data.bikes[0].bike_id)

        });
    });

}

function getBikeData() {
    console.log("Button clicked!");

    let url =
        "http://api.flamingoscooters.com/gbfs/wellington/free_bike_status.json";

    fetch(url).then(function(response) {
        response.json().then(function(data) {
            let output = '';
            data.data.bikes.forEach(function(bikes) {
                output += `
                <ul>
                <li>Bike ID: ${bikes.bike_id}</li>
                <li>Latitude: ${bikes.lat}</li>
                <li>Longitude: ${bikes.lon}</li>
                <li>Current Range (meters): ${bikes.current_range_meters}m</li>
                </ul>
                `
            });
            dataOutput.innerHTML = output;
        });
    });

}


// Event listeners
getBtn.addEventListener("click", getData);
getBikeBtn.addEventListener("click", getBikeData)

/* Map related code (leaflet) */
var mymap = L.map("mapid").setView([51.505, -0.09], 13);

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