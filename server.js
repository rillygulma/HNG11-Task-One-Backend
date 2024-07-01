// functions/server.js
const express = require('express');
const requestIp = require('request-ip');
const axios = require('axios');
require('dotenv').config();

const app = express();
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const LOCATION = 'New York';

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = requestIp.getClientIp(req);

  try {
    if (!WEATHER_API_KEY) {
      throw new Error('WEATHER_API_KEY is not defined. Please check your .env file.');
    }

    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: LOCATION,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

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

module.exports = app;
