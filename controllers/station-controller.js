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
        // Redirect to the "station-not-found" page
        response.redirect("/notFound");
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
        // Redirect to the "station-not-found" page
        response.redirect("/notFound");
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
  // function to delete a reading
  async deleteReading(request, response) {
    // extracting station ID and reading ID from request parameters
    const stationId = request.params.stationid;
    const readingId = request.params.readingId;

    // deleting the reading from the reading store
    await readingStore.deleteReading(stationId, readingId);

    // redirect to the station page after deleting the reading
    response.redirect("/station/" + stationId);
  },
  // Function to update station information
  async updateStationName(request, response) {
    // extract station ID, name, latitude, and longitude from request
    const stationId = request.params.id;
    const updatedName = request.body.name;
    const updatedLatitude = request.body.latitude;
    const updatedLongitude = request.body.longitude;
    // get the existing station using the ID
    const updatedStation = await stationStore.getStationById(stationId);
    // if the station doesn't exist, show an error
    if (!updatedStation) {
      const error = "Station not found";
      const userStations = await stationStore.getStationsByUserId(updatedStation.userId);
      const viewData = {
        title: "Edit Station Name",
        station: updatedStation,
        errorMessage: error,
      };
      response.render("edit-station-name", viewData);
      return;
    }
    // Get all stations associated with the user
    const userStations = await stationStore.getStationsByUserId(updatedStation.userId);
    // Check if a station with the updated name already exists
    const existingStationWithUpdatedName = userStations.find((s) => s.name.toLowerCase() === updatedName.toLowerCase() && s.id !== stationId);
    if (existingStationWithUpdatedName) {
      const error = "A station with the same name already exists within your account.";
      const viewData = {
        title: "Edit Station Name",
        station: updatedStation,
        errorMessage: error,
      };
      response.render("edit-station-name", viewData);
      return;
    }

    // Convert latitude and longitude to numbers
    const numericLatitude = parseFloat(updatedLatitude);
    const numericLongitude = parseFloat(updatedLongitude);

    // Validate latitude and longitude ranges
    if (numericLatitude < -90 || numericLatitude > 90) {
      const error = "Latitude must be between -90 and 90 degrees.";
      const viewData = {
        title: "Edit Station Name",
        station: updatedStation,
        errorMessage: error,
      };
      response.render("edit-station-name", viewData);
      return;
    }
    // Validate latitude and longitude ranges
    if (numericLongitude < -180 || numericLongitude > 180) {
      const error = "Longitude must be between -180 and 180 degrees.";
      const viewData = {
        title: "Edit Station Name",
        station: updatedStation,
        errorMessage: error,
      };
      response.render("edit-station-name", viewData);
      return;
    }
    // Update station's information in the store
    updatedStation.name = updatedName;
    updatedStation.latitude = numericLatitude; // Use numericLatitude here
    updatedStation.longitude = numericLongitude; // Use numericLongitude here

    await stationStore.updateStationParam(stationId, updatedName, numericLatitude, numericLongitude);
    // Redirect to the dashboard after updating
    response.redirect("/dashboard");
  },

  async editStationParam(request, response) {
    const stationId = request.params.id;

    try {
      // Retrieve the station by ID
      const station = await stationStore.getStationById(stationId);

      if (!station) {
        // Redirect to the "station-not-found" page
        response.redirect("/notFound");
        return;
      }

      // Prepare view data and render the edit station page
      const viewData = {
        title: "Edit Station Name",
        station: station,
      };

      response.render("edit-station-name", viewData);
    } catch (error) {
      console.error("Error rendering edit station name page:", error);
      response.status(500).send("Internal Server Error");
    }
  },
};
