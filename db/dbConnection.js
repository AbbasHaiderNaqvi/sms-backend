import { Sequelize } from "sequelize";
import defineUserModel from "../model/userModel.js";
import defineStudentModel from "../model/studentModel.js";

// Export models
export let User = null;
export let Student = null;

const dbConnection = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("❌ DATABASE_URL is not defined! Please set it in Railway variables.");
  }

  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Important for Railway SSL
      },
    },
  });

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Railway Postgres successfully");

    // Define models
    User = defineUserModel(sequelize);
    Student = defineStudentModel(sequelize);

    // Sync tables
    await sequelize.sync({ alter: true });
    console.log("🟢 Models synced successfully");
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
    throw err; // Crash if DB connection fails
  }
};

export { dbConnection };
