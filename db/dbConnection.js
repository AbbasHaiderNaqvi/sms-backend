import { Sequelize } from "sequelize";
import defineUserModel from "../model/userModel.js";
import defineStudentModel from "../model/studentModel.js";

export let User = null;
export let Student = null;

const dbConnection = async (database, username, password) => {
  // 👇 If DATABASE_URL exists (Railway), use it
  const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        protocol: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // 👈 important for Railway
          },
        },
      })
    : new Sequelize(database, username, password, {
        host: "localhost",
        dialect: "postgres",
      });

  try {
    await sequelize.authenticate();

    // Define models
    User = defineUserModel(sequelize);
    Student = defineStudentModel(sequelize);

    await sequelize.sync({ alter: true });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect:", error);
  }
};

export { dbConnection };
