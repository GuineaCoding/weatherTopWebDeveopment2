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
  });