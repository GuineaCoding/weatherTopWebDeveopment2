import { stationStore } from "../models/station-store.js";

// Define the dashboardController object with an async function called "index"
export const dashboardController = {
  async index(request, response) {
    try {
       // Prepare the data to be passed to the view
      const viewData = {
        title: "Station Dashboard",
        stations: await stationStore.getAllStations(),
      };
       // Render the "dashboard-view" using the prepared data (viewData)
      response.render("dashboard-view", viewData);
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      response.status(500).send("Internal Server Error");
    }
  },
  async addStation(request, response) {
    const newStation = {
      name: request.body.name,
    };
    
    console.log(`adding Station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },
};
