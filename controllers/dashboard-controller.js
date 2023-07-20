import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const dashboardController = {
  async index(request, response) {
    try {
      const viewData = {
        title: "Station Dashboard",
        stations: await stationStore.getAllStations(),
        lastReadings: await readingStore.getLastReading(),
        fromCtoF: await readingStore.fromCtoF(),
      };
      console.log("dashboard rendering");
      // console.log("Last readings array:", viewData.lastReadings);
      response.render("dashboard-view", viewData);
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      response.status(500).send("Internal Server Error");
    }
  },
};
