const express = require("express");
const {HttpGetAllPlanets} = require("./planets.controller.js");
const planetsRouter = express.Router();

planetsRouter.get("/", HttpGetAllPlanets);

module.exports = planetsRouter;