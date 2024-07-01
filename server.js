const express = require('express');
const requestIp = require('request-ip');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/hello', (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = requestIp.getClientIp(req);
  // Simulate location based on IP (for demonstration)
  const location = 'New York';
  // Simulate temperature (for demonstration)
  const temperature = 11;

  const response = {
    client_ip: clientIp,
    location: location,
    greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
  };

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
