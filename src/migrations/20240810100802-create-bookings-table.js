'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bookings', 'flightDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Bookings', 'flightDate');
  }
};
