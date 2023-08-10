import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";

// Define the stationController object
export const stationController = {
  async index(request, response) {
    try {
      // Get the station ID from the request parameters
      const stationId = request.params.id;

      // Get the logged-in user
      const loggedInUser = await accountsController.getLoggedInUser(request);

      // Fetch the station details using the stationStore's 'getStationById' function
      const station = await stationStore.getStationsByUserId(stationId);

      // Fetch the last reading associated with the station using the readingStore's 'getLastReading' function
      const lastReading = await readingStore.getLastReading(stationId);

      // Check if the station is found in the database
      if (!station) {
        // If the station is not found, send a 404 Not Found response and return from the function
        response.status(404).send("Station not found");
        return;
      }

      // Convert the lastReading object into an array
      const lastReadings = [lastReading];

      // Prepare the data to be passed to the view
      const viewData = {
        name: station.name,
        station: station,
        lastReadings: lastReadings,
        loggedInUser: loggedInUser, // Pass the loggedInUser to the view
      };

      response.render("station-view", viewData);
    } catch (error) {
      console.error("Error rendering station:", error);
      response.status(500).send("Internal Server Error");
    }
  },

  async addReading(request, response) {
    const station = await stationStore.getStationsByUserId(request.params.id);

    // Extract the reading data from the request body
    const reading = {
      code: Number(request.body.code),
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      pressure: Number(request.body.pressure),
      windDirection: Number(request.body.windDirection),
    };

    // Add the new reading to the station using the readingStore's 'addReading' function
    await readingStore.addReading(station.id, reading);

    // Redirect the user to the station's page after adding the reading
    response.redirect("/station/" + station.id);
  },
};
