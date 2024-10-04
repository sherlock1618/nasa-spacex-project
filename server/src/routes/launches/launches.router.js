const express = require("express");
const { 
    HttpGetAllLaunches,
    HttpAddNewLaunch,
    HttpAbortLaunchById,
 } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", HttpGetAllLaunches);

launchesRouter.post("/", HttpAddNewLaunch);

launchesRouter.delete('/:id', HttpAbortLaunchById);


  

module.exports = launchesRouter;