const BookingService = require('../services/bookingService');
const bookingService = new BookingService();

exports.createBooking = async (req, res) => {
  try {    
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);    
    res.status(500).json({
      success: false,
      message: 'Could not create booking',
      error: error.message
    });
  }
};

exports.getBookingsByUser = async (req, res) => {
  try {
    console.log(`controller is hit at getBookingsByUser`);
    const userId = req.query.userId;
    console.log(`userId from the Req is ${userId}`);
    
    if(!userId){
      throw new Error('User id is missing from query params');
    }
    const bookings = await bookingService.findByUserId(userId);
    res.status(200).json({
      success: true,
      data: bookings,
      message: 'Bookings fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch bookings',
      error: error.message
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    if(!bookingId){
        throw new Error('Booking ID is invalid no flight with the given booking Id')
    }
    console.log(bookingId);
         
    const booking = await bookingService.findById(bookingId);

    if(!booking){
      return res.status(404).json({
        success : false,
        data : booking,
        message : 'No Booking with the given ID'
      })
    }



    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch booking',
      error: error.message
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const email = req.body.email;
    console.log(email);
    
    if(!bookingId){
        throw new Error('Booking ID is invalid no flight with the given booking Id')
    }
    const booking = await bookingService.findById(bookingId);

    if(!booking){
      //throw new Error('there does not exist any booking with that Id');
      return res.status(404).json({
        success: false,
        data : booking,
        message : `No Booking found for the given Booking ID ${bookingId}`,
      });
    }

    console.log(booking);
    
    if(booking.email !== email){
      //throw new Error('there does not exist any booking with that Id');
      return res.status(404).json({
        success: false,
        data : {},
        message : `Please provide correct email id associated with Booking ID ${bookingId}`,
      });
    }
    await bookingService.deleteById(booking);
    res.status(200).json({
      success: true,
      data : booking,
      message: `Booking cancelled successfully for Booking Id ${booking.bookingId}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not cancel booking',
      error: error.message
    });
  }
};
