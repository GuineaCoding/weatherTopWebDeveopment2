export const aboutController = {
  // Define the index function to handle requests to the about page
  index(request, response) {
    // Create an object called viewData containing the data to be passed to the view
    const viewData = {
      title: "About Us",
    };
    // Render the "about-view" template with the viewData object as context
    response.render("about-view", viewData);
  },
  aboutNonLogged(request,response){
    const viewData = {
      title: "About Us",
    };
    response.render("about-view-visitor", viewData);
  }
};
