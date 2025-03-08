const axios = require('axios');
const nodemailer = require('nodemailer');
const BookingRepository = require('../repository/bookingRepository');
const { flightServiceUrl, service, user, pass } = require('../config/config');
const logger  = require('../utils/logger'); 
const { sendEmail } = require('../utils/emailConfig');
const { generateBookingConfirmationEmail, generateReminderEmail } = require('../utils/emailTemplates');

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const flightResponse = await axios.get(`${flightServiceUrl}/api/v1/flights/${data.flightId}`);
      const flightData = flightResponse.data.data;      
      console.log(flightData);
      
      const flightDateOnly = new Date(flightData.departureTime).toISOString().split('T')[0];
      console.log(flightDateOnly);
      
      if (data.flightDate !== flightDateOnly) {
          await axios.patch(`${flightServiceUrl}/api/v1/flights/${data.flightId}`, {
              departureTime: new Date(data.flightDate).toISOString()
          });
      }     

      if (data.noOfSeats > flightData.totalSeats) {
        logger.error('Insufficient seats available');
          throw new Error('Insufficient seats available');
      }

      const totalCost = flightData.price * data.noOfSeats;
      console.log(totalCost);
      
      const bookingPayload = { ...data,totalCost, status: 'Pending' };
      console.log(bookingPayload);
      
      const booking = await this.bookingRepository.create(bookingPayload);

      await axios.patch(`${flightServiceUrl}/api/v1/flights/${booking.flightId}`, {
          totalSeats: flightData.totalSeats - booking.noOfSeats
      });
      booking.status = 'Booked';
          
      try {
        await booking.save();
        logger.info(`Booking created successfully for user ${booking.userId} with booking ID ${booking.id}`);
          } catch (error) {
            logger.error(`Error saving booking: ${error.message}`);
        console.error('Error saving booking:', error.message);
          }
      
      await this.sendConfirmationEmail(booking, flightData , data.flightDate);
      return booking;
    } catch (error) {
      logger.error(`Error creating booking: ${error.message}`);
      throw new ServiceError('Could not create booking', error);
    }
  }

  async findByUserId(userId) {
    logger.info(`Booking repo is hit at findByUserId for user ${userId}`);    
    return await this.bookingRepository.findByUserId(userId);
  }
  
  async findById(id) {
    logger.info(`Booking repo is hit at findById for booking ID ${id}`);
    return await this.bookingRepository.findById(id);
  }
  
  async deleteById(booking) {
    logger.info(`Booking repo is hit at deleteById for booking`);
    return await this.bookingRepository.deleteById(booking.id);
  }
  

  async sendConfirmationEmail(booking, flightData , flightDate) {
    const departureAirport = await axios.get(`${flightServiceUrl}/api/v1/airports/${flightData.departureAirportId}`);
    const arrivalAirport = await axios.get(`${flightServiceUrl}/api/v1/airports/${flightData.arrivalAirportId}`);
  
    const departureCityRes = await axios.get(`${flightServiceUrl}/api/v1/city/${departureAirport.data.data.cityId}`);
    const arrivalCityRes = await axios.get(`${flightServiceUrl}/api/v1/city/${arrivalAirport.data.data.cityId}`);
    
    const emailTemplate = generateBookingConfirmationEmail(
      booking, 
      flightData,
      flightDate ?? flightData.departureTime,
      departureCityRes.data.data.name, 
      arrivalCityRes.data.data.name,
      departureAirport.data.data.name,
      arrivalAirport.data.data.name
    );
  
    await sendEmail(emailTemplate);
  }
  

  async getBookingsForToday() {
    const bookings = await this.bookingRepository.findAllBookingsForToday();
    return bookings;
  }

  async sendReminderEmail(booking, flightData){
    const emailTemplate = generateReminderEmail(booking, flightData);
    await sendEmail(emailTemplate);
  }

  async getBookingsByUserId(userId) {
    return await this.bookingRepository.findAll({
      where: { userId }
    });
  }

}

module.exports = BookingService;
