import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const readingController = {
    async index(request, response) {
      const stationId = request.params.stationid; 
      const readingId = request.params.readingId;
      console.log(`Editing Reading ${readingId} from Station ${stationId}`);
      const foundStation = await stationStore.getStationById(stationId);
      const readingToEdit = foundStation.readings.find((reading) => reading.id === readingId);
      console.log(readingToEdit)

    if (!readingToEdit) {

        return;
      }

      const viewData = {
        title: "Edit Reading",
        station: foundStation,
        reading: readingToEdit,
      };
    response.render("reading-view", viewData);
  },

  async update(request, response) {
    const stationId = request.params.stationid; 
    console.log(stationId);
    const readingId = request.params.readingId;
    const updatedReading = {
      code: request.body.code,
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      pressure: Number(request.body.pressure),
      windDirection: Number(request.body.windDirection),
    };
    console.log(`Updating Reading ${readingId} from Station ${stationId}`);
    await readingStore.updateReading(readingId, updatedReading);
    response.redirect("/station/" + stationId);
  },
};