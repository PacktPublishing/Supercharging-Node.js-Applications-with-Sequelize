'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Airplanes',
      'slug',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );

    await queryInterface.addIndex(
      'Airplanes',
      ['slug'],
      {
        name: 'airplanes_slug_uniq_idx',
        unique: true,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Airplanes', 'airplanes_slug_uniq_idx');
    await queryInterface.removeColumn('Airplanes', 'slug');
  },
};
