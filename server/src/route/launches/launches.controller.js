const {getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById} = require('../../model/launches.model')



function httpGetAllLaunches(req, res){
    return res.status(200).json(getAllLaunches());
}


function httpAddNewLaunch(req, res){
   const launchData = req.body;

   console.log("launchData",launchData);
   if(!launchData.mission || !launchData.rocket || !launchData.launchDate || !launchData.target){
    return res.status(400).json({error:"please fill the required details"})
   }
   launchData.launchDate = new Date(launchData.launchDate)

   if(isNaN(launchData.launchDate)){
    return res.status(400).json({error:"Not a valid date."})
   }


    addNewLaunch(launchData)
    return res.status(201).json(launchData)
}



function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id);

    if(!existsLaunchWithId(launchId)){
        return res.status(404).json({
            error:'Launch not found'
        });
    }

    const aborted = abortLaunchById(launchId)
    return res.status(200).json({aborted:aborted})
}





module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}