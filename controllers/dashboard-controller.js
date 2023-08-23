import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { readingStore } from "../models/reading-store.js";

export const dashboardController = {
  async index(request, response) {
    try {
      const loggedInUser = await accountsController.getLoggedInUser(request);
  
      if (loggedInUser) {
        // retrieve stations based on the logged-in user's ID
        const userStations = await stationStore.getStationsByUserId(loggedInUser.id);
  
        // Fetch the last readings for each station
        const stationsWithLastReadings = await Promise.all(
          userStations.map(async (station) => {
            const lastReading = await readingStore.getLastReading(station.id);
            return {
              ...station,
              lastReading,
            };
          })
        );
        
        const viewData = {
          title: "Dashboard",
          stations: stationsWithLastReadings, // Display stations with last readings
        };
  
        // Render the "dashboard-view" template only when the user is logged in
        response.render("dashboard-view", viewData);
      } else {
        // If the user is not logged in, redirect to the login page
        response.redirect("/login");
      }
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      response.status(500).send("Internal Server Error");
    }
  },

  // Route handler for adding a new station
  async addStation(request, response) {
    try {
      const loggedInUser = await accountsController.getLoggedInUser(request);
      const { name, latitude, longitude } = request.body;

      // Check if 'name', 'latitude', and 'longitude' are missing in the request body, and throw an error if any of them are missing
      if (!name) {
        throw new Error("Station name is missing in the request body.");
      }
      if (!latitude) {
        throw new Error("Latitude is missing in the request body.");
      }
      if (!longitude) {
        throw new Error("Longitude is missing in the request body.");
      }

      // Convert latitude and longitude to numbers
      const numericLatitude = parseFloat(latitude);
      const numericLongitude = parseFloat(longitude);

      // Validate latitude and longitude ranges
      if (numericLatitude < -90 || numericLatitude > 90) {
        throw new Error("Latitude must be between -90 and 90 degrees.");
      }
      if (numericLongitude < -180 || numericLongitude > 180) {
        throw new Error("Longitude must be between -180 and 180 degrees.");
      }

      // Create a new station object with the extracted properties and the user ID
      const newStation = {
        name: name,
        latitude: numericLatitude,
        longitude: numericLongitude,
        userId: loggedInUser.id,
      };

      // Add the new station to the stationStore, checking for duplicate station names
      await stationStore.addStation(request, newStation);

      // Retrieve stations based on the logged-in user's ID (including the newly added station)
      const userStations = await stationStore.getStationsByUserId(loggedInUser.id);

      const viewData = {
        title: "Station Dashboard",
        stations: userStations,
        existingStation: false, // Reset this flag as we've successfully added a station
      };

      // Render the dashboard-view template
      response.render("dashboard-view", viewData);
    } catch (error) {
      // Handle the error and show the dashboard view
      try {
        const loggedInUser = await accountsController.getLoggedInUser(request);
        const userStations = await stationStore.getStationsByUserId(loggedInUser.id);
        const viewData = {
          title: "Station Dashboard",
          stations: userStations,
          existingStation: true,
          errorMessage: error.message,
        };
        response.render("dashboard-view", viewData);
      } catch (innerError) {
        console.error("Error rendering dashboard:", innerError);
        response.status(500).send("Internal Server Error");
      }
    }
  },

// function to delete a station
async deleteStation(request, response) {
  // Get the station ID from the request parameters
  const stationId = request.params.id;

  console.log(`Deleting Station ${stationId}`);

  // calling the deleteStationById function to delete the station from the store
  await stationStore.deleteStationById(stationId);

  // redirect user to the dashboard after deleting the station
  response.redirect("/dashboard");
},
};
