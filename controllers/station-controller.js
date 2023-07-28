import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";

export const stationController = {
    async index(request, response) {
        const station = await stationStore.getStationById(request.params.id);
        try {
            // Prepare the data to be passed to the view
            const viewData = {
                name: station.name,
                station: station,
                lastReadings: await readingStore.getLastReading(station),
            };
            // Render the "station-view" using the prepared data (viewData)
            console.log(station)
            response.render("station-view", viewData);
        } catch (error) {
            console.error("Error rendering station:", error);
            response.status(500).send("Internal Server Error");
        }
    }
}