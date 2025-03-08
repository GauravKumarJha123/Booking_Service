const Joi = require('joi');
const logger = require('../utils/logger');
const {bookingSchema , getBookingSchema, getBookingByIdSchema, cancelBookingSchema} = require('../utils/validation-schema');

const bookingRequestValidator = (req, res, next) => {
    const { error } = bookingSchema.validate(req.body);

    if (error) {
        logger.error('Booking request validation failed', error.details);
        return res.status(400).json({success : false, error: error.details[0].message });
    }
    next();
};

const getBookingValidator = (req, res, next) => {
    const { error } = getBookingSchema.validate(req.query);

    if (error) {
        logger.error('Get booking request validation failed', error.details);
        return res.status(400).json({success : false, error: error.details[0].message });
    }
    next();
}

const getBookingByIdValidator = (req, res, next) => {
    const { error } = getBookingByIdSchema.validate(req.params);

    if (error) {
        logger.error('Get booking by ID request validation failed', error.details);
        return res.status(400).json({success : false, error: error.details[0].message });
    }
    next();
}

const cancelBookingValidator = (req, res, next) => {
    const { error } = cancelBookingSchema.validate(req.body);

    if (error) {
        logger.error('Cancel booking request validation failed', error.details);
        return res.status(400).json({success : false, error: error.details[0].message });
    }
    next();
}
module.exports =  {bookingRequestValidator , getBookingValidator, getBookingByIdValidator, cancelBookingValidator};