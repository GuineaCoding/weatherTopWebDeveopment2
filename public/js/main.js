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

// Wait for the DOM to be fully loaded before executing this code.
document.addEventListener("DOMContentLoaded", function () {
  // Check if the current URL path includes "/dashboard".
  if (window.location.pathname.includes("/dashboard")) {
    // Get the form and relevant input elements by their IDs.
    const form = document.getElementById("addStationForm");
    const latitudeInput = form.elements.latitude;
    const longitudeInput = form.elements.longitude;
    const latitudeError = document.getElementById("latitudeError");
    const longitudeError = document.getElementById("longitudeError");

    // Add a submit event listener to the form.
    form.addEventListener("submit", function (event) {
      // Parse the latitude and longitude input values as numbers.
      const numericLatitude = parseFloat(latitudeInput.value);
      const numericLongitude = parseFloat(longitudeInput.value);

      // Check if the latitude is out of the valid range (-90 to 90 degrees).
      if (numericLatitude < -90 || numericLatitude > 90) {
        // Prevent the form from submitting.
        event.preventDefault();
        // Add a CSS class to indicate an error.
        latitudeInput.classList.add("is-danger");
        // Display the latitude error message.
        latitudeError.style.display = "block";
      } else {
        // Remove the error CSS class and hide the error message if latitude is valid.
        latitudeInput.classList.remove("is-danger");
        latitudeError.style.display = "none";
      }

      if (numericLongitude < -180 || numericLongitude > 180) {
        // Prevent the form from submitting.
        event.preventDefault();
        // Add a CSS class to indicate an error.
        longitudeInput.classList.add("is-danger");
        // Display the latitude error message.
        longitudeError.style.display = "block";
      } else {
        // Remove the error CSS class and hide the error message if latitude is valid.
        longitudeInput.classList.remove("is-danger");
        longitudeError.style.display = "none";
      }
    });
    //initialize arrays,
    const stationNames = [];
    const displayedStations = [];

    // Function to populate station names from the page.
    function populateStationNames() {
      // Find all elements with the ID "StationDashboardName."
      const stationNameElements = document.querySelectorAll("#StationDashboardName");
      // Clear the stationNames array before populating it again.
      stationNames.length = 0;
      // Iterate through station name elements and add them to the array in lowercase.
      stationNameElements.forEach((element) => {
        const stationName = element.textContent.trim();
        stationNames.push(stationName.toLowerCase());
      });
    }
    // Function to render stations, including populating station names.
    function renderStations() {
      populateStationNames();

      console.log(stationNames.length, 'station Name Length');
      console.log(stationNames, 'StationNames');
    }
    // Initially render stations when the page loads.
    renderStations();
    // Add a submit event listener to the form.
    form.addEventListener("submit", function (event) {
      // Get the new station name from the input field and convert it to lowercase.
      const newStationName = document.getElementById("stationNameInput").value.trim().toLowerCase();
      console.log(newStationName)
      // Check if the new station name is already in the stationNames array.
      if (stationNames.includes(newStationName)) {
        event.preventDefault();
        // Display an error message if the station name already exists.
        const errorMessage = document.getElementById("stationNameError");
        errorMessage.style.display = "block";
        return;
      }
      else {
        // If the station name is unique, create a new station object.
        const newStation = { name: newStationName };
        displayedStations.push(newStation);
        // Clear the error message.
        const errorMessage = document.getElementById("stationNameError");
        errorMessage.style.display = "none";

        renderStations();
      }
    });
  }
});
