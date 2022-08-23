const express = require("express");

const app = express();
const models = require("./models");

models.sequelize.sync().then(async function () {
    console.log("> database has been synced");
}).catch(function (err) {
    console.log(" > there was an issue synchronizing the database", err);
});

app.get('/', async function (req, res) {
    const airplanes = await models.Airplane.findAll();
    res.send("<pre>" + JSON.stringify(airplanes, undefined, 4) + "</pre>");
});

app.get('/airplanes/:id', async function (req, res) {
    const airplane = await models.Airplane.findByPk(req.params.id);
    if (!airplane) {
        return res.sendStatus(404);
    }

    res.send("<pre>" + JSON.stringify(airplane, undefined, 4) + "</pre>");
});

app.listen(3000, function () {
    console.log("> express server has started");
});
