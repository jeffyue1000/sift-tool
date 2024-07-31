const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dbConnect = async () => {
    try {
        console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Successfully connected to MongoDB");
        });

        connection.on("error", (error) => {
            console.log("Error connecting to MongoDB", error);
        });
    } catch (error) {
        console.error("Something went wrong!", error);
        process.exit(1);
    }
};

module.exports = dbConnect;
