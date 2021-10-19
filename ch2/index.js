var express = require("express");

var app = express();
var models = require("./models");

models.sequelize.sync().then(function () {
    console.log("> database has been synced");
}).catch(function (err) {
    console.log(" > there was an issue synchronizing the database", err);
});

app.get('/', async function (req, res) {
    var airplanes = await models.Airplane.findAll();
    res.send("<pre>" + JSON.stringify(airplanes, undefined, 4) + "</pre>");
});

app.get('/airplanes/:id', async function (req, res) {
    var airplane = await models.Airplane.findByPk(req.params.id);
    if (!airplane) {
        return res.sendStatus(404);
    }

    res.send("<pre>" + JSON.stringify(airplane, undefined, 4) + "</pre>");
});

app.listen(3000, function () {
    console.log("> express server has started");
});
