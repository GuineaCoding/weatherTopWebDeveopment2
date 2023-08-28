import axios from "axios";

export const openWeather = {

    async addAutoReading(latitude, longitude) {
        const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,daily,alerts&appid=eb23fec2f9ae9cce17349beea60ea3f0`;
        const response = await axios.get(requestUrl);
        const date = new Date().toLocaleString();

        if (response.status == 200) {
            const weatherData = response.data.current;
            // console.log('weatherData:', weatherData);
            const weatherCode = Number(weatherData.weather[0].id);
            console.log(weatherCode)
            const roundedCode = Math.round(weatherCode / 100) * 100;
            console.log(roundedCode)
            const newReading = {
                date: String(date),
                code: roundedCode,
                temperature: Number(weatherData.temp),
                windSpeed: Number(weatherData.wind_speed),
                windDirection: Number(weatherData.wind_deg),
                pressure: Number(weatherData.pressure),
            };
            return newReading;
        }

        return null;
    },
    async getWeatherTrendReport(latitude, longitude) {
        let report = { labels: [], temperature: [], windSpeed: [], pressure: [] };
        const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,alerts&appid=eb23fec2f9ae9cce17349beea60ea3f0`;

        const response = await axios.get(requestUrl);
        
        if (response.status == 200) {
            const trendData = response.data.daily;
            for (let i = 0; i < trendData.length; i++) {
                const date = new Date(trendData[i].dt * 1000);
                report.labels.push(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
                report.temperature.push(trendData[i].temp.day);
                report.windSpeed.push(trendData[i].wind_speed);
                report.pressure.push(trendData[i].pressure);
            }
        }
        return report;
    }
}