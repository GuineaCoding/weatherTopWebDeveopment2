import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { read } from "fs-extra";

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

function calculateWindChill(temperatureCelsius, windSpeedMps) {
  const windSpeedMph = windSpeedMps * 2.23694;
  const windChillCelsius = 13.12 + 0.6215 * temperatureCelsius - 11.37 * Math.pow(windSpeedMph, 0.16) + 0.3965 * temperatureCelsius * Math.pow(windSpeedMph, 0.16);
  return windChillCelsius.toFixed(1);
}

function getWindCompassDirection(windDirectionDegrees) {
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
  const index = Math.round((windDirectionDegrees % 360) / 22.5);
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

export const readingStore = {
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },
  async getReadingByStationId(id) {
    await db.read();
    const station = db.data.stations.find((station) => station.id === id);
    return station.readings;
  },
  // Export the readingStore object containing async functions to interact with the database
  async getLastReading(id) {
    await db.read();
    const lastReadings = db.data.stations.map((station) => {
      return station.id === id && station.readings.length > 0
        ? station.readings[station.readings.length - 1]
        : null;
    });

    const foundStation = db.data.stations.find((station) => station.id === id);
    if (!foundStation || foundStation.readings.length === 0) {
      return null;
    }

    const lastReading = lastReadings.find((reading) => reading !== null);
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

    return {
      id: foundStation.id,
      name: foundStation.name,
      lastReading: lastReading,
      temperatureFahrenheit: temperatureFahrenheit,
      beaufortLevel: beaufortLevel,
      beaufortDescription: beaufortDescription,
      windChill: windChill,
      windCompassDirection: windCompassDirection,
      
    };
  },
  async addReading(stationId, reading) {
    await db.read();
    reading.id = v4();
    reading.stationId = stationId;
    const station = db.data.stations.find((station) => station.id === stationId);
    if (!station) {
      console.log("Station not found");
    }
    if (!station.readings) {
      station.readings = [];
    }
    station.readings.push(reading); 
    await db.write();
    return reading;
  },
};
