const { 
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    existLaunch
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

//get all launches
async function HttpGetAllLaunches(req, res){
    const {limit, skip} = getPagination(req.query);

    res.set('Content-Type', 'application/json')
    return res.status(200).json(await getAllLaunches(skip, limit));
}

//add new launch
async function HttpAddNewLaunch(req, res) {
    const { mission, rocket, launchDate, target } = req.body;

    //checks for missing fields
    if (!mission || !rocket || !launchDate || !target) {
        return res.status(400).json({ error: "Missing required launch data" });
    }
    

    const parsedLaunchDate = new Date(launchDate);

    //checks for date validation
    if (isNaN(parsedLaunchDate.getTime())) {
        return res.status(400).json({ error: "Date is invalid" });
    }

    const launch = { mission, rocket, launchDate: parsedLaunchDate, target };
    
    try {
        await scheduleNewLaunch(launch);
        // Explicitly setting Content-Type
        res.set('Content-Type', 'application/json');
        return res.status(201).json(launch);
    } catch (error) {
        console.error(`Error scheduling new launch: ${error.message}`);
        return res.status(500).json({ error: "Failed to schedule launch" });
    }
}

//aborting launch
async function HttpAbortLaunchById(req, res){
    const abortId = +req.params.id;
    const isValid = await existLaunch(abortId);
    
    //checks if aborting launch exists in that database with current id
    if(!isValid){
        return res.status(404).json({
            error: "launch not found 404",
        });
    }

    const aborted = await abortLaunchById(abortId);

    if(!aborted){
        return res.status(400).json({
            error: "Abort failed",
        });
    }

    return res.status(204).json({
        ok: true,
    });
}

//exports
module.exports = { 
    HttpGetAllLaunches, 
    HttpAddNewLaunch,
    HttpAbortLaunchById
};