import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";

export const dashboardController = {
  async index(request, response) {
    try {
      const loggedInUser = await accountsController.getLoggedInUser(request);
      console.log(loggedInUser)

      let viewData;
      if (loggedInUser) {
        // Retrieve stations based on the logged-in user's ID
        const userStations = await stationStore.getStationsByUserId(loggedInUser.id);

        viewData = {
          title: "Dashboard",
          stations: userStations, // Display stations associated with the logged-in user
        };
      } else {
        // If user is not logged in, redirect to login-page
        response.redirect("/login");
      }

      response.render("dashboard-view", viewData);
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      response.status(500).send("Internal Server Error");
    }
  },

  // "addStation" function to handle adding a new station
  async addStation(request, response) {
    try {
      // Extract the 'name', 'latitude', and 'longitude' properties from the request body
      const { name, latitude, longitude } = request.body;

      // Check if 'name' is missing in the request body, and throw an error if it is
      if (!name) {
        throw new Error("Station name is missing in the request body.");
      }

      // Get the logged-in user
      const loggedInUser = await accountsController.getLoggedInUser(request);

      // Create a new station object with the extracted properties and the user ID
      const newStation = {
        name: name,
        latitude: latitude,
        longitude: longitude,
        userId: loggedInUser.id, // Use the 'id' property from the logged-in user
      };

      // Add the new station to the stationStore
      await stationStore.addStation(newStation);

      // Redirect the user back to the dashboard after adding the station
      response.redirect("/dashboard");
    } catch (error) {
      // If an error occurs during the station addition process, handle the error and show the dashboard view
      const viewData = {
        title: "Station Dashboard",
        stations: await stationStore.getAllStations(), // Retrieve all stations from the stationStore
        existingStation: true,
        errorMessage: error.message, // Store the error message to display it in the view
      };
      response.render("dashboard-view", viewData);
    }
  },
};
