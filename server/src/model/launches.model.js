
const axios =  require('axios');
const launchesDatabase = require('./launches.mongo')
const planetsDatabase = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

// let latestFlightNumber = 100;

// const launch = {
//     flightNumber:100,                             // flight_number
//     mission:"Kepler Exploration X",               // name
//     rocket:"Explore Is1",                         // rocket.name
//     launchDate:new Date('December 27, 2030'),     // date_local
//     target:"Kepler-442 b",                        // not applicable 
//     customer:["botmantra", "NASA"],               // payload.customer for each payload
//     upcoming:true,                                // upcoming
//     success:true,                                 // success
// };


// saveLaunch(launch)
// launches.set(launch.flightNumber, launch);



async function populateLauchesWithSpaceXApi() {
  const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
  const payload =  {
    query:{},
   options:{
     pagination:false,
       populate:[
           {
               path:"rocket",
               select:{
                   name:1
               }
           },
           {
               path:"payloads",
               select:{
                   "customers":1
               }
           }
       ]
   }
  }

  

  const response = await axios.post(SPACEX_API_URL, payload);

  if(response.status !== 200){
    console.log("Problem in downloading launch data from spaceXapi...")
    throw new Error("Downloading data from spaceXapi failed...")
  }

  console.log("Downloading launch data...");
  const launchDataResponses = response.data.docs;
  for (const launchResponse of launchDataResponses) {
    const payloads = launchResponse["payloads"];
    const customer = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchResponse["flight_number"],
      mission: launchResponse["name"],
      rocket: launchResponse["rocket"]["name"],
      launchDate: launchResponse["date_local"],
      upcoming: launchResponse["upcoming"],
      success: launchResponse["success"],
      customer: customer,
    };

    console.log("flightDatafromSpaceXApi", launch.mission);
    await saveLaunch(launch)
  }
}







async function loadLaunchData(){

   const firstLaunch =  await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    if(firstLaunch){
        console.log("Launch data already loaded")
    }else{
        await populateLauchesWithSpaceXApi()
    }
  
}





async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber')

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}






async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}


async function existsLaunchWithId(launchID){
    return await findLaunch({flightNumber:launchID});
}


async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}








async function getAllLaunches(skip, limit){
    return await launchesDatabase
    .find({},{'_id':0, '__v':0 })
    .sort({flightNumber: 1})// -1 is used for decending the values and 1 is used for ascending the values.
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launchData){
    await launchesDatabase.findOneAndUpdate({
    flightNumber: launchData.flightNumber,   
    },
    launchData,
    {
    upsert:true,
    })
}



async function scheduleNewLaunch(launch){
    const planet = await planetsDatabase.findOne({
        keplerName:launchData.target
    });

    if(!planet){
        throw new Error('No matching planets found!')
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success:true,
        upcoming:true,
        customer:["botmantra", "NASA"],
        flightNumber: newFlightNumber
    });

    await saveLaunch(newLaunch)
}




module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}