import { v4 } from "uuid";
// Import the 'initStore' function from the '../utils/store-utils.js' file
import { initStore } from "../utils/store-utils.js";
import { readingStore } from "./reading-store.js";

// Call the 'initStore' function with the argument "stations" and store the returned data in the constant 'db'
const db = initStore("stations");

// Define the 'stationStore' object
export const stationStore = {
  // Define the 'getAllStations' function to retrieve all stations from the database
  async getAllStations() {
    await db.read();
    // Return the array of stations from the 'db.data.stations'
    return db.data.stations;
  },

  async getStationById(id) {
    await db.read();
    const list = db.data.stations.find((station) => station.id === id);
  
    if (!list) {
      // If the station with the specified ID is not found, return null or handle the error
      return null;
    }
  
    // Fetch readings associated with the station using the readingStore
    list.readings = await readingStore.getReadingByStationId(list.id);
    console.log(list)
    return list;
    
  },
  //Add station function
  async addStation(station) {
    //Check if station name which is added already exist
    const existingStation = db.data.stations.find((s) => s.name === station.name);
    if (existingStation) {
      throw new Error("A station with the same name already exists.");
    }
    await db.read();
    station.id = v4();
    //Push station into database
    db.data.stations.push(station);
    await db.write();
    return station;
  },

};
