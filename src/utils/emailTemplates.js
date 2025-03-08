const generateBookingConfirmationEmail = (booking, flightData, flightDate, departureCityName, arrivalCityName, departureCityAirportName, arrivalCityAirportName) => {
    return {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: 'Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4CAF50;">Booking Confirmation</h2>
          <p>Dear ${booking.userName},</p>
          <p>Your flight booking has been confirmed with the following details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="text-align: left; padding: 8px;">Flight Number</th>
              <td style="padding: 8px;">${flightData.flightNumber}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px;">Departure</th>
              <td style="padding: 8px;">${departureCityName}, ${departureCityAirportName}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px;">Arrival</th>
              <td style="padding: 8px;">${arrivalCityName}, ${arrivalCityAirportName}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px;">Date</th>
              <td style="padding: 8px;">${flightDate}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px;">Time</th>
              <td style="padding: 8px;">${flightData.departureTime}</td>
            </tr>
          </table>
          <p>We look forward to serving you on your journey. If you have any questions, please don't hesitate to contact us.</p>
          <p>Thank you for booking with us. We wish you a pleasant journey!</p>
          <p>Best regards,<br/>The Airline Team</p>
        </div>
      `
    };
  };
  
  const generateReminderEmail = (booking, flightData) => {
    return {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: 'Flight Reminder: Your Flight is Scheduled for Today',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4CAF50; text-align: center;">Flight Reminder</h2>
          <p>Dear ${booking.userName},</p>
          <p>This is a friendly reminder that your flight is scheduled for today. Here are the details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="text-align: left; padding: 8px;">Flight Number</th>
              <td style="padding: 8px;">${flightData.flightNumber}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px;">Departure</th>
              <td style="padding: 8px;">${flightData.departureCity}, ${flightData.departureAirport}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px;">Arrival</th>
              <td style="padding: 8px;">${flightData.arrivalCity}, ${flightData.arrivalAirport}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px;">Date</th>
              <td style="padding: 8px;">${flightData.date}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px;">Departure Time</th>
              <td style="padding: 8px;">${flightData.departureTime}</td>
            </tr>
          </table>
          <p>We wish you a safe and pleasant journey!</p>
          <p>Best regards,<br/>The Airline Team</p>
        </div>
      `
    };
  };
  
  module.exports = {
    generateBookingConfirmationEmail,
    generateReminderEmail
  };
  