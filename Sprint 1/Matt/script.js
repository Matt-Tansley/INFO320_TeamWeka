// Leaflet / Map related code
var map = L.map("map").setView([-41.28664, 174.7757], 13);

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

// map.locate({ setView: true, maxZoom: 16 });

/* Getting data from API */
let scooterData = [];

function getData() {
  let url =
    "http://api.flamingoscooters.com/gbfs/wellington/free_bike_status.json";

  fetch(url).then(function (response) {
    response.json().then(function (data) {
      scooterData = data.data.bikes;
      displayMarkers();
    });
  });
}

function displayMarkers() {
  let markers = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
  for (var i = 0; i < scooterData.length; i++) {
    let marker = L.marker([scooterData[i].lat, scooterData[i].lon]);
    markers.addLayer(marker);
  }
  map.addLayer(markers);
}

window.addEventListener("onload", getData());
