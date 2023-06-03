const fs = require('fs');
const path = require('path');
const { parse } = require("csv-parse");

const planetsDatabase = require('./planets.mongo')


function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData(){
return new Promise((resolve, reject)=>{
    fs.createReadStream(path.join(__dirname, ".." , ".." , "data" , "kepler_data.csv" ))
    .pipe(parse({
      comment: '#',
      columns: true,
    }))
    .on('data', async (data) => {
      if (isHabitablePlanet(data)) {
        // habitablePlanets.push(data);

        //TODO: replace the below (create) code with insert + update = upsert --> to avoid duplication in databases
        savePlanet(data)
      }
    })
    .on('error', (err) => {
      console.log(err);
      reject(err);
    })
    .on('end', async() => {
      const countPlanetsFound = (await getAllPlanet()).length
      console.log(`${countPlanetsFound} habitable planets found!`);
    resolve();
    });
})

}


async function getAllPlanet(){
                  //filter   projection
  return await planetsDatabase.find({},{ '__v':0});
}




async function savePlanet(planet){
  try{
    await planetsDatabase.updateOne({
      keplerName: planet.kepler_name,//the value based on which you want to find the data 
     },{
      keplerName: planet.kepler_name,//the data that is going to replace the value
     },{
      upsert: true,//create if not present or update if present
     })
  }catch(err){
    console.log(`Failed to save planets data-----> ${err}`)
  }
}



  module.exports = {
    loadPlanetsData:loadPlanetsData,
    getAllPlanet:getAllPlanet
  }