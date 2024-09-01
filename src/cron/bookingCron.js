const cron = require('node-cron');
const BookingService = require('../services/bookingService');
const bookingService = new BookingService();
const axios = require('axios');
const { flightServiceUrl } = require('../config/config');

cron.schedule('0 */6 * * *', async () => {
  try {
    const bookings = await bookingService.getBookingsForToday();
    for(const booking of bookings){
      const flightResponse = await axios.get(`${flightServiceUrl}/api/v1/flights/${booking.flightId}`);
      const flightData = flightResponse.data.data;

      await bookingService.sendReminderEmail(booking, flightData);
    } 
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});

module.exports = cron;
