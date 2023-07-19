import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("stations");

export const readingStore = {
    async getAllReadings() {
      await db.read();
      return db.data.readings;
    }
}