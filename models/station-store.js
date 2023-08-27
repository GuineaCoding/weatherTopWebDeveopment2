import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { readingStore } from "./reading-store.js";
import { accountsController } from "../controllers/accounts-controller.js";

// Call the 'initStore' function with the argument "stations" and store the returned data in the constant 'db'
const db = initStore("stations");

// Define the 'stationStore' object
export const stationStore = {

  // Retrieve all stations associated with a specific user ID
  async getStationsByUserId(userId) {
    await db.read();
    const stations = db.data.stations.filter((station) => station.userId === userId);
    const fetchReadingsPromises = stations.map(async (station) => {
      station.readings = await readingStore.getReadingByStationId(station.id);
    });

    await Promise.all(fetchReadingsPromises);

    // Sort the stations alphabetically by name
    stations.sort((a, b) => a.name.localeCompare(b.name));
    return stations;
  },

  async getStationById(stationId) {
    await db.read();
    const test = db.data.stations.find((station) => station.id === stationId);
    return test;
  },
  // Add a new station to the database
  async addStation(request, station) {
    // Get the currently logged-in user
    const loggedInUser = await accountsController.getLoggedInUser(request);

    // Retrieve stations associated with the logged-in user
    const userStations = await stationStore.getStationsByUserId(loggedInUser.id);

    // Check if a station with the same name already exists
    const existingStation = userStations.find((s) => s.name === station.name);
    if (existingStation) {
      throw new Error("A station with the same name already exists within your account.");
    }

    // Reading the database
    await db.read();

    // Generate a unique ID for the new station
    station.id = v4();

    // Update the "userId" and initialize an empty array for readings
    station.userId = loggedInUser.id;
    station.readings = [];

    // Add the new station to the database
    db.data.stations.push(station);
    await db.write();

    // Return the newly added station
    return station;
  },

  // Delete a station by its ID
  async deleteStationById(id) {
    // Read data from the database
    await db.read();

    // Find the index of the station with the given ID
    const index = db.data.stations.findIndex((station) => station.id === id);

    // If the station is found, remove it from the list
    if (index !== -1) {
      db.data.stations.splice(index, 1);
      // Write the updated data back to the database
      await db.write();
    }
  },

  // Get a station by name and user ID
  async getStationByName(loggedInUserId, name) {
    // Read data from the database
    await db.read();

    // Find the station with the given user ID and name (case-insensitive)
    const station = db.data.stations.find((station) => station.userId === loggedInUserId && station.name.toLowerCase() === name.toLowerCase());

    // Return the found station
    return station;
  },

  // Update a station's name, latitude, and longitude
  async updateStationParam(stationId, updatedName, updatedLatitude, updatedLongitude) {
    // Get the station by its ID
    const station = await this.getStationById(stationId);

    // If the station is not found, throw an error
    if (!station) {
      // Redirect to the "station-not-found" page
      response.redirect("/notFound");
      return;
    }

    // Update the station's name, latitude, and longitude
    station.name = updatedName;
    station.latitude = updatedLatitude;
    station.longitude = updatedLongitude;

    // Save the changes to the database
    await db.write();

    // Return the updated station
    return station;
  },
};