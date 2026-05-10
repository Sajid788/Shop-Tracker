import express from "express";
import { connection, PORT } from "./config/db.js";
import phoneRoutes from "./routes/mobile.route.js";
import cors from "cors";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// routes
app.use("/api/phones", phoneRoutes);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DataBase");
  } catch (error) {
    console.log(`${error} is giving while connecting`);
  }
  console.log(`Listening on PORT: ${PORT}`);
});