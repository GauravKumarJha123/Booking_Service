module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noOfSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending',
    },
    flightDate: {
      type: DataTypes.DATE, 
      allowNull: false, 
    },
  }, {});

  return Booking;
};
