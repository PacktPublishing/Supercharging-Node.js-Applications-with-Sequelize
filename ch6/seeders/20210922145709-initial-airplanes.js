'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Airplanes', [{
      planeModel: 'Airbus A220-100',
      totalSeats: 110,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      planeModel: 'Airbus A220-300',
      totalSeats: 110,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      planeModel: 'Airbus A 318',
      totalSeats: 115,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      planeModel: 'Boeing 707-100',
      totalSeats: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      planeModel: 'Boeing 737-100',
      totalSeats: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Airplanes', null, {});
  }
};
