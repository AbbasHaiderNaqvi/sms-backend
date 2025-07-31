import { Sequelize } from "sequelize";
import defineUserModel from "../model/userModel.js";

export let User = null;

const dbConnection = async (database, username, password) => {
  const sequelize = new Sequelize(database, username, password, {
    host: "localhost",
    dialect: "postgres",
  });

  try {
    await sequelize.authenticate();
    User = defineUserModel(sequelize); 
    await sequelize.sync({ alter: true }); 
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect:", error);
  }
};

export {dbConnection}
