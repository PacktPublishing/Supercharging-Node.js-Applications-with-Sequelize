const { ValidationError } = require("@sequelize/core");
const models = require("../models");

async function bookTicket(req, res) {
    try {
        const { scheduleId, seat, name, email } = req.body;

        const [customer] = await models.Customer.findOrCreate({
            where: {
                email,
            },
            defaults: {
                name,
            }
        });

        const t = await models.sequelize.transaction(async (tx) => {
            const schedule = await models.FlightSchedule.findByPk(scheduleId, { transaction: tx });
            if (!schedule) {
                throw new Error("schedule could not be found");
            }

            const boardingTicket = await models.BoardingTicket.create({
                seat,
            }, {
                transaction: tx,
            });

            await boardingTicket.setCustomer(customer, { transaction: tx });
            await schedule.addBoardingTicket(boardingTicket, { transaction: tx });

            return boardingTicket;
        });

        return res.json(t);
    } catch (error) {
        if (error instanceof ValidationError) {
            let errObj = {};

            error.errors.map(err => {
               errObj[err.path] = err.message;
            });

            return res.status(400).json(errObj);
        }

        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }

        return res.status(400).send(error.toString());
    }
}
exports.bookTicket = bookTicket;
