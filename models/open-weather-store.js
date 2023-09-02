// Import the axios library for making HTTP requests
import axios from "axios";

function matchWeatherCode(code) {
    if (code === 800) return 100; // Clear
    if (code >= 801 && code <= 804) return 200; // Partial clouds
    if (code >= 701 && code <= 781) return 300; // Cloudy (fog, mist, etc.)
    if (code >= 300 && code <= 321) return 400; // Light Showers (drizzle)
    if (code >= 500 && code <= 531) return 500; // Heavy Showers (rain)
    if (code >= 400 && code <= 504) return 600; // Rain
    if (code >= 600 && code <= 622) return 700; // Snow
    if (code >= 200 && code <= 232) return 800; // Thunder
  
    return "Unknown weather condition";
  }

export const openWeather = {
    // Function to add an automatic reading based on latitude and longitude via the API http request
    async addAutoReading(latitude, longitude) {
        // Send a GET request to the API using axios
        const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,daily,alerts&appid=eb23fec2f9ae9cce17349beea60ea3f0`;
        const response = await axios.get(requestUrl);
        // Get the current date and time
        const date = new Date().toLocaleString();
        // Check if the response status is successful (200)
        if (response.status == 200) {
            // Extract weather data from the API response
            const weatherData = response.data.current;
            const weatherCode = Number(matchWeatherCode(weatherData.weather[0].id));
            // Extract weather code and round it to the nearest code(100-800)
            
            const newReading = {
                date: String(date),
                code: weatherCode,
                temperature: Number(weatherData.temp),
                windSpeed: Number(weatherData.wind_speed),
                windDirection: Number(weatherData.wind_deg),
                pressure: Number(weatherData.pressure),
            };
            return newReading;
        }
        // Return null if the API request was not successful
        return null;
    },
    // Function to get weather trend report data
    async getWeatherTrendReport(latitude, longitude) {
        // Initialize an empty report object with labels and data arrays
        let report = { labels: [], temperature: [], windSpeed: [], pressure: [] };
        // Create the request URL for the OpenWeatherMap API
        const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,alerts&appid=eb23fec2f9ae9cce17349beea60ea3f0`;
        // Send a GET request to the API using axios
        const response = await axios.get(requestUrl);

        // Check if the response status is successful (200)     
        if (response.status == 200) {
            const trendData = response.data.daily;
            // Loop through trendData to populate report arrays
            for (let i = 0; i < trendData.length; i++) {
                // Convert timestamp to a readable date
                const date = new Date(trendData[i].dt * 1000);
                // Push date, temperature, wind speed, and pressure data to report arrays
                report.labels.push(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
                report.temperature.push(trendData[i].temp.day);
                report.windSpeed.push(trendData[i].wind_speed);
                report.pressure.push(trendData[i].pressure);
            }
        }
        // Return the populated report object
        return report;
    }
}