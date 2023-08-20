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

      // Check if the user is logged in
      if (!loggedInUser) {
        // Redirect the user to the login page or show an error message
        response.redirect("/login"); // Change the route to your login page
        return;
      }
  
      // Fetch the station details using the stationStore's 'getStationById' function
      const userStations = await stationStore.getStationsByUserId(loggedInUser.id);
  
      // Find the station in the user's stations based on the provided stationId
      const station = userStations.find((s) => s.id === stationId);
  
      // Check if the station is found in the user's stations
      if (!station) {
        // If the station is not found, send a 404 Not Found response and return from the function
        response.status(404).send("Station not found");
        return;
      }
  
      // Fetch the last reading associated with the station using the readingStore's 'getLastReading' function
      const lastReading = await readingStore.getLastReading(stationId);
      const readings = await readingStore.getReadingByStationId(stationId);
      // Convert the lastReading object into an array
      const lastReadings = [lastReading];
  
      // Prepare the data to be passed to the view
      const viewData = {
        name: station.name,
        latitude: station.latitude,
        longitude: station.longitude, 
        station: station,
        lastReadings: lastReadings,
        readings: readings,
        loggedInUser: loggedInUser,
      };
      response.render("station-view", viewData);
    } catch (error) {
      console.error("Error rendering station:", error);
      response.status(500).send("Internal Server Error");
    }
  },

  async addReading(request, response) {
    try {
      // Get the station ID from the request parameters
      const stationId = request.params.id;
      
      const date = new Date().toLocaleString();
      // Get the station using the stationStore's 'getStationById' function
      const station = await stationStore.getStationById(stationId);

      // Check if the station is found
      if (!station) {
        // If the station is not found, send a 404 Not Found response and return from the function
        response.status(404).send("Station not found");
        return;
      }

      // Extract the reading data from the request body
      const reading = {
        date: date,
        code: Number(request.body.code),
        temperature: Number(request.body.temperature),
        windSpeed: Number(request.body.windSpeed),
        pressure: Number(request.body.pressure),
        windDirection: Number(request.body.windDirection),
      };

      // Add the new reading to the station using the readingStore's 'addReading' function
      await readingStore.addReading(stationId, reading);

      // Redirect the user to the station's page after adding the reading
      response.redirect("/station/" + stationId);
    } catch (error) {
      console.error("Error adding reading:", error);
      response.status(500).send("Internal Server Error");
    }
  },  
  async deleteReading(request, response) {
    const stationId = request.params.stationid; 
    const readingId = request.params.readingId;
    console.log(`Deleting Reading ${readingId} from Station ${stationId}`);
    await readingStore.deleteReading(stationId, readingId); 
    response.redirect("/station/" + stationId);
  }
};
