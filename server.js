const express = require('express');
const requestIp = require('request-ip');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY; // Get API key from environment variable
const LOCATION = 'New York'; // Location to fetch weather for

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = requestIp.getClientIp(req);

  try {
    // Check if the API key is loaded correctly
    if (!WEATHER_API_KEY) {
      throw new Error('WEATHER_API_KEY is not defined. Please check your .env file.');
    }

    // Fetch weather data from OpenWeatherMap API
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: LOCATION,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    // Ensure the API response contains the expected data
    if (!weatherResponse.data || !weatherResponse.data.main || typeof weatherResponse.data.main.temp !== 'number') {
      throw new Error('Unexpected response format from weather API');
    }

    const temperature = weatherResponse.data.main.temp;

    const response = {
      client_ip: clientIp,
      location: LOCATION,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${LOCATION}`
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Error fetching weather data', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
