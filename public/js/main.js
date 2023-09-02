// Waiting for the contentent to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Picking the burger menu element
  const burger = document.querySelector(".navbar-burger");

  // Picking the navigation menu element
  const menu = document.querySelector(".navbar-menu");

  // click event listener to the burger menu
  burger.addEventListener("click", () => {
    // Toggle the "is-active" class on the burger menu
    burger.classList.toggle("is-active");

    // Toggle the "is-active" class on the navigation menu
    menu.classList.toggle("is-active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("/dashboard")) {
    const form = document.getElementById("addStationForm");
    const latitudeInput = form.elements.latitude;
    const longitudeInput = form.elements.longitude;
    const latitudeError = document.getElementById("latitudeError");
    const longitudeError = document.getElementById("longitudeError");

    form.addEventListener("submit", function (event) {
      const numericLatitude = parseFloat(latitudeInput.value);
      const numericLongitude = parseFloat(longitudeInput.value);

      if (numericLatitude < -90 || numericLatitude > 90) {
        event.preventDefault();
        latitudeInput.classList.add("is-danger");
        latitudeError.style.display = "block";
      } else {
        latitudeInput.classList.remove("is-danger");
        latitudeError.style.display = "none";
      }

      if (numericLongitude < -180 || numericLongitude > 180) {
        event.preventDefault();
        longitudeInput.classList.add("is-danger");
        longitudeError.style.display = "block";
      } else {
        longitudeInput.classList.remove("is-danger");
        longitudeError.style.display = "none";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("/dashboard")) {
    const form = document.getElementById("addStationForm");
    const stationNames = [];
    const displayedStations = []; // Declare the array at a higher scope

    // Function to populate the stationNames array
    function populateStationNames() {
      const stationNameElements = document.querySelectorAll(".title.is-3.has-text-white"); // Update the selector

      stationNames.length = 0; // Clear the array when rendering

      stationNameElements.forEach((element) => {
        const stationName = element.textContent.trim(); // Trim to remove any leading/trailing spaces
        stationNames.push(stationName);
      });
    }
    // Function to render stations
    function renderStations() {
      populateStationNames();
      // Now, stationNames array contains all the station names
      console.log(stationNames.length, 'station Name Length');
      console.log(stationNames, 'StationNames');
    }
    renderStations();
    form.addEventListener("submit", function (event) {
      const newStationName = document.getElementById("stationNameInput").value.trim(); // Trim to remove any leading/trailing spaces
      console.log(newStationName)
      if (stationNames.includes(newStationName)) {
        event.preventDefault(); 
        // Display an error message.
        const errorMessage = document.getElementById("stationNameError");
        errorMessage.style.display = "block";
        return; // Don't proceed further.
      }
      else{
      // Add the new station to the displayedStations array.
      const newStation = { name: newStationName /* other station data */ };
      displayedStations.push(newStation);

      // Clear the error message.
      const errorMessage = document.getElementById("stationNameError");
      errorMessage.style.display = "none";

      // Render the updated list of stations.
      renderStations();
      }
    });
  }
});
