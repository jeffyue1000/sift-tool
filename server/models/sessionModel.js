import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
	sessionID: {
		type: String,
		required: [true, "ID is required"],
		unique: true,
	},
});
