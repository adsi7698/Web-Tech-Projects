const mongoose = require("mongoose");
const config = require("./config.json");
const db = config["mongoURI"];

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(db, {});

        console.log("MongoDB is Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
