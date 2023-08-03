import { stationStore } from "../models/station-store.js";

// Define the dashboardController object with two functions: "index" and "addStation"
export const dashboardController = {
  // "index" function to display the dashboard view
  async index(request, response) {
    try {
      const viewData = {
        title: "Station Dashboard",
        stations: await stationStore.getAllStations(), // Retrieve all stations from the stationStore
      };
      // Render the "dashboard-view" using the prepared data (viewData)
      response.render("dashboard-view", viewData);
    } catch (error) {
      // If an error occurs during rendering, log the error and send an internal server error status
      console.error("Error rendering dashboard:", error);
      response.status(500).send("Internal Server Error");
    }
  },

  // "addStation" function to handle adding a new station
  async addStation(request, response) {
    try {
      // Extract the 'name' property from the request body
      const { name } = request.body;
      const {latitude} = request.body;
      const {longitude} = request.body;

      // Check if 'name' is missing in the request body, and throw an error if it is
      if (!name) {
        throw new Error("Station name is missing in the request body.");
      }

      // Create a new station object with the extracted name
      const newStation = {
        name: name,
        latitude: latitude,
        longitude: longitude
      };
      console.log(`adding Station ${newStation.name}`);
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
