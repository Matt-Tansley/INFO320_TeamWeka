const getBtn = document.getElementById("getBtn");
const dataOutput = document.getElementById("dataOutput");

// Functions
function getData() {
  console.log("Button clicked!");

  let url =
    "http://api.flamingoscooters.com/gbfs/wellington/free_bike_status.json";
  //   let response = fetch(url);

  //   dataOutput.innerHTML = response.json();
  fetch(url).then(function (response) {
    response.json().then(function (data) {
      dataOutput.innerHTML = JSON.stringify(data);
    });
  });
}

// Event listeners
getBtn.addEventListener("click", getData);

/* Map related code (leaflet) */
var mymap = L.map("mapid").setView([51.505, -0.09], 13);

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
