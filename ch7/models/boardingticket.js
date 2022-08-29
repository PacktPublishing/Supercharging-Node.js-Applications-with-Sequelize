const { Model } = require('@sequelize/core');

module.exports = (sequelize, DataTypes) => {
  class BoardingTicket extends Model {
    static associate(models) {
      this.Customer = this.belongsTo(models.Customer);
    }
  };

  BoardingTicket.init({
    seat: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please enter in a valid seating arrangement'
        }
      }
    },
    isEmployee: {
      type: DataTypes.VIRTUAL,
      async get() {
        const customer = await this.getCustomer();
        if (!customer || !customer.email) return false;

        return customer.email.endsWith('avalonairlines.com');
      }
    }
  }, {
    sequelize,
    modelName: 'BoardingTicket'
  });

  // Employees should be able to fly for free
  BoardingTicket.beforeValidate('checkEmployee', (ticket, options) => {
    if (ticket.isEmployee) {
      ticket.subtotal = 0;
    }
  });

  // Subtotal should never be less than zero
  BoardingTicket.beforeSave('checkSubtotal', (ticket, options) => {
    if (ticket.subtotal < 0) {
      throw new Error('Invalid subtotal for this ticket.');
    }
  });

  // Ensure that the seat the customer has requested is available
  BoardingTicket.beforeSave('checkSeat', async (ticket, options) => {
    const newSeat = ticket.getDataValue('seat');
    const { transaction } = options;

    if (ticket.changed('seat')) {
      const boardingTicketExists = await BoardingTicket.findOne({
        where: {
          seat: newSeat
        },
        transaction,
      });

      if (boardingTicketExists !== null) {
        throw new Error(`The seat ${newSeat} has already been taken.`);
      }
    }
  });

  BoardingTicket.afterSave('saveReceipt', async (ticket, options) => {
    await sequelize.models.Receipts.create({
      receipt: ticket.get()
    }, {
      transaction: options.transaction
    });
  });

  return BoardingTicket;
};
