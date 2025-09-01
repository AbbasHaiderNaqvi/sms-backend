import { Sequelize } from "sequelize";
import defineUserModel from "../model/userModel.js";
import defineStudentModel from "../model/studentModel.js";

// Export models for use elsewhere
export let User = null;
export let Student = null;

const dbConnection = async () => {
  let sequelize;

  if (process.env.DATABASE_URL) {
    // Production / Railway
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // important for Railway SSL
        },
      },
    });
  } else {
    // Local development
    sequelize = new Sequelize("auth", "postgres", "furqan", {
      host: "localhost",
      dialect: "postgres",
    });
  }

  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Define models
    User = defineUserModel(sequelize);
    Student = defineStudentModel(sequelize);

    // Sync models (creates tables if not exist / updates schema)
    await sequelize.sync({ alter: true });
    console.log("🟢 Models synced successfully");
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
    throw err; // important: crash startup if DB fails
  }
};

export { dbConnection };
