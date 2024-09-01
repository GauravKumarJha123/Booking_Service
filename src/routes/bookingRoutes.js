const express = require('express');
const BookingController = require('../controllers/bookingController');
const router = express.Router();

router.post('/booking', BookingController.createBooking);
router.get('/bookings', BookingController.getBookingsByUser);
router.get('/bookings/:id', BookingController.getBookingById);
router.delete('/bookings/:id', BookingController.cancelBooking);

module.exports = router;
