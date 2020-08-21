// Sidebar Nav code
function openNav() {
    document.getElementById("sidebar").style.width = "70vw";
    document.getElementById("map").style.zIndex = "-1";
    document.getElementById("opaque").style.display = "block";
}
const openBtn = document.getElementById("openBtn");
openBtn.addEventListener("click", openNav);

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    setTimeout(function() {
        document.getElementById("map").style.zIndex = "0";
    }, 500);
    document.getElementById("opaque").style.display = "none";
}
const closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", closeNav);

// Leaflet / Map related code
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

// map.locate({ setView: true, maxZoom: 16 });

/* Getting data from API */
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

var markerList = []

function displayMarkers() {
    let markers = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
    for (var i = 0; i < scooterData.length; i++) {

        let marker = L.marker([scooterData[i].lat, scooterData[i].lon]);
        //marker.bindPopup("Scooter ID: " + scooterData[i].bike_id + "\n Range: " + scooterData[i].current_range_meters + "m")
        markerList.push(marker);

        markers.addLayer(marker);
    }
    map.addLayer(markers);
    getInfo()
}


function getInfo() {
    console.log("getInfo Called")
    markerList.forEach(function(marker) {
        marker.on('click', function() {
            var index = markerList.indexOf(marker);
            let output = ` 
            <h3><span>Settings</span></h3>
 
            <table>
            <tr>
                <th>ID:</th>
                <td>${scooterData[index].bike_id}</td>
            </tr>
            <tr>
                <th>Range:</th>
                <td>${scooterData[index].current_range_meters + "m"}</td>
            </tr>
            <tr>
                <th>GPS Status:</th>
                <td>Available</td>
            </tr>
            <tr>
                <th>GPS Updated:</th>
                <td>3:15pm 16/8/20</td>
             </tr>
            <tr>
                <th>GPS Precsion:</th>
                <td>Perfect</td>
             </tr>
        
            </table> 

            <div class="buttons">
            <div class="rows">
                <div class="btn">
                    <input type="button" value="Location"> </div>
                <div class="btn">
                    <input type="button" value="Naviagtion">
                </div>
            </div>
            <div class="rows">
                <div class="btn">
                    <input type="button" value="Open Hatch">
                </div>
                <div class="btn">
                    <input type="button" value="Mark Completed">
                </div>
            </div>             
            `;
            marker.bindPopup(output);
            //dataOutput.innerHTML = output;
            //marker.url = 'scooter_info.html';
            //window.location = (marker.url);
            console.log(output)
        });
    })
}

window.addEventListener("onload", getData());