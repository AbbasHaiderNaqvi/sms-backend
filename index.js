import 'dotenv/config';
import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import router from "./routes/routes.js";
import cors from "cors";

const app = express();

// Simple CORS configuration
app.use(cors({
  origin: [
    'https://sms-frontend-pbvphypwl-furqan-hassans-projects-fa4b821f.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());


// Add this before your routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use("/api", router);

const PORT = process.env.PORT || 8081;

const startServer = async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

startServer();