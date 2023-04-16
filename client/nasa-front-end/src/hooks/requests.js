const BASE_URL = "http://localhost:8000";



// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${BASE_URL}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  const response = await fetch(`${BASE_URL}/launches`,{method:"get"});
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a,b)=>{
   return a.flightNumber-b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  try{
    console.log("launch",launch)
    return await fetch(`${BASE_URL}/launches`,{
      method:"post",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify(launch)
    });
  }catch(err){
    console.log("launcherr",err)
    return {
      ok:false,
    };
  }

}

async function httpAbortLaunch(id) {
  try{
    return await fetch(`${BASE_URL}/launches/${id}`,{
      method:"delete",
    })
  }catch(err){
    console.log("aborterr",err)
    return {
      ok:false,
    };
  }
}



export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};