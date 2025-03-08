const express = require('express');
const BookingController = require('../controllers/bookingController');
const router = express.Router();
const  { RequestValidators } = require('../middlewares/index');

router.post('/booking', RequestValidators.bookingRequestValidator, BookingController.createBooking);
router.get('/bookings', RequestValidators.getBookingValidator, BookingController.getBookingsByUser);
router.get('/bookings/:id',RequestValidators.getBookingByIdValidator , BookingController.getBookingById);
router.delete('/bookings/:id', RequestValidators.cancelBookingValidator, BookingController.cancelBooking);

module.exports = router;
