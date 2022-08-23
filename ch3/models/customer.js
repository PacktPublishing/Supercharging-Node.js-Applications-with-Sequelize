const { Model } = require('@sequelize/core');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      this.BoardingTickets = this.hasMany(models.BoardingTicket);
    }
  };

  Customer.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        msg: 'A name is required for the customer'
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        msg: 'Invalid email format for the customer'
      }
    }
  }, {
    sequelize,
    modelName: 'Customer',
  });

  return Customer;
};
