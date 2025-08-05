import { DataTypes } from "sequelize";

const defineUserModel = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "society", "accountant"),
      allowNull: false,
      defaultValue: "society", // change if needed
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return User;
};

export default defineUserModel;
