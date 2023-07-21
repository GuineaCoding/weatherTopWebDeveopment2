export const homeController = {
    // Define the index function to handle requests to the about page
  index(request, response) {
    // Create an object called viewData containing the data to be passed to the view
    const viewData = {
      title: "Home",
    };
    console.log("home rendering");
     // Render the "about-view" template with the viewData object as context
    response.render("home-view", viewData);
  },
};
