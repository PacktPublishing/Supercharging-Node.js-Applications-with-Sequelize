const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const models = require("./models");

const { bookTicket } = require("./routes/tickets")
const { createAirplane, createSchedule } = require("./routes/flights");

models.sequelize.sync().then(async function () {
    console.log("> database has been synced");
}).catch(function (err) {
    console.log(" > there was an issue synchronizing the database", err);
});

app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', async function (req, res) {
    const airplanes = await models.Airplane.findAll();
    res.send("<pre>" + JSON.stringify(airplanes, undefined, 4) + "</pre>");
});

app.post('/airplanes', createAirplane);
app.get('/airplanes/:id', async function (req, res) {
    const airplane = await models.Airplane.findByPk(req.params.id);
    if (!airplane) {
        return res.sendStatus(404);
    }

    res.send("<pre>" + JSON.stringify(airplane, undefined, 4) + "</pre>");
});

app.post('/schedules', createSchedule);
app.post('/book-flight', bookTicket);

app.listen(3000, function () {
    console.log("> express server has started");
});
