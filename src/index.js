const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT || 4001;

const express = require('express');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');
const cron = require('./cron/bookingCron'); 

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', bookingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Booking Service is running' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

cron; // Start cron jobs
