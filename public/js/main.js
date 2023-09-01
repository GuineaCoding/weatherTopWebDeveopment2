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
    const formValidation = document.getElementById("addStationForm");
    const nameFormInput = formValidation.elements.name;
    const latitudeFormInput = formValidation.elements.latitude;
    const longitudeFormInput = formValidation.elements.longitude;
    const nameErrorBlock = document.getElementById("nameError");
    const latitudeErrorBlock = document.getElementById("latitudeError");
    const longitudeErrorBlock = document.getElementById("longitudeError");
  
    formValidation.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const numericLatitude = parseFloat(latitudeFormInput.value);
      const numericLongitude = parseFloat(longitudeFormInput.value);
      const stationName = nameFormInput.value;
  
      // Extract station names from the page
      const stationNamesOnPage = Array.from(document.querySelectorAll(".StationDashboardName")).map(element => element.textContent);
      console.log(stationNamesOnPage)
      if (numericLatitude < -90 || numericLatitude > 90) {
        latitudeErrorBlock.style.display = "block";
      } else {
        latitudeErrorBlock.style.display = "none";
      }
  
      if (numericLongitude < -180 || numericLongitude > 180) {
        longitudeErrorBlock.style.display = "block";
      } else {
        longitudeErrorBlock.style.display = "none";
      }
  
      if (stationNamesOnPage.includes(stationName)) {
        nameErrorBlock.style.display = "block";
      } else {
        // Submit the form if all validations pass
        await formValidation.submit();
      }
    });
  });