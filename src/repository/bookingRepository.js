const { Booking, sequelize  } = require('../models');
const { Op } = require('sequelize');

class BookingRepository {
  async create(data) {
    return await Booking.create(data);
  }

  async update(bookingId, data) {
    const booking = await Booking.findByPk(bookingId);
    if (booking) {
      await booking.update(data);
    }
    return booking;
  }

  async findById(id) {
    return await Booking.findByPk(id);
  }

  async findByUserId(userId) {
    console.log(`Booking repo is hit at findByUserId`);
    const data = await Booking.findAll({ where: { userId :  userId } });
    console.log(data.data);
    
    return data;
  }

  async deleteById(id) {
    return await Booking.destroy({ where: { id } });
  }

  async findAll(query) {
    return await Booking.findAll(query);
  }

  async findAllBookingsForToday() {
    const today = new Date();
    const todayStart = today.setHours(0, 0, 0, 0);
    const todayEnd = today.setHours(23, 59, 59, 999);

    const bookings = await Booking.findAll({
        where: {
            flightDate: {
                [Op.between]: [todayStart, todayEnd]
            }
        }
    });

    console.log(bookings);  // Check the structure here
    return bookings;
}
}

module.exports = BookingRepository;
