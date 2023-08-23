export const genericRedirectController = {
    // Define the index function to handle requests to the about page
    index(request, response) {
      // Create an object called viewData containing the data to be passed to the view
      const viewData = {
        title: "Not Available",
      };
      // Render the "about-view" template with the viewData object as context
      response.render("generic-view", viewData);
    },
  };
  