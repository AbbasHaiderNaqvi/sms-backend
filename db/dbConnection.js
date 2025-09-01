import { Sequelize } from "sequelize";
import defineUserModel from "../model/userModel.js";
import defineStudentModel from "../model/studentModel.js";

export let User = null;
export let Student = null;

let sequelize;

const dbConnection = async () => {
  // use DATABASE_URL from environment if available
  const isProd = !!process.env.DATABASE_URL;

  sequelize = isProd
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Neon needs this
          },
        },
      })
    : new Sequelize("auth", "postgres", "furqan", {
        host: "localhost",
        dialect: "postgres",
      });

  try {
    await sequelize.authenticate();

    // Define models
    User = defineUserModel(sequelize);
    Student = defineStudentModel(sequelize);

    // Sync models to DB
    await sequelize.sync({ alter: true });

    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Unable to connect:", error);
  }
};

export { dbConnection, sequelize };
