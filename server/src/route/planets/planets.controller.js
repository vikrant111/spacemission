const {getAllPlanet} = require("../../model/planets.model")

function httpGetAllPlanets(req, res){
return res.status(200).json(getAllPlanet())

}

module.exports = {
    httpGetAllPlanets,
};