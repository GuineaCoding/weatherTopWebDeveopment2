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
  