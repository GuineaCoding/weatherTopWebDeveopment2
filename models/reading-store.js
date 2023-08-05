import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { read } from "fs-extra";

const db = initStore("stations");

// Function to determine the Beaufort level based on wind speed
function getBeaufortLevel(windSpeed) {
  // Check the wind speed and return the corresponding Beaufort level
  // Each condition represents a Beaufort level range
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

// Function to calculate the wind chill temperature
function calculateWindChill(temperatureCelsius, windSpeedMps) {
  // Convert wind speed from m/s to mph
  const windSpeedMph = windSpeedMps * 2.23694;

  // Calculate wind chill using the formula
  const windChillCelsius = 13.12 + 0.6215 * temperatureCelsius - 11.37 * Math.pow(windSpeedMph, 0.16) + 0.3965 * temperatureCelsius * Math.pow(windSpeedMph, 0.16);

  // Return the wind chill value rounded to 1 decimal place
  return windChillCelsius.toFixed(1);
}

// Function to get the wind compass direction based on wind direction degrees
function getWindCompassDirection(windDirectionDegrees) {
  // Array containing the compass directions in geographical order
  const directions = [
    "North",
    "North-Northeast",
    "Northeast",
    "East-Northeast",
    "East",
    "East-Southeast",
    "Southeast",
    "South-Southeast",
    "South",
    "South-Southwest",
    "Southwest",
    "West-Southwest",
    "West",
    "West-Northwest",
    "Northwest",
    "North-Northwest",
  ];

  // Calculate the index of the corresponding compass direction in the array
  const index = Math.round((windDirectionDegrees % 360) / 22.5);
  // Return the wind compass direction based on the index
  return directions[index % 16];
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

function getMinValueFromParameter(id, value) {
  const foundStation = db.data.stations.find((station) => station.id === id);
  const temperatureValues = foundStation.readings.map((reading) => reading[value]);
  const min = Math.min(...temperatureValues);
  return min;
}

function getMaxValueFromParameter(id, value) {
  const foundStation = db.data.stations.find((station) => station.id === id);
  const temperatureValues = foundStation.readings.map((reading) => reading[value]);
  const max = Math.max(...temperatureValues);
  return max;
}

export const readingStore = {
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },

  // Function to retrieve readings for the opened station based on the station ID
  async getReadingByStationId(id) {
    await db.read();
    const station = db.data.stations.find((station) => station.id === id);
    return station.readings;
  },

  // Function to get the last reading for the opened station based on the station ID
  async getLastReading(id) {
    await db.read();
    const lastReadings = db.data.stations.map((station) => {
      return station.id === id && Array.isArray(station.readings) && station.readings.length > 0
        ? station.readings[station.readings.length - 1]
        : null;
    });

    // Find the station that matches the requested ID
    const foundStation = db.data.stations.find((station) => station.id === id);
    
    // If the station is not found or the station's readings array is empty, return null
    if (!foundStation || !foundStation.readings || foundStation.readings.length === 0) {
      return null;
    }

    // Find the last non-null reading in the lastReadings array
    const lastReading = lastReadings.find((reading) => reading !== null);

    // If no last non-null reading is found, return null
    if (!lastReading) {
      return null;
    }
    const temperatureCelsius = lastReading.temperature;
    const temperatureFahrenheit = temperatureCelsius * 9 / 5 + 32;
    const windSpeed = lastReading.windSpeed;
    const beaufortLevel = getBeaufortLevel(windSpeed);
    const beaufortDescription = getBeaufortLevelDescription(windSpeed);
    const windChill = calculateWindChill(temperatureCelsius, windSpeed);
    const windCompassDirection = getWindCompassDirection(lastReading.windDirection);
    const minTemperature = getMinValueFromParameter(id, "temperature");
    const maxTemperature = getMaxValueFromParameter(id, "temperature");
    const minWindSpeed = getMinValueFromParameter(id, "windSpeed");
    const maxWindSpeed = getMaxValueFromParameter(id, "windSpeed");
    const minPressure = getMinValueFromParameter(id, "pressure");
    const maxPressure = getMaxValueFromParameter(id, "pressure");

    // Return the prepared object with the last reading and additional data
    return {
      id: foundStation.id,
      latitude: foundStation.latitude,
      longitude: foundStation.longitude,
      name: foundStation.name,
      lastReading: lastReading,
      temperatureFahrenheit: temperatureFahrenheit,
      beaufortLevel: beaufortLevel,
      beaufortDescription: beaufortDescription,
      windChill: windChill,
      windCompassDirection: windCompassDirection,
      minTemperature: minTemperature,
      maxTemperature: maxTemperature,
      minWindSpeed: minWindSpeed,
      maxWindSpeed: maxWindSpeed,
      minPressure: minPressure,
      maxPressure: maxPressure,
    };
  },

  // Function to add a new reading for the choosen station
  
  async addReading(stationId, reading) {
    await db.read();

    // Generate a unique ID for the new reading
    reading.id = v4();
    reading.stationId = stationId;

    // Find the station that matches the requested stationId
    const station = db.data.stations.find((station) => station.id === stationId);

    // If the station is not found, log an error message
    if (!station) {
      console.log("Station not found");
    }

    // If the station's readings array is empty or undefined, initialize it as an empty array
    if (!station.readings) {
      station.readings = [];
    }
    // Push the new reading into the station's readings array
    station.readings.push(reading);
    await db.write();

    return reading;
  },
};
