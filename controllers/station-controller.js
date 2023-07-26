import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";

export const stationController = {
    async index(request, response) {
        const station = await stationStore.getStationById(request.params.id);
        try {
            // Prepare the data to be passed to the view
            const viewData = {
                title: "Station",
                // lastReadings: await readingStore.getLastReading(),
            };
            // Render the "station-view" using the prepared data (viewData)
            response.render("station-view", viewData);
        } catch (error) {
            console.error("Error rendering station:", error);
            response.status(500).send("Internal Server Error");
        }
    }

}