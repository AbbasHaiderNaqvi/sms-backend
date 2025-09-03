import 'dotenv/config';
import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import router from "./routes/routes.js";
import cors from "cors";

const app = express();

// Debug to see what Railway is providing
console.log('PORT environment variable:', process.env.PORT);

// CORS Configuration
app.use(cors({
  origin: [
    'https://sms-frontend-pbvphypwl-furqan-hassans-projects-fa4b821f.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running successfully'
  });
});

app.use("/api", router);

// ✅ Use fallback port for local development, Railway will provide the PORT
const PORT = process.env.PORT || 3000;
console.log('Starting server on port:', PORT);

const startServer = async () => {
  try {
    await dbConnection();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server successfully running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

startServer();