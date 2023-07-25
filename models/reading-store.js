import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("stations");

// Function to determine the Beaufort level based on wind speed
function getBeaufortLevel(windSpeed) {
  if (windSpeed < 0.3) {
    return 0;
  } else if (windSpeed < 1.6) {
    return 1;
  } else if (windSpeed < 3.4) {
    return 2;
  } else if (windSpeed < 5.5) {
    return 3;
  } else if (windSpeed < 8) {
    return 4;
  } else if (windSpeed < 10.8) {
    return 5;
  } else if (windSpeed < 13.9) {
    return 6;
  } else if (windSpeed < 17.2) {
    return 7;
  } else if (windSpeed < 20.8) {
    return 8;
  } else if (windSpeed < 24.5) {
    return 9;
  } else if (windSpeed < 28.5) {
    return 10;
  } else if (windSpeed < 32.7) {
    return 11;
  } else {
    return 12;
  }
}
// Function to get the Beaufort level description based on wind speed
function getBeaufortLevelDescription(windSpeed) {
  if (windSpeed < 0.3) {
    return 'Calm';
  } else if (windSpeed < 1.6) {
    return 'Light air';
  } else if (windSpeed < 3.4) {
    return 'Light breeze';
  } else if (windSpeed < 5.5) {
    return 'Gentle breeze';
  } else if (windSpeed < 8) {
    return 'Moderate breeze';
  } else if (windSpeed < 10.8) {
    return 'Fresh breeze';
  } else if (windSpeed < 13.9) {
    return 'Strong breeze';
  } else if (windSpeed < 17.2) {
    return 'Near gale';
  } else if (windSpeed < 20.8) {
    return 'Gale';
  } else if (windSpeed < 24.5) {
    return 'Strong gale';
  } else if (windSpeed < 28.5) {
    return 'Storm';
  } else if (windSpeed < 32.7) {
    return 'Violent storm';
  } else {
    return 'Hurricane force';
  }
}

export const readingStore = {
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },
  // Export the readingStore object containing async functions to interact with the database
  async getLastReading() {
    await db.read();
    const lastReadings = db.data.stations.map((station) => {
      if (station.readings.length === 0) {
        return null;
      }
      const lastReading = station.readings[station.readings.length - 1];
      const temperatureCelsius = lastReading.temperature;
      const temperatureFahrenheit = temperatureCelsius * 9 / 5 + 32;
      const windSpeed = lastReading.windSpeed;
      const beaufortLevel = getBeaufortLevel(windSpeed);
      const beaufortDescription = getBeaufortLevelDescription(windSpeed);
      return {
        id: station.id,
        name: station.name,
        lastReading: lastReading,
        temperatureFahrenheit: temperatureFahrenheit,
        beaufortLevel: beaufortLevel,
        beaufortDescription: beaufortDescription,
      };
    });
    return lastReadings;
  },

};
