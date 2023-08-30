import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { read } from "fs-extra";
import Handlebars from "handlebars";

const db = initStore("stations");

function findStationById(id) {
  return db.data.stations.find((station) => station.id === id);
}

// Function to determine the Beaufort level based on wind speed
function getBeaufortLevel(windSpeed) {
  // Check the wind speed and return the corresponding Beaufort level
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

// Function to get the weather description based on weather code
function getWeatherDescription(weatherCode) {
  const weatherDescriptions = {
    100: "Clear",
    200: "Partial clouds",
    300: "Cloudy",
    400: "Light Showers",
    500: "Heavy Showers",
    600: "Rain",
    700: "Snow",
    800: "Thunder"
  };

  // Return the weather description corresponding to the provided weather code
  return weatherDescriptions[weatherCode];
}

// Define a Handlebars helper named 'weatherIcon'
Handlebars.registerHelper('weatherIcon', function (weatherCode) {
  const weatherIcons = {
    100: 'sun',
    200: 'cloud-sun',
    300: 'cloud',
    400: 'cloud-rain',
    500: 'cloud-showers-heavy',
    600: 'rain',
    700: 'snow',
    800: 'thunder',
  };

  // Get the icon class corresponding to the provided weather code
  const iconClass = weatherIcons[weatherCode];

  // Create an HTML string containing the Font Awesome icon
  return new Handlebars.SafeString(`<img class="weather-icon-image" src="../images/weather-images/${iconClass}.png"></img>`);
});

function calculateTrend(values) {
  const trendThreshold = 3; // Number of consecutive readings for a trend
  let trend = ""; // Initialize the trend as neutral

  if (values.length < trendThreshold) {
    return "Steady"; // Not enough data for a trend, default to Steady
  }

  let risingCount = 0;
  let fallingCount = 0;
  let steadyCount = 0;

  for (let i = 0; i < values.length; i++) {
    if (values[i] > values[i - 1]) {
      risingCount++;
      fallingCount = 0; // Reset falling count
      steadyCount = 0; // Reset steady count
    } else if (values[i] < values[i - 1]) {
      fallingCount++;
      risingCount = 0; // Reset rising count
      steadyCount = 0; // Reset steady count
    } else {
      steadyCount++;
      risingCount = 0; // Reset rising count
      fallingCount = 0; // Reset falling count
    }

    if (risingCount >= trendThreshold - 1) {
      trend = "Rising";
      break;
    } else if (fallingCount >= trendThreshold - 1) {
      trend = "Falling";
      break;
    } else if (steadyCount >= trendThreshold - 1) {
      trend = "Steady"; // Set trend to Steady if values are equal for the specified threshold
      break;
    }
  }

  if (trend === "") {
    trend = "Steady"; // Default to Steady if no clear trend is found
  }

  return trend;
}

// Handlebars helper function to generate the trend icon based on the trend value
Handlebars.registerHelper('trendIcon', function (trend) {
  const trendIcons = {
    'Rising': 'arrow-circle-up',
    'Falling': 'arrow-circle-down',
    'Steady': 'steady',
  };
  // Get the corresponding icon class from the mapping based on the provided trend value
  const iconClass = trendIcons[trend];

  // Create an HTML string containing the Font Awesome icon
  return new Handlebars.SafeString(`<img class="weather-icon-image" src="../images/weather-images/${iconClass}.png"></img>`);
});


// Function to get the Beaufort level description based on wind speed
function getBeaufortLevelDescription(windSpeed) {
  if (windSpeed < 1) {
    return 'Calm';
  } else if (windSpeed <= 5) {
    return 'Light Air';
  } else if (windSpeed <= 11) {
    return 'Light Breeze';
  } else if (windSpeed <= 19) {
    return 'Gentle Breeze';
  } else if (windSpeed <= 28) {
    return 'Moderate Breeze';
  } else if (windSpeed <= 38) {
    return 'Fresh Breeze';
  } else if (windSpeed <= 49) {
    return 'Strong Breeze';
  } else if (windSpeed <= 61) {
    return 'Near Gale';
  } else if (windSpeed <= 74) {
    return 'Gale';
  } else if (windSpeed <= 88) {
    return 'Severe Gale';
  } else if (windSpeed <= 102) {
    return 'Strong Storm';
  } else {
    return 'Violent Storm';
  }
}

// Handlebars helper function to generate the Beaufort scale icon based on the description
Handlebars.registerHelper("beaufortIcon", function (beaufortDescription) {
  const iconMapping = {
    "Calm": "fa-rainbow",
    "Light Air": "fa-feather",
    "Light Breeze": "fa-smog",
    "Gentle Breeze": "fa-water",
    "Moderate Breeze": "fa-wind",
    "Fresh Breeze": "fa-wind",
    "Strong Breeze": "fa-wind",
    "Near Gale": "fa-icicles",
    "Gale": "fa-meteor",
    "Severe Gale": "fa-cloud-meatball",
    "Strong Storm": "fa-tornado",
    "Violent Storm": "fa-house-tsunami",
    "Hurricane Force": "fa-hurricane",
  };

  // Get the corresponding icon name from the mapping based on the provided description
  const iconName = iconMapping[beaufortDescription];

  // Return the generated HTML for the icon using the selected icon name
  return new Handlebars.SafeString(`<i class="fa-solid ${iconName}"></i>`);
});

// Helper function to get the temperature range and corresponding Font Awesome icon based on temperature
Handlebars.registerHelper('temperatureRangeAndIcon', function (temperature) {
  let temperatureRange = '';
  if (temperature < 0) {
    temperatureRange = 'Freezing';
  } else if (temperature < 10) {
    temperatureRange = 'Cold';
  } else if (temperature < 20) {
    temperatureRange = 'Moderate';
  } else if (temperature < 30) {
    temperatureRange = 'Warm';
  } else {
    temperatureRange = 'Hot';
  }

  const temperatureIcons = {
    Freezing: 'fa-temperature-empty',
    Cold: 'fa-temperature-quarter',
    Moderate: 'fa-solid fa-solid fa-temperature-half',
    Warm: 'fa-temperature-full',
    Hot: 'fa-temperature-high',
  };

  const temperatureIcon = temperatureIcons[temperatureRange];
  return new Handlebars.SafeString(`<i class="fa-solid ${temperatureIcon}"></i>`);
});


//function to get the Min Value from the reading parameter
function getMinValueFromParameter(id, value) {
  const foundStation = findStationById(id);
  const temperatureValues = foundStation.readings.map((reading) => reading[value]);
  const min = Math.min(...temperatureValues);
  return min;
}
//function to get the Max Value from the reading parameter
function getMaxValueFromParameter(id, value) {
  const foundStation = findStationById(id);
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
    const station = findStationById(id);
    return station.readings;
  },

  // Function to get the last reading for the opened station based on the station ID
  async getLastReading(id) {
    await db.read();
    const foundStation = findStationById(id);

    if (!foundStation || !foundStation.readings || foundStation.readings.length === 0) {
      return null;
    }

    // Find the last non-null reading in the lastReadings array
    const lastReading = foundStation.readings[foundStation.readings.length - 1];
    const recentReadings = foundStation.readings.slice(-3);
    // If no last non-null reading is found, return null
    if (!lastReading) {
      return null;
    }
    const temperatureTrendValues = recentReadings.map((reading) => reading.temperature);
    const windSpeedTrendValues = recentReadings.map((reading) => reading.windSpeed);
    const pressureTrendValues = recentReadings.map((reading) => reading.pressure);
    const temperatureCelsius = lastReading.temperature;
    const weatherDescription = getWeatherDescription(lastReading.code);
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
    const temperatureTrend = calculateTrend(temperatureTrendValues);
    const windSpeedTrend = calculateTrend(windSpeedTrendValues);
    const pressureTrend = calculateTrend(pressureTrendValues);
    // Return the prepared object with the last reading and additional data
    return {
      id: foundStation.id,
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
      weatherDescription: weatherDescription,
      temperatureTrend: temperatureTrend,
      windSpeedTrend: windSpeedTrend,
      pressureTrend: pressureTrend,
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
      // Redirect to the "station-not-found" page
      response.redirect("/notFound");
      return;
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

// Delete reading from a station
async deleteReading(stationId, readingId) {
  // Load data from the database
  await db.read();

  // Find the station using its ID
  const station = db.data.stations.find((station) => station.id === stationId);

  // If station doesn't exist, do nothing
  if (!station) {
    return;
  }

  // Find the index of the reading in the station's readings list
  const index = station.readings.findIndex((reading) => reading.id === readingId);

  // If the reading is found, remove it and update the database
  if (index !== -1) {
    station.readings.splice(index, 1); // remove the reading from the list
    await db.write(); // save the updated data to the database
  } else {
    console.log(`Reading not found`);
  }
},

  async getReadingById(readingId) {
    await db.read();

    // Loop through all stations and their readings to find the matching reading
    for (const station of db.data.stations) {
      const foundReading = station.readings.find((reading) => reading.id === readingId);
      if (foundReading) {
        return foundReading;
      }
    }

    return null; // Return null if reading is not found
  },
  async updateReading(readingId, updatedReading) {
    const reading = await this.getReadingById(readingId);
    reading.code = updatedReading.code;
    reading.temperature = updatedReading.temperature;
    reading.windSpeed = updatedReading.windSpeed;
    reading.pressure = updatedReading.pressure;
    reading.windDirection = updatedReading.windDirection;
    await db.write();
  },
};
