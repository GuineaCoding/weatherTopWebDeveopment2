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
    console.log(test, 'test')
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

    // Read the database
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

  async deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station.id === id);
    if (index !== -1) {
      db.data.stations.splice(index, 1);
      await db.write();
    }
  },

  async getStationByName(loggedInUserId, name) {
    await db.read();
    return db.data.stations.find((station) => station.userId === loggedInUserId && station.name === name);
  },

  async updateStationParam(request, stationId, updatedName, response) {
    try {
      const loggedInUser = await accountsController.getLoggedInUser(request);
  
      if (!updatedName) {
        throw new Error("New station name is missing in the request body.");
      }
  
      const existingStation = await stationStore.getStationByName(loggedInUser.id, updatedName);
  
      if (existingStation && existingStation.id !== stationId) {
        throw new Error("A station with the same name already exists.");
      }
  
      await stationController.updateStationParam(request, stationId, updatedName, response);
  
      response.redirect("/station/" + stationId); 
    } catch (error) {
      console.error("Error updating station name:", error);
      response.status(500).send("Internal Server Error");
    }
  },
};
