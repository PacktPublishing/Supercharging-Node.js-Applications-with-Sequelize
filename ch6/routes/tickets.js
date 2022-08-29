const models = require("../models");

async function bookTicket(req, res) {
    try {
        const { scheduleId, seat } = req.body;

        const t = await models.sequelize.transaction(async (tx) => {
                const schedule = await models.FlightSchedule.findByPk(scheduleId, { transaction: tx });
                if (!schedule) {
                    throw new Error("schedule could not be found");
                }
        
                const boardingTicket = await models.BoardingTicket.create({
                    seat,
                }, { transaction: tx });
        
                // this is where we would set a customer if we had an application with authentication, etc.
                // await ticket.setCustomer(customerId, { transaction: tx });
                await schedule.addBoardingTicket(boardingTicket, { transaction: tx });
        
                return boardingTicket;
        });

        return res.json(t);
    } catch (error) {
        return res.status(400).send(error.toString());
    }
}
exports.bookTicket = bookTicket;
