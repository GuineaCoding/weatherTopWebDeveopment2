import axios from "axios";

export const openWeather = {

    async addAutoReading(latitude, longitude) {
        const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,daily,alerts&appid=eb23fec2f9ae9cce17349beea60ea3f0`;
        const response = await axios.get(requestUrl);
        const date = new Date().toLocaleString();

        if (response.status == 200) {
            const weatherData = response.data.current;
            const newReading = {
                date: String(date),
                code: Number(convertCode(weatherData.weather[0].id)),
                code: Number(weatherData.weather[0].id),
                temperature: Number(weatherData.temp),
                windSpeed: Number(weatherData.wind_speed),
                windDirection: Number(weatherData.wind_deg),
                pressure: Number(weatherData.pressure),
            };
            return newReading;
        }

        return null;
    },

}