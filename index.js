import express from "express";
import {dbConnection} from "./db/dbConnection.js";
// import cookieParser from "cookie-parser";  
import router from "./routes/routes.js";

const app = express();

app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    express.json()(req, res, next);
  } else {
    next(); // Skip JSON parsing for GET/DELETE/etc.
  }
});
// app.use(cookieParser())
app.use("/api", router);

dbConnection("auth", "postgres", "furqan");

app.listen(8081, () => {
  console.log("Server is running at port 8081!");
});
