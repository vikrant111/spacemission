const {getAllLaunches, existsLaunchWithId, abortLaunchById, scheduleNewLaunch} = require('../../model/launches.model');
const { getPagination } = require('../../services/query');



async function httpGetAllLaunches(req, res){
    const {skip, limit} =  getPagination(req.query);
    const launches = await  getAllLaunches(skip, limit)

    return res.status(200).json(launches);
}


async function httpAddNewLaunch(req, res){
   const launchData = req.body;

   console.log("launchData",launchData);
   if(!launchData.mission || !launchData.rocket || !launchData.launchDate || !launchData.target){
    return res.status(400).json({error:"please fill the required details"})
   }
   launchData.launchDate = new Date(launchData.launchDate)

   if(isNaN(launchData.launchDate)){
    return res.status(400).json({error:"Not a valid date."})
   }


  await  scheduleNewLaunch(launchData)
    return res.status(201).json(launchData)
}



async function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id);

    const existsLaunch = await existsLaunchWithId(launchId);
    if(!existsLaunch){
        return res.status(404).json({
            error:'Launch not found'
        });
    }

    const aborted = await abortLaunchById(launchId)
    if(!aborted){
        return res.status(400).json({
            error:'Abort failed'
        });
    }
    return res.status(200).json({aborted:aborted})
}





module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}