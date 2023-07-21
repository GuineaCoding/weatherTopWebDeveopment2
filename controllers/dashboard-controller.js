import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

// Define the dashboardController object with an async function called "index"
export const dashboardController = {
  async index(request, response) {
    try {
       // Prepare the data to be passed to the view
      const viewData = {
        title: "Station Dashboard",
        stations: await stationStore.getAllStations(),
        lastReadings: await readingStore.getLastReading(),
      };
       // Render the "dashboard-view" using the prepared data (viewData)
      response.render("dashboard-view", viewData);
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      response.status(500).send("Internal Server Error");
    }
  },
};
