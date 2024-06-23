const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGOO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

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
