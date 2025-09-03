import 'dotenv/config';
import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import router from "./routes/routes.js";
import cors from "cors";

const app = express();

// ✅ JUST THIS LINE - cors() without config allows all origins
app.use(cors());

app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await dbConnection();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

startServer();