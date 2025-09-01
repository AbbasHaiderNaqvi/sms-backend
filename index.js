import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import router from "./routes/routes.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",   // change to your frontend URL in prod
  credentials: true
}));

app.use(express.json()); // simpler & works for all methods

app.use("/api", router);

// 🟢 Connect to DB (auto-detects Neon or local based on DATABASE_URL)
dbConnection();

app.listen(8081, () => {
  console.log("🚀 Server is running at port 8081!");
});
