async function getAirplane(req, res) {
    const airplane = await models.Airplane.findByPk(req.params.id);
    if (!airplane) {
        return res.sendStatus(404);
    }

    res.json(airplane);
}
exports.getAirplane = getAirplane;

async function createAirplane(req, res) {
    const { name, seats } = req.body;

    try {
        const airplane = await models.Airplane.create({
            planeModel: name,
            totalSeats: seats,
        });

        return res.json(airplane);
    } catch (error) {
        res.status(500).send(error);
    }
}
exports.createAirplane = createAirplane;

