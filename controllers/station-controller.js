import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";

export const stationController = {
    async index(request, response) {
      const stationId = request.params.id;
      const station = await stationStore.getStationById(stationId);
      const lastReading = await readingStore.getLastReading(stationId);
  
      try {
        if (!station) {
          response.status(404).send("Station not found");
          return;
        }
  
        const lastReadings = [lastReading]; // Convert the lastReading object into an array
  
        const viewData = {
          name: station.name,
          station: station,
          lastReadings: lastReadings, 
        };
  
        response.render("station-view", viewData);
      } catch (error) {
        console.error("Error rendering station:", error);
        response.status(500).send("Internal Server Error");
      }
    },
    async addReading(request, response) {
        const station = await stationStore.getStationById(request.params.id);
        const reading= {
          code: Number(request.body.code),
          temperature: Number(request.body.temperature),
          windSpeed: Number(request.body.windSpeed),
          pressure: Number(request.body.pressure),
          windDirection: Number(request.body.windDirection),
        };
        // console.log(`adding reading ${newReading.code}`);
        // console.log(`adding reading ${newReading.temperature}`);
        // console.log(`adding reading ${newReading.windDirection}`);
        // console.log(`adding reading ${newReading.windSpeed}`);
        // console.log(`adding reading ${newReading.Pressure}`);
        console.log(station.id)
        await readingStore.addReading(station.id, reading);
        
        response.redirect("/station/" + station.id);
      },
  };
  