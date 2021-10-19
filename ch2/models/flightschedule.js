'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FlightSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FlightSchedule.init({
    originAirport: DataTypes.STRING,
    destinationAirport: DataTypes.STRING,
    departureTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FlightSchedule',
  });
  return FlightSchedule;
};