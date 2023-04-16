const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber:100,
    mission:"Kepler Exploration X",
    rocket:"Explore Is1",
    launchDate:new Date('December 27, 2030'),
    target:"Kepler-442 b",
    customer:["botmantra", "NASA"],
    upcoming:true,
    success:true,
};

launches.set(launch.flightNumber, launch);








function existsLaunchWithId(launchID){
    return launches.has(launchID);
}


function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}








function getAllLaunches(){
    return Array.from(launches.values())
}

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {
        flightNumber:latestFlightNumber,
        upcoming:true,
        success:true,
    }))
}



module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}