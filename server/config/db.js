import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const connection = mongoose.connect(process.env.MONGO_URI);
const PORT = process.env.PORT;

export { connection, PORT };