import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import router from "./routes/routes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json()); // simpler than custom middleware

app.use("/api", router);

const PORT = process.env.PORT || 8081;

const startServer = async () => {
  await dbConnection(); // wait for DB + models to be ready
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
