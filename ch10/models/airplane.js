const { Model } = require('@sequelize/core');
const slugPlugin = require('../plugins/slug');

module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    static tableName = 'Airplanes';

    static associate(models) {
      this.FlightSchedules = this.hasMany(models.FlightSchedule);
    }
  };

  Airplane.init({
    planeModel: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Plane types should not be empty'
        }
      }
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1,
          msg: 'A plane must have at least one seat'
        }
      }
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Airplane',
  });

  slugPlugin.use(Airplane, {
    source: ['planeModel']
  });

  return Airplane;
};
