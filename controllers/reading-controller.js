import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

// define the readingController object to handle reading-related actions
export const readingController = {
  // controller action to display the editing view for a reading
  async index(request, response) {
    // Extract station ID and reading ID from request parameters
    const stationId = request.params.stationid;
    const readingId = request.params.readingId;

    // find the station and the reading to edit
    const foundStation = await stationStore.getStationById(stationId);
    const readingToEdit = foundStation.readings.find((reading) => reading.id === readingId);

    // If the reading is not found, return without rendering
    if (!readingToEdit) {
      return;
    }

    // prepare data for rendering the editing view
    const viewData = {
      title: "Edit Reading",
      station: foundStation,
      reading: readingToEdit,
    };

    // Renderr the "reading-view" template with the prepared data
    response.render("reading-view", viewData);
  },

  // controller action to update a reading
  async update(request, response) {
    // Extract station ID and reading ID from request parameters
    const stationId = request.params.stationid;
    const readingId = request.params.readingId;

    // create an updated reading object based on the submitted form data
    const updatedReading = {
      code: request.body.code,
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      pressure: Number(request.body.pressure),
      windDirection: Number(request.body.windDirection),
    };
    // Update the reading in the reading store
    await readingStore.updateReading(readingId, updatedReading);

    // redirect back to the station page after updating the reading
    response.redirect("/station/" + stationId);
  },
};
