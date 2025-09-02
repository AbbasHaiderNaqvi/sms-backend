import { Sequelize } from "sequelize";
import defineUserModel from "../model/userModel.js";
import defineStudentModel from "../model/studentModel.js";

let User = null;
let Student = null;
let sequelize = null;

const dbConnection = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("❌ DATABASE_URL is not defined! Please set it in Railway variables.");
  }

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Railway Postgres successfully");

    // Define models
    User = defineUserModel(sequelize);
    Student = defineStudentModel(sequelize);

    await sequelize.sync({ alter: true });
    console.log("🟢 Models synced successfully");
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
    throw err;
  }
};

// Getter functions
const getUserModel = () => {
  if (!User) throw new Error("❌ User model is not initialized yet!");
  return User;
};

const getStudentModel = () => {
  if (!Student) throw new Error("❌ Student model is not initialized yet!");
  return Student;
};

export { dbConnection, getUserModel, getStudentModel };
