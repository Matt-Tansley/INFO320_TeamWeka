const btn = document.getElementById("btn");
const output = document.getElementById("output");

function postData() {
  fetch("https://api.flamingoscooters.com/weka/battery", {
    method: "post",
  }).then((response) => {
    output.innerHTML = "Status: " + response.status;
  });
}

btn.addEventListener("click", postData);
