const app = require("./app.js");
const PORT = process.env.PORT || 8000;
const http = require("http");
const axios = require("axios");
require("dotenv").config();
const { loadPlanetsData } = require('./models/planets.model.js');
const { loadLaunchData } = require("./models/launches.model.js");
const { mongoConnect } = require("./services/mongo.js");

const server = http.createServer(app);

async function StartServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    });   
}

StartServer();
