const joi = require('joi'); 

const bookingSchema = joi.object({
    userId: joi.number().required(),
    flightId: joi.number().required(),
    flightDate: joi.date().required(),
    email : joi.string().email().required(),
    userName: joi.string().optional(),
    noOfSeats: joi.number().required(),
});

const getBookingSchema = joi.object({
    userId: joi.number().optional(),
});

const getBookingByIdSchema = joi.object({
    id: joi.number().required(),
});

const cancelBookingSchema = joi.object({
    email: joi.string().required(),
    bookingId: joi.number().required(),
});

module.exports = {bookingSchema, getBookingSchema, getBookingByIdSchema, cancelBookingSchema};