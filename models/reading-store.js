import { initStore } from "../utils/store-utils.js";

const db = initStore("stations");

function getBeaufortLevel(windSpeed) {
  if (windSpeed < 0.5) {
    return 0;
  } else if (windSpeed <= 7) {
    return 1;
  } else if (windSpeed <= 13.8) {
    return 2;
  } else if (windSpeed <= 20.7) {
    return 3;
  } else if (windSpeed <= 28.5) {
    return 4;
  } else if (windSpeed <= 38.8) {
    return 5;
  } else if (windSpeed <= 49.9) {
    return 6;
  } else if (windSpeed <= 61.2) {
    return 7;
  } else if (windSpeed <= 74.5) {
    return 8;
  } else if (windSpeed <= 88.5) {
    return 9;
  } else if (windSpeed <= 102.8) {
    return 10;
  } else {
    return 11; // Maximum value for the provided ranges
  }
}

function getBeaufortLevelDescription(windSpeed) {
  if (windSpeed < 0.5) {
    return 'Calm';
  } else if (windSpeed <= 7) {
    return 'Light Air';
  } else if (windSpeed <= 13.8) {
    return 'Light Breeze';
  } else if (windSpeed <= 20.7) {
    return 'Gentle Breeze';
  } else if (windSpeed <= 28.5) {
    return 'Moderate Breeze';
  } else if (windSpeed <= 38.8) {
    return 'Fresh Breeze';
  } else if (windSpeed <= 49.9) {
    return 'Strong Breeze';
  } else if (windSpeed <= 61.2) {
    return 'Near Gale';
  } else if (windSpeed <= 74.5) {
    return 'Gale';
  } else if (windSpeed <= 88.5) {
    return 'Severe Gale';
  } else if (windSpeed <= 102.8) {
    return 'Strong Storm';
  } else {
    return 'Violent Storm';
  }
}

function getWeatherDescription(code) {
  const weatherDescriptions = {
    100: "Clear",
    200: "Partial clouds",
    300: "Cloudy",
    400: "Light Showers",
    500: "Heavy Showers",
    600: "Rain",
    700: "Snow",
    800: "Thunder",
  };

  return weatherDescriptions[code];
}

export const readingStore = {
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },
  
  async getLastReading() {
    await db.read();
    const lastReadings = db.data.stations.map((station) => {
      if (station.readings.length === 0) {
        return { id: station.id, name: station.name, lastReading: null }; // Indicate no data
      }
      const lastReading = station.readings[station.readings.length - 1];
      const temperatureCelsius = lastReading.temperature;
      const temperatureFahrenheit = temperatureCelsius * 9 / 5 + 32;
      const windSpeed = lastReading.windSpeed;
      const beaufortLevel = getBeaufortLevel(windSpeed);
      const beaufortDescription = getBeaufortLevelDescription(windSpeed);
      const weatherDescription = getWeatherDescription(lastReading.code);
      return {
        id: station.id,
        name: station.name,
        lastReading: lastReading,
        temperatureFahrenheit: temperatureFahrenheit,
        beaufortLevel: beaufortLevel,
        beaufortDescription: beaufortDescription,
        weatherDescription: weatherDescription,
      };
    }); 
    return lastReadings;
  },
};
