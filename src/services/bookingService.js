const axios = require('axios');
const nodemailer = require('nodemailer');
const BookingRepository = require('../repository/bookingRepository');
const { flightServiceUrl, service, user, pass } = require('../config/config'); 

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
      
      // if (data.flightDate !== flightDateOnly) {
      //     await axios.patch(`${flightServiceUrl}/api/v1/flights/${data.flightId}`, {
      //         departureTime: new Date(data.flightDate).toISOString()
      //     });
      // }
      

      if (data.noOfSeats > flightData.totalSeats) {
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
      console.log(`Total Seats are updated after booking ${flightData.totalSeats}`);
      booking.status = 'Booked';
      console.log(booking.status);
          
      console.log('Booking before save:', booking);
      try {
        await booking.save();
        console.log('Booking saved successfully.');
          } catch (error) {
        console.error('Error saving booking:', error.message);
          }
      console.log('Booking after save:', booking);
      
      await this.sendConfirmationEmail(booking, flightData);
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error.message);
      throw new ServiceError('Could not create booking', error);
    }
  }

  async findByUserId(userId) {
    console.log(`Service Logic is hit for findByUserId`);    
    return await this.bookingRepository.findByUserId(userId);
  }
  
  async findById(id) {
    return await this.bookingRepository.findById(id);
  }
  
  async deleteById(booking) {
    return await this.bookingRepository.deleteById(booking.id);
  }
  

  async sendConfirmationEmail(booking, flightData) {
    const email = booking.email;
    const userName = booking.userName;
    const transporter = nodemailer.createTransport({
      service: service,
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass
      }
    });

    const departureAirport = await axios.get(`${flightServiceUrl}/api/v1/airports/${flightData.departureAirportId}`);
    console.log(departureAirport);
    
    const departureCityId = departureAirport.data.data.cityId;
    const departureCityAirportName = departureAirport.data.data.name;    

    const arrivalAirport = await axios.get(`${flightServiceUrl}/api/v1/airports/${flightData.arrivalAirportId}`);
    const arrivalCityId = arrivalAirport.data.data.cityId;
    const arrivalCityAirportName = arrivalAirport.data.data.name;

    const arrivalCityRes = await axios.get(`${flightServiceUrl}/api/v1/city/${arrivalCityId}`);
    const departureCityRes = await axios.get(`${flightServiceUrl}/api/v1/city/${departureCityId}`);

    const arrivalCityName = arrivalCityRes.data.data.name;
    const departureCityName = departureCityRes.data.data.name;

    const mailOptions = {
      from: user,
      to: email,
      subject: 'Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4CAF50;">Booking Confirmation</h2>
          <p>Dear ${userName},</p>
          <p>Your flight booking has been confirmed with the following details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Flight Number:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${flightData.flightNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Flight Date:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${booking.flightDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>From:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${departureCityName} (${departureCityAirportName})</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>To:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${arrivalCityName} (${arrivalCityAirportName})</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Number of Seats:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${booking.noOfSeats}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Boarding Gate:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${flightData.boardingGate}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Cost:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">₹${booking.totalCost}</td>
            </tr>
          </table>
          <p>Thank you for booking with us. We wish you a pleasant journey!</p>
          <p style="color: #555;">If you have any questions, feel free to contact us.</p>
        </div>
        Best regards,<br>
        Vistara Airlines
      `
    };
    

    await transporter.sendMail(mailOptions);
  }

  async getBookingsForToday() {
    const bookings = await this.bookingRepository.findAllBookingsForToday();
    // console.log(`Booking for the current date ${bookings.data}`);
    // console.log(`Booking for the current date ${bookings}`);
    return bookings;
  }

  async sendReminderEmail(booking, flightData){
    const email = booking.email;
    const userName = booking.userName;
    const transporter = nodemailer.createTransport({
      service: service,
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass
      }
    });

    const mailOptions = {
      from: user,
      to: email,
      subject: 'Flight Reminder: Your Flight is Scheduled for Today',
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #4CAF50; text-align: center;">Flight Reminder</h2>
              <p>Dear ${userName},</p>
              <p>This is a friendly reminder that your flight is scheduled for today. Here are the details:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr>
                      <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Flight Number:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${flightData.flightNumber}</td>
                  </tr>
                  <tr>
                      <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Flight Date:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${booking.flightDate}</td>
                  </tr>
                  <tr>
                      <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Boarding Gate:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${flightData.boardingGate}</td>
                  </tr>
                  <tr>
                      <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Total Seats:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${booking.noOfSeats}</td>
                  </tr>
                  <tr>
                      <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Total Cost:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">₹${booking.totalCost}</td>
                  </tr>
              </table>
              <p style="color: #555;">Please ensure you arrive at the airport on time. We wish you a pleasant journey!</p>
              <p style="text-align: center; font-weight: bold;">Thank you for choosing our airline.</p>
              <p style="text-align: center;">For any inquiries, contact our support at <a href="mailto:support@airline.com">support@airline.com</a>.</p>
          </div>
      `
  };

    await transporter.sendMail(mailOptions);
  }

  async getBookingsByUserId(userId) {
    return await this.bookingRepository.findAll({
      where: { userId }
    });
  }

}

module.exports = BookingService;
