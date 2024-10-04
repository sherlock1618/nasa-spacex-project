const mongoose = require("mongoose");

const planetsSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true,
    }
}, {
    versionKey: false,  // Disables the __v field
});

module.exports = mongoose.model("Planet", planetsSchema);
