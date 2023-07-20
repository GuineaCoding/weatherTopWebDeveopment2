import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("stations");

export const readingStore = {
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },

  async getLastReading() {
    await db.read();
    const lastReadings = db.data.stations.map((station) => {
      if (station.readings.length === 0) {
        return null;
      }
      
      const lastReading = station.readings[station.readings.length - 1];
      return {
        id: station.id,
        name: station.name,
        lastReading: lastReading,
      };
    });
    console.log("All last readings:", lastReadings.temperature);
    return lastReadings;

  },
 
  async fromCtoF(){
    // const cTemp = lastReadings.temperature;
    // console.log('test111',lastReadings)
    // const cToFahr = cTemp * 9 / 5 + 32;
    // console.log('test', cToFahr);
  }
};
