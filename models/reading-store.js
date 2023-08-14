// Import the 'initStore' function from '../utils/store-utils.js'
import { initStore } from "../utils/store-utils.js";

// Call the 'initStore' function with the argument "stations" and store the returned data in the constant 'db'
const db = initStore("stations");

// Function to determine the Beaufort level based on wind speed
function getBeaufortLevel(windSpeed) {
  // Check wind speed ranges and return corresponding Beaufort level
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

// Function to get the Beaufort level description based on wind speed
function getBeaufortLevelDescription(windSpeed) {
  // Check wind speed ranges and return corresponding Beaufort level description
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

// Function to get the weather description based on weather code
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

// Export the 'readingStore' object containing async functions to interact with the database
export const readingStore = {
  // Function to retrieve all readings from the database
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },
  
  // Function to retrieve the last readings for all stations
  async getLastReading() {
    await db.read();
    const lastReadings = db.data.stations.map((station) => {
      if (station.readings.length === 0) {
        return { id: station.id, name: station.name, lastReading: null }; // Indicate no data
      }
      // Retrieve data from the last reading
      const lastReading = station.readings[station.readings.length - 1];
      const temperatureCelsius = lastReading.temperature;
      const temperatureFahrenheit = temperatureCelsius * 9 / 5 + 32;
      const windSpeed = lastReading.windSpeed;
      const beaufortLevel = getBeaufortLevel(windSpeed);
      const beaufortDescription = getBeaufortLevelDescription(windSpeed);
      const weatherDescription = getWeatherDescription(lastReading.code);
      
      // Return the data in the desired format
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
