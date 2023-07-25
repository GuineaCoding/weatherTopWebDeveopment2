export const aboutController = {
  // Define the index function to handle requests to the about page
  index(request, response) {
    // Create an object called viewData containing the data to be passed to the view
    const viewData = {
      title: "About Us",
    };
    console.log("about rendering");
    // Render the "about-view" template with the viewData object as context
    response.render("about-view", viewData);
  },
};
