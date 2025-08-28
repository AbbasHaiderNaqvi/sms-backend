import { Sequelize } from "sequelize";
import defineUserModel from "../model/userModel.js";
import defineStudentModel from "../model/studentModel.js"; // 🆕 import student model

export let User = null;
export let Student = null; // 🆕 export for use elsewhere

const dbConnection = async (database, username, password) => {
  const sequelize = new Sequelize(database, username, password, {
    host: "localhost",
    dialect: "postgres",
  });

  try {
    await sequelize.authenticate();

    // 🟢 Define models
    User = defineUserModel(sequelize); 
    Student = defineStudentModel(sequelize); 

    // 🟡 If Student is related to Fee or others, define associations here
    // Example: Fee.belongsTo(Student, { foreignKey: 'studentId' });

    await sequelize.sync({ alter: true }); // Apply all model changes

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect:", error);
  }
};

export { dbConnection };
