const { DataTypes } = require("@sequelize/core");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('FlightSchedules', 'AirplaneId', {
      type: DataTypes.INTEGER,
    });

    await queryInterface.addConstraint('FlightSchedules', {
      type: 'foreign key',
      fields: ['AirplaneId'],
      references: {
        table: 'Airplanes',
        field: 'id'
      },
      name: 'fkey_flight_schedules_airplane',
      onDelete: 'set null',
      onUpdate: 'cascade'
    });

    await queryInterface.addColumn('BoardingTickets', 'CustomerId', {
      type: DataTypes.INTEGER,
    });

    await queryInterface.addConstraint('BoardingTickets', {
      type: 'foreign key',
      fields: ['CustomerId'],
      references: {
        table: 'Customers',
        field: 'id'
      },
      name: 'fkey_boarding_tickets_customer',
      onDelete: 'set null',
      onUpdate: 'cascade'
    });

    await queryInterface.addColumn('BoardingTickets', 'FlightScheduleId', {
      type: DataTypes.INTEGER,
    });

    await queryInterface.addConstraint('BoardingTickets', {
      type: 'foreign key',
      fields: ['FlightScheduleId'],
      references: {
        table: 'FlightSchedules',
        field: 'id'
      },
      name: 'fkey_boarding_tickets_flight_schedule',
      onDelete: 'set null',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'FlightSchedules', 'fkey_flight_schedules_airplane'
    );

    await queryInterface.removeConstraint(
      'BoardingTickets', 'fkey_boarding_tickets_customer'
    );

    await queryInterface.removeConstraint(
      'BoardingTickets', 'fkey_boarding_tickets_flight_schedule'
    );

    await queryInterface.removeColumn('FlightSchedules', 'AirplaneId');
    await queryInterface.removeColumn('BoardingTickets', 'CustomerId');
    await queryInterface.removeColumn('BoardingTickets', 'FlightScheduleId');
  }
};
