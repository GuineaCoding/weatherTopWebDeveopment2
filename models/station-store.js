import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { readingStore } from "./reading-store.js";
import { accountsController } from "../controllers/accounts-controller.js";

// Call the 'initStore' function with the argument "stations" and store the returned data in the constant 'db'
const db = initStore("stations");

// Define the 'stationStore' object
export const stationStore = {

// Retrieve all stations associated with a specific user ID
async getStationsByUserId(userid) {
  // Read the database
  await db.read();

  // Filter stations based on the provided user ID
  const stations = db.data.stations.filter((station) => station.userid === userid);
  console.log(stations)
  
  // Iterate through each station and fetch its associated readings using the readingStore
  for (const station of stations) {
    station.readings = await readingStore.getReadingByStationId(station.id);
  }

  // Return the list of stations with their associated readings
  return stations;
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

  // Update the "userid" and initialize an empty array for readings
  station.userid = loggedInUser.id;
  station.readings = [];

  // Add the new station to the database
  db.data.stations.push(station);
  await db.write();

  // Return the newly added station
  return station;
},


};
