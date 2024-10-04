const { query } = require("express");
const launchesDB = require("./launches.mongo");
const planetsDB = require("./planets.mongo");
const axios = require("axios");
const { options } = require("../app");

const DEFAULT_FLIGHT_NUMBER = 1;

// Initial data
// const launch = {
//     flightNumber: 100,// flight_number
//     mission: "FalconSat",//name
//     rocket: "Falcon 1",//rocket.name
//     launchDate: new Date("October 6, 2026"),//date_local
//     target: "Kepler-62 f",//not applicable
//     upcoming: true,//upcoming
//     success: true,//success
//     customers: ['SpaceX', 'NASA']
// };

const SPACEX_LAUNCH_URL = "https://api.spacexdata.com/v4/launches/query"; 

//Data download from SpaceX
async function populateData(){
    const response = await axios.post(SPACEX_LAUNCH_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
            {
             path: 'rocket',
             select: {
                name: 1,
             }   
            },
            {
             path: 'payloads',
             select: {
                customers: 1,
            }
            }
        ]
        }
    })

    if(response.status != 200){
        console.log("Download failed");
        throw new Error("Problem occured while requesting donload data");
    }

    const launchDocs = response.data.docs;

    for(const launchDoc of launchDocs){

        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }

        console.log(`${launch.flightNumber} - ${launch.mission}`);

        await saveLaunch(launch);
    }
}

async function loadLaunchData() {
    console.log("Downloading launch data from SpaceX");

    const firstLaunch = await launchesDB.findOne({
        flightNumber: 1,
        //mission: { $regex: /FalconSat/i } // Case-insensitive search
    });

    if(firstLaunch){
        console.log("Data is already loaded to DB");
    } else {
       populateData();
    }

}

async function findLaunch(launch){
    return await launchesDB.findOne(launch);
}

async function existLaunch(id){
    return await findLaunch({
        flightNumber: id,
    });
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDB
    .findOne()
    .sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

// // Add launch to the Map
// launchesDB.set(launch.flightNumber, launch);

async function getAllLaunches(skip, limit){
    return await launchesDB.find({}, {"_id": 0, "__v": 0})
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit);
}


async function scheduleNewLaunch(launch){
    //target planet is only required when we schedule new launch not downloading from SpaceX
    const planet = await planetsDB.findOne({
        keplerName: launch.target, 
    });

    if(!planet){
        throw new Error("No matching planet found");
    }

    const newFlightNumber = (await getLatestFlightNumber()) + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        success: true,
        upcoming: true,
    });

    await saveLaunch(newLaunch);
}

async function saveLaunch(launch){
    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}
//abort function sets upcomming and success to false
async function abortLaunchById(launchId){
    const aborted = await launchesDB.updateOne({
        flightNumber: launchId,        
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
}

// Export the Map
module.exports = { 
    existLaunch, 
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
};